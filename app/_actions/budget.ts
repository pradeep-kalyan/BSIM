"use server";

import { prisma } from "../functions/prisma";
import { getCurrentUser } from "@/app/functions/jwt";
import { revalidatePath } from "next/cache";

interface BudgetRequestInput {
  amount: number;
  notes?: string;
  department: string; // Passed via URL from the client
}

export async function createBudgetRequest(input: BudgetRequestInput) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const company = await prisma.company.findFirst({
    where: { user_id: user.id },
    select: { id: true, current_period: true },
  });

  if (!company) throw new Error("No associated company found for this user");

  const { department, amount, notes } = input;

  try {
    const request = await prisma.budgetRequest.create({
      data: {
        companyId: company.id,
        userId: user.id,
        period: company.current_period,
        department,
        amount,
        notes,
      },
    });

    revalidatePath(`/finance/${department}`); // Optional revalidation
    return request;
  } catch (err: any) {
    if (err.code === "P2002") {
      throw new Error("A request for this department already exists in this period.");
    }
    console.error(err);
    throw new Error("Failed to create budget request.");
  }
}
