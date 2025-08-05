"use server";

import prisma from "../functions/prisma";

export async function getCompanyDashboardData(companyId: string) {
  // Fetch company with its basic info including simulation and user
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      simulation: true,
      user: true,
    },
  });

  if (!company) {
    return null;
  }

  // Fetch company history ordered by period
  const history = await prisma.company_history.findMany({
    where: { company_id: companyId },
    orderBy: { period: "asc" },
  });

  // Fetch financial history (finance decisions) ordered by period
  const financialHistory = await prisma.finance.findMany({
    where: { company_id: companyId },
    orderBy: { period: "asc" },
  });

  // Fetch product performances for all company's products
  const productPerformance = await prisma.product_performance.findMany({
    where: {
      product: {
        company_id: companyId,
      },
    },
    include: { product: true },
    orderBy: { period: "asc" },
  });

  // Count active products
  const activeProductsCount = await prisma.product.count({
    where: {
      company_id: companyId,
      status: "active",
    },
  });

  // Fetch HR decisions (all periods)
  const hrMetricsRaw = await prisma.hr_decision.findMany({
    where: {
      company_id: companyId,
    },
    include: {
      roles: true,
    },
    orderBy: { period: "asc" },
  });

  // Transform hrMetrics for your UI needs as example
  const hrMetrics = hrMetricsRaw.map((hr) => ({
    period: hr.period,
    totalBudget: hr.total_budget,
    employeeSatisfaction: hr.employee_satisfaction,
    roles: hr.roles.map((r) => ({
      roleName: r.role_name,
      salaryPerHead: r.salary_per_head,
      headCount: r.head_count,
    })),
  }));

  // Fetch R&D decisions
  const rd_decision = await prisma.rd.findMany({
    where: { company_id: companyId },
    orderBy: { period: "asc" },
  });

  // Fetch Production decisions
  const production_decision = await prisma.production.findMany({
    where: { company_id: companyId },
    orderBy: { period: "asc" },
  });

  // Fetch Marketing decisions
  const marketing_decision = await prisma.marketing.findMany({
    where: { company_id: companyId },
    orderBy: { period: "asc" },
  });

  // Fetch the latest hr, rd, production, marketing decisions for convenience
  const latestHrDecision =
    hrMetricsRaw.length > 0 ? hrMetricsRaw[hrMetricsRaw.length - 1] : null;
  const latestRdDecision =
    rd_decision.length > 0 ? rd_decision[rd_decision.length - 1] : null;
  const latestProductionDecision =
    production_decision.length > 0
      ? production_decision[production_decision.length - 1]
      : null;
  const latestMarketingDecision =
    marketing_decision.length > 0
      ? marketing_decision[marketing_decision.length - 1]
      : null;

  // Prepare object to return - matching your DashboardData type requirement
  return {
    company,
    history,
    financialHistory,
    productPerformance,
    hrMetrics,
    productionData: production_decision,
    rdData: rd_decision, // Add array of all R&D decisions
    marketingData: marketing_decision, // Add array of all marketing decisions
    hr_decision: latestHrDecision,
    finance_decision:
      financialHistory.length > 0
        ? financialHistory[financialHistory.length - 1]
        : null,
    marketing_decision: latestMarketingDecision,
    rd_decision: latestRdDecision,
    production_decision: latestProductionDecision,
    activeProductsCount,
  };
}
