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
} from "@mui/material";
import {
  DollarSign,
  Users,
  TrendingUp,
  Beaker,
  Factory,
  Package,
} from "lucide-react";
import FinanceForm from "./FinanceForm";
import HRDashboard from "./HR";
import MarketingForm from "./MarketingForm";
import RDForm from "./RDForm";
import ProductionForm from "./ProductionForm";
import ProductsForm from "./ProductsForm";
import LogoutBtn from "@/app/(auth)/_components/Logout";

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
    label: "Finance Info",
    icon: DollarSign,
    description: "Manage financial decisions and budgets",
  },
];

interface FormProps {
  companyId: string;
}

const Form: React.FC<FormProps> = ({ companyId }) => {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleStepClick = (step: number) => setActiveStep(step);

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <HRDashboard companyId={companyId} />;
      case 1:
        return <MarketingForm companyId={companyId} />;
      case 2:
        return <RDForm companyId={companyId} />;
      case 3:
        return <ProductionForm companyId={companyId} />;
      case 4:
        return <ProductsForm companyId={companyId} />;
      case 5:
        return <FinanceForm companyId={companyId} />;
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
      }}
    >
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
                onClick={() => handleStepClick(index)}
                sx={{
                  p: 2,
                  cursor: "pointer",
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
                  "&:hover": {
                    bgcolor: isActive
                      ? "rgba(33, 150, 243, 0.2)"
                      : isCompleted
                        ? "rgba(76, 175, 80, 0.1)"
                        : "rgba(255, 255, 255, 0.05)",
                    transform: "translateX(4px)",
                  },
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
              py:1,
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
                    background: "linear-gradient(135deg, #fff 0%, #64b5f6 100%)",
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
              py:1,
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
              disabled={activeStep === 0}
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
              disabled={activeStep === steps.length - 1}
              variant="contained"
              size="medium"
              sx={{
                background: "linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)",
                color: "#fff",
                fontWeight: 700,
                minWidth: "100px",
                height: "40px",
                borderRadius: "10px",
                textTransform: "none",
                boxShadow: "0 6px 20px rgba(33, 150, 243, 0.4)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #1976d2 0%, #1cb5e0 100%)",
                  boxShadow: "0 8px 24px rgba(33, 150, 243, 0.5)",
                  transform: "translateY(-1px)",
                },
                "&:disabled": {
                  background: "#333",
                  color: "#666",
                  boxShadow: "none",
                },
                transition: "all 0.3s ease",
              }}
            >
              {activeStep === steps.length - 1 ? "Complete" : "Next Step"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Form;
