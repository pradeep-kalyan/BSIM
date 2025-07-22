"use server";

import prisma from "../functions/prisma";

interface BudgetRequestInput {
  companyId: string;
  userId: string;
  period: number;
  department: string;
  amount: number;
  notes?: string;
}

export async function createBudgetRequest(data: BudgetRequestInput) {
  return await prisma.budgetRequest.create({
    data,
  });
}
