"use client";
import React, { useState } from "react";
import { useBreakpoint } from "@/app/lib/utils/useBreakPoint";
import {
  DollarSign,
  Users,
  TrendingUp,
  Beaker,
  Factory,
  Package,
  Eye,
  ShoppingCart,
} from "lucide-react";
import FinanceForm from "./FinanceForm";
import MarketingForm from "./MarketingForm";
import RDForm from "./RDForm";
import ProductionForm from "./ProductionForm";
import ProductsForm from "./ProductsForm";
import LogoutBtn from "@/app/(auth)/_components/Logout";
import HRDashboard from "./HR";
import PreviewDashboard from "./PreviewDashboard";
import {
  useForm,
  useCashBalance,
  useSalesForm,
  useCompanyForm,
} from "@/app/context/FormContext";
import { comprehensiveFormSubmission } from "@/app/_actions/comprehensiveFormSubmission";
import { redirect } from "next/navigation";
import Sales from "./SalesForm";
import { useSimulation } from "@/app/context/SimulationContext";

const steps = [
  {
    label: "Human Resources",
    icon: Users,
    description: "Handle HR decisions and workforce management",
  },
  {
    label: "Marketing",
    icon: TrendingUp,
    description: "Plan marketing strategies and campaigns",
  },
  {
    label: "Research & Development",
    icon: Beaker,
    description: "Invest in innovation and product development",
  },
  {
    label: "Production",
    icon: Factory,
    description: "Optimize production processes and capacity",
  },
  {
    label: "Products",
    icon: Package,
    description: "Manage product portfolio and pricing",
  },
  {
    label: "sales",
    icon: ShoppingCart,
    description: "Manage Sales and customer relationships",
  },
  {
    label: "Finance Info",
    icon: DollarSign,
    description: "Manage financial decisions and budgets",
  },
  {
    label: "Preview & Submit",
    icon: Eye,
    description: "Review all decisions and start simulation",
  },
];

interface FormProps {
  companyId: string;
}

