"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
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
} from "lucide-react";
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
        return <CheckCircle size={16} color="#4caf50" />;
      case "in-progress":
        return <CircularProgress size={16} sx={{ color: "#ff9800" }} />;
      case "pending":
        return <CircularProgress size={16} sx={{ color: "#666" }} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(18, 20, 24, 0.95)",
          color: "#fff",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} sx={{ color: "#64b5f6", mb: 3 }} />
          <Typography variant="h6" sx={{ color: "#fff", mb: 1 }}>
            Preparing Your Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: "#aaa" }}>
            Compiling all your strategic decisions...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        bgcolor: "rgba(18, 20, 24, 0.95)",
        color: "#fff",
        overflow: "auto",
        p: 3,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Paper
          sx={{
            bgcolor: "rgba(8, 10, 15, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 3,
            p: 4,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(135deg, rgba(100, 181, 246, 0.05) 0%, rgba(33, 150, 243, 0.02) 100%)",
              pointerEvents: "none",
            },
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  bgcolor: "rgba(100, 181, 246, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 3,
                  border: "1px solid rgba(100, 181, 246, 0.2)",
                }}
              >
                <BarChart3 size={28} color="#64b5f6" />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h3"
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    mb: 1,
                    background:
                      "linear-gradient(135deg, #fff 0%, #64b5f6 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: { xs: "1.75rem", md: "2.5rem" },
                  }}
                >
                  Strategic Overview
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#64b5f6",
                    fontWeight: 500,
                    mb: 1,
                    fontSize: { xs: "1rem", md: "1.25rem" },
                  }}
                >
                  {companyData.name || "Your Company"}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#aaa",
                    lineHeight: 1.6,
                    fontSize: "0.95rem",
                  }}
                >
                  Comprehensive review of strategic decisions across all
                  business units
                </Typography>
              </Box>
            </Box>

            <Alert
              severity={
                sections.every((s) => s.status === "completed")
                  ? "success"
                  : "warning"
              }
              sx={{
                bgcolor: sections.every((s) => s.status === "completed")
                  ? "rgba(76, 175, 80, 0.1)"
                  : "rgba(255, 193, 7, 0.1)",
                border: sections.every((s) => s.status === "completed")
                  ? "1px solid rgba(76, 175, 80, 0.3)"
                  : "1px solid rgba(255, 193, 7, 0.3)",
                color: sections.every((s) => s.status === "completed")
                  ? "#81c784"
                  : "#ffb74d",
                borderRadius: 2,
                "& .MuiAlert-icon": {
                  color: sections.every((s) => s.status === "completed")
                    ? "#4caf50"
                    : "#ff9800",
                },
                "& .MuiAlert-message": {
                  fontWeight: 500,
                },
              }}
            >
              {sections.every((s) => s.status === "completed")
                ? "All business units configured successfully! Your strategy is ready for implementation."
                : `Configuration Progress: ${
                    sections.filter((s) => s.status === "completed").length
                  } of ${
                    sections.length
                  } sections completed. Review pending areas below.`}
            </Alert>
          </Box>
        </Paper>
      </Box>

      {/* Financial Overview */}
      <Box sx={{ mb: 4 }}>
        <Paper
          sx={{
            bgcolor: "rgba(8, 10, 15, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 3,
            p: 4,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(33, 150, 243, 0.02) 100%)",
              pointerEvents: "none",
            },
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              variant="h5"
              sx={{
                color: "#fff",
                fontWeight: 700,
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <DollarSign size={24} color="#4caf50" />
              Financial Overview
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(5, 1fr)",
                },
                gap: 3,
              }}
            >
              {/* Current Cash Balance */}
              <Box
                sx={{
                  bgcolor: "rgba(76, 175, 80, 0.1)",
                  border: "1px solid rgba(76, 175, 80, 0.3)",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#81c784",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  CURRENT CASH BALANCE (period : {period})
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    color: "#4caf50",
                    fontWeight: 700,
                    mt: 1,
                    fontSize: { xs: "1.5rem", md: "2rem" },
                  }}
                >
                  {formatCurrency(companyData.cash_balance || 0)}
                </Typography>
              </Box>

              <Box
                sx={{
                  bgcolor: "rgba(76, 175, 80, 0.1)",
                  border: "1px solid rgba(76, 175, 80, 0.3)",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#81c784",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  PROJECTED CASH BALANCE (period : {(period ?? 0) + 1})
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    color: "#4caf50",
                    fontWeight: 700,
                    mt: 1,
                    fontSize: { xs: "1.5rem", md: "2rem" },
                  }}
                >
                  {formatCurrency(projectedCashBalance || 0)}
                </Typography>
              </Box>

              {/* Total Budgets Impact */}
              <Box
                sx={{
                  bgcolor: "rgba(255, 152, 0, 0.1)",
                  border: "1px solid rgba(255, 152, 0, 0.3)",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#ffb74d",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  TOTAL BUDGET ALLOCATION
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    color: "#ff9800",
                    fontWeight: 700,
                    mt: 1,
                    fontSize: { xs: "1.5rem", md: "2rem" },
                  }}
                >
                  {formatCurrency(
                    (hrData.total_budget || 0) +
                      (marketingData.budget || 0) +
                      (rdData.budget || 0) +
                      (financeData.investment_amount || 0) +
                      (financeData.loan_amount || 0)
                  )}
                </Typography>
              </Box>

              {/* Projected Profit */}
              <Box
                sx={{
                  bgcolor: "rgba(33, 150, 243, 0.1)",
                  border: "1px solid rgba(33, 150, 243, 0.3)",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#64b5f6",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  PROJECTED PROFIT
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    color:
                      totalSalesMetrics.totalProfit >= 0
                        ? "#2196f3"
                        : "#f44336",
                    fontWeight: 700,
                    mt: 1,
                    fontSize: { xs: "1.5rem", md: "2rem" },
                  }}
                >
                  {formatCurrency(totalSalesMetrics.totalProfit)}
                </Typography>
              </Box>

              {/* Net Worth */}
              <Box
                sx={{
                  bgcolor: "rgba(156, 39, 176, 0.1)",
                  border: "1px solid rgba(156, 39, 176, 0.3)",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#ba68c8",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  NET WORTH
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    color: "#9c27b0",
                    fontWeight: 700,
                    mt: 1,
                    fontSize: { xs: "1.5rem", md: "2rem" },
                  }}
                >
                  {formatCurrency(
                    (companyData.total_assets || 0) -
                      (companyData.total_liabilities || 0)
                  )}
                </Typography>
              </Box>
            </Box>

            {/* Detailed Financial Breakdown */}
            <Box sx={{ mt: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                Financial Position Details
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                  gap: 3,
                }}
              >
                {/* Assets & Liabilities */}
                <Box
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 2,
                    p: 3,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#64b5f6", fontWeight: 600, mb: 2 }}
                  >
                    Balance Sheet
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" sx={{ color: "#bbb" }}>
                        Total Assets:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#4caf50", fontWeight: 600 }}
                      >
                        {formatCurrency(companyData.total_assets || 0)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" sx={{ color: "#bbb" }}>
                        Total Liabilities:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#f44336", fontWeight: 600 }}
                      >
                        {formatCurrency(companyData.total_liabilities || 0)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" sx={{ color: "#bbb" }}>
                        Brand Value:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#9c27b0", fontWeight: 600 }}
                      >
                        {formatCurrency(companyData.brand_value || 0)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" sx={{ color: "#bbb" }}>
                        Credit Rating:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#fff", fontWeight: 600 }}
                      >
                        {companyData.credit_rating || "Not Rated"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Cash Flow Impact */}
                <Box
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 2,
                    p: 3,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#64b5f6", fontWeight: 600, mb: 2 }}
                  >
                    Cash Flow Impact
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" sx={{ color: "#bbb" }}>
                        HR Budget:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#f44336", fontWeight: 600 }}
                      >
                        -{formatCurrency(hrData.total_budget || 0)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" sx={{ color: "#bbb" }}>
                        Marketing Budget:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#f44336", fontWeight: 600 }}
                      >
                        -{formatCurrency(marketingData.budget || 0)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" sx={{ color: "#bbb" }}>
                        R&D Budget:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#f44336", fontWeight: 600 }}
                      >
                        -{formatCurrency(rdData.budget || 0)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" sx={{ color: "#bbb" }}>
                        Expected Revenue:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#4caf50", fontWeight: 600 }}
                      >
                        +{formatCurrency(totalSalesMetrics.totalRevenue)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        pt: 1,
                        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "#fff", fontWeight: 600 }}
                      >
                        Projected Cash Balance:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            (companyData.cash_balance || 0) +
                              totalSalesMetrics.totalProfit -
                              (hrData.total_budget || 0) -
                              (marketingData.budget || 0) -
                              (rdData.budget || 0) >=
                            0
                              ? "#4caf50"
                              : "#f44336",
                          fontWeight: 600,
                        }}
                      >
                        {formatCurrency(projectedCashBalance)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Summary Cards Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 3,
          mb: 4,
        }}
      >
        {sections.map((section, index) => {
          const IconComponent = section.icon;
          return (
            <Card
              key={section.title}
              sx={{
                bgcolor: "rgba(8, 10, 15, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 3,
                height: "100%",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(135deg, ${getStatusColor(
                    section.status
                  )}08 0%, transparent 100%)`,
                  pointerEvents: "none",
                },
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 12px 40px rgba(33, 150, 243, 0.15)",
                  borderColor: "rgba(100, 181, 246, 0.4)",
                  "& .section-icon": {
                    transform: "scale(1.1)",
                    boxShadow: `0 8px 24px ${getStatusColor(section.status)}40`,
                  },
                },
              }}
              onClick={() => onEditSection?.(index)}
            >
              <CardContent sx={{ p: 4, position: "relative", zIndex: 1 }}>
                {/* Header */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box
                    className="section-icon"
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2.5,
                      bgcolor: `${getStatusColor(section.status)}15`,
                      border: `1px solid ${getStatusColor(section.status)}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2.5,
                      transition: "all 0.3s ease",
                    }}
                  >
                    <IconComponent
                      size={24}
                      color={getStatusColor(section.status)}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#fff",
                        fontWeight: 600,
                        mb: 1,
                        fontSize: "1.1rem",
                      }}
                    >
                      {section.title}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {getStatusIcon(section.status)}
                      <Chip
                        label={section.status.replace("-", " ")}
                        size="small"
                        sx={{
                          ml: 1,
                          bgcolor: `${getStatusColor(section.status)}20`,
                          color: getStatusColor(section.status),
                          fontSize: "0.7rem",
                          height: 22,
                          fontWeight: 500,
                          textTransform: "capitalize",
                          border: `1px solid ${getStatusColor(
                            section.status
                          )}30`,
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.08)", mb: 3 }} />

                {/* Key Metrics */}
                {section.keyMetrics && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "#64b5f6",
                        mb: 2,
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Key Metrics
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                      }}
                    >
                      {section.keyMetrics.map((metric, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            py: 1,
                            px: 2,
                            borderRadius: 1.5,
                            bgcolor: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid rgba(255, 255, 255, 0.05)",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#bbb",
                              fontWeight: 500,
                              fontSize: "0.8rem",
                            }}
                          >
                            {metric.label}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#fff",
                              fontWeight: 600,
                              fontSize: "0.85rem",
                            }}
                          >
                            {metric.value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Summary Points */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "#64b5f6",
                      mb: 2,
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Strategic Summary
                  </Typography>
                  <Box sx={{ maxHeight: 140, overflow: "auto" }}>
                    {section.summary.slice(0, 4).map((point, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          mb: 1.5,
                          py: 0.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            bgcolor: getStatusColor(section.status),
                            mt: 1,
                            mr: 1.5,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#ccc",
                            fontSize: "0.8rem",
                            lineHeight: 1.5,
                            fontWeight: 400,
                          }}
                        >
                          {point}
                        </Typography>
                      </Box>
                    ))}
                    {section.summary.length > 4 && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64b5f6",
                          fontStyle: "italic",
                          fontSize: "0.75rem",
                          ml: 2.5,
                        }}
                      >
                        +{section.summary.length - 4} more items...
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default PreviewDashboard;
