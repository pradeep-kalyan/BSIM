"use server";

import prisma from "../functions/prisma";
import { revalidatePath } from "next/cache";

export async function advancePeriod(companyId: string) {
  return await prisma.$transaction(async (tx: any) => {
    const company = await tx.company.findUnique({
      where: { id: companyId },
      select: {
        current_period: true,
        cash_balance: true,
      },
    });

    if (!company) throw new Error("Company not found");

    const nextPeriod = company.current_period + 1;

    const existing = await tx.hr_decision.findUnique({
      where: {
        company_id_period: {
          company_id: companyId,
          period: nextPeriod,
        },
      },
    });

    if (!existing) {
      const lastDecision = await tx.hr_decision.findFirst({
        where: { company_id: companyId },
        orderBy: { period: "desc" },
        include: { roles: true },
      });

      if (!lastDecision) {
        throw new Error("No HR decision found to carry forward");
      }

      const carrySalary = lastDecision.salary_budget || 0;
      const carryTraining = lastDecision.training_budget || 0;
      const carryTotal = carrySalary + carryTraining;

      if (company.cash_balance < carryTotal) {
        throw new Error("Insufficient balance to carry forward HR decision");
      }

      await tx.company.update({
        where: { id: companyId },
        data: {
          cash_balance: {
            decrement: carryTotal,
          },
        },
      });

      await tx.hr_decision.create({
        data: {
          company_id: companyId,
          period: nextPeriod,
          salary_budget: carrySalary,
          training_budget: carryTraining,
          total_budget: carryTotal,
          employee_satisfaction: lastDecision.employee_satisfaction,
          recruitment_cost: 0,
          firing_cost: 0,
          roles: {
            create: lastDecision.roles.map((role: any) => ({
              role_name: role.role_name,
              salary_per_head: role.salary_per_head,
              head_count: role.head_count,
            })),
          },
        },
      });
    }

    const updated = await tx.company.update({
      where: { id: companyId },
      data: {
        current_period: { increment: 1 },
      },
    });

    revalidatePath(`/management/home/${companyId}`);
    return updated.current_period;
  });
}
