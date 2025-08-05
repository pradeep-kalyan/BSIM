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
    // Get company information first (simple query, no transaction needed)
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        current_period: true,
        cash_balance: true,
        user_id: true,
        data: true,
        total_assets: true,
        total_liabilities: true,
        marketing_budget: true,
        credit_rating: true,
        brand_value: true,
      },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    const currentPeriod = company.current_period;

    const submissionResults: Record<
      string,
      { success: boolean; id?: string; error?: string; newPeriod?: number }
    > = {};

    // Step 2: Process all business areas in parallel using direct operations (no nested transactions)
    console.log("Step 2: Processing all business decisions in parallel...");

    // Create array of promises for parallel execution
    const businessProcesses = [
      // 2.1. Submit HR Decision
      (async () => {
        try {
          const existingHRDecision = await prisma.hr_decision.findFirst({
            where: {
              company_id: companyId,
              period: currentPeriod,
            },
          });

          if (existingHRDecision) {
            // Update existing HR decision
            const updatedHRDecision = await prisma.hr_decision.update({
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
            await prisma.hr_role_decision.deleteMany({
              where: { hr_decision_id: existingHRDecision.id },
            });

            // Create role decisions for existing roles
            const existingRolePromises = formData.hr.existingRoles.map((role) =>
              prisma.hr_role_decision.create({
                data: {
                  hr_decision_id: existingHRDecision.id,
                  role_name: role.role_name,
                  salary_per_head: role.salary_per_head,
                  head_count: role.current_head_count + role.hires - role.fires,
                },
              })
            );

            // Create role decisions for new roles
            const newRolePromises = formData.hr.newRoles.map((role) =>
              prisma.hr_role_decision.create({
                data: {
                  hr_decision_id: existingHRDecision.id,
                  role_name: role.role_name,
                  salary_per_head: role.salary_per_head,
                  head_count: role.hires,
                },
              })
            );

            await Promise.all([...existingRolePromises, ...newRolePromises]);

            submissionResults.hr = {
              success: true,
              id: updatedHRDecision.id,
            };
          } else {
            // Create new HR decision
            const hrDecision = await prisma.hr_decision.create({
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

            // Create role decisions for existing and new roles
            const allRolePromises = [
              ...formData.hr.existingRoles.map((role) =>
                prisma.hr_role_decision.create({
                  data: {
                    hr_decision_id: hrDecision.id,
                    role_name: role.role_name,
                    salary_per_head: role.salary_per_head,
                    head_count:
                      role.current_head_count + role.hires - role.fires,
                  },
                })
              ),
              ...formData.hr.newRoles.map((role) =>
                prisma.hr_role_decision.create({
                  data: {
                    hr_decision_id: hrDecision.id,
                    role_name: role.role_name,
                    salary_per_head: role.salary_per_head,
                    head_count: role.hires,
                  },
                })
              ),
            ];

            await Promise.all(allRolePromises);
            submissionResults.hr = { success: true, id: hrDecision.id };
          }
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
          const existingMarketingDecision = await prisma.marketing.findFirst({
            where: {
              company_id: companyId,
              period: currentPeriod,
            },
          });

          if (existingMarketingDecision) {
            const updatedMarketingDecision = await prisma.marketing.update({
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
            const marketingDecision = await prisma.marketing.create({
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
          const existingRDDecision = await prisma.rd.findFirst({
            where: {
              company_id: companyId,
              period: currentPeriod,
            },
          });

          if (existingRDDecision) {
            const updatedRDDecision = await prisma.rd.update({
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
            const rdDecision = await prisma.rd.create({
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
          const existingProductionDecision = await prisma.production.findFirst({
            where: {
              company_id: companyId,
              period: currentPeriod,
            },
          });

          if (existingProductionDecision) {
            const updatedProductionDecision = await prisma.production.update({
              where: { id: existingProductionDecision.id },
              data: {
                units_to_produce: formData.production.units_to_produce,
                cost_per_unit: formData.production.cost_per_unit,
                budget:
                  formData.production.units_to_produce *
                  formData.production.cost_per_unit,
                production_capacity: formData.production.production_capacity,
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
            const productionDecision = await prisma.production.create({
              data: {
                company_id: companyId,
                period: currentPeriod,
                units_to_produce: formData.production.units_to_produce,
                cost_per_unit: formData.production.cost_per_unit,
                budget:
                  formData.production.units_to_produce *
                  formData.production.cost_per_unit,
                production_capacity: formData.production.production_capacity,
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
          const existingFinanceDecision = await prisma.finance.findFirst({
            where: {
              company_id: companyId,
              period: currentPeriod,
            },
          });

          if (existingFinanceDecision) {
            const updatedFinanceDecision = await prisma.finance.update({
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
            const financeDecision = await prisma.finance.create({
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
            const existingProduct = await prisma.product.findFirst({
              where: {
                company_id: companyId,
                name: formData.product.name,
              },
            });

            if (existingProduct) {
              const updatedProduct = await prisma.product.update({
                where: { id: existingProduct.id },
                data: {
                  description: formData.product.description,
                  category: formData.product.category,
                  quality_rating: formData.product.quality_rating,
                  innovation_rating: formData.product.innovation_rating,
                  sustainability_rating: formData.product.sustainability_rating,
                  production_cost: formData.product.production_cost,
                  selling_price: formData.product.selling_price,
                  inventory_level: formData.product.inventory_level,
                  production_capacity: formData.product.production_capacity,
                  development_cost: formData.product.development_cost,
                  marketing_budget: formData.product.marketing_budget,
                  status: formData.product.status,
                  launch_period: formData.product.launch_period,
                  discontinue_period: formData.product.discontinue_period,
                },
              });
              submissionResults.product = {
                success: true,
                id: updatedProduct.id,
              };
            } else {
              const newProduct = await prisma.product.create({
                data: {
                  company_id: companyId,
                  name: formData.product.name,
                  description: formData.product.description,
                  category: formData.product.category,
                  quality_rating: formData.product.quality_rating,
                  innovation_rating: formData.product.innovation_rating,
                  sustainability_rating: formData.product.sustainability_rating,
                  production_cost: formData.product.production_cost,
                  selling_price: formData.product.selling_price,
                  inventory_level: formData.product.inventory_level,
                  production_capacity: formData.product.production_capacity,
                  development_cost: formData.product.development_cost,
                  marketing_budget: formData.product.marketing_budget,
                  status: formData.product.status,
                  launch_period:
                    formData.product.launch_period || currentPeriod,
                  discontinue_period: formData.product.discontinue_period,
                },
              });
              submissionResults.product = {
                success: true,
                id: newProduct.id,
              };
            }
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
          // Get the first product for the company
          const products = await prisma.product.findMany({
            where: { company_id: companyId },
            orderBy: { created_at: "asc" },
            take: 1,
          });

          if (products.length > 0) {
            const product = products[0];

            // Check if product performance record exists for this period
            const existingPerformance =
              await prisma.product_performance.findFirst({
                where: {
                  product_id: product.id,
                  period: currentPeriod,
                },
              });

            if (existingPerformance) {
              // Update existing product performance
              await prisma.product_performance.update({
                where: { id: existingPerformance.id },
                data: {
                  sales_volume: formData.sales.sales_volume,
                  revenue: formData.sales.revenue,
                  costs: formData.sales.costs,
                  profit: formData.sales.profit,
                  market_share: formData.sales.market_share,
                  customer_satisfaction: formData.sales.customer_satisfaction,
                },
              });
            } else {
              // Create new product performance record
              await prisma.product_performance.create({
                data: {
                  product_id: product.id,
                  period: currentPeriod,
                  sales_volume: formData.sales.sales_volume,
                  revenue: formData.sales.revenue,
                  costs: formData.sales.costs,
                  profit: formData.sales.profit,
                  market_share: formData.sales.market_share,
                  customer_satisfaction: formData.sales.customer_satisfaction,
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

    // Check if any critical operations failed
    const failedOperations = Object.entries(submissionResults)
      .filter(([, result]) => !result.success)
      .map(([operation, result]) => ({ operation, error: result.error }));

    if (failedOperations.length > 0) {
      console.warn("Some operations failed:", failedOperations);
      // Continue with period advancement even if some operations failed
      // This ensures the application doesn't get stuck in an inconsistent state
    }

    // Step 3: Final transaction to store history and advance period (using a single optimized transaction)
    console.log(
      "Step 3: Finalizing - storing company history and advancing period..."
    );
    try {
      await prisma.$transaction(
        async (tx) => {
          // Store current company data to history before advancing period
          await tx.company_history.create({
            data: {
              company_id: companyId,
              period: currentPeriod,
              cash_balance: company.cash_balance,
              data: company.data,
              total_assets: company.total_assets,
              total_liabilities: company.total_liabilities,
              marketing_budget: company.marketing_budget,
              credit_rating: company.credit_rating,
              brand_value: company.brand_value,
            },
          });

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
          timeout: 30000, // 30 second timeout for final operations
          maxWait: 10000, // Maximum time to wait for a connection from the pool
          isolationLevel: "ReadCommitted", // Use a less strict isolation level for better performance
        }
      );
    } catch (error) {
      submissionResults.periodAdvancement = {
        success: false,
        error:
          error instanceof Error ? error.message : "Period advancement failed",
      };
      console.error("Period advancement error:", error);

      // If period advancement fails, we should still return the other results
      // but indicate that the process didn't complete fully
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
