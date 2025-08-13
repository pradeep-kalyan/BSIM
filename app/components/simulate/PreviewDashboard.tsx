"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  CheckCircle,
  Users,
  Wallet,
  TrendingUp,
  IndianRupee,
  BarChart2,
  Beaker,
  Package,
  DollarSign,
  ShoppingCart,
  LoaderCircle,
  Download,
  PiggyBank,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/app/lib/utils/utils";
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
import { useExport } from "@/app/hooks/useExport";
import InfoCard from "@/app/components/InfoCard";
interface PreviewDashboardProps {
  companyId: string;
}

interface SectionSummary {
  title: string;
  icon: React.ElementType;
  status: "completed" | "pending" | "in-progress";
  summary: string[];
  keyMetrics?: { label: string; value: string }[];
}

const PreviewDashboard: React.FC<PreviewDashboardProps> = () => {
  const [loading, setLoading] = useState(true);
  const { projectedCashBalance } = useCashBalance();
  const [sections, setSections] = useState<SectionSummary[]>([]);
  const [modalData, setModalData] = useState<{
    title: string;
    items: string[];
  } | null>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const { exportDashboard, isExporting } = useExport();

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
    [hrData, marketingData, rdData, productData, financeData, totalSalesMetrics]
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
              label: "Quality Improvements",
              value: `${rdData.quality_changes || 0}`,
            },
            {
              label: "Time to Market",
              value: `${rdData.time_to_market} Months`,
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
    }, 300);

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

  const handleExportDashboard = useCallback(async () => {
    if (!dashboardRef.current) return;

    try {
      // Temporarily modify styles for full content capture
      const originalStyle = dashboardRef.current.style.cssText;
      const originalClass = dashboardRef.current.className;

      // Remove height restrictions and overflow for export
      dashboardRef.current.style.height = "auto";
      dashboardRef.current.style.overflow = "visible";
      dashboardRef.current.style.maxHeight = "none";
      dashboardRef.current.style.minHeight = "auto";
      dashboardRef.current.className = originalClass.replace(
        "h-full overflow-auto",
        "min-h-full overflow-visible"
      );

      // Add export-specific styles
      const exportStyle = document.createElement("style");
      exportStyle.textContent = `
        .capturing-screenshot {
          height: auto !important;
          overflow: visible !important;
          max-height: none !important;
          min-height: auto !important;
        }
        .capturing-screenshot * {
          max-height: none !important;
          overflow: visible !important;
        }
      `;
      document.head.appendChild(exportStyle);

      // Wait for layout to adjust
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const filename = `business-simulation-dashboard-${period}-${
        new Date().toISOString().split("T")[0]
      }`;
      await exportDashboard(dashboardRef.current, filename);

      // Clean up
      document.head.removeChild(exportStyle);

      // Restore original styles
      dashboardRef.current.style.cssText = originalStyle;
      dashboardRef.current.className = originalClass;
    } catch {
      // Restore original styles in case of error
      if (dashboardRef.current) {
        dashboardRef.current.style.cssText = "";
        dashboardRef.current.className =
          "h-full bg-[rgba(18,20,24,0.95)] text-white overflow-auto p-3";
      }
      // Clean up style element if it exists
      const exportStyle = document.querySelector("style[data-export]");
      if (exportStyle) {
        document.head.removeChild(exportStyle);
      }
    }
  }, [exportDashboard, period]);

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
      <div className="h-full flex items-center justify-center bg-slate-800/50 shadow-md text-white">
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

  return (
    <div
      ref={dashboardRef}
      className="h-full bg-slate-800/50 shadow-md text-white overflow-auto p-3"
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Dashboard Preview
          </h1>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportDashboard}
          disabled={isExporting}
          className="flex items-center gap-2 bg-[rgba(33,150,243,0.1)] hover:bg-[rgba(33,150,243,0.2)] border border-[rgba(33,150,243,0.3)] hover:border-[rgba(33,150,243,0.5)] rounded-lg px-4 py-2 text-[#64b5f6] hover:text-[#42a5f5] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <LoaderCircle className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isExporting ? "Exporting..." : "Export Dashboard"}
        </button>
      </div>

      {/* Financial Overview */}
      <div className="mb-4">
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <DollarSign size={24} color="#4caf50" />
          Financial Overview
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4 mx-4">
          <InfoCard
            label={`Cash Balance`}
            value={companyData.cash_balance || 0}
            isCurrency={true}
            Icon={Wallet}
            width="w-full"
            height="h-full"
            iconColor="text-green-400"
            // subtext={`period : ${(period ?? 0)}`}
          />

          <InfoCard
            label={`Projected Cash Balance`}
            value={projectedCashBalance || 0}
            isCurrency={true}
            Icon={PiggyBank}
            width="w-full"
            height="h-full"
            iconColor="text-purple-400"
            // subtext={`period : ${(period ?? 0) + 1}`}
          />

          <InfoCard
            label="Total Budget"
            value={
              (hrData.total_budget || 0) +
              (marketingData.budget || 0) +
              (rdData.budget || 0) +
              (financeData.investment_amount || 0) +
              (financeData.loan_amount || 0)
            }
            isCurrency={true}
            Icon={IndianRupee}
            width="w-full"
            height="h-full"
            iconColor="text-orange-400"
          />

          <InfoCard
            label="Projected Profit"
            value={totalSalesMetrics.totalProfit}
            isCurrency={true}
            Icon={BarChart2}
            width="w-full"
            height="h-full"
            iconColor="text-blue-400"
          />

          <InfoCard
            label="Net Worth"
            value={
              (companyData.total_assets || 0) -
              (companyData.total_liabilities || 0)
            }
            isCurrency={true}
            Icon={TrendingUp}
            width="w-full"
            height="h-full"
            iconColor="text-purple-400"
          />
        </div>

        <div className="relative overflow-hidden bg-slate-800/50 shadow-md border border-slate-600 rounded-xl p-4 before:pointer-events-none m-4">
          <div className="relative z-[1]">
            {/* Detailed Financial Breakdown */}
            <div>
              <h2 className="text-white font-semibold text-lg mb-2">
                Financial Position Details
              </h2>

              <div className="grid gap-3 grid-cols-1 md:grid-cols-2 mx-8">
                {/* Assets & Liabilities */}
                <div className="bg-slate-800/50 shadow-md border border-slate-600 rounded-lg py-3 px-8">
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
                      <p className="text-sm text-green-500 font-semibold">
                        {formatCurrency(companyData.brand_value || 0)}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-sm text-[#bbb]">Credit Rating:</p>
                      <p className="text-[#bbb] font-semibold text-sm">
                        {companyData.credit_rating || "Not Rated"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cash Flow Impact */}
                <div className=" border border-slate-600 rounded-lg py-3 px-8">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 m-4">
        {sections.map((section) => {
          const IconComponent = section.icon;
          return (
            <Card
              key={section.title}
              className={cn(
                "relative h-full cursor-pointer overflow-hidden border border-slate-600 bg-slate-800/50 shadow-md transition-all duration-300",
                "hover:-translate-y-1.5]"
              )}
            >
              <div className="relative z-[1]">
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

                <div className="flex justify-between gap-6">
                  {/* Key Metrics */}
                  {section.keyMetrics && (
                    <div className="w-1/2">
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
                  <div className="w-1/2">
                    <p className="text-[#64b5f6] mb-2 font-semibold text-[0.85rem] uppercase tracking-[0.5px]">
                      Strategic Summary
                    </p>

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
                      <button
                        onClick={() =>
                          setModalData({
                            title: section.title,
                            items: section.summary,
                          })
                        }
                        className="text-[#64b5f6] italic text-[0.75rem] ml-6 hover:underline"
                      >
                        +{section.summary.length - 4} more items...
                      </button>
                    )}
                  </div>
                  {modalData && (
                    <div className="fixed inset-0 bg-slate-800/50 shadow-md flex items-center justify-center z-50">
                      <div className="bg-slate-800/90 border border-slate-600 rounded-lg p-6 max-w-lg w-full text-white">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-lg font-semibold">
                            {modalData.title} - Full Summary
                          </h2>
                          <button
                            onClick={() => setModalData(null)}
                            className="text-red-400 hover:text-red-500"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto pr-2">
                          {modalData.items.map((point, idx) => (
                            <div key={idx} className="flex items-start mb-2">
                              <div className="w-[6px] h-[6px] rounded-full mt-2 mr-2 flex-shrink-0 bg-green-400" />
                              <p className="text-sm text-gray-300">{point}</p>
                            </div>
                          ))}
                        </div>
                        <div className="text-right mt-4">
                          <button
                            onClick={() => setModalData(null)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
