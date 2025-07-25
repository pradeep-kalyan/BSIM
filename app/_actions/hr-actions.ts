"use server";

import prisma from "../functions/prisma";

export async function getCompanyData(companyId: string) {
  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        cash_balance: true,
        current_period: true,
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

export async function getHistoricalHRData(companyId: string) {
  try {
    const historicalData = await prisma.hR.findMany({
      where: { company_id: companyId },
      orderBy: { period: "asc" },
      include: {
        roles: true,
      },
    });

    return historicalData.map(decision => ({
      period: decision.period,
      total_budget: decision.total_budget,
      salary_budget: decision.salary_budget,
      training_budget: decision.training_budget,
      employee_satisfaction: decision.employee_satisfaction,
      recruitment_cost: decision.recruitment_cost,
      firing_cost: decision.firing_cost,
      total_employees: decision.roles.reduce((acc, role) => acc + role.head_count, 0),
      roles: decision.roles,
    }));
  } catch (error) {
    console.error("Error fetching historical HR data:", error);
    throw new Error("Failed to fetch historical HR data");
  }
}

export async function getCurrentRoles(companyId: string) {
  try {
    const lastDecision = await prisma.hR.findFirst({
      where: { company_id: companyId },
      orderBy: { period: "desc" },
      include: { roles: true },
    });

    if (!lastDecision) {
      return [];
    }

    return lastDecision.roles.map(role => ({
      role_name: role.role_name,
      salary_per_head: role.salary_per_head,
      current_head_count: role.head_count,
      hires: 0,
      fires: 0,
    }));
  } catch (error) {
    console.error("Error fetching current roles:", error);
    throw new Error("Failed to fetch current roles");
  }
}
