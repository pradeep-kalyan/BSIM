"use client";
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { createSwapy } from "swapy";
import {
  DollarSign,
  TrendingUp,
  Users,
  Package,
  Target,
  BarChart3,
  Briefcase,
  Plus,
  Factory,
  Lightbulb,
  Calendar,
  Award,
  // Play,
  Info,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DashboardCard from "@/app/ui/Card";
import QuickStat from "@/app/ui/QuickStat";
import ChartCard from "@/app/ui/ChartCard";
import { useRouter } from "next/navigation";
import { useSimulation } from "@/app/context/SimulationContext";
import HamburgerMenu from './HamburgerMenu';
// import LogoutBtn from "@/app/components/auth/Logout";
import formatCurrency from "@/app/functions/formatCurrency";
import { useExport } from "@/app/hooks/useExport";
import Image from "next/image";
import {
  CompanyHistoryType,
  DashboardData,
  PieTooltipProps,
  TooltipProps,
  HRRole,
} from "@/app/types/homepage";
import { ButtonStack } from "@/app/ui/StackBtn";
import { getCurrentUser } from "@/app/functions/jwt";
import Joyride, { CallBackProps } from "react-joyride";
import { toast } from "react-toastify";
import { logoutUser } from "@/app/_actions/auth";

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (
    !active ||
    !payload ||
    !payload.length ||
    payload.every((entry) => entry.value === 0 || entry.value == null)
  ) {
    return null;
  }
  return (
    <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-gray-600">
      {label && (
        <p className="font-medium mb-1 text-gray-200">{String(label)}</p>
      )}
      {payload.map((entry, index: number) => (
        <p key={index} className="text-gray-100">
          <span
            className="font-medium"
            style={{ color: entry.color || "#fff" }}
          >
            {entry.name || "Unknown"}:
          </span>{" "}
          {typeof entry.value === "number"
            ? entry.value.toLocaleString()
            : String(entry.value || "0")}
        </p>
      ))}
    </div>
  );
};

const FinancialTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-gray-600">
        {label && (
          <p className="font-medium mb-1 text-gray-200">{String(label)}</p>
        )}
        {payload.map((entry, index: number) => (
          <p key={index} className="text-gray-100">
            <span
              className="font-medium"
              style={{ color: entry.color || "#fff" }}
            >
              {entry.name || "Unknown"}:
            </span>{" "}
            ₹{(((entry.value as number) || 0) / 10000000).toFixed(2)} Cr
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }: PieTooltipProps) => {
  if (active && payload && payload.length && payload[0].value != null) {
    return (
      <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-gray-600">
        <p className="font-medium text-gray-200">
          {String(payload[0].name || "Unknown")}
        </p>
        <p className="text-gray-100">
          Value: ₹{(((payload[0].value as number) || 0) / 10000000).toFixed(2)}{" "}
          Cr
        </p>
        <p className="text-gray-100">
          Percentage: {payload[0].payload?.percentage || 0}%
        </p>
      </div>
    );
  }
  return null;
};

const getPercentChange = (current: number, prev: number) => {
  if (prev === 0 || prev === undefined || prev === null) return undefined;
  return +(((current - prev) / prev) * 100).toFixed(1);
};

const HomePage = ({ data, comID }: { data: DashboardData; comID: string }) => {
  const { setComId, setPeriod, simId } = useSimulation();
  const router = useRouter();
  const { exportDashboard, isExporting } = useExport();
  const swapyRef = useRef<HTMLDivElement | null>(null);
  const swapyInstanceRef = useRef<ReturnType<typeof createSwapy> | null>(null);
  const [joyrideRun, setJoyrideRun] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();
  const steps = [
    {
      target: ".details",
      content:
        "Customize your dashboard layout by dragging and arranging the sections.",
      disableBeacon: true,
    },
    {
      target: ".export-dashboard-btn",
      content: "Click here to download your dashboard as an image.",
      disableBeacon: true,
    },
    {
      target: ".simulate-dashboard-btn",
      content: "Run a simulation to preview how your strategies will perform.",
      disableBeacon: true,
    },
  ];
  const [highlightedSelector, setHighlightedSelector] = useState<string | null>(
    null
  );

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, action, step } = data;

    if (status === "finished" || status === "skipped") {
      setHighlightedSelector(null);
      setJoyrideRun(false);
      return;
    }

    if (action === "start" || action === "update") {
      if (typeof step.target === "string") {
        setHighlightedSelector(step.target);
      } else if (step.target instanceof HTMLElement) {
        // Convert the element to a selector if possible
        const selector = step.target.className
          ? `.${step.target.className.split(" ").join(".")}`
          : "";
        setHighlightedSelector(selector || null);
      }
    }
  };

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
  const isValidImageUrl = (url?: string) => {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      return /\.(jpeg|jpg|png|gif|webp|svg)$/i.test(parsed.pathname);
    } catch {
      return false;
    }
  };
  const CompanyLogo = ({
    logoUrl,
    companyName,
  }: {
    logoUrl?: string;
    companyName: string;
  }) => {
    const [imageError, setImageError] = useState(false);

    const showFallback = imageError || !isValidImageUrl(logoUrl);

    const initials = companyName
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return (
      <div className="w-28  h-28 rounded-full overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center text-white text-4xl font-bold">
        {showFallback ? (
          <span>{initials}</span>
        ) : (
          <Image
            src={logoUrl!}
            alt="Company Logo"
            className="object-cover w-full h-full"
            width={128}
            height={128}
            onError={() => setImageError(true)}
          />
        )}
      </div>
    );
  };
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
  const [isSimulating] = useState(false);

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
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const handleInfoClick = () => {
    setJoyrideRun(true);
  };
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

  const chartData = {
    revenue: revenueSeries.filter((item) => item && item.period != null),
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
      ? productionData.filter((data) => data && typeof data.period === "number")
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
  const handleViewCompany = useCallback(() => {
    router.push(`/simulations/${simId}`);
  }, [router, simId]);
  // Change event: update selected period
  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(Number(e.target.value));
  };

  // Simulate button
  const handleSimulate = useCallback(() => {
    router.push(`/simulate/${comID}`);
  }, [router, comID]);

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
  const container = useRef<HTMLDivElement>(null);

  const capture = async () => {
    try {
      if (!container.current) {
        alert("Unable to capture: Dashboard container is not available");
        return;
      }

      await exportDashboard(container.current);
    } catch (error) {
      let errorMessage = "Dashboard export failed. ";
      if (error instanceof Error) {
        errorMessage += error.message;
      } else {
        errorMessage += "Unknown error occurred.";
      }

      alert(errorMessage + " Please check the console for more details.");
    }
  };

  const { clearAll } = useSimulation();

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
            },
            buttonClose: {
              // fixed from buttonClose to tooltipClose
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
            tooltipContainer: {
              textAlign: "center",
              marginTop: "16px",
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
        {/* Fixed Header */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#334155] shadow-2xl sticky top-0 z-50 w-full">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center gap-8">
              {/* LEFT: Company info */}
              <div className="flex items-center gap-4 animate-slide-in-left min-w-0 flex-1">
                {/* Company Logo */}
                <div className="flex-shrink-0">
                  <CompanyLogo
                    logoUrl={data?.company?.logo_url ?? undefined}
                    companyName={data?.company?.name || "Company"}
                  />
                </div>

                {/* Company Details */}
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl font-bold text-white truncate">
                    {data?.company?.name || "Company Dashboard"}
                  </h1>

                  {/* Period Selector */}
                  <div className="flex items-center mt-2 space-x-2">
                    <Calendar
                      size={16}
                      className="text-gray-300 flex-shrink-0"
                    />
                    <span className="text-sm text-gray-300 whitespace-nowrap">
                      Period:
                    </span>
                    <select
                      className="px-3 py-1 rounded-md bg-slate-800 text-white border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-[120px]"
                      value={selectedPeriod}
                      onChange={handlePeriodChange}
                    >
                      {periods.map((p, index) => (
                        <option key={`period-${p}-${index}`} value={p}>
                          Period {p}{" "}
                          {p === data?.company?.current_period
                            ? "(Current)"
                            : ""}
                        </option>
                      ))}
                    </select>
                    {isCurrentPeriod && (
                      <span className="current-period-badge whitespace-nowrap">
                        LIVE
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <ButtonStack
                isExporting={isExporting}
                isSimulating={isSimulating}
                capture={capture}
                handleViewCompany={handleViewCompany}
                handleSimulate={handleSimulate}
              />

              {/* <div className="flex items-center gap-3 animate-fade-in-up flex-shrink-0">
                <button
                  onClick={capture}
                  disabled={isExporting}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm whitespace-nowrap min-w-[140px] justify-center"
                  title="Export dashboard as image"
                >
                  {isExporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Export
                    </>
                  )}
                </button>

                <button
                  onClick={handleViewCompany}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm whitespace-nowrap min-w-[140px] justify-center"
                  title="Back to companies list"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to Companies
                </button>

                <button
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm whitespace-nowrap min-w-[140px] justify-center"
                  title="Start simulation"
                >
                  {isSimulating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Simulating...
                    </>
                  ) : (
                    <>
                      <Play size={16} />
                      Simulate
                    </>
                  )}
                </button>

                <LogoutBtn />
              </div> */}
              {/* <HamburgerMenu
                isExporting={isExporting}
                isSimulating={isSimulating}
                capture={capture}
                handleViewCompany={handleViewCompany}
                handleSimulate={handleSimulate}
                onLogout={() => {
                  handleLogout();
                }}
              /> */}
            </div>
          </div>
        </div>

        <div
          className="details container mx-auto px-6 py-8 space-y-8"
          data-swapy-container
          ref={swapyRef}
        >
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
            <div data-swapy-slot="slot-1">
              <div data-swapy-item="item-cash">
                <DashboardCard
                  title="Cash Balance"
                  value={formatCurrency(cash_balance)}
                  subtitle="Available Funds"
                  icon={DollarSign}
                  iconColor="text-green-400"
                  change={cashChange}
                  className="stagger-2"
                />
              </div>
            </div>

            <div data-swapy-slot="slot-2">
              <div data-swapy-item="item-networth">
                <DashboardCard
                  title="Net Worth"
                  value={formatCurrency(netWorthNow)}
                  subtitle="Assets - Liabilities"
                  icon={TrendingUp}
                  iconColor="text-emerald-400"
                  change={netWorthChange}
                  className="stagger-2"
                />
              </div>
            </div>
            <div data-swapy-slot="slot-3">
              <div data-swapy-item="currentRevenue">
                <DashboardCard
                  title="Total Revenue"
                  value={formatCurrency(currentRevenue ?? 0)}
                  subtitle={`Period ${selectedPeriod}${isCurrentPeriod ? " (Current)" : ""
                    }`}
                  icon={BarChart3}
                  iconColor="text-blue-400"
                  change={revenueChange}
                  className="stagger-3"
                />
              </div>
            </div>
            <div data-swapy-slot="slot-4">
              <div data-swapy-item="activeProducts">
                <DashboardCard
                  title="Active Products"
                  value={activeProducts}
                  subtitle="In Market"
                  icon={Package}
                  iconColor="text-yellow-400"
                  change={prodChange}
                  className="stagger-4"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div data-swapy-slot="slot-revenue" className="lg:col-span-2">
              <div data-swapy-item="item-revenue">
                <ChartCard
                  title="Revenue & Profit Trend"
                  subtitle={`Last ${periods.length
                    } periods (up to Period ${Math.max(...periods)})`}
                  className="lg:col-span-2"
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData.revenue}>
                      <defs>
                        <linearGradient
                          id="revenueGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3B82F6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3B82F6"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="profitGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10B981"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10B981"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="period" stroke="#9CA3AF" />
                      <YAxis
                        stroke="#9CA3AF"
                        tickFormatter={(value) =>
                          `₹${(value / 10000000).toFixed(1)} Cr`
                        }
                      />
                      <Tooltip
                        content={<FinancialTooltip />}
                        isAnimationActive={false}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#revenueGradient)"
                        name="Revenue"
                      />
                      <Area
                        type="monotone"
                        dataKey="profit"
                        stroke="#10B981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#profitGradient)"
                        name="Profit"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </div>

            <div data-swapy-slot="slot-department-budgets">
              <div data-swapy-item="item-department-budgets">
                <ChartCard
                  title="Department Budgets"
                  subtitle={`${isCurrentPeriod ? "Current" : `Period ${selectedPeriod}`
                    } allocation`}
                >
                  <ResponsiveContainer width="100%" height={200} >
                    <RechartsPieChart>
                      <Pie
                        data={chartData.departmentBudgets}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {chartData.departmentBudgets.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={<PieTooltip />}
                        isAnimationActive={false}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {chartData.departmentBudgets.map((dept) => (
                      <div
                        key={dept.name}
                        className="flex items-center justify-around p-2 rounded bg-white/5"
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: dept.color }}
                          />
                          <span className="text-sm text-gray-300">
                            {dept.name}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-white">
                          {dept.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </ChartCard>
              </div>
            </div>
          </div>

          {/* Department Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div data-swapy-slot="slot-hr-overview" className="lg:col-span-1">
              <div data-swapy-item="item-hr-overview">
                <ChartCard title="HR Overview">
                  <div className="space-y-3">
                    <QuickStat
                      label="Total Employees"
                      value={totalEmployees.toString()}
                      icon={Users}
                      color="blue"
                      trend={totalEmployeesChange}
                    />
                    <QuickStat
                      label="New Hires"
                      value={newHires.toString()}
                      icon={Plus}
                      color="green"
                      trend={newHiresChange}
                    />
                    <QuickStat
                      label="Avg Satisfaction"
                      value={avgSatisfaction.toFixed(1)}
                      icon={Award}
                      color="yellow"
                      trend={avgSatisfactionChange}
                    />
                    <QuickStat
                      label="HR Budget"
                      value={`${formatCurrency(hrBudget)}`}
                      icon={Briefcase}
                      color="purple"
                      trend={hrBudgetChange}
                    />
                  </div>
                </ChartCard>
              </div>
            </div>

            <div
              data-swapy-slot="slot-production-metrics"
              className="lg:col-span-1"
            >
              <div data-swapy-item="item-production-metrics">
                <ChartCard title="Production Metrics">
                  <ResponsiveContainer width="100%" height={455}>
                    <BarChart data={chartData.productionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: "transparent" }}
                        isAnimationActive={false}
                      />
                      <Bar
                        dataKey="produced"
                        fill="#3B82F6"
                        name="Units Produced"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="defects"
                        fill="#EF4444"
                        name="Defects"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </div>

            <div data-swapy-slot="slot-rd-pipeline" className="lg:col-span-1">
              <div data-swapy-item="item-rd-pipeline">
                <ChartCard title="R&D Pipeline">
                  <div className="space-y-3">
                    <QuickStat
                      label="Active Projects"
                      value={activeProducts || "0"}
                      icon={Lightbulb}
                      color="yellow"
                      trend={selectedPeriod > 1 ? 12 : undefined}
                    />
                    <QuickStat
                      label="Patents Filed"
                      value={rd_decision?.patented || "0"}
                      icon={Award}
                      color="purple"
                      trend={selectedPeriod > 1 ? 50 : undefined}
                    />
                    <QuickStat
                      label="R&D Budget"
                      value={`₹${(rd_budget / 10000000).toFixed(2)} Cr`}
                      icon={Factory}
                      color="blue"
                      trend={selectedPeriod > 1 ? -5 : undefined}
                    />
                    <QuickStat
                      label="Time to Market"
                      value={`${rd_decision?.time_to_market || 0} mo`}
                      icon={Target}
                      color="green"
                      trend={selectedPeriod > 1 ? -15 : undefined}
                    />
                  </div>
                </ChartCard>
              </div>
            </div>
          </div>

          {/* Sales Performance & Product Portfolio */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div
              data-swapy-slot="slot-total-sales-trend"
              className="lg:col-span-2"
            >
              <div data-swapy-item="item-total-sales-trend">
                <ChartCard
                  title="Total Sales Trend"
                  subtitle={`Sales volume over last ${periods.length} periods`}
                >
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={chartData.sales}>
                      <defs>
                        <linearGradient
                          id="salesGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8B5CF6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8B5CF6"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="salesRevenueGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#F59E0B"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#F59E0B"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="period" stroke="#9CA3AF" />
                      <YAxis
                        stroke="#9CA3AF"
                        yAxisId="left"
                        tickFormatter={(value) => `${value} units`}
                      />
                      <YAxis
                        stroke="#9CA3AF"
                        yAxisId="right"
                        orientation="right"
                        tickFormatter={(value) =>
                          `₹${(value / 1000).toFixed(0)}K`
                        }
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (!active || !payload || !payload.length)
                            return null;
                          return (
                            <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-gray-600">
                              {label && (
                                <p className="font-medium mb-1 text-gray-200">
                                  Period {label}
                                </p>
                              )}
                              {payload.map((entry, index) => (
                                <p key={index} className="text-gray-100">
                                  <span
                                    className="font-medium"
                                    style={{ color: entry.color }}
                                  >
                                    {entry.name}:
                                  </span>{" "}
                                  {entry.dataKey === "totalSales"
                                    ? `${entry.value} units`
                                    : `₹${(
                                      (entry.value as number) / 1000
                                    ).toFixed(0)}K`}
                                </p>
                              ))}
                            </div>
                          );
                        }}
                        isAnimationActive={false}
                      />
                      <Area
                        type="monotone"
                        dataKey="totalSales"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#salesGradient)"
                        name="Sales Volume"
                        yAxisId="left"
                      />
                      <Area
                        type="monotone"
                        dataKey="salesRevenue"
                        stroke="#F59E0B"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#salesRevenueGradient)"
                        name="Sales Revenue"
                        yAxisId="right"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </div>

            <div
              data-swapy-slot="slot-product-performance"
              className="lg:col-span-1"
            >
              <div data-swapy-item="item-product-performance">
                <ChartCard
                  title="Product Performance"
                  subtitle={`Period ${selectedPeriod} overview`}
                >
                  <div className="space-y-3">
                    {chartData.productPerformance.length > 0 ? (
                      chartData.productPerformance
                        .slice(0, 4)
                        .map((product, index) => (
                          <div
                            key={`${product.product?.name || product.name
                              }-${index}`}
                            className="p-3 rounded-lg bg-white/5"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-white text-sm">
                                {product.product?.name ||
                                  product.name ||
                                  `Product ${index + 1}`}
                              </span>
                              <span className="text-xs text-gray-400">
                                {product.market_share || 0}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-1.5 mb-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    (product.market_share || 0) * 2,
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>{product.sales_volume || 0} units</span>
                              <span>
                                ₹{((product.revenue || 0) / 1000).toFixed(0)}K
                              </span>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="p-4 rounded-lg bg-white/5 text-center">
                        <span className="text-gray-400 text-sm">
                          No products for Period {selectedPeriod}
                        </span>
                      </div>
                    )}
                  </div>
                </ChartCard>
              </div>
            </div>
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
