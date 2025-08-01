"use server";

import prisma from "../functions/prisma";
import { revalidatePath } from "next/cache";

interface ComprehensiveFormData {
  hr: {
    existingRoles: Array<{
      role_name: string;
      salary_per_head: number;
      current_head_count: number;
      hires: number;
      fires: number;
    }>;
    newRoles: Array<{
      role_name: string;
      salary_per_head: number;
      hires: number;
    }>;
    salary_budget: number;
    training_budget: number;
    total_budget: number;
    employee_satisfaction: number;
    recruitment_cost: number;
    firing_cost: number;
  };
  marketing: {
    budget: number;
    offline: number;
    online: number;
  };
  rd: {
    budget: number;
    pip: number;
    time_to_market: number;
    total_development: number;
    patented: number;
    quality_changes: number;
  };
  production: {
    production_capacity: number;
    inventory_value: number;
    storage_capacity: number;
    defect_rate: number;
    quality_improvement_investment: number;
    efficiency_upgrade_cost: number;
    maintenance_budget: number;
    automation_level: number;
    safety_investment: number;
    environmental_compliance_cost: number;
    units_to_produce: number;
    cost_per_unit: number;
  };
  finance: {
    investment_amount: number;
    loan_amount: number;
    repay_loan: number;
    dividend_payout: number;
    equity_issue: number;
  };
  product?: {
    name: string;
    description?: string;
    category: string;
    quality_rating: number;
    innovation_rating: number;
    sustainability_rating: number;
    production_cost: number;
    selling_price: number;
    inventory_level: number;
    production_capacity: number;
    development_cost: number;
    marketing_budget: number;
    status: string;
    launch_period?: number;
    discontinue_period?: number;
  };
  sales: {
    sales_volume: number;
    revenue: number;
    costs: number;
    profit: number;
    market_share: number;
    customer_satisfaction: number;
  };
  projected_balance: number;
  budget_impacts?: {
    hr: number;
    finance: number;
    marketing: number;
    production: number;
    rd: number;
    sales: number;
    product: number;
  };
}

