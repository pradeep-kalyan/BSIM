"use server";

import prisma from "../functions/prisma";

export async function getInitialFormData(companyId: string, period: number) {
  try {
    // Use Promise.allSettled to handle cases where some data might not exist
    const results = await Promise.allSettled([
      // Finance - get latest period data
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
      // Marketing - get data for specific period
      prisma.marketing.findFirst({
        where: { company_id: companyId, period: period },
        select: {
          budget: true,
          offline: true,
          online: true,
        },
      }),
      // Production - get all products for specific period
      prisma.production.findMany({
        where: {
          company_id: companyId,
          period: period,
        },
        select: {
          product_id: true,
          production_capacity: true,
          storage_capacity: true,
          inventory_value: true,
          cost_per_unit: true,
          units_to_produce: true,
          defect_rate: true,
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      // HR Decision - get latest period data
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
      // HR Roles - get roles for specific period
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
      // R&D - get data for specific period
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
      // Product Performance - get data for specific period
      // Fixed: Need to join through product table to filter by company
      prisma.product_performance.findMany({
        where: {
          product: { company_id: companyId },
          period: period,
        },
        select: {
          sales_volume: true,
          revenue: true,
          costs: true,
          profit: true,
          selling_price: true,
          market_share: true,
          customer_satisfaction: true,
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      // Products - get all products for company
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
          status: true,
          launch_period: true,
          discontinue_period: true,
        },
      }),
      // Company - get company details
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
      // Simulation - get simulation details for the company
      prisma.simulation.findFirst({
        where: {
          companies: {
            some: { id: companyId },
          },
        },
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
      productionResult.status === "fulfilled" ? productionResult.value : [];
    const hr = hrResult.status === "fulfilled" ? hrResult.value : null;
    const hrRole =
      hrRoleResult.status === "fulfilled" ? hrRoleResult.value : null;
    const rd = rdResult.status === "fulfilled" ? rdResult.value : null;
    const sales = salesResult.status === "fulfilled" ? salesResult.value : [];
    const products =
      productResult.status === "fulfilled" ? productResult.value : [];
    const company =
      companyResult.status === "fulfilled" ? companyResult.value : null;
    const simulation =
      simulationResult.status === "fulfilled" ? simulationResult.value : null;

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
  } catch {
    // Return a safe default structure
    return {
      finance: null,
      marketing: null,
      production: [],
      hr: null,
      hrRole: null,
      rd: null,
      sales: [],
      products: [],
      company: null,
      simulation: null,
      cashBalance: {
        originalCashBalance: 100000,
      },
    };
  }
}
