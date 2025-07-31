"use server";

import prisma from "../functions/prisma";
import { revalidatePath } from "next/cache";

interface MarketingDecision {
  company_id: string;
  period: number;
  budget: number;
  offline: number;
  online: number;
}

interface HistoricalMarketingData {
  period: number;
  budget: number;
  offline: number;
  online: number;
  roi: number;
  conversion_rate: number;
  finalised: boolean;
}

export async function getCompanyData(companyId: string) {
  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        current_period: true,
        cash_balance: true,
      },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    return company;
  } catch (error) {
    console.error("Error fetching company data:", error);
    throw new Error("Failed to fetch company data");
  }
}

export async function getHistoricalMarketingData(
  companyId: string
): Promise<HistoricalMarketingData[]> {
  try {
    const marketingData = await prisma.marketing.findMany({
      where: { company_id: companyId },
      orderBy: { period: "asc" },
      select: {
        period: true,
        budget: true,
        offline: true,
        online: true,
        roi: true,
        conversion_rate: true,
        finalised: true,
      },
    });

    return marketingData;
  } catch (error) {
    console.error("Error fetching historical marketing data:", error);
    throw new Error("Failed to fetch historical marketing data");
  }
}

export async function getCurrentMarketingDecision(
  companyId: string,
  period: number
) {
  try {
    const decision = await prisma.marketing.findFirst({
      where: {
        company_id: companyId,
        period: period,
      },
      select: {
        id: true,
        company_id: true,
        period: true,
        budget: true,
        offline: true,
        online: true,
        roi: true,
        conversion_rate: true,
        finalised: true,
        created_at: true,
        updated_at: true,
      },
    });

    return decision;
  } catch (error) {
    console.error("Error fetching current marketing decision:", error);
    return null;
  }
}

export async function submitMarketingDecisionForPeriod(
  decision: MarketingDecision
) {
  try {
    // Validate inputs
    if (decision.budget < 0 || decision.offline < 0 || decision.online < 0) {
      throw new Error("Budget values cannot be negative");
    }

    if (decision.offline + decision.online !== decision.budget) {
      throw new Error("Online and offline budgets must sum to total budget");
    }

    // Calculate ROI and conversion rate (simplified calculation)
    const roi = Math.round(Math.random() * 15 + 5); // 5-20% ROI
    const conversion_rate = Math.round((decision.budget / 10000) * 100) / 100; // Simplified conversion rate

    // Check if decision already exists
    const existingDecision = await prisma.marketing.findFirst({
      where: {
        company_id: decision.company_id,
        period: decision.period,
      },
    });

    if (existingDecision) {
      // Update existing decision
      await prisma.marketing.update({
        where: { id: existingDecision.id },
        data: {
          budget: decision.budget,
          offline: decision.offline,
          online: decision.online,
          roi: roi,
          conversion_rate: conversion_rate,
          finalised: true,
        },
      });
    } else {
      // Create new decision
      await prisma.marketing.create({
        data: {
          company_id: decision.company_id,
          period: decision.period,
          budget: decision.budget,
          offline: decision.offline,
          online: decision.online,
          roi: roi,
          conversion_rate: conversion_rate,
          finalised: true,
        },
      });
    }

    revalidatePath(`/simulate/${decision.company_id}`);
    return {
      success: true,
      message: "Marketing decision submitted successfully",
    };
  } catch (error) {
    console.error("Error submitting marketing decision:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to submit marketing decision"
    );
  }
}
