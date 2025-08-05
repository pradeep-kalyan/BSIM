"use server";

import prisma from "../functions/prisma";

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

    if (!company) throw new Error("Company not found");

    return company;
  } catch (error) {
    console.error("Error fetching company data:", error);
    throw new Error("Failed to fetch company data");
  }
}

export async function getHistoricalMarketingData(companyId: string) {
  try {
    const history = await prisma.marketing.findMany({
      where: { company_id: companyId },
      orderBy: { period: "asc" },
    });

    return history.map((entry) => ({
      period: entry.period,
      budget: entry.budget,
      online: entry.online,
      offline: entry.offline,
      finalised: entry.finalised,
    }));
  } catch (error) {
    console.error("Error fetching marketing history:", error);
    throw new Error("Failed to fetch marketing history");
  }
}

export async function getCurrentMarketingDecision(
  companyId: string,
  period: number
) {
  try {
    const decision = await prisma.marketing.findFirst({
      where: { company_id: companyId, period },
      select: {
        id: true,
        company_id: true,
        period: true,
        budget: true,
        online: true,
        offline: true,
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

export async function submitMarketingDecisionForPeriod({
  company_id,
  period,
  budget,
  online,
  offline,
}: {
  company_id: string;
  period: number;
  budget: number;
  online: number;
  offline: number;
}) {
  try {
    return await prisma.$transaction(async (tx) => {
      const company = await tx.company.findUnique({
        where: { id: company_id },
        select: { cash_balance: true },
      });

      if (!company) throw new Error("Company not found");

      if (online + offline !== budget) {
        throw new Error("Online and offline must add up to total budget");
      }

      if (company.cash_balance < budget) {
        throw new Error("Insufficient cash balance for marketing decision");
      }

      const existingDecision = await tx.marketing.findFirst({
        where: { company_id, period },
      });

      if (existingDecision) {
        const previousBudget = existingDecision.budget;
        const delta = budget - previousBudget;

        if (delta > 0 && company.cash_balance < delta) {
          throw new Error("Insufficient cash balance for updated budget");
        }

        if (delta !== 0) {
          await tx.company.update({
            where: { id: company_id },
            data: {
              cash_balance: { decrement: delta },
            },
          });
        }

        await tx.marketing.update({
          where: { id: existingDecision.id },
          data: {
            budget,
            online,
            offline,
            finalised: true,
          },
        });

        return existingDecision.id;
      } else {
        await tx.company.update({
          where: { id: company_id },
          data: {
            cash_balance: { decrement: budget },
          },
        });

        const newDecision = await tx.marketing.create({
          data: {
            company_id,
            period,
            budget,
            online,
            offline,
            finalised: true,
          },
        });

        return newDecision.id;
      }
    });
  } catch (error) {
    console.error("Error in marketing decision submission:", error);
    throw new Error("Failed to submit marketing decision");
  }
}
