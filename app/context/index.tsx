// app/context/index.tsx
"use client";
import React, { useEffect, useState } from "react";
import { AuthProvider } from "./AuthContext";
import { SimulationProvider, useSimulation } from "./SimulationContext";
import { FormProvider, useForm } from "./FormContext";
import { getInitialFormData } from "../_actions/formActions";

// Component to initialize form data every time on load
function FormDataInitializer() {
  const { comId, period } = useSimulation();
  const { initializeForms } = useForm();
  const [, setIsLoading] = useState(false);

  useEffect(() => {
    if (!comId || !period) return;

    const fetchAndInitializeForms = async () => {
      setIsLoading(true);
      try {
        const initialData = await getInitialFormData(comId, period === 1 ? period : period - 1);

        // Create production data map by product_id
        const productionByProductId = new Map();
        (initialData.production ?? []).forEach((prod) => {
          productionByProductId.set(prod.product_id, prod);
        });

        // Create sales data map by product_id
        const salesByProductId = new Map();
        (initialData.sales ?? []).forEach((sale) => {
          if (sale.product?.id) {
            salesByProductId.set(sale.product.id, {
              product_id: sale.product.id,
              product_name: sale.product.name ?? "",
              sales_volume: sale.sales_volume ?? 0,
              selling_price: sale.selling_price ?? 0,
              revenue: sale.revenue ?? 0,
              costs: sale.costs ?? 0,
              profit: sale.profit ?? 0,
              market_share: sale.market_share ?? 0,
              customer_satisfaction: sale.customer_satisfaction ?? 0,
            });
          }
        });

        // Get production data per product for the new structure
        const productionDataPerProduct = (initialData.products ?? []).map(
          (product) => {
            // Find production data for this product in the latest period
            const productionRecord = (initialData.production ?? []).find(
              (prod) => prod.product_id === product.id
            );

            const unitsToProduceVal = productionRecord?.units_to_produce ?? 0;
            const costPerUnitVal = productionRecord?.cost_per_unit ?? 0;
            const defectRateVal = productionRecord?.defect_rate ?? 0;
            const totalCostVal =
              unitsToProduceVal * costPerUnitVal * (1 + defectRateVal / 100);

            return {
              product_id: product.id!,
              units_to_produce: unitsToProduceVal,
              cost_per_unit: costPerUnitVal,
              total_cost: totalCostVal,
              production_capacity:
                productionRecord?.production_capacity ?? 2000,
              storage_capacity: productionRecord?.storage_capacity ?? 0,
              inventory_value: productionRecord?.inventory_value ?? 0,
              defect_rate: defectRateVal,
            };
          }
        );

        const formInitialData = {
          finance: {
            investment_amount: initialData.finance?.investment_amount ?? 0,
            loan_amount: initialData.finance?.loan_amount ?? 0,
            repay_loan: initialData.finance?.repay_loan ?? 0,
            dividend_payout: initialData.finance?.dividend_payout ?? 0,
            equity_issue: initialData.finance?.equity_issue ?? 0,
          },
          marketing: {
            budget: initialData.marketing?.budget ?? 0,
            offline: initialData.marketing?.offline ?? 0,
            online: initialData.marketing?.online ?? 0,
          },
          production: {
            // Use the new structure with products array
            products: productionDataPerProduct,
          },
          hr: {
            salary_budget: initialData.hr?.salary_budget ?? 0,
            training_budget: initialData.hr?.training_budget ?? 0,
            total_budget: initialData.hr?.total_budget ?? 0,
            employee_satisfaction: initialData.hr?.employee_satisfaction ?? 0,
            total_employee_count: initialData.hr?.total_employee_count ?? 0,
            newRoles: [],
            existingRoles: (initialData?.hrRole?.roles ?? []).map((role) => ({
              role_name: role.role_name,
              salary_per_head: role.salary_per_head,
              current_head_count: role.head_count,
              hires: 0,
              fires: 0,
            })),
          },
          rd: {
            budget: initialData.rd?.budget ?? 0,
            pip: initialData.rd?.pip ?? 0,
            time_to_market: initialData.rd?.time_to_market ?? 0,
            total_development: initialData.rd?.total_development ?? 0,
            patented: initialData.rd?.patented ?? 0,
            quality_changes: initialData.rd?.quality_changes ?? 0,
          },
          // Handle products array with proper ID mapping and include production data for each product
          product: (initialData.products ?? []).map((product) => {
            const productionData = productionByProductId.get(product.id);
            return {
              id: product.id,
              name: product.name ?? "",
              description: product.description ?? "",
              category: product.category ?? "",
              quality_rating: product.quality_rating ?? 0,
              innovation_rating: product.innovation_rating ?? 0,
              sustainability_rating: product.sustainability_rating ?? 0,
              status: product.status ?? "development",
              launch_period: product.launch_period ?? undefined,
              discontinue_period: product.discontinue_period ?? undefined,
              // Include production data for this specific product
              production_cost: productionData?.cost_per_unit ?? 0,
              inventory_level: productionData?.inventory_value ?? 0,
              production_capacity: productionData?.production_capacity ?? 2000,
            };
          }),
          // Convert sales array to ProductSalesData object keyed by product_id
          sales: Object.fromEntries(salesByProductId),
          company: {
            name: initialData.company?.name ?? "",
            description: initialData.company?.description ?? "",
            logo_url: initialData.company?.logo_url ?? "",
            cash_balance: initialData.company?.cash_balance ?? 100000,
            total_assets: initialData.company?.total_assets ?? 0,
            total_liabilities: initialData.company?.total_liabilities ?? 0,
            marketing_budget: initialData.company?.marketing_budget ?? 0,
            credit_rating: initialData.company?.credit_rating ?? "",
            brand_value: initialData.company?.brand_value ?? 0,
          },
          simulation: {
            name: initialData.simulation?.name ?? "",
            description: initialData.simulation?.description ?? "",
            config: initialData.simulation?.config ?? "{}",
            current_period: initialData.simulation?.current_period ?? 0,
            status: initialData.simulation?.status ?? "active",
          },
          cashBalance: {
            originalCashBalance: initialData.company?.cash_balance ?? 100000,
            hrBudgetImpact: 0,
            financeBudgetImpact: 0,
            marketingBudgetImpact: 0,
            productionBudgetImpact: 0,
            rdBudgetImpact: 0,
            salesBudgetImpact: 0,
            productBudgetImpact: 0,
          },
        };

        initializeForms(formInitialData);
      } catch {
        // Provide proper fallback structure with proper mapping and types
        initializeForms({
          finance: {
            investment_amount: 0,
            loan_amount: 0,
            repay_loan: 0,
            dividend_payout: 0,
            equity_issue: 0,
          },
          marketing: {
            budget: 0,
            offline: 0,
            online: 0,
          },
          production: {
            products: [], // Empty products array for fallback
          },
          hr: {
            salary_budget: 0,
            training_budget: 0,
            total_budget: 0,
            employee_satisfaction: 0,
            total_employee_count: 0,
            newRoles: [],
            existingRoles: [],
          },
          rd: {
            budget: 0,
            pip: 0,
            time_to_market: 0,
            total_development: 0,
            patented: 0,
            quality_changes: 0,
          },
          product: [],
          sales: {},
          company: {
            name: "",
            description: "",
            logo_url: "",
            cash_balance: 100000,
            total_assets: 0,
            total_liabilities: 0,
            marketing_budget: 0,
            credit_rating: "",
            brand_value: 0,
          },
          simulation: {
            name: "",
            description: "",
            config: "{}",
            current_period: 0,
            status: "active",
          },
          cashBalance: {
            originalCashBalance: 100000,
            hrBudgetImpact: 0,
            financeBudgetImpact: 0,
            marketingBudgetImpact: 0,
            productionBudgetImpact: 0,
            rdBudgetImpact: 0,
            salesBudgetImpact: 0,
            productBudgetImpact: 0,
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndInitializeForms();
  }, [comId, period, initializeForms]);

  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SimulationProvider>
        <FormProvider>
          <FormDataInitializer />
          {children}
        </FormProvider>
      </SimulationProvider>
    </AuthProvider>
  );
}
