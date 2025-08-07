"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  CheckCircle,
  Users,
  TrendingUp,
  Beaker,
  Factory,
  Package,
  DollarSign,
  BarChart3,
  ShoppingCart,
  LoaderCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  useFinanceForm,
  useMarketingForm,
  useProductionForm,
  useHRForm,
  useRDForm,
  useProductForm,
  useCompanyForm,
  useSalesForm,
  useCashBalance,
} from "@/app/context/FormContext";
import { useSimulation } from "@/app/context/SimulationContext";
import formatCurrency from "@/app/functions/formatCurrency";
import { AlertDescription, Alert } from "@/components/ui/alert";
interface PreviewDashboardProps {
  companyId: string;
  onEditSection?: (section: number) => void;
}

interface SectionSummary {
  title: string;
  icon: React.ElementType;
  status: "completed" | "pending" | "in-progress";
  summary: string[];
  keyMetrics?: { label: string; value: string }[];
}

const PreviewDashboard: React.FC<PreviewDashboardProps> = ({
  onEditSection,
}) => {
  const [loading, setLoading] = useState(true);
  const { projectedCashBalance } = useCashBalance();
  const [sections, setSections] = useState<SectionSummary[]>([]);

  // Get form data from context
  const { period } = useSimulation();
  const { data: hrData } = useHRForm();
  const { data: marketingData } = useMarketingForm();
  const { data: rdData } = useRDForm();
  const { data: productionData } = useProductionForm();
  const { data: productData } = useProductForm();
  const { data: financeData } = useFinanceForm();
  const { getTotalSalesMetrics } = useSalesForm();
  const { data: companyData } = useCompanyForm();

  // Get aggregated sales metrics
  const totalSalesMetrics = getTotalSalesMetrics();

  // Helper function to calculate total employees
  const calculateTotalEmployees = useCallback(() => {
    const existingEmployees =
      hrData.existingRoles?.reduce((total, role) => {
        return (
          total + Math.max(0, role.current_head_count + role.hires - role.fires)
        );
      }, 0) || 0;

    const newEmployees =
      hrData.newRoles?.reduce((total, role) => {
        return total + role.hires;
      }, 0) || 0;

    return existingEmployees + newEmployees;
  }, [hrData.existingRoles, hrData.newRoles]);

  // Helper function to calculate profit margin
  const calculateProfitMargin = useCallback(() => {
    const firstProduct = productData.length > 0 ? productData[0] : null;
    if (!firstProduct) return 0;
    const sellingPrice = firstProduct.selling_price || 0;
    const productionCost = firstProduct.production_cost || 0;
    if (sellingPrice === 0) return 0;
    return ((sellingPrice - productionCost) / sellingPrice) * 100;
  }, [productData]);

  // Helper function to determine section status
  const getSectionStatus = useCallback(
    (sectionName: string): "completed" | "pending" | "in-progress" => {
      switch (sectionName) {
        case "hr":
          return hrData.total_budget > 0 ||
            hrData.existingRoles?.length > 0 ||
            hrData.newRoles?.length > 0
            ? "completed"
            : "pending";
        case "marketing":
          return marketingData.budget > 0 ||
            marketingData.offline > 0 ||
            marketingData.online > 0
            ? "completed"
            : "pending";
        case "rd":
          return rdData.budget > 0 ||
            rdData.pip > 0 ||
            rdData.total_development > 0
            ? "completed"
            : "pending";
        case "production":
          return productionData.production_capacity > 0 ||
            productionData.units_to_produce > 0
            ? "completed"
            : "pending";
        case "product":
          return productData.length > 0 && productData[0]?.name?.trim()
            ? "completed"
            : "pending";
        case "finance":
          return financeData.investment_amount > 0 ||
            financeData.loan_amount > 0 ||
            financeData.equity_issue > 0
            ? "completed"
            : "pending";
        case "sales":
          return totalSalesMetrics.totalVolume > 0 ||
            totalSalesMetrics.totalRevenue > 0 ||
            totalSalesMetrics.averageMarketShare > 0
            ? "completed"
            : "pending";
        default:
          return "pending";
      }
    },
    [
      hrData,
      marketingData,
      rdData,
      productionData,
      productData,
      financeData,
      totalSalesMetrics,
    ]
  );

  useEffect(() => {
    // Simulate loading time and prepare data from form context
    const timer = setTimeout(() => {
      const sectionsData: SectionSummary[] = [
        {
          title: "Human Resources",
          icon: Users,
          status: getSectionStatus("hr"),
          summary: [
            `Total HR Budget: ${formatCurrency(hrData.total_budget || 0)}`,
            `Salary Budget: ${formatCurrency(hrData.salary_budget || 0)}`,
            `Training Budget: ${formatCurrency(hrData.training_budget || 0)}`,
            `Recruitment Cost: ${formatCurrency(hrData.recruitment_cost || 0)}`,
            `Firing Cost: ${formatCurrency(hrData.firing_cost || 0)}`,
            `Existing Roles: ${hrData.existingRoles?.length || 0}`,
            `New Roles: ${hrData.newRoles?.length || 0}`,
            `Total Employees: ${calculateTotalEmployees()}`,
            `Employee Satisfaction: ${hrData.employee_satisfaction || 0}%`,
          ],
          keyMetrics: [
            {
              label: "Total Budget",
              value: formatCurrency(hrData.total_budget || 0),
            },
            {
              label: "Training Investment",
              value: formatCurrency(hrData.training_budget || 0),
            },
            {
              label: "Employee Satisfaction",
              value: `${hrData.employee_satisfaction || 0}%`,
            },
            {
              label: "Total Workforce",
              value: `${calculateTotalEmployees()} employees`,
            },
          ],
        },
        {
          title: "Marketing",
          icon: TrendingUp,
          status: getSectionStatus("marketing"),
          summary: [
            `Total Marketing Budget: ${formatCurrency(
              marketingData.budget || 0
            )}`,
            `Offline Marketing: ${formatCurrency(marketingData.offline || 0)}`,
            `Online Marketing: ${formatCurrency(marketingData.online || 0)}`,
            `Budget Allocation: Offline ${
              marketingData.budget > 0
                ? (
                    (marketingData.offline / marketingData.budget) *
                    100
                  ).toFixed(1)
                : 0
            }% / Online ${
              marketingData.budget > 0
                ? ((marketingData.online / marketingData.budget) * 100).toFixed(
                    1
                  )
                : 0
            }%`,
            `Total Marketing Budget vs Company Budget: ${(
              (marketingData.budget /
                Math.max(companyData.marketing_budget || 1, 1)) *
              100
            ).toFixed(1)}%`,
          ],
          keyMetrics: [
            {
              label: "Total Budget",
              value: formatCurrency(marketingData.budget || 0),
            },
            {
              label: "Offline/Online Split",
              value:
                marketingData.budget > 0
                  ? `${(
                      (marketingData.offline / marketingData.budget) *
                      100
                    ).toFixed(0)}/${(
                      (marketingData.online / marketingData.budget) *
                      100
                    ).toFixed(0)}`
                  : "0/0",
            },
            {
              label: "Budget Utilization",
              value: `${
                companyData.marketing_budget > 0
                  ? (
                      (marketingData.budget / companyData.marketing_budget) *
                      100
                    ).toFixed(1)
                  : 0
              }%`,
            },
          ],
        },
        {
          title: "Research & Development",
          icon: Beaker,
          status: getSectionStatus("rd"),
          summary: [
            `R&D Budget: ${formatCurrency(rdData.budget || 0)}`,
            `Product Improvement: ${formatCurrency(rdData.pip || 0)}`,
            `Time to Market: ${rdData.time_to_market || 0} months`,
            `Total Development: ${rdData.total_development || 0}`,
            `Patents Filed: ${rdData.patented || 0}`,
            `Quality Changes: ${rdData.quality_changes || 0}%`,
          ],
          keyMetrics: [
            {
              label: "R&D Investment",
              value: formatCurrency(rdData.budget || 0),
            },
            {
              label: "Innovation Index",
              value: `${
                (rdData.patented || 0) + (rdData.quality_changes || 0)
              }`,
            },
            {
              label: "Development ROI",
              value:
                rdData.budget > 0
                  ? `${((rdData.pip / rdData.budget) * 100).toFixed(1)}%`
                  : "0%",
            },
          ],
        },
        {
          title: "Production",
          icon: Factory,
          status: getSectionStatus("production"),
          summary: [
            `Production Capacity: ${
              productionData.production_capacity || 0
            } units`,
            `Units to Produce: ${productionData.units_to_produce || 0}`,
            `Cost per Unit: ${formatCurrency(
              productionData.cost_per_unit || 0
            )}`,
            `Inventory Value: ${formatCurrency(
              productionData.inventory_value || 0
            )}`,
            `Storage Capacity: ${productionData.storage_capacity || 0} units`,
            `Quality Investment: ${formatCurrency(
              productionData.quality_improvement_investment || 0
            )}`,
            `Automation Level: ${productionData.automation_level || 0}%`,
            `Defect Rate: ${productionData.defect_rate || 0}%`,
            `Maintenance Budget: ${formatCurrency(
              productionData.maintenance_budget || 0
            )}`,
            `Safety Investment: ${formatCurrency(
              productionData.safety_investment || 0
            )}`,
          ],
          keyMetrics: [
            {
              label: "Production Efficiency",
              value: `${
                productionData.production_capacity > 0
                  ? (
                      (productionData.units_to_produce /
                        productionData.production_capacity) *
                      100
                    ).toFixed(1)
                  : 0
              }%`,
            },
            {
              label: "Automation Level",
              value: `${productionData.automation_level || 0}%`,
            },
            {
              label: "Total Investment",
              value: formatCurrency(
                (productionData.quality_improvement_investment || 0) +
                  (productionData.efficiency_upgrade_cost || 0) +
                  (productionData.maintenance_budget || 0) +
                  (productionData.safety_investment || 0) +
                  (productionData.environmental_compliance_cost || 0)
              ),
            },
          ],
        },
        {
          title: "Products",
          icon: Package,
          status: getSectionStatus("product"),
          summary: [
            `Products Count: ${productData.length}`,
            ...(productData.length > 0
              ? [
                  `Product: ${productData[0].name || "Not specified"}`,
                  `Category: ${productData[0].category || "Not specified"}`,
                  `Description: ${productData[0].description || "None"}`,
                  `Selling Price: ${formatCurrency(
                    productData[0].selling_price || 0
                  )}`,
                  `Production Cost: ${formatCurrency(
                    productData[0].production_cost || 0
                  )}`,
                  `Profit Margin: ${calculateProfitMargin().toFixed(1)}%`,
                  `Development Cost: ${formatCurrency(
                    productData[0].development_cost || 0
                  )}`,
                  `Marketing Budget: ${formatCurrency(
                    productData[0].marketing_budget || 0
                  )}`,
                  `Quality Rating: ${productData[0].quality_rating || 0}/10`,
                  `Innovation Rating: ${
                    productData[0].innovation_rating || 0
                  }/10`,
                  `Sustainability Rating: ${
                    productData[0].sustainability_rating || 0
                  }/10`,
                  `Inventory Level: ${
                    productData[0].inventory_level || 0
                  } units`,
                  `Status: ${productData[0].status || "development"}`,
                ]
              : ["No products configured"]),
          ],
          keyMetrics: [
            {
              label: "Products Count",
              value: `${productData.length}`,
            },
            ...(productData.length > 0
              ? [
                  {
                    label: "Selling Price",
                    value: formatCurrency(productData[0].selling_price || 0),
                  },
                  {
                    label: "Production Cost",
                    value: formatCurrency(productData[0].production_cost || 0),
                  },
                  {
                    label: "Quality Rating",
                    value: `${productData[0].quality_rating || 0}/10`,
                  },
                  {
                    label: "Profit Margin",
                    value: `${calculateProfitMargin().toFixed(1)}%`,
                  },
                ]
              : []),
          ],
        },
        {
          title: "Finance",
          icon: DollarSign,
          status: getSectionStatus("finance"),
          summary: [
            `Investment Amount: ${formatCurrency(
              financeData.investment_amount || 0
            )}`,
            `Loan Amount: ${formatCurrency(financeData.loan_amount || 0)}`,
            `Loan Repayment: ${formatCurrency(financeData.repay_loan || 0)}`,
            `Dividend Payout: ${formatCurrency(
              financeData.dividend_payout || 0
            )}`,
            `Equity Issue: ${formatCurrency(financeData.equity_issue || 0)}`,
            `Current Cash: ${formatCurrency(companyData.cash_balance || 0)}`,
            `Total Assets: ${formatCurrency(companyData.total_assets || 0)}`,
            `Total Liabilities: ${formatCurrency(
              companyData.total_liabilities || 0
            )}`,
            `Credit Rating: ${companyData.credit_rating || "Not rated"}`,
            `Brand Value: ${formatCurrency(companyData.brand_value || 0)}`,
          ],
          keyMetrics: [
            {
              label: "Investment",
              value: formatCurrency(financeData.investment_amount || 0),
            },
            {
              label: "Current Cash",
              value: formatCurrency(companyData.cash_balance || 0),
            },
            {
              label: "Net Worth",
              value: formatCurrency(
                (companyData.total_assets || 0) -
                  (companyData.total_liabilities || 0)
              ),
            },
          ],
        },
        {
          title: "Sales",
          icon: ShoppingCart,
          status: getSectionStatus("sales"),
          summary: [
            `Total Sales Volume: ${totalSalesMetrics.totalVolume} units`,
            `Total Revenue: ${formatCurrency(totalSalesMetrics.totalRevenue)}`,
            `Total Costs: ${formatCurrency(totalSalesMetrics.totalCosts)}`,
            `Expected Profit: ${formatCurrency(totalSalesMetrics.totalProfit)}`,
            `Average Market Share: ${totalSalesMetrics.averageMarketShare.toFixed(
              1
            )}%`,
            `Average Customer Satisfaction: ${totalSalesMetrics.averageCustomerSatisfaction.toFixed(
              1
            )}/10`,
            `Profit Margin: ${
              totalSalesMetrics.totalRevenue > 0
                ? (
                    (totalSalesMetrics.totalProfit /
                      totalSalesMetrics.totalRevenue) *
                    100
                  ).toFixed(1)
                : 0
            }%`,
            `Products Selling: ${totalSalesMetrics.productCount}`,
          ],
          keyMetrics: [
            {
              label: "Total Sales Volume",
              value: `${totalSalesMetrics.totalVolume} units`,
            },
            {
              label: "Total Revenue",
              value: formatCurrency(totalSalesMetrics.totalRevenue),
            },
            {
              label: "Expected Profit",
              value: formatCurrency(totalSalesMetrics.totalProfit),
            },
            {
              label: "Average Market Share",
              value: `${totalSalesMetrics.averageMarketShare.toFixed(1)}%`,
            },
          ],
        },
      ];

      setSections(sectionsData);
      setLoading(false);
    }, 1000); // Reduced loading time

    return () => clearTimeout(timer);
  }, [
    hrData,
    marketingData,
    rdData,
    productionData,
    productData,
    financeData,
    totalSalesMetrics,
    companyData,
    getSectionStatus,
    calculateTotalEmployees,
    calculateProfitMargin,
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#4caf50";
      case "in-progress":
        return "#ff9800";
      case "pending":
        return "#666";
      default:
        return "#666";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "in-progress":
        return (
          <LoaderCircle className="w-4 h-4 text-yellow-500 animate-spin" />
        );
      case "pending":
        return <LoaderCircle className="w-4 h-4 text-muted animate-spin" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[rgba(18,20,24,0.95)] text-white">
        <div className="text-center">
          <LoaderCircle className="w-15 h-15 text-blue-400 animate-spin mb-3 mx-auto" />
          <h2 className="text-lg font-semibold text-white mb-1">
            Preparing Your Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            Compiling all your strategic decisions...
          </p>
        </div>
      </div>
    );
  }
  const allCompleted = sections.every((s) => s.status === "completed");
  const completedCount = sections.filter(
    (s) => s.status === "completed"
  ).length;
  return (
    <div className="h-full bg-[rgba(18,20,24,0.95)] text-white overflow-auto p-3">
      {/* Header */}
      <div className="mb-4">
        <div className="relative bg-[rgba(8,10,15,0.8)] border border-white/10 rounded-xl p-6 overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(100,181,246,0.05)_0%,rgba(33,150,243,0.02)_100%)] pointer-events-none z-0" />

          {/* Content Layer */}
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              {/* Icon container */}
              <div className="w-14 h-14 flex items-center justify-center bg-[rgba(100,181,246,0.1)] border border-[#64b5f633] rounded-lg mr-4">
                <BarChart3 size={28} color="#64b5f6" />
              </div>

              {/* Text */}
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold mb-1 bg-gradient-to-r from-white to-[#64b5f6] bg-clip-text text-transparent">
                  Strategic Overview
                </h1>
                <p className="text-[#64b5f6] font-medium text-base md:text-lg mb-1">
                  {companyData.name || "Your Company"}
                </p>
                <p className="text-sm text-[#aaa] leading-relaxed">
                  Comprehensive review of strategic decisions across all
                  business units
                </p>
              </div>
            </div>

            {/* Alert Box */}
            <Alert
              className={`border ${
                allCompleted
                  ? "border-green-300 bg-green-100/10 text-green-300"
                  : "border-yellow-300 bg-yellow-100/10 text-yellow-300"
              } rounded-md`}
            >
              <AlertDescription className="font-medium">
                {allCompleted
                  ? "All business units configured successfully! Your strategy is ready for implementation."
                  : `Configuration Progress: ${completedCount} of ${sections.length} sections completed. Review pending areas below.`}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="mb-4">
        <div className="relative overflow-hidden bg-[rgba(8,10,15,0.8)] border border-[rgba(255,255,255,0.1)] rounded-xl p-4 before:absolute before:inset-0 before:content-[''] before:bg-[linear-gradient(135deg,rgba(76,175,80,0.05)_0%,rgba(33,150,243,0.02)_100%)] before:pointer-events-none">
          <div className="relative z-[1]">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <DollarSign size={24} color="#4caf50" />
              Financial Overview
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Current Cash Balance */}
              <div className="bg-[rgba(76,175,80,0.1)] border border-[rgba(76,175,80,0.3)] rounded-lg p-3 text-center">
                <p className="text-[#81c784] text-xs mt-3 font-semibold">
                  CURRENT CASH BALANCE (period : {period})
                </p>
                <h2 className="text-[#4caf50] font-bold mt-7 text-[1.5rem] md:text-[1.5rem]">
                  {formatCurrency(companyData.cash_balance || 0)}
                </h2>
              </div>

              <div className="bg-[rgba(76,175,80,0.1)] border border-[rgba(76,175,80,0.3)] rounded-lg p-3 text-center">
                <p className="text-[#81c784] text-xs mt-3 font-semibold">
                  PROJECTED CASH BALANCE (period : {(period ?? 0) + 1})
                </p>
                <h2 className="text-[#4caf50] font-bold mt-7 text-[1.5rem] md:text-[1.5rem]">
                  {formatCurrency(projectedCashBalance || 0)}
                </h2>
              </div>

              {/* Total Budgets Impact */}
              <div className="bg-[rgba(255,152,0,0.1)] border border-[rgba(255,152,0,0.3)] rounded-lg p-3 text-center">
                <p className="text-[#ffb74d] text-xs mt-3 font-semibold">
                  TOTAL BUDGET ALLOCATION
                </p>
                <h2 className="text-[#ff9800] font-bold mt-7 text-[1.5rem] md:text-[1.5rem]">
                  {formatCurrency(
                    (hrData.total_budget || 0) +
                      (marketingData.budget || 0) +
                      (rdData.budget || 0) +
                      (financeData.investment_amount || 0) +
                      (financeData.loan_amount || 0)
                  )}
                </h2>
              </div>

              {/* Projected Profit */}
              <div className="bg-[rgba(33,150,243,0.1)] border border-[rgba(33,150,243,0.3)] rounded-lg p-3 text-center">
                <p className="text-[#64b5f6] text-xs mt-3 font-semibold">
                  PROJECTED PROFIT
                </p>
                <h2
                  className={`font-bold mt-9 text-[1.5rem] md:text-[1.5rem] ${
                    totalSalesMetrics.totalProfit >= 0
                      ? "text-blue-500"
                      : "text-red-500"
                  }`}
                >
                  {formatCurrency(totalSalesMetrics.totalProfit)}
                </h2>
              </div>

              {/* Net Worth */}
              <div className="bg-[rgba(156,39,176,0.1)] border border-[rgba(156,39,176,0.3)] rounded-lg p-3 text-center">
                <p className="text-[#ba68c8] text-xs mt-3 font-semibold">
                  NET WORTH
                </p>

                <p className="text-purple-600 font-bold mt-9 text-[1.5rem] md:text-[1.5rem]">
                  {formatCurrency(
                    (companyData.total_assets || 0) -
                      (companyData.total_liabilities || 0)
                  )}
                </p>
              </div>
            </div>

            {/* Detailed Financial Breakdown */}
            <div className="mt-4">
              <h2 className="text-white font-semibold text-lg mb-2">
                Financial Position Details
              </h2>

              <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                {/* Assets & Liabilities */}
                <div className="bg-[rgba(255,255,255,0.03)] border border-white/10 rounded-lg p-3">
                  <h3 className="text-[#64b5f6] font-semibold text-base mb-2">
                    Balance Sheet
                  </h3>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between">
                      <p className="text-sm text-[#bbb]">Total Assets:</p>
                      <p className="text-sm text-green-500 font-semibold">
                        {formatCurrency(companyData.total_assets || 0)}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-sm text-[#bbb]">Total Liabilities:</p>
                      <p className="text-sm text-red-500 font-semibold">
                        {formatCurrency(companyData.total_liabilities || 0)}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-sm text-[#bbb]">Brand Value:</p>
                      <p className="text-sm text-purple-600 font-semibold">
                        {formatCurrency(companyData.brand_value || 0)}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-sm text-[#bbb]">Credit Rating:</p>
                      <p className="text-white font-semibold text-sm">
                        {companyData.credit_rating || "Not Rated"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cash Flow Impact */}
                <div className="bg-[rgba(255,255,255,0.03)] border border-white/10 rounded-lg p-3">
                  <h3 className="text-[#64b5f6] font-semibold text-base mb-2">
                    Cash Flow Impact
                  </h3>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between">
                      <p className="text-sm text-[#bbb]">HR Budget:</p>
                      <p className="text-sm text-red-500 font-semibold">
                        -{formatCurrency(hrData.total_budget || 0)}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-sm text-[#bbb]">Marketing Budget:</p>
                      <p className="text-sm text-red-500 font-semibold">
                        -{formatCurrency(marketingData.budget || 0)}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-sm text-[#bbb]">R&amp;D Budget:</p>
                      <p className="text-sm text-red-500 font-semibold">
                        -{formatCurrency(rdData.budget || 0)}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-sm text-[#bbb]">Expected Revenue:</p>
                      <p className="text-sm text-green-500 font-semibold">
                        +{formatCurrency(totalSalesMetrics.totalRevenue)}
                      </p>
                    </div>

                    <div className="flex justify-between pt-1 border-t border-white/10">
                      <p className="text-white font-semibold text-sm">
                        Projected Cash Balance:
                      </p>

                      <p
                        className={`font-semibold text-sm ${
                          (companyData.cash_balance || 0) +
                            totalSalesMetrics.totalProfit -
                            (hrData.total_budget || 0) -
                            (marketingData.budget || 0) -
                            (rdData.budget || 0) >=
                          0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {formatCurrency(projectedCashBalance)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 mb-4">
        {sections.map((section, index) => {
          const IconComponent = section.icon;
          return (
            <Card
              key={section.title}
              onClick={() => onEditSection?.(index)}
              className={cn(
                "relative h-full cursor-pointer overflow-hidden border border-white/10 bg-[#080a0fcc] transition-all duration-300",
                "hover:-translate-y-1.5 hover:border-[#64b5f680] hover:shadow-[0_12px_40px_rgba(33,150,243,0.15)]"
              )}
              style={{
                // Gradient overlay on top of card
                backgroundImage: `linear-gradient(135deg, ${getStatusColor(
                  section.status
                )}08 0%, transparent 100%)`,
                backgroundBlendMode: "overlay",
              }}
            >
              <div className="relative z-[1] p-4">
                {/* Header */}
                <div className="mb-3 flex items-center">
                  <div
                    className="section-icon mr-2.5 flex h-12 w-12 items-center justify-center rounded-[10px] transition-all duration-300 ease-in-out"
                    style={{
                      backgroundColor: `${getStatusColor(section.status)}15`,
                      border: `1px solid ${getStatusColor(section.status)}30`,
                    }}
                  >
                    <IconComponent
                      size={24}
                      color={getStatusColor(section.status)}
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="mb-1 text-[1.1rem] font-semibold text-white">
                      {section.title}
                    </h3>

                    <div className="flex items-center">
                      {getStatusIcon(section.status)}

                      <span
                        className="ml-1 inline-flex items-center justify-center rounded border px-2 py-[2px] text-xs font-medium capitalize"
                        style={{
                          backgroundColor: `${getStatusColor(
                            section.status
                          )}20`,
                          color: getStatusColor(section.status),
                          borderColor: `${getStatusColor(section.status)}30`,
                          height: "22px",
                          fontSize: "0.7rem",
                        }}
                      >
                        {section.status.replace("-", " ")}
                      </span>
                    </div>
                  </div>
                </div>

                <hr className="mb-3 border-0 h-px bg-white/10" />

                {/* Key Metrics */}
                {section.keyMetrics && (
                  <div className="mb-3">
                    <p className="text-[#64b5f6] mb-2 font-semibold text-[0.85rem] uppercase tracking-[0.5px]">
                      Key Metrics
                    </p>

                    <div className="flex flex-col gap-3">
                      {section.keyMetrics.map((metric, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center py-1 px-2 rounded-xl bg-white/5 border border-white/10"
                        >
                          <span className="text-[#bbb] font-medium text-[0.8rem]">
                            {metric.label}
                          </span>
                          <span className="text-white font-semibold text-[0.85rem]">
                            {metric.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary Points */}
                <div>
                  <p className="text-[#64b5f6] mb-2 font-semibold text-[0.85rem] uppercase tracking-[0.5px]">
                    Strategic Summary
                  </p>

                  <div className="max-h-[140px] overflow-auto pr-1">
                    {section.summary.slice(0, 4).map((point, idx) => (
                      <div key={idx} className="flex items-start mb-1.5 py-0.5">
                        <div
                          className="w-[6px] h-[6px] rounded-full mt-1 mr-1.5 flex-shrink-0"
                          style={{
                            backgroundColor: getStatusColor(section.status),
                          }}
                        />
                        <p className="text-[#ccc] text-[0.8rem] font-normal leading-snug">
                          {point}
                        </p>
                      </div>
                    ))}

                    {section.summary.length > 4 && (
                      <p className="text-[#64b5f6] italic text-[0.75rem] ml-6">
                        +{section.summary.length - 4} more items...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PreviewDashboard;
