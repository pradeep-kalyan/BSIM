"use server";

import prisma from "../functions/prisma";

export async function getCurrentHRDecision(companyId: string, period: number) {
  const decision = await prisma.hr_decision.findFirst({
    where: { company_id: companyId, period },
    select: {
      training_budget: true,
      employee_satisfaction: true,
    },
  });

  return decision;
}