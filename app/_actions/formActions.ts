"use server";

import prisma from "../functions/prisma";

export async function getInitialFormData(companyId: string, period: number) {
  try {
    // Use Promise.allSettled to handle cases where some data might not exist
    const results = await Promise.allSettled([
      prisma.finance.findFirst({
        where: { company_id: companyId },
        orderBy: { period: "desc" },
        select: {
          investment_amount: true,
          loan_amount: true,
          repay_loan: true,
          dividend_payout: true,
          equity_issue: true,
        },
      }),
      prisma.marketing.findFirst({
        where: { company_id: companyId, period: period },
        select: {
          budget: true,
          offline: true,
          online: true,
        },
      }),
      prisma.production.findFirst({
        where: { company_id: companyId, period: period },
        select: {
          production_capacity: true,
          storage_capacity: true,
          inventory_value: true,
          cost_per_unit: true,
          units_to_produce: true,
          defect_rate: true,
        },
      }),
      prisma.hr_decision.findFirst({
        where: { company_id: companyId },
        orderBy: { period: "desc" },
        select: {
          salary_budget: true,
          training_budget: true,
          total_budget: true,
          employee_satisfaction: true,
          recruitment_cost: true,
          firing_cost: true,
          total_employee_count: true,
        },
      }),
      prisma.hr_decision.findFirst({
        where: { company_id: companyId, period: period },
        select: {
          roles: {
            select: {
              role_name: true,
              salary_per_head: true,
              head_count: true,
            },
          },
        },
      }),
      prisma.rd.findFirst({
        where: { company_id: companyId, period: period },

        select: {
          budget: true,
          pip: true,
          time_to_market: true,
          total_development: true,
          patented: true,
          quality_changes: true,
        },
      }),
      prisma.product_performance.findFirst({
        where: {
          product: { company_id: companyId },
          period: period,
        },
        select: {
          sales_volume: true,
          revenue: true,
          costs: true,
          profit: true,
          market_share: true,
          customer_satisfaction: true,
        },
      }),
      prisma.product.findMany({
        where: { company_id: companyId },
        select: {
          id: true,
          name: true,
          description: true,
          category: true,
          quality_rating: true,
          innovation_rating: true,
          sustainability_rating: true,
          production_cost: true,
          selling_price: true,
          inventory_level: true,
          production_capacity: true,
          development_cost: true,
          marketing_budget: true,
          status: true,
          launch_period: true,
          discontinue_period: true,
        },
      }),
      prisma.company.findUnique({
        where: { id: companyId },
        select: {
          name: true,
          description: true,
          logo_url: true,
          cash_balance: true,
          total_assets: true,
          total_liabilities: true,
          marketing_budget: true,
          credit_rating: true,
          brand_value: true,
        },
      }),
      prisma.simulation.findFirst({
        where: { companies: { some: { id: companyId } } },
        select: {
          name: true,
          description: true,
          config: true,
          current_period: true,
          status: true,
        },
      }),
    ]);

    // Extract results, handling both fulfilled and rejected promises
    const [
      financeResult,
      marketingResult,
      productionResult,
      hrResult,
      hrRoleResult,
      rdResult,
      salesResult,
      productResult,
      companyResult,
      simulationResult,
    ] = results;

    const finance =
      financeResult.status === "fulfilled" ? financeResult.value : null;
    const marketing =
      marketingResult.status === "fulfilled" ? marketingResult.value : null;
    const production =
      productionResult.status === "fulfilled" ? productionResult.value : null;
    const hr = hrResult.status === "fulfilled" ? hrResult.value : null;
    const hrRole =
      hrRoleResult.status === "fulfilled" ? hrRoleResult.value : null;
    const rd = rdResult.status === "fulfilled" ? rdResult.value : null;
    const sales = salesResult.status === "fulfilled" ? salesResult.value : null;
    const products =
      productResult.status === "fulfilled" ? productResult.value : [];
    const company =
      companyResult.status === "fulfilled" ? companyResult.value : null;
    const simulation =
      simulationResult.status === "fulfilled" ? simulationResult.value : null;

    // Log any failed queries for debugging
    results.forEach((result) => {
      if (result.status === "rejected") {
        // Silently handle failed fetch
      }
    });

    return {
      finance,
      marketing,
      production,
      hr,
      hrRole,
      rd,
      sales,
      products,
      company,
      simulation,
      cashBalance: {
        originalCashBalance: company?.cash_balance || 100000,
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    // Return a safe default structure
    return {
      finance: null,
      marketing: null,
      production: null,
      hr: null,
      rd: null,
      sales: null,
      products: [],
      company: null,
      simulation: null,
      cashBalance: {
        originalCashBalance: 100000,
      },
    };
  }
}
