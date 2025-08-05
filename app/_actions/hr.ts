/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "../functions/prisma";

interface HRRole {
  role_name: string;
  salary_per_head: number;
  head_count: number;
}

interface CreateHRDecisionInput {
  company_id: string;
  period: number;
  is_submitted: boolean;
  salary_budget: number;
  training_budget: number;
  total_budget: number;
  employee_satisfaction: number;
  roles: HRRole[];
}

export async function createHRDecisionWithRoles(input: CreateHRDecisionInput) {
  const {
    company_id,
    period,
    salary_budget,
    training_budget,
    total_budget,
    employee_satisfaction,
    roles,
  } = input;

  try {
    const result = await prisma.$transaction(async (tx: any) => {
      const company = await tx.company.findUnique({
        where: { id: company_id },
        select: { cash_balance: true },
      });

      if (!company) {
        throw new Error("Company not found");
      }

      if (company.cash_balance < total_budget) {
        throw new Error("Insufficient company cash balance");
      }

      await tx.company.update({
        where: { id: company_id },
        data: {
          cash_balance: { decrement: total_budget },
        },
      });

      // Create HR record using correct model name
      const hrDecision = await tx.hr_decision.create({
        data: {
          company_id,
          period,
          salary_budget,
          training_budget,
          total_budget,
          employee_satisfaction,
          roles: {
            create: roles.map((role) => ({
              role_name: role.role_name,
              salary_per_head: role.salary_per_head,
              head_count: role.head_count,
            })),
          },
        },
      });

      return hrDecision;
    });

    return result.id;
  } catch (error) {
    console.error("Error creating HR decision with roles:", error);
    throw new Error("Failed to create HR decision");
  }
}
