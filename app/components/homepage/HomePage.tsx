"use client";
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { createSwapy } from "swapy";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSimulation } from "@/app/context/SimulationContext";
import { HamburgerMenuRef } from "./HamburgerMenu";
import { useExport } from "@/app/hooks/useExport";
import { Step } from "react-joyride";
import { CompanyHistoryType, HRRole } from "@/app/types/homepage";
import { getCurrentUser } from "@/app/functions/jwt";
import Joyride, { CallBackProps } from "react-joyride";
import { toast } from "react-toastify";
import { logoutUser } from "@/app/_actions/auth";

// Import new components
import DashboardHeader from "./DashboardHeader";
import MetricsCards from "./MetricsCards";
import RevenueProfitChart from "./RevenueProfitChart";
import DepartmentBudgetChart from "./DepartmentBudgetChart";
import HROverview from "./HROverview";
import ProductionMetrics from "./ProductionMetrics";
import RDPipeline from "./RDPipeline";
import SalesTrend from "./SalesTrend";
import ProductPerformance from "./ProductPerformance";
import { ChartDataTypes, HomePageProps } from "./types";

const getPercentChange = (current: number, prev: number) => {
  if (prev === 0 || prev === undefined || prev === null) return undefined;
  return +(((current - prev) / prev) * 100).toFixed(1);
};

