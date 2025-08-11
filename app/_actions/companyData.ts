"use server";

import prisma from "@/app/functions/prisma";

export async function getCompanyComparisonData(
  simulationId: string,
  companyIds: string[]
) {
  const companies = await prisma.company.findMany({
    where: {
      simulation_id: simulationId,
      id: { in: companyIds },
    },
    include: {
      finance_decisions: {
        orderBy: { period: "desc" },
        take: 1,
      },
      hr_decisions: {
        orderBy: { period: "desc" },
        take: 1,
      },
      rd_decisions: {
        orderBy: { period: "desc" },
        take: 1,
      },
      production_decisions: {
        orderBy: { period: "desc" },
        take: 1,
      },
      products: {
        orderBy: { name: "asc" },
        take: 3,
        include: {
          performances: {
            orderBy: { period: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  return companies.map((company) => {
    const finance = company.finance_decisions[0];
    const hr = company.hr_decisions[0];
    const rd = company.rd_decisions[0];
    const production = company.production_decisions[0];

    return {
      id: company.id,
      name: company.name,
      cash_balance: company.cash_balance ?? 0,
      total_assets: company.total_assets ?? 0,
      total_liabilities: company.total_liabilities ?? 0,
      brand_value: company.brand_value ?? 0,
      marketing_budget: company.marketing_budget ?? 0,
      current_period: company.current_period ?? 0,
      finance: {
        total_revenue: finance?.total_revenue ?? 0,
        net_profit: finance?.net_profit ?? 0,
        roi: finance?.roi ?? 0,
        burn_rate: finance?.burn_rate ?? 0,
      },
      hr: {
        total_budget: hr?.total_budget ?? 0,
        employee_satisfaction: hr?.employee_satisfaction ?? 0,
      },
      rd: {
        budget: rd?.budget ?? 0,
        patented: rd?.patented ?? 0,
        quality_changes: rd?.quality_changes ?? 0,
      },
      production: {
        production_capacity: production?.production_capacity ?? 0,
        defect_rate: production?.defect_rate ?? 0,
      },
      products: company.products.map((product) => {
        const performance = product.performances[0];
        return {
          name: product.name,
          market_share: performance?.market_share ?? 0,
          customer_satisfaction: performance?.customer_satisfaction ?? 0,
        };
      }),
    };
  });
}
