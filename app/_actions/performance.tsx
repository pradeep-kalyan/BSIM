"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// Performance results operations
export async function getPerformanceResults(companyId: string, period: number) {
  try {
    const results = await prisma.performance_result.findUnique({
      where: {
        company_id_period: {
          company_id: companyId,
          period,
        },
      },
      include: {
        company: true,
      },
    });
    return results;
  } catch (error) {
    console.error("Error fetching performance results:", error);
    throw new Error("Failed to fetch performance results");
  }
}

export async function getPerformanceHistory(companyId: string) {
  try {
    const results = await prisma.performance_result.findMany({
      where: { company_id: companyId },
      orderBy: { period: "asc" },
      include: {
        company: true,
      },
    });
    return results;
  } catch (error) {
    console.error("Error fetching performance history:", error);
    throw new Error("Failed to fetch performance history");
  }
}

export async function createPerformanceResults(data: {
  company_id: string;
  period: number;
  revenue?: number;
  costs?: number;
  profit?: number;
  market_share?: number;
  cash_flow?: number;
  roi?: number;
  customer_satisfaction?: number;
  employee_satisfaction?: number;
  sustainability_score?: number;
  innovation_score?: number;
  brand_value_change?: number;
}) {
  try {
    const results = await prisma.performance_result.create({
      data: {
        company_id: data.company_id,
        period: data.period,
        revenue: data.revenue || 0,
        costs: data.costs || 0,
        profit: data.profit || 0,
        market_share: data.market_share || 0,
        cash_flow: data.cash_flow || 0,
        roi: data.roi || 0,
        customer_satisfaction: data.customer_satisfaction || 0,
        employee_satisfaction: data.employee_satisfaction || 0,
        sustainability_score: data.sustainability_score || 0,
        innovation_score: data.innovation_score || 0,
        brand_value_change: data.brand_value_change || 0,
      },
    });
    revalidatePath(`/companies/${data.company_id}`);
    return results.id;
  } catch (error) {
    console.error("Error creating performance results:", error);
    throw new Error("Failed to create performance results");
  }
}
