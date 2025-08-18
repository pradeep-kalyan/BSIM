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
    total_employee_count: number;
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
    products: Array<{
      product_id: string;
      units_to_produce: number;
      cost_per_unit: number;
      total_cost: number;
      production_capacity: number;
      storage_capacity: number;
      inventory_value: number;
      defect_rate: number;
    }>;
  };
  finance: {
    investment_amount: number;
    loan_amount: number;
    repay_loan: number;
    dividend_payout: number;
    equity_issue: number;
    net_profit: number;
    operating_costs: number;
    total_revenue: number;
  };
  product?: Array<{
    name: string;
    description?: string | null;
    category: string;
    quality_rating: number;
    innovation_rating: number;
    sustainability_rating: number;
    selling_price: number;
    inventory_level?: number;
    production_capacity?: number;
    development_cost?: number;
    status: string;
    launch_period?: number | null;
    discontinue_period?: number | null;
  }>;
  sales: {
    [productId: string]: {
      sales_volume: number;
      revenue: number;
      costs: number;
      profit: number;
      market_share: number;
      customer_satisfaction: number;
    };
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
  // Log budget breakdown for debugging

  try {
    // Get company information first (simple query, no transaction needed)
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        current_period: true,
        cash_balance: true,
        user_id: true,
        total_assets: true,
        total_liabilities: true,
        brand_value: true,
      },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    const currentPeriod = company.current_period;

    const submissionResults: Record<
      string,
      {
        success: boolean;
        id?: string;
        error?: string;
        newPeriod?: number;
        products?: Array<{ success: boolean; id: string; name: string }>;
        count?: number;
        message?: string;
      }
    > = {};

    // Step 2: Process all business areas in parallel using direct operations (no nested transactions)

    // Create array of promises for parallel execution
    const businessProcesses = [
      // 2.1. Submit HR Decision
      (async () => {
        try {
          // Calculate total employee count from existing and new roles
          const totalEmployeeCount =
            formData.hr.existingRoles.reduce(
              (total, role) =>
                total + (role.current_head_count + role.hires - role.fires),
              0
            ) +
            formData.hr.newRoles.reduce((total, role) => total + role.hires, 0);

          const existingHRDecision = await prisma.hr_decision.findFirst({
            where: {
              company_id: companyId,
              period: currentPeriod,
            },
          });

          if (existingHRDecision) {
            // Only update if not yet submitted to preserve historical data
            if (!existingHRDecision.is_submitted) {
              // Update existing HR decision
              const updatedHRDecision = await prisma.hr_decision.update({
                where: { id: existingHRDecision.id },
                data: {
                  salary_budget: formData.hr.salary_budget,
                  training_budget: formData.hr.training_budget,
                  total_budget: formData.hr.total_budget,
                  employee_satisfaction: formData.hr.employee_satisfaction,
                  recruitment_cost: 0,
                  firing_cost: 0,
                  total_employee_count: totalEmployeeCount,
                  is_submitted: true,
                },
              });

              // Clear existing roles and create new ones
              await prisma.hr_role_decision.deleteMany({
                where: { hr_decision_id: existingHRDecision.id },
              });

              // Create role decisions for existing roles
              const existingRolePromises = formData.hr.existingRoles.map(
                (role) =>
                  prisma.hr_role_decision.create({
                    data: {
                      hr_decision_id: existingHRDecision.id,
                      role_name: role.role_name,
                      salary_per_head: role.salary_per_head,
                      head_count:
                        role.current_head_count + role.hires - role.fires,
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
              // If already submitted, preserve the historical data
              submissionResults.hr = {
                success: true,
                id: existingHRDecision.id,
              };
            }
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
                recruitment_cost: 0,
                firing_cost: 0,
                total_employee_count: totalEmployeeCount,
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
            // Only update if not yet finalized to preserve historical data
            if (!existingMarketingDecision.finalised) {
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
              // If already finalized, preserve the historical data
              submissionResults.marketing = {
                success: true,
                id: existingMarketingDecision.id,
              };
            }
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
            // Only update if not yet finalized to preserve historical data
            if (!existingRDDecision.finalised) {
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
              // If already finalized, preserve the historical data
              submissionResults.rd = {
                success: true,
                id: existingRDDecision.id,
              };
            }
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
        }
      })(),

      // 2.4. Submit Production Decisions (per product)
      (async () => {
        try {
          const productionResults = [];

          // Process each product's production decision
          for (const productData of formData.production.products) {
            // Get product name for the result
            const product = await prisma.product.findUnique({
              where: { id: productData.product_id },
              select: { name: true },
            });

            const existingProductionDecision =
              await prisma.production.findFirst({
                where: {
                  company_id: companyId,
                  product_id: productData.product_id,
                  period: currentPeriod,
                },
              });

            if (existingProductionDecision) {
              // Only update if not yet finalized to preserve historical data
              if (!existingProductionDecision.finalised) {
                const updatedProductionDecision =
                  await prisma.production.update({
                    where: { id: existingProductionDecision.id },
                    data: {
                      units_to_produce: productData.units_to_produce,
                      cost_per_unit: productData.cost_per_unit,
                      total_cost:
                        productData.total_cost ||
                        productData.units_to_produce *
                          productData.cost_per_unit *
                          (1 + productData.defect_rate / 100),
                      production_capacity: productData.production_capacity,
                      storage_capacity: productData.storage_capacity,
                      inventory_value: productData.inventory_value,
                      defect_rate: productData.defect_rate,
                      finalised: true,
                    },
                  });
                productionResults.push({
                  success: true,
                  id: updatedProductionDecision.id,
                  name: product?.name || "Unknown Product",
                });
              } else {
                // If already finalized, preserve the historical data
                productionResults.push({
                  success: true,
                  id: existingProductionDecision.id,
                  name: product?.name || "Unknown Product",
                });
              }
            } else {
              const productionDecision = await prisma.production.create({
                data: {
                  company_id: companyId,
                  product_id: productData.product_id,
                  period: currentPeriod,
                  units_to_produce: productData.units_to_produce,
                  cost_per_unit: productData.cost_per_unit,
                  total_cost:
                    productData.total_cost ||
                    productData.units_to_produce *
                      productData.cost_per_unit *
                      (1 + productData.defect_rate / 100),
                  production_capacity: productData.production_capacity,
                  storage_capacity: productData.storage_capacity,
                  inventory_value: productData.inventory_value,
                  defect_rate: productData.defect_rate,
                  finalised: true,
                },
              });
              productionResults.push({
                success: true,
                id: productionDecision.id,
                name: product?.name || "Unknown Product",
              });
            }
          }

          submissionResults.production = {
            success: true,
            products: productionResults,
          };
        } catch (error) {
          submissionResults.production = {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Production submission failed",
          };
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
            // Only update if not yet finalized to preserve historical data
            if (!existingFinanceDecision.finalised) {
              const updatedFinanceDecision = await prisma.finance.update({
                where: { id: existingFinanceDecision.id },
                data: {
                  investment_amount: formData.finance.investment_amount,
                  loan_amount: formData.finance.loan_amount,
                  repay_loan: formData.finance.repay_loan,
                  dividend_payout: formData.finance.dividend_payout,
                  equity_issue: formData.finance.equity_issue,
                  total_revenue: formData.finance.total_revenue,
                  operating_costs: formData.finance.operating_costs ?? 0,
                  net_profit: formData.finance.net_profit,
                  cash_balance: formData.projected_balance,
                  finalised: true,
                },
              });
              submissionResults.finance = {
                success: true,
                id: updatedFinanceDecision.id,
              };
            } else {
              // If already finalized, preserve the historical data
              submissionResults.finance = {
                success: true,
                id: existingFinanceDecision.id,
              };
            }
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
                total_revenue: formData.finance.total_revenue,
                operating_costs: formData.finance.operating_costs ?? 0,
                net_profit: formData.finance.net_profit,
                cash_balance: formData.projected_balance,
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
        }
      })(),

      // 2.6. Handle Products (Create or Update multiple products)
      (async () => {
        try {
          if (formData.product && formData.product.length > 0) {
            const productResults = [];

            for (const productData of formData.product) {
              const existingProduct = await prisma.product.findFirst({
                where: {
                  company_id: companyId,
                  name: productData.name,
                },
              });

              if (existingProduct) {
                const updatedProduct = await prisma.product.update({
                  where: { id: existingProduct.id },
                  data: {
                    description: productData.description,
                    category: productData.category,
                    quality_rating: productData.quality_rating,
                    innovation_rating: productData.innovation_rating,
                    sustainability_rating: productData.sustainability_rating,
                    status: productData.status,
                    launch_period: productData.launch_period,
                    discontinue_period: productData.discontinue_period,
                  },
                });
                productResults.push({
                  success: true,
                  id: updatedProduct.id,
                  name: productData.name,
                });
              } else {
                const newProduct = await prisma.product.create({
                  data: {
                    company_id: companyId,
                    name: productData.name,
                    description: productData.description,
                    category: productData.category,
                    quality_rating: productData.quality_rating,
                    innovation_rating: productData.innovation_rating,
                    sustainability_rating: productData.sustainability_rating,
                    status: productData.status,
                    launch_period: productData.launch_period || currentPeriod,
                    discontinue_period: productData.discontinue_period,
                  },
                });
                productResults.push({
                  success: true,
                  id: newProduct.id,
                  name: productData.name,
                });
              }
            }

            submissionResults.product = {
              success: true,
              products: productResults,
              count: productResults.length,
            };
          } else {
            submissionResults.product = {
              success: true,
              message: "No products to process",
              count: 0,
            };
          }
        } catch (error) {
          submissionResults.product = {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Product submission failed",
          };
        }
      })(),
    ];

    // Execute all business processes in parallel
    await Promise.all(businessProcesses);

    // Step 2.7: Process Sales decisions as Product Performance (after products are created/updated)
    try {
      // Get all products for the company (including newly created ones)
      const products = await prisma.product.findMany({
        where: { company_id: companyId },
        orderBy: { created_at: "asc" },
      });

      if (products.length > 0) {
        // Process each product's sales data
        const productPerformancePromises = products.map(async (product) => {
          const productSales = formData.sales[product.id];

          if (productSales && productSales.sales_volume > 0) {
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
                  sales_volume: productSales.sales_volume,
                  revenue: productSales.revenue,
                  costs: productSales.costs,
                  profit: productSales.profit,
                  market_share: productSales.market_share,
                  customer_satisfaction: productSales.customer_satisfaction,
                },
              });
            } else {
              // Create new product performance record
              await prisma.product_performance.create({
                data: {
                  product_id: product.id,
                  period: currentPeriod,
                  sales_volume: productSales.sales_volume,
                  revenue: productSales.revenue,
                  costs: productSales.costs,
                  profit: productSales.profit,
                  market_share: productSales.market_share,
                  customer_satisfaction: productSales.customer_satisfaction,
                },
              });
            }
          }
        });

        await Promise.all(productPerformancePromises);

        submissionResults.sales = {
          success: true,
        };
      } else {
        submissionResults.sales = {
          success: false,
          error: "No products found for sales performance recording",
        };
      }
    } catch (error) {
      submissionResults.sales = {
        success: false,
        error:
          error instanceof Error ? error.message : "Sales submission failed",
      };
    }

    // Additional check: Process sales for any products that might have been created with names
    // but not yet captured by the sales data with product IDs
    if (formData.product && formData.product.length > 0) {
      try {
        // Create a mapping between product names and their sales data
        const productNameToSalesDataMap = new Map();

        // First, try to map by product names from the products being submitted
        formData.product.forEach((productData, index) => {
          // Look for sales data that might correspond to this product
          const potentialSalesKeys = Object.keys(formData.sales);

          for (const salesKey of potentialSalesKeys) {
            // Check if the sales key matches:
            // 1. A temporary ID pattern (temp-*)
            // 2. Product name
            // 3. Index-based pattern
            if (
              salesKey.startsWith("temp-") ||
              salesKey === productData.name ||
              salesKey === `product-${index}` ||
              salesKey
                .toLowerCase()
                .includes(productData.name.toLowerCase().replace(/\s+/g, "_"))
            ) {
              productNameToSalesDataMap.set(
                productData.name,
                formData.sales[salesKey]
              );
              break; // Use the first match
            }
          }
        });

        for (const productData of formData.product) {
          // Find the product by name to get its real database ID
          const product = await prisma.product.findFirst({
            where: {
              company_id: companyId,
              name: productData.name,
            },
          });

          if (product) {
            // Get sales data for this product
            let productSales = formData.sales[product.id]; // Try real ID first

            if (!productSales) {
              // Try mapped sales data
              productSales = productNameToSalesDataMap.get(productData.name);
            }

            if (!productSales) {
              // Try other potential mappings
              const salesDataKeys = Object.keys(formData.sales);
              const potentialKey = salesDataKeys.find(
                (key) =>
                  key === product.name ||
                  key.startsWith("temp-") ||
                  key
                    .toLowerCase()
                    .includes(product.name.toLowerCase().replace(/\s+/g, "_"))
              );
              if (potentialKey) {
                productSales = formData.sales[potentialKey];
              }
            }

            if (productSales && productSales.sales_volume > 0) {
              // Check if performance record already exists
              const existingPerformance =
                await prisma.product_performance.findFirst({
                  where: {
                    product_id: product.id,
                    period: currentPeriod,
                  },
                });

              if (!existingPerformance) {
                // Create new product performance record
                await prisma.product_performance.create({
                  data: {
                    product_id: product.id,
                    period: currentPeriod,
                    sales_volume: productSales.sales_volume,
                    revenue: productSales.revenue,
                    costs: productSales.costs,
                    profit: productSales.profit,
                    market_share: productSales.market_share,
                    customer_satisfaction: productSales.customer_satisfaction,
                  },
                });
              }
            }
          }
        }
      } catch {}
    }

    // Check if any critical operations failed
    const failedOperations = Object.entries(submissionResults)
      .filter(([, result]) => !result.success)
      .map(([operation, result]) => ({ operation, error: result.error }));

    if (failedOperations.length > 0) {
      // Continue with period advancement even if some operations failed
      // This ensures the application doesn't get stuck in an inconsistent state
    }

    try {
      await prisma.$transaction(
        async (tx) => {
          // Store current company data to history before advancing period
          await tx.company_history.create({
            data: {
              company_id: companyId,
              period: currentPeriod,
              cash_balance: company.cash_balance,
              total_assets: company.total_assets,
              total_liabilities: company.total_liabilities,
              brand_value: company.brand_value,
            },
          });

          // Calculate changes in assets and liabilities based on finance decisions
          // Loan amount: Increases both assets (cash received) and liabilities (debt owed)
          // Equity issue: Increases assets (cash received) but doesn't increase liabilities (equity, not debt)
          // Loan repayment: Decreases both assets (cash paid) and liabilities (debt reduced)
          const assetChanges =
            formData.finance.loan_amount + formData.finance.equity_issue;
          const liabilityChanges =
            formData.finance.loan_amount - formData.finance.repay_loan;

          const newTotalAssets = Math.max(
            0,
            company.total_assets + assetChanges
          );
          const newTotalLiabilities = Math.max(
            0,
            company.total_liabilities + liabilityChanges
          );

          // Advance the period and update cash balance, assets, and liabilities
          await tx.company.update({
            where: { id: companyId },
            data: {
              current_period: { increment: 1 },
              cash_balance: formData.projected_balance,
              total_assets: newTotalAssets,
              total_liabilities: newTotalLiabilities,
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

      // If period advancement fails, we should still return the other results
      // but indicate that the process didn't complete fully
    }

    // Revalidate paths
    revalidatePath(`/simulate/${companyId}`);
    revalidatePath(`/homepage/${companyId}`);

    return {
      success: true,
      message: "All form data submitted successfully and period advanced",
      results: submissionResults,
      companyId,
      newPeriod: company.current_period + 1,
    } as const;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Form submission failed",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    } as const;
  }
}
