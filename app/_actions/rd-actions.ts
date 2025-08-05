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

    if (!company) {
      throw new Error("Company not found");
    }

    return company;
  } catch (error) {
    console.error("Error fetching company data:", error);
    throw new Error("Failed to fetch company data");
  }
}

export async function getHistoricalRDData(companyId: string) {
  try {
    const historicalData = await prisma.rd.findMany({
      where: { company_id: companyId },
      orderBy: { period: "asc" },
    });

    return historicalData.map((decision) => ({
      period: decision.period,
      budget: decision.budget,
      pip: decision.pip,
      time_to_market: decision.time_to_market,
      total_development: decision.total_development,
      patented: decision.patented,
      quality_changes: decision.quality_changes,
    }));
  } catch (error) {
    console.error("Error fetching historical R&D data:", error);
    throw new Error("Failed to fetch historical R&D data");
  }
}

export async function getCurrentRDDecision(companyId: string, period: number) {
  try {
    const decision = await prisma.rd.findFirst({
      where: {
        company_id: companyId,
        period: period,
      },
      select: {
        id: true,
        company_id: true,
        period: true,
        budget: true,
        pip: true,
        time_to_market: true,
        total_development: true,
        patented: true,
        quality_changes: true,
        finalised: true,
        created_at: true,
        updated_at: true,
      },
    });

    return decision;
  } catch (error) {
    console.error("Error fetching current R&D decision:", error);
    return null;
  }
}

export async function submitRDDecisionForPeriod({
  company_id,
  period,
  budget,
  pip,
  time_to_market,
  total_development,
  patented,
  quality_changes,
}: {
  company_id: string;
  period: number;
  budget: number;
  pip: number;
  time_to_market: number;
  total_development: number;
  patented: number;
  quality_changes: number;
}) {
  try {
    return await prisma.$transaction(async (tx) => {
      const company = await tx.company.findUnique({
        where: { id: company_id },
        select: { cash_balance: true },
      });

      if (!company) {
        throw new Error("Company not found");
      }

      if (company.cash_balance < budget) {
        throw new Error("Insufficient cash balance");
      }

      const existingDecision = await tx.rd.findFirst({
        where: {
          company_id,
          period,
        },
      });

      if (existingDecision) {
        const delta = budget - existingDecision.budget;

        if (delta > 0 && company.cash_balance < delta) {
          throw new Error("Insufficient cash balance for updated decision");
        }

        if (delta !== 0) {
          await tx.company.update({
            where: { id: company_id },
            data: {
              cash_balance: { decrement: delta },
            },
          });
        }

        await tx.rd.update({
          where: { id: existingDecision.id },
          data: {
            budget,
            pip,
            time_to_market,
            total_development,
            patented,
            quality_changes,
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

        const newDecision = await tx.rd.create({
          data: {
            company_id,
            period,
            budget,
            pip,
            time_to_market,
            total_development,
            patented,
            quality_changes,
          },
        });

        return newDecision.id;
      }
    });
  } catch (error) {
    console.error("Error in R&D decision submission:", error);
    throw new Error("Failed to submit R&D decision");
  }
}