const Form: React.FC<FormProps> = ({ companyId }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const { state } = useForm();
  const { projectedCashBalance, budgetImpacts } = useCashBalance();
  const { getTotalSalesMetrics } = useSalesForm();
  const salesmetrices = getTotalSalesMetrics();
  const { data: companyData } = useCompanyForm();
  const { period } = useSimulation();

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Handle save and submit logic here (only on the final Preview & Submit step)
      handleSaveAndSubmit();
    } else {
      // Move to next step for all other cases
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleStepClick = (step: number) => setActiveStep(step);

  const handleSaveAndSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Prepare comprehensive form data
      const formData = {
        hr: {
          existingRoles: state.hr.existingRoles,
          newRoles: state.hr.newRoles,
          salary_budget: state.hr.salary_budget,
          training_budget: state.hr.training_budget,
          total_budget: state.hr.total_budget,
          employee_satisfaction: state.hr.employee_satisfaction,
          total_employee_count:
            state.hr.existingRoles.reduce(
              (total, role) =>
                total + (role.current_head_count + role.hires - role.fires),
              0
            ) +
            state.hr.newRoles.reduce((total, role) => total + role.hires, 0),
        },
        marketing: {
          budget: state.marketing.budget,
          offline: state.marketing.offline,
          online: state.marketing.online,
        },
        rd: {
          budget: state.rd.budget,
          pip: state.rd.pip,
          time_to_market: state.rd.time_to_market,
          total_development: state.rd.total_development,
          patented: state.rd.patented,
          quality_changes: state.rd.quality_changes,
        },
        production: {
          production_capacity: state.production.production_capacity,
          inventory_value: state.production.inventory_value,
          storage_capacity: state.production.storage_capacity,
          defect_rate: state.production.defect_rate,
          quality_improvement_investment:
            state.production.quality_improvement_investment,
          efficiency_upgrade_cost: state.production.efficiency_upgrade_cost,
          maintenance_budget: state.production.maintenance_budget,
          automation_level: state.production.automation_level,
          safety_investment: state.production.safety_investment,
          environmental_compliance_cost:
            state.production.environmental_compliance_cost,
          units_to_produce: state.production.units_to_produce,
          cost_per_unit: state.production.cost_per_unit,
        },
        finance: {
          investment_amount: state.finance.investment_amount,
          loan_amount: state.finance.loan_amount,
          repay_loan: state.finance.repay_loan,
          dividend_payout: state.finance.dividend_payout,
          equity_issue: state.finance.equity_issue,
          total_revenue: salesmetrices.totalRevenue,
          net_profit: salesmetrices.totalProfit,
          operating_costs: salesmetrices.totalCosts,
        },
        sales: state.sales, // Pass the full per-product sales data object
        product: state.product
          .filter((product) => product && product.name)
          .map((product) => ({
            name: product.name,
            description: product.description,
            category: product.category,
            quality_rating: product.quality_rating,
            innovation_rating: product.innovation_rating,
            sustainability_rating: product.sustainability_rating,
            production_cost: product.production_cost,
            selling_price: product.selling_price,
            inventory_level: product.inventory_level,
            production_capacity: product.production_capacity,
            development_cost: product.development_cost,
            marketing_budget: product.marketing_budget,
            status: product.status,
            launch_period: product.launch_period,
            discontinue_period: product.discontinue_period,
          })),
        projected_balance: projectedCashBalance,
        budget_impacts: budgetImpacts,
      };

      const result = await comprehensiveFormSubmission(companyId, formData);
      setIsSubmitting(false);

      if (result.success) {
        const productCount = formData.product.length;
        const productText = productCount === 1 ? "product" : "products";

        const successDiv = document.createElement("div");
        successDiv.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(76, 175, 80, 0.9);
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          z-index: 10000;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        successDiv.innerHTML = `
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 20px; height: 20px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #4caf50; font-weight: bold;">✓</div>
            <div>
              <div>Simulation submitted successfully!</div>
              <div style="font-size: 12px; margin-top: 4px; opacity: 0.9;">
                ${productCount} ${productText} submitted • Advanced to period ${result.newPeriod}
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(successDiv);

        setTimeout(() => {
          if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
          }
        }, 3000);

        // Redirect to dashboard
        setTimeout(() => {
          redirect("/homepage/" + companyId);
        }, 1500);
      } else {
        console.error("Submission failed:", result);

        // Show detailed error message
        let errorMessage = "Error submitting simulation";

        if (result.message) {
          errorMessage = `Error: ${result.message}`;

          // Provide specific guidance for common errors
          if (
            result.message.includes("Transaction API error") ||
            result.message.includes("Unable to start a transaction")
          ) {
            errorMessage +=
              "\\n\\nThis appears to be a database timeout issue. Please try again in a moment. If the problem persists, some of your data may have been saved successfully.";
          } else if (result.message.includes("Insufficient funds")) {
            errorMessage +=
              "\\n\\nPlease review your budget allocations and ensure they don't exceed your available cash balance.";
          } else if (result.message.includes("Company not found")) {
            errorMessage += "\\n\\nPlease refresh the page and try again.";
          }
        }

        // Show error alert
        const errorDiv = document.createElement("div");
        errorDiv.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(244, 67, 54, 0.9);
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          z-index: 10000;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          max-width: 400px;
          cursor: pointer;
        `;
        errorDiv.innerHTML = `
          <div style="display: flex; align-items: flex-start; gap: 12px;">
            <div style="width: 20px; height: 20px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #f44336; font-weight: bold; flex-shrink: 0;">!</div>
            <div>
              <div style="font-weight: bold; margin-bottom: 8px;">Submission Failed</div>
              <div style="font-size: 14px; line-height: 1.4; white-space: pre-line;">${errorMessage}</div>
              <div style="font-size: 12px; margin-top: 8px; opacity: 0.8;">Click to dismiss</div>
            </div>
          </div>
        `;

        errorDiv.onclick = () => {
          if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
          }
        };

        document.body.appendChild(errorDiv);

        // Auto-remove after 10 seconds
        setTimeout(() => {
          if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
          }
        }, 10000);
      }
    } catch (error) {
      console.error("Unexpected error in form submission:", error);
      setIsSubmitting(false);

      // Show generic error message
      const errorDiv = document.createElement("div");
      errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(244, 67, 54, 0.9);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        max-width: 400px;
        cursor: pointer;
      `;
      errorDiv.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 12px;">
          <div style="width: 20px; height: 20px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #f44336; font-weight: bold;">!</div>
          <div>
            <div style="font-weight: bold; margin-bottom: 8px;">Unexpected Error</div>
            <div style="font-size: 14px; line-height: 1.4;">An unexpected error occurred while submitting the simulation. Please try again.</div>
            <div style="font-size: 12px; margin-top: 8px; opacity: 0.8;">Click to dismiss</div>
          </div>
        </div>
      `;

      errorDiv.onclick = () => {
        if (errorDiv.parentNode) {
          errorDiv.parentNode.removeChild(errorDiv);
        }
      };

      document.body.appendChild(errorDiv);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <HRDashboard />;
      case 1:
        return <MarketingForm />;
      case 2:
        return <RDForm />;
      case 3:
        return <ProductionForm />;
      case 4:
        return <ProductsForm companyId={companyId} />;
      case 5:
        return <Sales />;
      case 6:
        return <FinanceForm />;
      case 7:
        return (
          <PreviewDashboard
            companyId={companyId}
            onEditSection={(sectionIndex) => setActiveStep(sectionIndex)}
          />
        );
      default:
        return <div>Unknown Step</div>;
    }
  };

  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <div className="w-full h-screen flex flex-col md:flex-row overflow-hidden relative">
      {/* Submission Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 w-screen h-screen bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center cursor-not-allowed">
          <div className="p-6 bg-[#121418f2] rounded-xl border border-[#2196f34d] backdrop-blur-2xl text-center max-w-[400px] m-2">
            <div className="w-15 h-15 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mb-6" />

            <h2 className="text-lg font-semibold mb-4 bg-gradient-to-br from-white to-blue-400 bg-clip-text text-transparent">
              Submitting Simulation
            </h2>
            <p className="text-sm text-gray-400 mb-2 leading-relaxed">
              Processing your business decisions and advancing to the next
              period...
            </p>

            <p className="text-xs text-gray-500 italic">
              Please do not close this window or navigate away
            </p>
          </div>
        </div>
      )}

      {/* Sidebar with Steps */}
      <div className="w-full md:w-[240px] lg:w-[280px] h-auto md:h-screen bg-[#080a0f]/95 backdrop-blur-2xl border-r border-white/10 overflow-hidden flex flex-col relative">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-blue-500/5 to-black/10" />
        {/* Header */}
        <div className="p-4 border-b border-white/10 relative z-10">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-blue-300">
                Progress
              </span>
              <span className="text-xs font-semibold text-blue-300">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 via-cyan-400 to-green-400"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Step {activeStep + 1} of {steps.length} • {steps[activeStep].label}
          </p>
        </div>

        <div className="flex-1 overflow-auto relative z-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;

            const containerClasses = [
              "px-4 py-3 border-b border-white/5 transition-all",
              isSubmitting ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
              isActive
                ? "bg-blue-500/10 border-l-4 border-blue-500 translate-x-1"
                : isCompleted
                  ? "bg-green-500/5 border-l-4 border-green-500 hover:translate-x-1"
                  : "border-l-4 border-transparent hover:bg-white/5 hover:translate-x-1",
            ].join(" ");

            return (
              <div
                key={step.label}
                className={containerClasses}
                onClick={() => !isSubmitting && handleStepClick(index)}
              >
                {/* Step Content */}
                <div className="flex items-start gap-3 mb-1">
                  {/* Icon Badge */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${isCompleted
                      ? "bg-green-500 shadow-md"
                      : isActive
                        ? "bg-blue-500 shadow-md"
                        : "bg-white/10"
                      }`}
                  >
                    <Icon
                      size={16}
                      color={isActive || isCompleted ? "#fff" : "#666"}
                    />
                  </div>

                  {/* Labels */}
                  <div className="flex-1">
                    <h4
                      className={`text-sm font-medium mb-0.5 ${isActive
                        ? "text-white"
                        : isCompleted
                          ? "text-green-300"
                          : "text-gray-300"
                        }`}
                    >
                      {step.label}
                    </h4>

                    {/* Description (only show on desktop) */}
                    {!isMobile && (
                      <p
                        className={`text-xs leading-snug ${isActive
                          ? "text-blue-200"
                          : isCompleted
                            ? "text-green-200"
                            : "text-gray-500"
                          }`}
                      >
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center ml-12">
                  <div
                    className={`w-[5px] h-[5px] rounded-full mr-2 ${isCompleted
                      ? "bg-green-500"
                      : isActive
                        ? "bg-blue-500"
                        : "bg-white/20"
                      }`}
                  />
                  <span
                    className={`text-[0.65rem] ${isCompleted
                      ? "text-green-500"
                      : isActive
                        ? "text-blue-300"
                        : "text-gray-500"
                      }`}
                  >
                    {isCompleted
                      ? "Completed"
                      : isActive
                        ? "In Progress"
                        : "Pending"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/20 relative z-10">
          <p className="text-xs text-gray-500 text-center">
            Click on any step to navigate directly
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Content Wrapper */}
        <div className="flex-1 bg-[#121418f2] backdrop-blur-2xl flex flex-col overflow-hidden relative">
          {/* Background gradient overlay (from ::before) */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-blue-500/5 to-black/5" />

          {/* Content Header */}
          <div className="px-6 py-2 border-b border-white/10 bg-[#080a0f]/80 relative z-10 flex items-center gap-4">
            <div className="flex items-center">
              {React.createElement(steps[activeStep].icon, {
                size: 24,
                className: "text-blue-300 mr-3",
              })}
              <div className="py-1">
                <h2 className="text-base font-bold mb-[2px] bg-gradient-to-br from-white to-blue-400 bg-clip-text text-transparent">
                  {steps[activeStep].label}
                </h2>
                <p className="text-sm text-gray-400 leading-snug">
                  {steps[activeStep].description}
                </p>
              </div>
            </div>
            <div className="flex-grow" />
            <div className="flex flex-col justify-end text-white mr-2">
              <h2 className="text-xl font-bold">{companyData.name}</h2>
              <span className="text-s flex justify-end text-gray-300">Period {period}</span>
            </div>
            <a
              href={`/homepage/${companyId}`}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-m font-semibold px-3 py-2 rounded-md no-underline"
            >
              Dashboard
            </a>
            <div className="flex items-center gap-1">
              <LogoutBtn />
            </div>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-auto relative z-10">
            {/* You can replace this with animation library like Framer Motion */}
            <div className="min-h-[400px] h-full">
              {renderStepContent(activeStep)}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="px-6 py-2 border-t border-white/10 bg-[#080a0f]/80 flex justify-between items-center gap-4 relative z-10">
            {/* Previous Button */}
            <button
              onClick={handleBack}
              disabled={activeStep === 0 || isSubmitting}
              className={`min-w-[100px] h-10 rounded-xl font-semibold text-sm border-2 transition-all ${activeStep === 0 || isSubmitting
                ? "border-white/10 text-gray-500 cursor-not-allowed"
                : "border-white/20 text-gray-300 hover:border-white/40 hover:bg-white/5 hover:-translate-y-[1px]"
                }`}
            >
              Previous
            </button>

            {/* Step Info */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Step</span>
              <span className="px-2 py-0.5 text-blue-300 bg-blue-500/20 text-sm font-bold rounded-md">
                {activeStep + 1} / {steps.length}
              </span>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={activeStep > steps.length - 1 || isSubmitting}
              className={`min-w-[100px] h-10 rounded-xl text-white font-bold text-sm transition-all ${isSubmitting
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 via-cyan-400 to-green-400 shadow-md hover:from-blue-700 hover:to-cyan-500 hover:-translate-y-[1px]"
                }`}
            >
              {isSubmitting
                ? "Submitting..."
                : activeStep === steps.length - 1
                  ? "save & submit"
                  : "Next Step"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
