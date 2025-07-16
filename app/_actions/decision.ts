"use server";


import { revalidatePath } from "next/cache";
import prisma from "../functions/prisma";
// Decision operations
export async function getDecision(id: string) {
  try {
    const decision = await prisma.decision.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });
    return decision;
  } catch (error) {
    console.error("Error fetching decision:", error);
    throw new Error("Failed to fetch decision");
  }
}

export async function getDecisionsByCompany(
  companyId: string,
  period?: number
) {
  try {
    const decisions = await prisma.decision.findMany({
      where: {
        company_id: companyId,
        ...(period !== undefined && { period }),
      },
      orderBy: { submitted_at: "desc" },
    });
    return decisions;
  } catch (error) {
    console.error("Error fetching decisions by company:", error);
    throw new Error("Failed to fetch decisions");
  }
}

export async function createDecision(data: {
  company_id: string;
  period: number;
  type: string;
  decision_data: string;
  processed?: boolean;
  processed_at?: Date;
}) {
  try {
    const decision = await prisma.decision.create({
      data: {
        company_id: data.company_id,
        period: data.period,
        type: data.type,
        decision_data: data.decision_data,
        processed: data.processed || false,
        processed_at: data.processed_at,
      },
    });
    revalidatePath("/decisions");
    revalidatePath(`/companies/${data.company_id}`);
    return decision.id;
  } catch (error) {
    console.error("Error creating decision:", error);
    throw new Error("Failed to create decision");
  }
}

export async function updateDecision(
  id: string,
  data: {
    processed?: boolean;
    processed_at?: Date;
  }
) {
  try {
    await prisma.decision.update({
      where: { id },
      data,
    });
    revalidatePath("/decisions");
    revalidatePath(`/decisions/${id}`);
  } catch (error) {
    console.error("Error updating decision:", error);
    throw new Error("Failed to update decision");
  }
}
