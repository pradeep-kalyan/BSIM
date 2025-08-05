/* eslint-disable @typescript-eslint/no-explicit-any */
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

// Updated helper functions for form submissions with correct database schema
export async function submitFinanceForm(
  data: any,
  companyId: string,
  period: number
) {
  try {
    const result = await prisma.finance.upsert({
      where: {
        company_id_period: {
          company_id: companyId,
          period: period,
        },
      },
      update: {
        investment_amount: data.investment_amount ?? 0,
        loan_amount: data.loan_amount ?? 0,
        repay_loan: data.repay_loan ?? 0,
        dividend_payout: data.dividend_payout ?? 0,
        equity_issue: data.equity_issue ?? 0,
        updated_at: new Date(),
      },
      create: {
        company_id: companyId,
        period: period,
        investment_amount: data.investment_amount ?? 0,
        loan_amount: data.loan_amount ?? 0,
        repay_loan: data.repay_loan ?? 0,
        dividend_payout: data.dividend_payout ?? 0,
        equity_issue: data.equity_issue ?? 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function submitMarketingForm(
  data: any,
  companyId: string,
  period: number
) {
  try {
    const result = await prisma.marketing.upsert({
      where: {
        company_id_period: {
          company_id: companyId,
          period: period,
        },
      },
      update: {
        budget: data.budget ?? 0,
        offline: data.offline ?? 0,
        online: data.online ?? 0,
        updated_at: new Date(),
      },
      create: {
        company_id: companyId,
        period: period,
        budget: data.budget ?? 0,
        offline: data.offline ?? 0,
        online: data.online ?? 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function submitProductionForm(
  data: any,
  companyId: string,
  period: number
) {
  try {
    const result = await prisma.production.upsert({
      where: {
        company_id_period: {
          company_id: companyId,
          period: period,
        },
      },
      update: {
        production_capacity: data.production_capacity ?? 2000,
        inventory_value: data.inventory_value ?? 0,
        storage_capacity: data.storage_capacity ?? 0,
        defect_rate: data.defect_rate ?? 0,
        updated_at: new Date(),
      },
      create: {
        company_id: companyId,
        period: period,
        units_to_produce: 0, // Default value
        cost_per_unit: 0, // Default value
        production_capacity: data.production_capacity ?? 2000,
        inventory_value: data.inventory_value ?? 0,
        storage_capacity: data.storage_capacity ?? 0,
        defect_rate: data.defect_rate ?? 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function submitHRForm(
  data: any,
  companyId: string,
  period: number
) {
  try {
    const result = await prisma.hr_decision.upsert({
      where: {
        company_id_period: {
          company_id: companyId,
          period: period,
        },
      },
      update: {
        salary_budget: data.salary_budget ?? 0,
        training_budget: data.training_budget ?? 0,
        total_budget: data.total_budget ?? 0,
        employee_satisfaction: data.employee_satisfaction ?? 0,
        recruitment_cost: data.recruitment_cost ?? 0,
        firing_cost: data.firing_cost ?? 0,
      },
      create: {
        company_id: companyId,
        period: period,
        salary_budget: data.salary_budget ?? 0,
        training_budget: data.training_budget ?? 0,
        total_budget: data.total_budget ?? 0,
        employee_satisfaction: data.employee_satisfaction ?? 0,
        recruitment_cost: data.recruitment_cost ?? 0,
        firing_cost: data.firing_cost ?? 0,
        submitted_at: new Date(),
      },
    });

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function submitRDForm(
  data: any,
  companyId: string,
  period: number
) {
  try {
    const result = await prisma.rd.upsert({
      where: {
        company_id_period: {
          company_id: companyId,
          period: period,
        },
      },
      update: {
        budget: data.budget ?? 0,
        pip: data.pip ?? 0,
        time_to_market: data.time_to_market ?? 0,
        total_development: data.total_development ?? 0,
        patented: data.patented ?? 0,
        quality_changes: data.quality_changes ?? 0,
        updated_at: new Date(),
      },
      create: {
        company_id: companyId,
        period: period,
        budget: data.budget ?? 0,
        pip: data.pip ?? 0,
        time_to_market: data.time_to_market ?? 0,
        total_development: data.total_development ?? 0,
        patented: data.patented ?? 0,
        quality_changes: data.quality_changes ?? 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function submitProductForm(data: any, companyId: string) {
  try {
    const result = await prisma.product.upsert({
      where: {
        name: data.name ?? "",
      },
      update: {
        description: data.description ?? "",
        category: data.category ?? "",
        quality_rating: data.quality_rating ?? 0,
        innovation_rating: data.innovation_rating ?? 0,
        sustainability_rating: data.sustainability_rating ?? 0,
        production_cost: data.production_cost ?? 0,
        selling_price: data.selling_price ?? 0,
        inventory_level: data.inventory_level ?? 0,
        production_capacity: data.production_capacity ?? 2000,
        development_cost: data.development_cost ?? 0,
        marketing_budget: data.marketing_budget ?? 0,
        status: data.status ?? "development",
        launch_period: data.launch_period,
        discontinue_period: data.discontinue_period,
        updated_at: new Date(),
      },
      create: {
        company_id: companyId,
        name: data.name ?? "",
        description: data.description ?? "",
        category: data.category ?? "",
        quality_rating: data.quality_rating ?? 0,
        innovation_rating: data.innovation_rating ?? 0,
        sustainability_rating: data.sustainability_rating ?? 0,
        production_cost: data.production_cost ?? 0,
        selling_price: data.selling_price ?? 0,
        inventory_level: data.inventory_level ?? 0,
        production_capacity: data.production_capacity ?? 2000,
        development_cost: data.development_cost ?? 0,
        marketing_budget: data.marketing_budget ?? 0,
        status: data.status ?? "development",
        launch_period: data.launch_period,
        discontinue_period: data.discontinue_period,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