const HomePage: React.FC<HomePageProps> = ({ data, comID }) => {
  const { setComId, setPeriod, simId, clearAll } = useSimulation();
  const router = useRouter();
  const { exportDashboard, isExporting } = useExport();
  const swapyRef = useRef<HTMLDivElement | null>(null);
  const swapyInstanceRef = useRef<ReturnType<typeof createSwapy> | null>(null);
  const [joyrideRun, setJoyrideRun] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();
  const [currentUsername, setCurrentUsername] = useState<string | undefined>();
  const [mounted, setMounted] = useState(false);
  const [isSimulating] = useState(false);

  const steps: Step[] = [
    {
      target: ".details",
      content:
        "Customize your dashboard by dragging and arranging the sections.",
      disableBeacon: true,
      placement: "top",
    },
    {
      target: ".export-dashboard-btn",
      content: "Click here to download your dashboard as an image.",
      disableBeacon: true,
      placement: "auto",
    },
    {
      target: ".simulate-dashboard-btn",
      content: "Run a simulation to preview how your strategies will perform.",
      disableBeacon: true,
      placement: "auto",
    },
  ];

  const [highlightedSelector, setHighlightedSelector] = useState<string | null>(
    null
  );

  const menuRef = useRef<HamburgerMenuRef>(null);

  // Helper function to create current period data from company object
  const createCurrentPeriodData = () => {
    const currentPeriod = data?.company?.current_period || 1;

    // Create current period company history entry
    const currentCompanyData = {
      id: `current-${currentPeriod}`,
      company_id: data?.company?.id || "",
      period: currentPeriod,
      cash_balance: data?.company?.cash_balance || 0,
      total_assets: data?.company?.total_assets || 0,
      total_liabilities: data?.company?.total_liabilities || 0,
      brand_value: data?.company?.brand_value || 0,
    };

    return { currentCompanyData };
  };

  // 1. Find unique periods from company history + current period
  const periods = useMemo(() => {
    const currentPeriod = data?.company?.current_period || 1;
    const historicalPeriods = data?.history?.map((h) => h.period) || [];
    const allPeriods = [...new Set([...historicalPeriods, currentPeriod])].sort(
      (a, b) => a - b
    );

    // Show last 5 periods including current
    return allPeriods.slice(-5);
  }, [data]);

  // 2. State: selected period (default: current period)
  const initialPeriod =
    data?.company?.current_period ||
    (periods.length > 0 ? periods[periods.length - 1] : 1);
  const [selectedPeriod, setSelectedPeriod] = useState(initialPeriod);

  // Get current period data
  const { currentCompanyData } = createCurrentPeriodData();
  const isCurrentPeriod = selectedPeriod === data?.company?.current_period;

  // All period-specific data loaded by period
  const companyHistory: CompanyHistoryType | undefined = isCurrentPeriod
    ? currentCompanyData
    : data.history?.find((h) => +h.period === +selectedPeriod);

  const companyHistoryPrev: CompanyHistoryType | undefined = data.history?.find(
    (h) => +h.period === +(selectedPeriod - 1)
  );

  // For financial data, if it's current period, use the latest finance_decision or create from company data
  const finForPeriod =
    isCurrentPeriod && data.finance_decision
      ? {
          period: selectedPeriod,
          total_revenue: data.finance_decision.total_revenue || 0,
          net_profit: data.finance_decision.net_profit || 0,
          cash_balance:
            data.finance_decision.cash_balance ||
            data?.company?.cash_balance ||
            0,
          operating_costs: data.finance_decision.operating_costs || 0,
          roi: data.finance_decision.roi || 0,
          burn_rate: data.finance_decision.burn_rate || 0,
        }
      : data.financialHistory?.find((f) => +f.period === +selectedPeriod) || {};

  const finForPeriodPrev =
    data.financialHistory?.find((f) => +f.period === +(selectedPeriod - 1)) ||
    {};

  // Product performance - include current period products
  const productPerformance = isCurrentPeriod
    ? data.productPerformance?.filter((p) => +p.period === +selectedPeriod) ||
      []
    : data.productPerformance?.filter((p) => +p.period === +selectedPeriod) ||
      [];

  const productPerformancePrev =
    data.productPerformance?.filter(
      (p) => +p.period === +(selectedPeriod - 1)
    ) || [];

  // HR Metrics - use current decision for current period
  const hrMetrics =
    isCurrentPeriod && data.hr_decision
      ? [
          {
            period: selectedPeriod,
            totalBudget: data.hr_decision.total_budget || 0,
            total_budget: data.hr_decision.total_budget || 0,
            employeeSatisfaction: data.hr_decision.employee_satisfaction || 0,
            employee_satisfaction: data.hr_decision.employee_satisfaction || 0,
            totalEmployees:
              data.hr_decision.total_employee_count ||
              data.hr_decision.roles?.reduce(
                (sum: number, role: HRRole) => sum + (role.head_count || 0),
                0
              ) ||
              0,
            total_employee_count:
              data.hr_decision.total_employee_count ||
              data.hr_decision.roles?.reduce(
                (sum: number, role: HRRole) => sum + (role.head_count || 0),
                0
              ) ||
              0,
            // Calculate newHires as difference from previous period
            newHires: (() => {
              const currentTotal =
                data.hr_decision.total_employee_count ||
                data.hr_decision.roles?.reduce(
                  (sum: number, role: HRRole) => sum + (role.head_count || 0),
                  0
                ) ||
                0;
              const prevPeriodHR = data.hrMetrics?.find(
                (h) => +h.period === +(selectedPeriod - 1)
              );

              type PrevHRData = {
                totalEmployees?: number;
                total_employee_count?: number;
                employees?: number;
                roles?: HRRole[];
              };

              const prevHRTyped = prevPeriodHR as PrevHRData;
              const prevTotal =
                prevHRTyped?.totalEmployees ??
                prevHRTyped?.total_employee_count ??
                prevHRTyped?.employees ??
                prevHRTyped?.roles?.reduce(
                  (sum: number, role: HRRole) => sum + (role.head_count || 0),
                  0
                ) ??
                0;
              return Math.max(0, currentTotal - prevTotal);
            })(),
            roles: data.hr_decision.roles || [],
          },
        ]
      : data.hrMetrics
          ?.filter((h) => +h.period === +selectedPeriod)
          .map((metric) => ({
            ...metric,
            // Ensure newHires is calculated for historical periods if not present
            newHires:
              metric.newHires ??
              (() => {
                const currentTotal =
                  metric.totalEmployees ??
                  metric.total_employee_count ??
                  metric.employees ??
                  metric.roles?.reduce(
                    (sum: number, role: HRRole) => sum + (role.head_count || 0),
                    0
                  ) ??
                  0;

                const prevMetric = data.hrMetrics?.find(
                  (h) => +h.period === +(selectedPeriod - 1)
                );
                const prevTotal =
                  prevMetric?.totalEmployees ??
                  prevMetric?.total_employee_count ??
                  prevMetric?.employees ??
                  prevMetric?.roles?.reduce(
                    (sum: number, role: HRRole) => sum + (role.head_count || 0),
                    0
                  ) ??
                  0;

                return Math.max(0, currentTotal - prevTotal);
              })(),
          })) || [
          { department: "No Data", employees: 0, satisfaction: 0, newHires: 0 },
        ];

  // Production data - use current decision for current period
  const productionData =
    isCurrentPeriod && data.production_decision
      ? [
          {
            period: selectedPeriod,
            month: "Current",
            produced: data.production_decision.units_to_produce || 0,
            defects: Math.round(
              ((data.production_decision.units_to_produce || 0) *
                (data.production_decision.defect_rate || 0)) /
                100
            ),
            efficiency:
              (data.production_decision.production_capacity ?? 0) > 0
                ? Math.round(
                    ((data.production_decision.units_to_produce || 0) /
                      (data.production_decision.production_capacity ?? 1)) *
                      100
                  )
                : 0,
            budget: data.production_decision.budget || 0,
          },
        ]
      : data.productionData?.filter((d) => +d.period === +selectedPeriod) || [
          { month: "Current", produced: 0, defects: 0, efficiency: 0 },
        ];

  // Get period-specific decisions from arrays when available
  const hr_decision = isCurrentPeriod
    ? data.hr_decision
    : data.hrMetrics?.find((h) => +h.period === +selectedPeriod);

  const rd_decision_for_period = isCurrentPeriod
    ? data.rd_decision
    : data.rdData?.find((r) => +r.period === +selectedPeriod);

  const production_decision_for_period = isCurrentPeriod
    ? data.production_decision
    : data.productionData?.find((p) => +p.period === +selectedPeriod);

  const marketing_decision_for_period = isCurrentPeriod
    ? data.marketing_decision
    : data.marketingData?.find((m) => +m.period === +selectedPeriod);

  // Fallback to latest decisions if period-specific not found
  const rd_decision = rd_decision_for_period || data.rd_decision;
  const production_decision =
    production_decision_for_period || data.production_decision;
  const marketing_decision =
    marketing_decision_for_period || data.marketing_decision;

  // Budgets, prevent undefined
  const hr_budget = hr_decision?.total_budget || hr_decision?.totalBudget || 0;
  const rd_budget = rd_decision?.budget || 0;
  // Production budget - handle both ProductionDecisionType and ProductionDataType
  const production_budget = (() => {
    if (!production_decision) return 0;
    // If it has a budget field, it's a ProductionDecisionType
    if ("budget" in production_decision && production_decision.budget) {
      return production_decision.budget;
    }
    // If it has units_to_produce and cost_per_unit, calculate from ProductionDataType
    if (
      "units_to_produce" in production_decision &&
      "cost_per_unit" in production_decision
    ) {
      return (
        (production_decision.units_to_produce || 0) *
        (production_decision.cost_per_unit || 0)
      );
    }
    return 0;
  })();
  const marketing_budget = marketing_decision?.budget || 0;

  // Pie chart: adjust percentages dynamically
  const totalDeptBudget =
    hr_budget + rd_budget + production_budget + marketing_budget;
  const departmentBudgets = [
    {
      name: "R&D",
      value: rd_budget,
      color: "#3B82F6",
      percentage: totalDeptBudget
        ? Math.round((rd_budget / totalDeptBudget) * 100)
        : 0,
    },
    {
      name: "Production",
      value: production_budget,
      color: "#10B981",
      percentage: totalDeptBudget
        ? Math.round((production_budget / totalDeptBudget) * 100)
        : 0,
    },
    {
      name: "Marketing",
      value: marketing_budget,
      color: "#F59E0B",
      percentage: totalDeptBudget
        ? Math.round((marketing_budget / totalDeptBudget) * 100)
        : 0,
    },
    {
      name: "HR",
      value: hr_budget,
      color: "#EF4444",
      percentage: totalDeptBudget
        ? 100 -
          (Math.round((rd_budget / totalDeptBudget) * 100) +
            Math.round((production_budget / totalDeptBudget) * 100) +
            Math.round((marketing_budget / totalDeptBudget) * 100))
        : 0,
    },
  ];

  // For trend chart, get last 5 periods up to current (including current period data)
  const revenueSeries = useMemo(() => {
    const periodsToInclude = periods;
    const currentPeriod = data?.company?.current_period || 1;

    const series = periodsToInclude.map((period) => {
      // If it's the current period, use current finance decision data
      if (period === currentPeriod && data.finance_decision) {
        return {
          period,
          revenue: data.finance_decision.total_revenue || 0,
          profit: data.finance_decision.net_profit || 0,
          total_revenue: data.finance_decision.total_revenue || 0,
        };
      }

      // Otherwise use historical financial data
      const periodData = data.financialHistory?.find(
        (f) => +f.period === period
      );
      return periodData
        ? {
            ...periodData,
            revenue: periodData.total_revenue || periodData.revenue || 0,
            profit: periodData.net_profit || periodData.profit || 0,
          }
        : {
            period,
            revenue: 0,
            profit: 0,
            total_revenue: 0,
          };
    });

    // Filter out any entries with invalid data
    return series.filter(
      (entry) =>
        entry &&
        typeof entry.period === "number" &&
        typeof entry.revenue === "number" &&
        typeof entry.profit === "number"
    );
  }, [
    data.financialHistory,
    data.finance_decision,
    periods,
    data?.company?.current_period,
  ]);

  // Sales trend series for past 5 periods
  const salesSeries = useMemo(() => {
    const periodsToInclude = periods;

    const series = periodsToInclude.map((period) => {
      // Get all products for this period
      const periodProducts =
        data.productPerformance?.filter((p) => +p.period === period) || [];

      // Calculate total sales volume and revenue for this period
      const totalSalesVolume = periodProducts.reduce(
        (sum, product) => sum + (product.sales_volume || 0),
        0
      );
      const totalSalesRevenue = periodProducts.reduce(
        (sum, product) => sum + (product.revenue || 0),
        0
      );

      return {
        period,
        totalSales: totalSalesVolume,
        salesRevenue: totalSalesRevenue,
      };
    });

    // Filter out any entries with invalid data
    return series.filter(
      (entry) =>
        entry &&
        typeof entry.period === "number" &&
        typeof entry.totalSales === "number" &&
        typeof entry.salesRevenue === "number"
    );
  }, [data.productPerformance, periods]);

  const chartData: ChartDataTypes = {
    revenue: revenueSeries
      .filter((item) => item && item.period != null)
      .map((item) => ({
        period: item.period,
        revenue: item.revenue,
        profit: item.profit,
        total_revenue: item.total_revenue || item.revenue,
      })),
    sales: salesSeries.filter((item) => item && item.period != null),
    departmentBudgets: departmentBudgets.filter(
      (item) =>
        item &&
        item.name &&
        typeof item.value === "number" &&
        !isNaN(item.value) &&
        typeof item.percentage === "number" &&
        !isNaN(item.percentage)
    ),
    productPerformance: productPerformance.length
      ? productPerformance.filter(
          (product) => product && (product.name || product.product?.name)
        )
      : [],
    hrMetrics: hrMetrics.length
      ? hrMetrics.filter(
          (metric) => metric && typeof metric.period === "number"
        )
      : [
          {
            department: "No Data",
            employees: 0,
            satisfaction: 0,
            newHires: 0,
          },
        ],
    productionData: productionData.length
      ? productionData
          .map((data) => {
            const hasMonth = "month" in data;
            const hasProduced = "produced" in data;
            const hasDefects = "defects" in data;
            const hasEfficiency = "efficiency" in data;
            const hasUnitsToProduceField = "units_to_produce" in data;

            return {
              month: hasMonth ? data.month : "Current",
              produced: hasProduced
                ? data.produced
                : hasUnitsToProduceField
                ? data.units_to_produce
                : 0,
              defects: hasDefects ? data.defects : 0,
              efficiency: hasEfficiency ? data.efficiency : 0,
              period: data.period,
            };
          })
          .filter((data) => data && typeof data.period === "number")
      : [{ month: "Current", produced: 0, defects: 0, efficiency: 0 }],
  };

  // --- CHANGE calculations ---
  // Cash Balance change
  const cash_balance = companyHistory?.cash_balance ?? 0;
  const cash_balance_prev = companyHistoryPrev?.cash_balance ?? 0;
  const cashChange = getPercentChange(cash_balance, cash_balance_prev);

  // Net Worth change
  const total_assets = companyHistory?.total_assets ?? 0;
  const total_liabilities = companyHistory?.total_liabilities ?? 0;
  const netWorthNow = total_assets - total_liabilities;

  const total_assets_prev = companyHistoryPrev?.total_assets ?? 0;
  const total_liabilities_prev = companyHistoryPrev?.total_liabilities ?? 0;
  const netWorthPrev = total_assets_prev - total_liabilities_prev;
  const netWorthChange = getPercentChange(netWorthNow, netWorthPrev);

  // Total Revenue change
  const currentRevenue =
    (finForPeriod as { total_revenue?: number })?.total_revenue ?? 0;
  const prevRevenue =
    (finForPeriodPrev as { total_revenue?: number })?.total_revenue ?? 0;
  const revenueChange = getPercentChange(currentRevenue, prevRevenue);

  // Active Products change
  const activeProducts =
    productPerformance.length || data?.activeProductsCount || 0;
  const activeProductsPrev = productPerformancePrev.length || 0;
  const prodChange = getPercentChange(activeProducts, activeProductsPrev);

  // HR calculations for components
  const thisHr = hrMetrics[0] || {};
  const prevHr = (() => {
    // If we're viewing current period, look in historical data for previous period
    if (isCurrentPeriod) {
      return (
        data.hrMetrics?.find((h) => +h.period === +(selectedPeriod - 1)) ?? {}
      );
    } else {
      // If we're viewing a historical period, look in historical data for the previous period
      return (
        data.hrMetrics?.find((h) => +h.period === +(selectedPeriod - 1)) ?? {}
      );
    }
  })();

  // Handle multiple property name variations for HR data
  type HRDataVariations = {
    totalEmployees?: number;
    total_employee_count?: number;
    employees?: number;
    newHires?: number;
    new_hires?: number;
    employeeSatisfaction?: number;
    employee_satisfaction?: number;
    satisfaction?: number;
    totalBudget?: number;
    total_budget?: number;
    roles?: HRRole[];
  };

  const thisHrTyped = thisHr as HRDataVariations;
  const prevHrTyped = prevHr as HRDataVariations;

  const totalEmployees =
    thisHrTyped?.totalEmployees ??
    thisHrTyped?.total_employee_count ??
    thisHrTyped?.employees ??
    thisHrTyped?.roles?.reduce(
      (sum: number, role: HRRole) => sum + (role.head_count || 0),
      0
    ) ??
    0;

  const prevTotalEmployees =
    prevHrTyped?.totalEmployees ??
    prevHrTyped?.total_employee_count ??
    prevHrTyped?.employees ??
    prevHrTyped?.roles?.reduce(
      (sum: number, role: HRRole) => sum + (role.head_count || 0),
      0
    ) ??
    0;

  const newHires = (() => {
    // First, check if newHires is already calculated in thisHr (for current period)
    if (thisHrTyped?.newHires !== undefined && thisHrTyped.newHires !== null) {
      return thisHrTyped.newHires;
    }

    // Check alternative property name
    if (
      thisHrTyped?.new_hires !== undefined &&
      thisHrTyped.new_hires !== null
    ) {
      return thisHrTyped.new_hires;
    }

    // If not available, calculate it from the difference
    return Math.max(0, totalEmployees - prevTotalEmployees);
  })();

  const prevNewHires = prevHrTyped?.newHires ?? prevHrTyped?.new_hires ?? 0;

  const avgSatisfaction =
    thisHrTyped?.employeeSatisfaction ??
    thisHrTyped?.employee_satisfaction ??
    thisHrTyped?.satisfaction ??
    0;

  const prevSatisfaction =
    prevHrTyped?.employeeSatisfaction ??
    prevHrTyped?.employee_satisfaction ??
    prevHrTyped?.satisfaction ??
    0;

  const hrBudget =
    thisHrTyped?.totalBudget ?? thisHrTyped?.total_budget ?? hr_budget;

  const hrBudgetPrev =
    prevHrTyped?.totalBudget ?? prevHrTyped?.total_budget ?? hr_budget;

  // Calculate dynamic trends
  const totalEmployeesChange = getPercentChange(
    totalEmployees,
    prevTotalEmployees
  );
  const newHiresChange = getPercentChange(newHires, prevNewHires);
  const avgSatisfactionChange = getPercentChange(
    avgSatisfaction,
    prevSatisfaction
  );
  const hrBudgetChange = getPercentChange(hrBudget, hrBudgetPrev);

  // Event handlers
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, action, step, type } = data;

    if (status === "finished" || status === "skipped") {
      setHighlightedSelector(null);
      setJoyrideRun(false);
      menuRef.current?.closeMenu();
      return;
    }

    // Highlighting logic
    if (action === "start" || action === "update") {
      if (typeof step.target === "string") {
        setHighlightedSelector(step.target);
      } else if (step.target instanceof HTMLElement) {
        const selector = step.target.className
          ? `.${step.target.className.split(" ").join(".")}`
          : "";
        setHighlightedSelector(selector || null);
      }
    }

    // Open hamburger menu for certain steps
    if (type === "step:before") {
      if (
        step?.target === ".export-dashboard-btn" ||
        step?.target === ".simulate-dashboard-btn"
      ) {
        menuRef.current?.openMenu();
      }
    }

    // Close hamburger menu after those steps
    if (type === "step:after") {
      if (
        step?.target === ".export-dashboard-btn" ||
        step?.target === ".simulate-dashboard-btn"
      ) {
        menuRef.current?.closeMenu();
      }
    }
  };

  const handleViewCompany = useCallback(() => {
    router.push(`/simulations/${simId}`);
  }, [router, simId]);

  const handleSimulate = useCallback(() => {
    router.push(`/simulate/${comID}`);
  }, [router, comID]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      clearAll();
      toast.info("Logout successful");

      setTimeout(() => {
        router.push("/login");
      }, 100);
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  const handlePeriodChange = (period: number) => {
    setSelectedPeriod(period);
  };

  const handleInfoClick = () => {
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Delay starting Joyride so scrolling finishes
    setTimeout(() => {
      setJoyrideRun(true);
    }, 500); // adjust delay if needed
  };

  const container = useRef<HTMLDivElement>(null);

  const capture = async () => {
    try {
      if (!container.current) {
        alert("Unable to capture: Dashboard container is not available");
        return;
      }

      await exportDashboard(container.current);
    } catch {
      // Optionally, you can log the error or show a toast here if needed
    }
  };

  // Effects
  useEffect(() => {
    setComId(comID || "");
    setPeriod(selectedPeriod);
  }, [comID, selectedPeriod, setComId, setPeriod]);

  useEffect(() => {
    const el =
      swapyRef.current ?? document.querySelector("[data-swapy-container]");
    if (!(el instanceof HTMLElement)) return;

    // create and store instance with drag events in config
    swapyInstanceRef.current = createSwapy(el, {
      animation: "dynamic",
      autoScrollOnDrag: true,
    });

    return () => {
      swapyInstanceRef.current?.destroy?.();
      swapyInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    swapyInstanceRef.current?.update?.();
  }, [selectedPeriod, data]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setCurrentUserId(user?.id);
      setCurrentUsername(user?.name);
    };
    fetchUser();
  }, []);

  // Run Joyride only if user hasn't seen it
  useEffect(() => {
    if (!currentUserId) return;

    const tourKey = `hasSeenHomePageTour_${currentUserId}`;
    const hasSeen = localStorage.getItem(tourKey);

    if (!hasSeen) {
      setJoyrideRun(true);
      localStorage.setItem(tourKey, "true");
    }
  }, [currentUserId]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Tooltip portal classes
      const tooltip = document.querySelector(".react-joyride__tooltip");
      const beacon = document.querySelector(".react-joyride__beacon");

      if (
        tooltip &&
        !tooltip.contains(event.target as Node) &&
        (!beacon || !beacon.contains(event.target as Node))
      ) {
        // Stop Joyride
        setJoyrideRun(false);
        // Remove highlights
        document.querySelectorAll(".joyride-highlight").forEach((el) => {
          el.classList.remove("joyride-highlight");
          (el as HTMLElement).style.border = ""; // remove border if added via style
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // remove previous highlights
    document.querySelectorAll(".joyride-highlight").forEach((el) => {
      el.classList.remove("joyride-highlight");
    });

    // highlight the current step target
    if (highlightedSelector) {
      const el = document.querySelector(highlightedSelector);
      if (el) el.classList.add("joyride-highlight");
    }
  }, [highlightedSelector]);

  return (
    <div ref={container}>
      {mounted && (
        <Joyride
          steps={steps}
          run={joyrideRun}
          continuous
          showSkipButton
          spotlightClicks
          disableOverlay
          scrollToFirstStep={false}
          disableScrolling
          styles={{
            tooltip: {
              width: "250px",
              padding: "10px 14px",
              fontSize: "14px",
              lineHeight: "1.4",
              zIndex: 10000,
              marginTop: "50px",
              transform: "translateY(30px)",
            },
            buttonClose: {
              width: 13,
              height: 13,
              padding: 0,
              lineHeight: "20px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "10px",
              marginRight: "10px",
            },
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              zIndex: 9999,
            },
            tooltipContainer: {
              textAlign: "center",
              marginTop: "20px",
            },
            tooltipContent: {
              padding: 0,
            },
            buttonNext: {
              padding: "4px 10px",
              fontSize: "13px",
            },
            buttonSkip: {
              fontSize: "12px",
            },
          }}
          callback={handleJoyrideCallback}
        />
      )}

      <div className="h-full bg-slate-800 text-white">
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
          .animate-slide-in-left { animation: slideInLeft 0.5s ease-out forwards; }
          .stagger-1 { animation-delay: 0.1s; }
          .stagger-2 { animation-delay: 0.2s; }
          .stagger-3 { animation-delay: 0.3s; }
          .stagger-4 { animation-delay: 0.4s; }
          .current-period-badge {
            background: linear-gradient(90deg, #10B981, #059669);
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 600;
            margin-left: 8px;
          }
          
          /* Special styles for screenshot capture */
          .capturing-screenshot {
            overflow: visible !important;
          }
          
          .capturing-screenshot * {
            animation: none !important;
            transition: none !important;
          }
          
          .capturing-screenshot svg {
            pointer-events: none;
            shape-rendering: geometricPrecision;
            text-rendering: geometricPrecision;
          }
          
          .capturing-screenshot .recharts-wrapper {
            overflow: visible !important;
          }
          
          .capturing-screenshot .recharts-surface {
            overflow: visible !important;
          }
          
          /* Info button styles */
          .info-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            background: #2563eb; /* Tailwind blue-600 */
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
            animation: pulse 2s infinite;
          }

          .info-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
          }
          
          @keyframes pulse {
            0% {
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 0 rgba(102, 126, 234, 0.7);
            }
            70% {
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 10px rgba(102, 126, 234, 0);
            }
            100% {
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 0 rgba(102, 126, 234, 0);
            }
          }
        `}</style>

        {/* Header */}
        <DashboardHeader
          data={data}
          periods={periods}
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
          currentUsername={currentUsername}
          menuRef={menuRef}
          isExporting={isExporting}
          isSimulating={isSimulating}
          onCapture={capture}
          onViewCompany={handleViewCompany}
          onSimulate={handleSimulate}
          onLogout={handleLogout}
        />

        <div
          className="details sm:max-w-small md:max-w-medium lg:max-w-large xl:max-w-xlarge mx-auto py-8 px-6 space-y-8"
          data-swapy-container
          ref={swapyRef}
        >
          {/* Key Metrics Cards */}
          <MetricsCards
            cashBalance={cash_balance}
            netWorth={netWorthNow}
            currentRevenue={currentRevenue}
            activeProducts={activeProducts}
            selectedPeriod={selectedPeriod}
            isCurrentPeriod={isCurrentPeriod}
            cashChange={cashChange}
            netWorthChange={netWorthChange}
            revenueChange={revenueChange}
            prodChange={prodChange}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue & Profit Chart */}
            <RevenueProfitChart
              chartData={chartData.revenue}
              periodsLength={periods.length}
              maxPeriod={Math.max(...periods)}
            />

            {/* Department Budget Chart */}
            <DepartmentBudgetChart
              chartData={chartData.departmentBudgets}
              isCurrentPeriod={isCurrentPeriod}
              selectedPeriod={selectedPeriod}
            />
          </div>

          {/* Department Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* HR Overview */}
            <HROverview
              totalEmployees={totalEmployees}
              newHires={newHires}
              avgSatisfaction={avgSatisfaction}
              hrBudget={hrBudget}
              totalEmployeesChange={totalEmployeesChange}
              newHiresChange={newHiresChange}
              avgSatisfactionChange={avgSatisfactionChange}
              hrBudgetChange={hrBudgetChange}
            />

            {/* Production Metrics */}
            <ProductionMetrics chartData={chartData.productionData} />

            {/* R&D Pipeline */}
            <RDPipeline
              activeProducts={activeProducts}
              rdDecision={rd_decision}
              rdBudget={rd_budget}
              selectedPeriod={selectedPeriod}
            />
          </div>

          {/* Sales Performance & Product Portfolio */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Trend */}
            <SalesTrend
              chartData={chartData.sales}
              periodsLength={periods.length}
            />

            {/* Product Performance */}
            <ProductPerformance
              chartData={chartData.productPerformance}
              selectedPeriod={selectedPeriod}
            />
          </div>
        </div>

        <button
          onClick={handleInfoClick}
          className="info-button"
          title="Take a guided tour"
          aria-label="Start guided tour"
        >
          <Info size={20} />
        </button>
      </div>
    </div>
  );
};

export default HomePage;
