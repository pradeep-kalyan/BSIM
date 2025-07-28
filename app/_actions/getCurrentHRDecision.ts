"use server";

import prisma from "../functions/prisma";

export async function getCurrentHRDecision(companyId: string, period: number) {
  try {
    const decision = await prisma.hr_decision.findFirst({
      where: { company_id: companyId, period },
      select: {
        id: true,
        company_id: true,
        period: true,
        is_submitted: true,
        submitted_at: true,
        salary_budget: true,
        training_budget: true,
        total_budget: true,
        employee_satisfaction: true,
        recruitment_cost: true,
        firing_cost: true,
        roles: {
          select: {
            id: true,
            role_name: true,
            salary_per_head: true,
            head_count: true,
          },
        },
      },
    });

    return decision;
  } catch (error) {
    console.error("Error fetching current HR decision:", error);
    return null;
  }
}
