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
        const initialData = await getInitialFormData(comId, period - 1);

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
          product:
            initialData.products?.map((product) => ({
              id: product.id,
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
            })) ?? [],
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
      } catch (error) {
        console.error("Error initializing forms:", error);
        initializeForms({
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
