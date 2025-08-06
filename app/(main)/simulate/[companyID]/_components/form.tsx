"use client";
import React, { useState } from "react";
import {
  Button,
  Paper,
  Fade,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Link,
  CircularProgress,
} from "@mui/material";
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
// import HRDashboard from "./HR";
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
} from "@/app/context/FormContext";
import { comprehensiveFormSubmission } from "@/app/_actions/comprehensiveFormSubmission";
import { redirect } from "next/navigation";
import Sales from "./SalesForm";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const { state } = useForm();
  const { projectedCashBalance, budgetImpacts } = useCashBalance();

  const { getTotalSalesMetrics } = useSalesForm();
  const salesmetrices = getTotalSalesMetrics();

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
      console.log("Starting form submission...");
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
          recruitment_cost: state.hr.recruitment_cost,
          firing_cost: state.hr.firing_cost,
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

      console.log("Form data prepared, calling submission API...");
      console.log("Products being submitted:", formData.product);
      console.log("Total products count:", formData.product.length);
      console.log("Sales data being submitted:", formData.sales);
      console.log("Sales data keys:", Object.keys(formData.sales));
      const result = await comprehensiveFormSubmission(companyId, formData);
      console.log("Submission result:", result);

      setIsSubmitting(false);

      if (result.success) {
        // Show success message with product information
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
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Submission Overlay */}
      {isSubmitting && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "not-allowed",
          }}
        >
          <Paper
            elevation={24}
            sx={{
              padding: 4,
              backgroundColor: "rgba(18, 20, 24, 0.95)",
              borderRadius: 3,
              border: "1px solid rgba(33, 150, 243, 0.3)",
              backdropFilter: "blur(20px)",
              textAlign: "center",
              maxWidth: "400px",
              margin: 2,
            }}
          >
            <CircularProgress
              size={60}
              thickness={4}
              sx={{
                color: "#2196f3",
                mb: 3,
                "& .MuiCircularProgress-circle": {
                  strokeLinecap: "round",
                },
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: "#fff",
                fontWeight: 600,
                mb: 2,
                background: "linear-gradient(135deg, #fff 0%, #64b5f6 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Submitting Simulation
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#aaa",
                mb: 1,
                lineHeight: 1.5,
              }}
            >
              Processing your business decisions and advancing to the next
              period...
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#666",
                fontStyle: "italic",
              }}
            >
              Please do not close this window or navigate away
            </Typography>
          </Paper>
        </Box>
      )}

      {/* Sidebar with Steps */}
      <Paper
        elevation={12}
        sx={{
          width: isMobile ? "100%" : isTablet ? "240px" : "280px",
          height: isMobile ? "auto" : "100vh",
          bgcolor: "rgba(8, 10, 15, 0.95)",
          borderRadius: 0,
          borderRight: isMobile ? "none" : "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(180deg, rgba(33, 150, 243, 0.05) 0%, rgba(0, 0, 0, 0.1) 100%)",
            pointerEvents: "none",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2.5,
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography
                variant="caption"
                sx={{ color: "#64b5f6", fontWeight: 600 }}
              >
                Progress
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#64b5f6", fontWeight: 600 }}
              >
                {Math.round(progress)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: "rgba(255, 255, 255, 0.1)",
                "& .MuiLinearProgress-bar": {
                  background:
                    "linear-gradient(90deg, #2196f3, #21cbf3, #00e676)",
                  borderRadius: 5,
                  transition: "all 0.6s ease",
                },
              }}
            />
          </Box>

          <Typography
            variant="caption"
            sx={{ color: "#888", display: "block" }}
          >
            Step {activeStep + 1} of {steps.length} • {steps[activeStep].label}
          </Typography>
        </Box>

        {/* Steps List */}
        <Box
          sx={{ flex: 1, overflow: "auto", position: "relative", zIndex: 1 }}
        >
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;

            return (
              <Box
                key={step.label}
                onClick={() => !isSubmitting && handleStepClick(index)}
                sx={{
                  p: 2,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                  bgcolor: isActive
                    ? "rgba(33, 150, 243, 0.15)"
                    : isCompleted
                    ? "rgba(76, 175, 80, 0.05)"
                    : "transparent",
                  borderLeft: isActive
                    ? "4px solid #2196f3"
                    : isCompleted
                    ? "4px solid #4caf50"
                    : "4px solid transparent",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: isActive ? "translateX(4px)" : "translateX(0)",
                  opacity: isSubmitting ? 0.6 : 1,
                  "&:hover": !isSubmitting
                    ? {
                        bgcolor: isActive
                          ? "rgba(33, 150, 243, 0.2)"
                          : isCompleted
                          ? "rgba(76, 175, 80, 0.1)"
                          : "rgba(255, 255, 255, 0.05)",
                        transform: "translateX(4px)",
                      }
                    : {},
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "10px",
                      bgcolor: isCompleted
                        ? "#4caf50"
                        : isActive
                        ? "#2196f3"
                        : "rgba(255, 255, 255, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                      transition: "all 0.3s ease",
                      boxShadow:
                        isActive || isCompleted
                          ? "0 4px 12px rgba(33, 150, 243, 0.3)"
                          : "none",
                    }}
                  >
                    <IconComponent
                      size={16}
                      color={isCompleted || isActive ? "#fff" : "#666"}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: isActive
                          ? "#fff"
                          : isCompleted
                          ? "#81c784"
                          : "#bbb",
                        fontWeight: isActive ? 700 : isCompleted ? 600 : 500,
                        fontSize: "0.9rem",
                        mb: 0.3,
                      }}
                    >
                      {step.label}
                    </Typography>
                    {!isMobile && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: isActive
                            ? "#b3d9ff"
                            : isCompleted
                            ? "#a5d6a7"
                            : "#666",
                          fontSize: "0.75rem",
                          lineHeight: 1.4,
                        }}
                      >
                        {step.description}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Step indicator */}
                <Box sx={{ display: "flex", alignItems: "center", ml: 4.5 }}>
                  <Box
                    sx={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      bgcolor: isCompleted
                        ? "#4caf50"
                        : isActive
                        ? "#2196f3"
                        : "rgba(255, 255, 255, 0.2)",
                      mr: 1,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: isActive
                        ? "#64b5f6"
                        : isCompleted
                        ? "#4caf50"
                        : "#555",
                      fontSize: "0.65rem",
                    }}
                  >
                    {isCompleted
                      ? "Completed"
                      : isActive
                      ? "In Progress"
                      : "Pending"}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            bgcolor: "rgba(0, 0, 0, 0.2)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: "#666", textAlign: "center", display: "block" }}
          >
            Click on any step to navigate directly
          </Typography>
        </Box>
      </Paper>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            bgcolor: "rgba(18, 20, 24, 0.95)",
            borderRadius: 0,
            backdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(135deg, rgba(33, 150, 243, 0.02) 0%, rgba(0, 0, 0, 0.05) 100%)",
              pointerEvents: "none",
            },
          }}
        >
          {/* Content Header */}
          <Box
            sx={{
              px: 3,
              py: 1,
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              bgcolor: "rgba(8, 10, 15, 0.8)",
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {React.createElement(steps[activeStep].icon, {
                size: 24,
                style: { color: "#64b5f6", marginRight: "12px" },
              })}
              <Box sx={{ py: 0.5 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    mb: 0.1,
                    background:
                      "linear-gradient(135deg, #fff 0%, #64b5f6 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: "1rem",
                  }}
                >
                  {steps[activeStep].label}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#aaa", lineHeight: 1.3, fontSize: "0.85rem" }}
                >
                  {steps[activeStep].description}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Link
              href={`/homepage/${companyId}`}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 !text-white text-sm px-3 py-2 rounded-md !no-underline"
            >
              Dashboard
            </Link>
            <div className="flex items-center gap-1">
              <LogoutBtn />
            </div>
          </Box>

          {/* Content Body */}
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Fade in timeout={600} key={activeStep}>
              <Box sx={{ height: "100%", minHeight: "400px" }}>
                {renderStepContent(activeStep)}
              </Box>
            </Fade>
          </Box>

          {/* Navigation Controls */}
          <Box
            sx={{
              px: 3,
              py: 1,
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              bgcolor: "rgba(8, 10, 15, 0.8)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              position: "relative",
              zIndex: 1,
            }}
          >
            <Button
              onClick={handleBack}
              disabled={activeStep === 0 || isSubmitting}
              variant="outlined"
              size="medium"
              sx={{
                color: "#bbb",
                borderColor: "rgba(255, 255, 255, 0.2)",
                borderWidth: 2,
                minWidth: "100px",
                height: "40px",
                borderRadius: "10px",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  borderColor: "rgba(255, 255, 255, 0.4)",
                  bgcolor: "rgba(255, 255, 255, 0.05)",
                  transform: "translateY(-1px)",
                },
                "&:disabled": {
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  color: "#555",
                },
                transition: "all 0.3s ease",
              }}
            >
              Previous
            </Button>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography
                variant="body2"
                sx={{ color: "#888", fontSize: "0.85rem" }}
              >
                Step
              </Typography>
              <Box
                sx={{
                  bgcolor: "rgba(33, 150, 243, 0.2)",
                  color: "#64b5f6",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "6px",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                }}
              >
                {activeStep + 1} / {steps.length}
              </Box>
            </Box>

            <Button
              onClick={handleNext}
              disabled={activeStep > steps.length - 1 || isSubmitting}
              variant="contained"
              size="medium"
              sx={{
                background: isSubmitting
                  ? "#666"
                  : "linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)",
                color: "#fff",
                fontWeight: 700,
                minWidth: "100px",
                height: "40px",
                borderRadius: "10px",
                textTransform: "none",
                boxShadow: isSubmitting
                  ? "none"
                  : "0 6px 20px rgba(33, 150, 243, 0.4)",
                "&:hover": {
                  background: isSubmitting
                    ? "#666"
                    : "linear-gradient(135deg, #1976d2 0%, #1cb5e0 100%)",
                  boxShadow: isSubmitting
                    ? "none"
                    : "0 8px 24px rgba(33, 150, 243, 0.5)",
                  transform: isSubmitting ? "none" : "translateY(-1px)",
                },
                "&:disabled": {
                  background: "#333",
                  color: "#666",
                  boxShadow: "none",
                },
                transition: "all 0.3s ease",
              }}
            >
              {isSubmitting
                ? "Submitting..."
                : activeStep === steps.length - 1
                ? "save & submit"
                : "Next Step"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Form;
