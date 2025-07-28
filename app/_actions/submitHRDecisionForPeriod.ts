"use server";

import prisma from "../functions/prisma";

interface RoleInput {
  role_name: string;
  salary_per_head: number;
  hires: number;
  fires: number;
}

interface SubmitHRDecisionInput {
  company_id: string;
  period: number;
  training_budget: number;
  employee_satisfaction: number;
  roles: RoleInput[];
}

export async function submitHRDecisionForPeriod(input: SubmitHRDecisionInput) {
  const { company_id, period, training_budget, employee_satisfaction, roles } =
    input;

  try {
    return await prisma.$transaction(async (tx) => {
      const company = await tx.company.findUnique({
        where: { id: company_id },
        select: { cash_balance: true },
      });

      if (!company) throw new Error("Company not found");

      const lastDecision = await tx.hr_decision.findFirst({
        where: { company_id },
        orderBy: { period: "desc" },
        include: { roles: true },
      });

      const previousRolesMap = new Map();
      for (const role of lastDecision?.roles || []) {
        previousRolesMap.set(role.role_name, {
          salary_per_head: role.salary_per_head,
          head_count: role.head_count,
        });
      }

      let salary_budget = 0;
      let recruitment_cost = 0;
      let firing_cost = 0;

      const newRoleStates: {
        role_name: string;
        salary_per_head: number;
        head_count: number;
      }[] = [];

      for (const role of roles) {
        const prev = previousRolesMap.get(role.role_name);

        if (prev) {
          const newHeadCount = prev.head_count + role.hires - role.fires;
          if (newHeadCount > 0) {
            newRoleStates.push({
              role_name: role.role_name,
              salary_per_head: prev.salary_per_head,
              head_count: newHeadCount,
            });

            salary_budget += newHeadCount * prev.salary_per_head;
            recruitment_cost += role.hires * prev.salary_per_head;
            firing_cost = 0;
          }
        } else {
          const newHeadCount = role.hires;
          if (newHeadCount > 0) {
            newRoleStates.push({
              role_name: role.role_name,
              salary_per_head: role.salary_per_head,
              head_count: newHeadCount,
            });

            salary_budget += newHeadCount * role.salary_per_head;
            recruitment_cost += newHeadCount * role.salary_per_head;
          }
        }
      }

      const total_budget =
        training_budget + recruitment_cost + firing_cost + salary_budget;

      const existingDecision = await tx.hr_decision.findFirst({
        where: { company_id, period },
      });

      if (existingDecision) {
        const delta = total_budget - existingDecision.total_budget;

        if (delta > 0 && company.cash_balance < delta) {
          throw new Error("Insufficient cash balance for updated decision");
        }

        if (delta !== 0) {
          await tx.company.update({
            where: { id: company_id },
            data: {
              cash_balance: { decrement: delta },
            },
          });
        }

        await tx.hr_role_decision.deleteMany({
          where: { hr_decision_id: existingDecision.id },
        });

        await tx.hr_decision.update({
          where: { id: existingDecision.id },
          data: {
            salary_budget,
            training_budget,
            total_budget,
            employee_satisfaction,
            recruitment_cost,
            firing_cost,
          },
        });

        await tx.hr_role_decision.createMany({
          data: newRoleStates.map((r) => ({
            hr_decision_id: existingDecision.id,
            role_name: r.role_name,
            salary_per_head: r.salary_per_head,
            head_count: r.head_count,
          })),
        });

        return existingDecision.id;
      } else {
        if (company.cash_balance < total_budget) {
          throw new Error("Insufficient cash balance");
        }

        await tx.company.update({
          where: { id: company_id },
          data: {
            cash_balance: { decrement: total_budget },
          },
        });

        const newDecision = await tx.hr_decision.create({
          data: {
            company_id,
            period,
            salary_budget,
            training_budget,
            total_budget,
            employee_satisfaction,
            recruitment_cost,
            firing_cost,
          },
        });

        await tx.hr_role_decision.createMany({
          data: newRoleStates.map((r) => ({
            hr_decision_id: newDecision.id,
            role_name: r.role_name,
            salary_per_head: r.salary_per_head,
            head_count: r.head_count,
          })),
        });

        return newDecision.id;
      }
    });
  } catch (error) {
    console.error("Error in HR decision submission:", error);
    throw new Error("Failed to submit HR decision");
  }
}
