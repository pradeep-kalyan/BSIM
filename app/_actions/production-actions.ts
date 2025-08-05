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

export async function getHistoricalProductionData(companyId: string) {
  try {
    const historicalData = await prisma.production.findMany({
      where: { company_id: companyId },
      orderBy: { period: "asc" },
    });

    return historicalData.map((decision) => ({
      period: decision.period,
      units_to_produce: decision.units_to_produce,
      cost_per_unit: decision.cost_per_unit,
      inventory_value: decision.inventory_value,
      defect_rate: decision.defect_rate,
    }));
  } catch (error) {
    console.error("Error fetching historical production data:", error);
    throw new Error("Failed to fetch historical production data");
  }
}

export async function getCurrentProductionDecision(
  companyId: string,
  period: number
) {
  try {
    const decision = await prisma.production.findFirst({
      where: {
        company_id: companyId,
        period: period,
      },
      select: {
        id: true,
        company_id: true,
        period: true,
        units_to_produce: true,
        cost_per_unit: true,
        inventory_value: true,
        defect_rate: true,
        finalised: true,
        created_at: true,
        updated_at: true,
      },
    });

    return decision;
  } catch (error) {
    console.error("Error fetching current production decision:", error);
    return null;
  }
}

export async function submitProductionDecisionForPeriod({
  company_id,
  period,
  units_to_produced,
  cost_per_unit,
  inventory_value,
  defect_rate,
}: {
  company_id: string;
  period: number;
  units_to_produced: number;
  cost_per_unit: number;
  inventory_value: number;
  defect_rate: number;
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

      const total_cost = units_to_produced * cost_per_unit;

      if (company.cash_balance < total_cost) {
        throw new Error("Insufficient cash balance");
      }

      const existingDecision = await tx.production.findFirst({
        where: {
          company_id,
          period,
        },
      });

      if (existingDecision) {
        const previous_cost =
          existingDecision.units_to_produce * existingDecision.cost_per_unit;
        const delta = total_cost - previous_cost;

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

        await tx.production.update({
          where: { id: existingDecision.id },
          data: {
            units_to_produce: units_to_produced,
            cost_per_unit,
            inventory_value,
            defect_rate,
          },
        });

        return existingDecision.id;
      } else {
        await tx.company.update({
          where: { id: company_id },
          data: {
            cash_balance: { decrement: total_cost },
          },
        });

        const newDecision = await tx.production.create({
          data: {
            company_id,
            period,
            units_to_produce: units_to_produced,
            cost_per_unit,
            inventory_value,
            defect_rate,
          },
        });

        return newDecision.id;
      }
    });
  } catch (error) {
    console.error("Error in production decision submission:", error);
    throw new Error("Failed to submit production decision");
  }
}
