// app/context/index.tsx
"use client";
import React, { useEffect, useState } from "react";
import { AuthProvider } from "./AuthContext";
import { SimulationProvider, useSimulation } from "./SimulationContext";
import { FormProvider, useForm } from "./FormContext";
import { getInitialFormData } from "../_actions/formActions";

// Component to initialize form data after all providers are mounted
function FormDataInitializer() {
  const { comId, period } = useSimulation();
  const { initializeForms, state } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAndInitializeForms = async () => {
      // Only initialize once and when we have the required data
      if (!comId || !period || state.isInitialized || isLoading) {
        return;
      }

      setIsLoading(true);
      try {
        const initialData = await getInitialFormData(comId, period);

        // Transform the data to match the form context and Zod schema
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
            production_capacity:
              initialData.production?.production_capacity ?? 0,
            storage_capacity: initialData.production?.storage_capacity ?? 0,
            inventory_value: initialData.production?.inventory_value ?? 0,
            defect_rate: initialData.production?.defect_rate ?? 0,
            quality_improvement_investment: 0,
            efficiency_upgrade_cost: 0,
            maintenance_budget: 0,
            automation_level: 0,
            safety_investment: 0,
            environmental_compliance_cost: 0,
            units_to_produce: initialData.production?.units_to_produce ?? 0,
            cost_per_unit: initialData.production?.cost_per_unit ?? 0,
          },
          hr: {
            salary_budget: initialData.hr?.salary_budget ?? 0,
            training_budget: initialData.hr?.training_budget ?? 0,
            total_budget: initialData.hr?.total_budget ?? 0,
            employee_satisfaction: initialData.hr?.employee_satisfaction ?? 0,
            recruitment_cost: initialData.hr?.recruitment_cost ?? 0,
            firing_cost: initialData.hr?.firing_cost ?? 0,
            newRoles:  [],
            existingRoles: initialData?.hrRole?.roles ?? [],
          }, 

          rd: {
            budget: initialData.rd?.budget ?? 0,
            pip: initialData.rd?.pip ?? 0,
            time_to_market: initialData.rd?.time_to_market ?? 0,
            total_development: initialData.rd?.total_development ?? 0,
            patented: initialData.rd?.patented ?? 0,
            quality_changes: initialData.rd?.quality_changes ?? 0,
          },

          product:
            initialData.products?.map(
              (product: {
                id: string;
                name: string;
                description: string | null;
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
                launch_period: number | null;
                discontinue_period: number | null;
              }) => ({
                id: product.id, // Include the ID
                name: product.name ?? "",
                description: product.description ?? "",
                category: product.category ?? "",
                quality_rating: product.quality_rating ?? 0,
                innovation_rating: product.innovation_rating ?? 0,
                sustainability_rating: product.sustainability_rating ?? 0,
                production_cost: product.production_cost ?? 0,
                selling_price: product.selling_price ?? 0,
                inventory_level: product.inventory_level ?? 0,
                production_capacity: product.production_capacity ?? 2000,
                development_cost: product.development_cost ?? 0,
                marketing_budget: product.marketing_budget ?? 0,
                status: product.status ?? "development",
                launch_period: product.launch_period ?? undefined,
                discontinue_period: product.discontinue_period ?? undefined,
              })
            ) ?? [],

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        // Initialize with default values in case of error
        const defaultData = {
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
        };

        initializeForms(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndInitializeForms();
  }, [comId, period, initializeForms, state.isInitialized, isLoading]);

  // This component doesn't render anything visible
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
