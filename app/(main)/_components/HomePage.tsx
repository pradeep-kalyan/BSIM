"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  Play,
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
import DashboardCard from "@/ui/Card";
import QuickStat from "@/ui/QuickStat";
import ChartCard from "@/ui/ChartCard";
import { useRouter } from "next/navigation";
import { useSimulation } from "@/app/context/SimulationContext";
import LogoutBtn from "@/app/(auth)/_components/Logout";

// Tooltip and chart tooltip components (same as before)
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

interface PieTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      percentage: number;
    };
  }>;
}

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
      {label && <p className="font-medium mb-1 text-gray-200">{label}</p>}
      {payload.map((entry, index: number) => (
        <p key={index} className="text-gray-100">
          <span className="font-medium" style={{ color: entry.color }}>
            {entry.name}:
          </span>{" "}
          {typeof entry.value === "number"
            ? entry.value.toLocaleString()
            : entry.value}
        </p>
      ))}
    </div>
  );
};

const FinancialTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-gray-600">
        {label && <p className="font-medium mb-1 text-gray-200">{label}</p>}
        {payload.map((entry, index: number) => (
          <p key={index} className="text-gray-100">
            <span className="font-medium" style={{ color: entry.color }}>
              {entry.name}:
            </span>{" "}
            ₹{((entry.value as number) / 10000000).toFixed(2)} Cr
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
        <p className="font-medium text-gray-200">{payload[0].name}</p>
        <p className="text-gray-100">
          Value: ₹{((payload[0].value as number) / 10000000).toFixed(2)} Cr
        </p>
        <p className="text-gray-100">
          Percentage: {payload[0].payload.percentage}%
        </p>
      </div>
    );
  }
  return null;
};

interface CompanyHistoryType {
  id: string;
  company_id: string;
  period: number;
  cash_balance: number;
  data?: string;
  total_assets: number;
  total_liabilities: number;
  marketing_budget: number;
  credit_rating?: string | null;
  brand_value: number;
}

interface FinancialHistoryType {
  period: number;
  total_revenue?: number;
  revenue?: number;
  net_profit?: number;
  profit?: number;
  cash_balance?: number;
  operating_costs?: number;
  roi?: number;
  burn_rate?: number;
}

interface ProductPerformanceType {
  period: number;
  name?: string;
  product?: {
    name: string;
  };
  sales_volume?: number;
  market_share?: number;
  revenue?: number;
  profit?: number;
  customer_satisfaction?: number;
}

interface HRRole {
  role_name: string;
  salary_per_head: number;
  head_count: number;
}

interface HRMetricsType {
  period: number;
  department?: string;
  employees?: number;
  satisfaction?: number;
  newHires?: number;
  totalBudget?: number;
  total_budget?: number;
  employeeSatisfaction?: number;
  employee_satisfaction?: number;
  totalEmployees?: number;
  total_employee_count?: number;
  roles?: HRRole[];
}

interface ProductionDataType {
  id: string;
  company_id: string;
  period: number;
  units_to_produce: number;
  cost_per_unit: number;
  budget: number;
  production_capacity: number;
  storage_capacity: number | null;
  inventory_value: number;
  defect_rate: number;
  finalised: boolean;
  created_at: Date;
  updated_at: Date;
}

interface RDDataType {
  period: number;
  budget?: number;
  pip?: number;
  patented?: number;
  time_to_market?: number;
}

interface MarketingDataType {
  period: number;
  budget?: number;
}

interface HRDecisionType {
  total_budget?: number;
  totalBudget?: number;
  employee_satisfaction?: number;
  employeeSatisfaction?: number;
  total_employee_count?: number | null;
  roles?: HRRole[];
}

interface RDDecisionType {
  budget?: number;
  pip?: number;
  patented?: number;
  time_to_market?: number;
}

interface ProductionDecisionType {
  budget?: number;
  units_to_produce?: number;
  defect_rate?: number;
  production_capacity?: number;
}

interface MarketingDecisionType {
  budget?: number;
}

interface FinanceDecisionType {
  total_revenue?: number;
  net_profit?: number;
  cash_balance?: number;
  operating_costs?: number;
  roi?: number;
  burn_rate?: number;
}

interface DashboardData {
  company: {
    id: string;
    name: string;
    current_period: number;
    cash_balance: number;
    data?: string;
    total_assets: number;
    total_liabilities: number;
    marketing_budget: number;
    credit_rating?: string | null;
    brand_value: number;
  };
  history: CompanyHistoryType[];
  financialHistory: FinancialHistoryType[];
  productPerformance: ProductPerformanceType[];
  hrMetrics: HRMetricsType[];
  productionData: ProductionDataType[];
  rdData: RDDataType[]; // Array of all R&D decisions
  marketingData: MarketingDataType[]; // Array of all marketing decisions
  hr_decision: HRDecisionType | null;
  rd_decision: RDDecisionType | null;
  production_decision: ProductionDecisionType | null;
  marketing_decision: MarketingDecisionType | null;
  finance_decision: FinanceDecisionType | null;
  activeProductsCount: number;
}

const getPercentChange = (current: number, prev: number) => {
  if (prev === 0 || prev === undefined || prev === null) return undefined;
  return +(((current - prev) / prev) * 100).toFixed(1);
};

