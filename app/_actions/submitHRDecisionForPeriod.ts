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
  const {
    company_id,
    period,
    training_budget,
    employee_satisfaction,
    roles,
  } = input;

  try {
    return await prisma.$transaction(async (tx) => {
      const company = await tx.company.findUnique({
        where: { id: company_id },
        select: { cash_balance: true },
      });

      if (!company) {
        throw new Error("Company not found");
      }

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
            firing_cost += role.fires * 5000;
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

      const total_budget = training_budget + recruitment_cost + firing_cost;

      if (company.cash_balance < total_budget) {
        throw new Error("Insufficient cash balance");
      }

      await tx.company.update({
        where: { id: company_id },
        data: {
          cash_balance: {
            decrement: total_budget,
          },
        },
      });

      const hrDecision = await tx.hr_decision.create({
        data: {
          company_id,
          period,
          is_submitted: true,
          salary_budget,
          training_budget,
          total_budget,
          employee_satisfaction,
          recruitment_cost,
          firing_cost,
          roles: {
            create: newRoleStates.map((r) => ({
              role_name: r.role_name,
              salary_per_head: r.salary_per_head,
              head_count: r.head_count,
            })),
          },
        },
      });

      return hrDecision.id;
    });
  } catch (error) {
    console.error("Error in HR decision submission:", error);
    throw new Error("Failed to submit HR decision");
  }
}