export async function comprehensiveFormSubmission(
  companyId: string,
  formData: ComprehensiveFormData
) {
  console.log("Starting comprehensive form submission for company:", companyId);

  // Log budget breakdown for debugging
  if (formData.budget_impacts) {
    console.log("Budget breakdown:", {
      projected_balance: formData.projected_balance,
      budget_impacts: formData.budget_impacts,
      total_costs: Object.values(formData.budget_impacts).reduce(
        (sum, impact) => sum + Math.abs(impact),
        0
      ),
    });
  }

  try {
    const companyVerification = await prisma.$transaction(
      async (tx) => {
        const company = await tx.company.findUnique({
          where: { id: companyId },
          select: {
            id: true,
            current_period: true,
            cash_balance: true,
            user_id: true,
          },
        });

        if (!company) {
          throw new Error("Company not found");
        }

        return { company };
      },
      {
        timeout: 10000, // 10 second timeout for simple operations
      }
    );

    const { company } = companyVerification;
    const currentPeriod = company.current_period;

    const submissionResults: Record<
      string,
      { success: boolean; id?: string; error?: string; newPeriod?: number }
    > = {};

    // Step 2: Process all business areas in parallel using Promise.all
    console.log("Step 2: Processing all business decisions in parallel...");

    // Create array of promises for parallel execution
    const businessProcesses = [
      // 2.1. Submit HR Decision
      (async () => {
        try {
          await prisma.$transaction(
            async (tx) => {
              const existingHRDecision = await tx.hr_decision.findFirst({
                where: {
                  company_id: companyId,
                  period: currentPeriod,
                },
              });

              if (existingHRDecision) {
                // Update existing HR decision
                const updatedHRDecision = await tx.hr_decision.update({
                  where: { id: existingHRDecision.id },
                  data: {
                    salary_budget: formData.hr.salary_budget,
                    training_budget: formData.hr.training_budget,
                    total_budget: formData.hr.total_budget,
                    employee_satisfaction: formData.hr.employee_satisfaction,
                    recruitment_cost: formData.hr.recruitment_cost,
                    firing_cost: formData.hr.firing_cost,
                    is_submitted: true,
                  },
                });

                // Clear existing roles and create new ones
                await tx.hr_role_decision.deleteMany({
                  where: { hr_decision_id: existingHRDecision.id },
                });

                // Create role decisions for existing roles
                for (const role of formData.hr.existingRoles) {
                  await tx.hr_role_decision.create({
                    data: {
                      hr_decision_id: existingHRDecision.id,
                      role_name: role.role_name,
                      salary_per_head: role.salary_per_head,
                      head_count:
                        role.current_head_count + role.hires - role.fires,
                    },
                  });
                }

                // Create role decisions for new roles
                for (const role of formData.hr.newRoles) {
                  await tx.hr_role_decision.create({
                    data: {
                      hr_decision_id: existingHRDecision.id,
                      role_name: role.role_name,
                      salary_per_head: role.salary_per_head,
                      head_count: role.hires,
                    },
                  });
                }

                submissionResults.hr = {
                  success: true,
                  id: updatedHRDecision.id,
                };
              } else {
                // Create new HR decision
                const hrDecision = await tx.hr_decision.create({
                  data: {
                    company_id: companyId,
                    period: currentPeriod,
                    salary_budget: formData.hr.salary_budget,
                    training_budget: formData.hr.training_budget,
                    total_budget: formData.hr.total_budget,
                    employee_satisfaction: formData.hr.employee_satisfaction,
                    recruitment_cost: formData.hr.recruitment_cost,
                    firing_cost: formData.hr.firing_cost,
                    is_submitted: true,
                  },
                });

                // Create role decisions for existing roles
                for (const role of formData.hr.existingRoles) {
                  await tx.hr_role_decision.create({
                    data: {
                      hr_decision_id: hrDecision.id,
                      role_name: role.role_name,
                      salary_per_head: role.salary_per_head,
                      head_count:
                        role.current_head_count + role.hires - role.fires,
                    },
                  });
                }

                // Create role decisions for new roles
                for (const role of formData.hr.newRoles) {
                  await tx.hr_role_decision.create({
                    data: {
                      hr_decision_id: hrDecision.id,
                      role_name: role.role_name,
                      salary_per_head: role.salary_per_head,
                      head_count: role.hires,
                    },
                  });
                }

                submissionResults.hr = { success: true, id: hrDecision.id };
              }
            },
            {
              timeout: 15000, // 15 second timeout for HR operations
            }
          );
        } catch (error) {
          submissionResults.hr = {
            success: false,
            error:
              error instanceof Error ? error.message : "HR submission failed",
          };
          console.error("HR submission error:", error);
        }
      })(),

      // 2.2. Submit Marketing Decision
      (async () => {
        try {
          await prisma.$transaction(
            async (tx) => {
              const existingMarketingDecision = await tx.marketing.findFirst({
                where: {
                  company_id: companyId,
                  period: currentPeriod,
                },
              });

              if (existingMarketingDecision) {
                const updatedMarketingDecision = await tx.marketing.update({
                  where: { id: existingMarketingDecision.id },
                  data: {
                    budget: formData.marketing.budget,
                    offline: formData.marketing.offline,
                    online: formData.marketing.online,
                    finalised: true,
                  },
                });
                submissionResults.marketing = {
                  success: true,
                  id: updatedMarketingDecision.id,
                };
              } else {
                const marketingDecision = await tx.marketing.create({
                  data: {
                    company_id: companyId,
                    period: currentPeriod,
                    budget: formData.marketing.budget,
                    offline: formData.marketing.offline,
                    online: formData.marketing.online,
                    finalised: true,
                  },
                });
                submissionResults.marketing = {
                  success: true,
                  id: marketingDecision.id,
                };
              }
            },
            {
              timeout: 10000, // 10 second timeout for marketing operations
            }
          );
        } catch (error) {
          submissionResults.marketing = {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Marketing submission failed",
          };
          console.error("Marketing submission error:", error);
        }
      })(),

      // 2.3. Submit R&D Decision
      (async () => {
        try {
          await prisma.$transaction(
            async (tx) => {
              const existingRDDecision = await tx.rd.findFirst({
                where: {
                  company_id: companyId,
                  period: currentPeriod,
                },
              });

              if (existingRDDecision) {
                const updatedRDDecision = await tx.rd.update({
                  where: { id: existingRDDecision.id },
                  data: {
                    budget: formData.rd.budget,
                    pip: formData.rd.pip,
                    time_to_market: formData.rd.time_to_market,
                    total_development: formData.rd.total_development,
                    patented: formData.rd.patented,
                    quality_changes: formData.rd.quality_changes,
                    finalised: true,
                  },
                });
                submissionResults.rd = {
                  success: true,
                  id: updatedRDDecision.id,
                };
              } else {
                const rdDecision = await tx.rd.create({
                  data: {
                    company_id: companyId,
                    period: currentPeriod,
                    budget: formData.rd.budget,
                    pip: formData.rd.pip,
                    time_to_market: formData.rd.time_to_market,
                    total_development: formData.rd.total_development,
                    patented: formData.rd.patented,
                    quality_changes: formData.rd.quality_changes,
                    finalised: true,
                  },
                });
                submissionResults.rd = { success: true, id: rdDecision.id };
              }
            },
            {
              timeout: 10000, // 10 second timeout for R&D operations
            }
          );
        } catch (error) {
          submissionResults.rd = {
            success: false,
            error:
              error instanceof Error ? error.message : "R&D submission failed",
          };
          console.error("R&D submission error:", error);
        }
      })(),

      // 2.4. Submit Production Decision
      (async () => {
        try {
          await prisma.$transaction(
            async (tx) => {
              const existingProductionDecision = await tx.production.findFirst({
                where: {
                  company_id: companyId,
                  period: currentPeriod,
                },
              });

              if (existingProductionDecision) {
                const updatedProductionDecision = await tx.production.update({
                  where: { id: existingProductionDecision.id },
                  data: {
                    units_to_produce: formData.production.units_to_produce,
                    cost_per_unit: formData.production.cost_per_unit,
                    budget:
                      formData.production.units_to_produce *
                      formData.production.cost_per_unit,
                    production_capacity:
                      formData.production.production_capacity,
                    storage_capacity: formData.production.storage_capacity,
                    inventory_value: formData.production.inventory_value,
                    defect_rate: formData.production.defect_rate,
                    finalised: true,
                  },
                });
                submissionResults.production = {
                  success: true,
                  id: updatedProductionDecision.id,
                };
              } else {
                const productionDecision = await tx.production.create({
                  data: {
                    company_id: companyId,
                    period: currentPeriod,
                    units_to_produce: formData.production.units_to_produce,
                    cost_per_unit: formData.production.cost_per_unit,
                    budget:
                      formData.production.units_to_produce *
                      formData.production.cost_per_unit,
                    production_capacity:
                      formData.production.production_capacity,
                    storage_capacity: formData.production.storage_capacity,
                    inventory_value: formData.production.inventory_value,
                    defect_rate: formData.production.defect_rate,
                    finalised: true,
                  },
                });
                submissionResults.production = {
                  success: true,
                  id: productionDecision.id,
                };
              }
            },
            {
              timeout: 10000, // 10 second timeout for production operations
            }
          );
        } catch (error) {
          submissionResults.production = {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Production submission failed",
          };
          console.error("Production submission error:", error);
        }
      })(),

      // 2.5. Submit Finance Decision
      (async () => {
        try {
          await prisma.$transaction(
            async (tx) => {
              const existingFinanceDecision = await tx.finance.findFirst({
                where: {
                  company_id: companyId,
                  period: currentPeriod,
                },
              });

              if (existingFinanceDecision) {
                const updatedFinanceDecision = await tx.finance.update({
                  where: { id: existingFinanceDecision.id },
                  data: {
                    investment_amount: formData.finance.investment_amount,
                    loan_amount: formData.finance.loan_amount,
                    repay_loan: formData.finance.repay_loan,
                    dividend_payout: formData.finance.dividend_payout,
                    equity_issue: formData.finance.equity_issue,
                    finalised: true,
                  },
                });
                submissionResults.finance = {
                  success: true,
                  id: updatedFinanceDecision.id,
                };
              } else {
                const financeDecision = await tx.finance.create({
                  data: {
                    company_id: companyId,
                    user_id: company.user_id,
                    period: currentPeriod,
                    investment_amount: formData.finance.investment_amount,
                    loan_amount: formData.finance.loan_amount,
                    repay_loan: formData.finance.repay_loan,
                    dividend_payout: formData.finance.dividend_payout,
                    equity_issue: formData.finance.equity_issue,
                    finalised: true,
                  },
                });
                submissionResults.finance = {
                  success: true,
                  id: financeDecision.id,
                };
              }
            },
            {
              timeout: 10000, // 10 second timeout for finance operations
            }
          );
        } catch (error) {
          submissionResults.finance = {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Finance submission failed",
          };
          console.error("Finance submission error:", error);
        }
      })(),

      // 2.6. Handle Product (Create or Update)
      (async () => {
        try {
          if (formData.product && formData.product.name) {
            await prisma.$transaction(
              async (tx) => {
                const existingProduct = await tx.product.findFirst({
                  where: {
                    company_id: companyId,
                    name: formData.product!.name,
                  },
                });

                if (existingProduct) {
                  const updatedProduct = await tx.product.update({
                    where: { id: existingProduct.id },
                    data: {
                      description: formData.product!.description,
                      category: formData.product!.category,
                      quality_rating: formData.product!.quality_rating,
                      innovation_rating: formData.product!.innovation_rating,
                      sustainability_rating: formData.product!
                        .sustainability_rating,
                      production_cost: formData.product!.production_cost,
                      selling_price: formData.product!.selling_price,
                      inventory_level: formData.product!.inventory_level,
                      production_capacity: formData.product!
                        .production_capacity,
                      development_cost: formData.product!.development_cost,
                      marketing_budget: formData.product!.marketing_budget,
                      status: formData.product!.status,
                      launch_period: formData.product!.launch_period,
                      discontinue_period: formData.product!.discontinue_period,
                    },
                  });
                  submissionResults.product = {
                    success: true,
                    id: updatedProduct.id,
                  };
                } else {
                  const newProduct = await tx.product.create({
                    data: {
                      company_id: companyId,
                      name: formData.product!.name,
                      description: formData.product!.description,
                      category: formData.product!.category,
                      quality_rating: formData.product!.quality_rating,
                      innovation_rating: formData.product!.innovation_rating,
                      sustainability_rating: formData.product!
                        .sustainability_rating,
                      production_cost: formData.product!.production_cost,
                      selling_price: formData.product!.selling_price,
                      inventory_level: formData.product!.inventory_level,
                      production_capacity: formData.product!
                        .production_capacity,
                      development_cost: formData.product!.development_cost,
                      marketing_budget: formData.product!.marketing_budget,
                      status: formData.product!.status,
                      launch_period:
                        formData.product!.launch_period || currentPeriod,
                      discontinue_period: formData.product!.discontinue_period,
                    },
                  });
                  submissionResults.product = {
                    success: true,
                    id: newProduct.id,
                  };
                }
              },
              {
                timeout: 10000, // 10 second timeout for product operations
              }
            );
          }
        } catch (error) {
          submissionResults.product = {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Product submission failed",
          };
          console.error("Product submission error:", error);
        }
      })(),

      // 2.7. Process Sales decisions as Product Performance
      (async () => {
        try {
          await prisma.$transaction(
            async (tx) => {
              // Get the first product for the company
              const products = await tx.product.findMany({
                where: { company_id: companyId },
                orderBy: { created_at: "asc" },
                take: 1,
              });

              if (products.length > 0) {
                const product = products[0];

                // Check if product performance record exists for this period
                const existingPerformance = await tx.product_performance.findFirst(
                  {
                    where: {
                      product_id: product.id,
                      period: currentPeriod,
                    },
                  }
                );

                if (existingPerformance) {
                  // Update existing product performance
                  await tx.product_performance.update({
                    where: { id: existingPerformance.id },
                    data: {
                      sales_volume: formData.sales.sales_volume,
                      revenue: formData.sales.revenue,
                      costs: formData.sales.costs,
                      profit: formData.sales.profit,
                      market_share: formData.sales.market_share,
                      customer_satisfaction:
                        formData.sales.customer_satisfaction,
                    },
                  });
                } else {
                  // Create new product performance record
                  await tx.product_performance.create({
                    data: {
                      product_id: product.id,
                      period: currentPeriod,
                      sales_volume: formData.sales.sales_volume,
                      revenue: formData.sales.revenue,
                      costs: formData.sales.costs,
                      profit: formData.sales.profit,
                      market_share: formData.sales.market_share,
                      customer_satisfaction:
                        formData.sales.customer_satisfaction,
                    },
                  });
                }

                submissionResults.sales = {
                  success: true,
                };
              } else {
                submissionResults.sales = {
                  success: false,
                  error: "No product found for sales performance recording",
                };
              }
            },
            {
              timeout: 30000,
            }
          );
        } catch (error) {
          submissionResults.sales = {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Sales submission failed",
          };
          console.error("Sales submission error:", error);
        }
      })(),
    ];

    // Execute all business processes in parallel
    await Promise.all(businessProcesses);

    console.log("All business processes completed, checking results...");

    // Step 3: Final transaction to deduct budget and advance period
    console.log(
      "Step 3: Finalizing - deducting budget and advancing period..."
    );
    try {
      await prisma.$transaction(
        async (tx) => {
          // Advance the period and update cash balance to projected balance
          await tx.company.update({
            where: { id: companyId },
            data: {
              current_period: { increment: 1 },
              cash_balance: formData.projected_balance,
            },
          });

          const newPeriod = company.current_period + 1;
          submissionResults.periodAdvancement = { success: true, newPeriod };
        },
        {
          timeout: 15000, // 15 second timeout for final operations
        }
      );
    } catch (error) {
      submissionResults.periodAdvancement = {
        success: false,
        error:
          error instanceof Error ? error.message : "Period advancement failed",
      };
      console.error("Period advancement error:", error);
    }

    // Revalidate paths
    revalidatePath(`/simulate/${companyId}`);
    revalidatePath(`/homepage/${companyId}`);

    console.log("Form submission completed successfully");
    return {
      success: true,
      message: "All form data submitted successfully and period advanced",
      results: submissionResults,
      companyId,
      newPeriod: company.current_period + 1,
    } as const;
  } catch (error) {
    console.error("Error in comprehensive form submission:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Form submission failed",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    } as const;
  }
}