const HomePage = ({ data, comID }: { data: DashboardData; comID: string }) => {
  const { setComId, setPeriod, simId } = useSimulation();
  const router = useRouter();

  // Helper function to create current period data from company object
  const createCurrentPeriodData = () => {
    const currentPeriod = data?.company?.current_period || 1;

    // Create current period company history entry
    const currentCompanyData = {
      id: `current-${currentPeriod}`,
      company_id: data?.company?.id || "",
      period: currentPeriod,
      cash_balance: data?.company?.cash_balance || 0,
      data: data?.company?.data || "{}",
      total_assets: data?.company?.total_assets || 0,
      total_liabilities: data?.company?.total_liabilities || 0,
      marketing_budget: data?.company?.marketing_budget || 0,
      credit_rating: data?.company?.credit_rating || null,
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
  const production_budget = production_decision?.budget || 0;
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

    return series;
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

    return series;
  }, [data.productPerformance, periods]);

  const chartData = {
    revenue: revenueSeries,
    sales: salesSeries,
    departmentBudgets,
    productPerformance: productPerformance.length ? productPerformance : [],
    hrMetrics: hrMetrics.length
      ? hrMetrics
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

  // Change event: update selected period
  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(Number(e.target.value));
  };
  
  const handleViewCompany = useCallback(() => {
    router.push(`/simulations/${simId}`);
  }, [router, simId]);

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

  return (
    <div className="min-h-screen bg-slate-900 text-white">
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
      `}</style>
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#334155] shadow-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Left side: company info */}
            <div className="animate-slide-in-left">
              <h1 className="text-4xl font-bold mb-2">{data?.company?.name}</h1>
              <p className="text-blue-100 text-lg">Business Simulation Dashboard</p>
              <div className="flex items-center mt-3 space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span className="text-sm">Period:</span>
                  <select
                    className="ml-2 px-2 py-1 rounded bg-slate-800 text-white border border-slate-600 focus:outline-none"
                    value={selectedPeriod}
                    onChange={handlePeriodChange}
                  >
                    {periods.map((p, index) => (
                      <option key={`period-${p}-${index}`} value={p}>
                        Period {p}{" "}
                        {p === data?.company?.current_period ? "(Current)" : ""}
                      </option>
                    ))}
                  </select>
                  {isCurrentPeriod && (
                    <span className="current-period-badge">LIVE</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right side: buttons */}
            <div className="flex gap-3 items-center animate-fade-in-up">
              <button
                onClick={handleViewCompany}
                className="bg-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 min-w-[180px]"
              >
                Back to Companies
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="bg-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {isSimulating ? "Simulating..." : "Simulate"}
                  <Play size={20} />
                </button>
                <LogoutBtn />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
          <DashboardCard
            title="Cash Balance"
            value={`₹${(cash_balance / 10000000).toFixed(2)} Cr`}
            subtitle="Available Funds"
            icon={DollarSign}
            change={cashChange}
            className="stagger-2"
          />
          <DashboardCard
            title="Net Worth"
            value={`₹${(netWorthNow / 10000000).toFixed(2)} Cr`}
            subtitle="Assets - Liabilities"
            icon={TrendingUp}
            change={netWorthChange}
            className="stagger-2"
          />
          <DashboardCard
            title="Total Revenue"
            value={`₹${((currentRevenue ?? 0) / 10000000).toFixed(2)} Cr`}
            subtitle={`Period ${selectedPeriod}${isCurrentPeriod ? " (Current)" : ""
              }`}
            icon={BarChart3}
            change={revenueChange}
            className="stagger-3"
          />
          <DashboardCard
            title="Active Products"
            value={activeProducts}
            subtitle="In Market"
            icon={Package}
            change={prodChange}
            className="stagger-4"
          />
        </div>

        {/* Revenue & Financial Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartCard
            title="Revenue & Profit Trend"
            subtitle={`Last ${periods.length} periods (up to Period ${Math.max(
              ...periods
            )})`}
            className="lg:col-span-2"
          >
            <ResponsiveContainer width="100%" height={450}>
              <AreaChart data={chartData.revenue}>
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient
                    id="profitGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
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

          <ChartCard
            title="Department Budgets"
            subtitle={`${isCurrentPeriod ? "Current" : `Period ${selectedPeriod}`
              } allocation`}
          >
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={chartData.departmentBudgets}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={120}
                  dataKey="value"
                >
                  {chartData.departmentBudgets.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} isAnimationActive={false} />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-1 gap-2 mt-4">
              {chartData.departmentBudgets.map((dept) => (
                <div
                  key={dept.name}
                  className="flex items-center justify-between p-2 rounded bg-white/5"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: dept.color }}
                    />
                    <span className="text-sm text-gray-300">{dept.name}</span>
                  </div>
                  <span className="text-sm font-medium text-white">
                    {dept.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Department Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <ChartCard title="HR Overview" className="lg:col-span-1">
            <div className="space-y-4">
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
                value={`₹${(hrBudget / 10000000).toFixed(2)} Cr`}
                icon={Briefcase}
                color="purple"
                trend={hrBudgetChange}
              />
            </div>
          </ChartCard>

          <ChartCard title="Production Metrics" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={450}>
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

          <ChartCard title="R&D Pipeline" className="lg:col-span-1">
            <div className="space-y-4">
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

        {/* Sales Performance & Product Portfolio */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartCard
            title="Total Sales Trend"
            subtitle={`Sales volume over last ${periods.length} periods`}
            className="lg:col-span-2"
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
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient
                    id="salesRevenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1} />
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
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || !payload.length) return null;
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
                              : `₹${((entry.value as number) / 1000).toFixed(
                                0
                              )}K`}
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
                      key={`${product.product?.name || product.name}-${index}`}
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
  );
};

export default HomePage;
