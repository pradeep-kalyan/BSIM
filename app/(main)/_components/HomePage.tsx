"use client";
import React, { useEffect, useState, useCallback } from "react";
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
import { DashboardData } from "../homepage/[companyID]/types";
import DashboardCard from "@/ui/Card";
import QuickStat from "@/ui/QuickStat";
import ChartCard from "@/ui/ChartCard";
import { useRouter } from "next/navigation";
import { useSimulation } from "@/app/context/SimulationContext";

// Tooltip types
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

// Move CustomTooltip outside component to prevent recreation on every render
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

// Specialized tooltip for financial data
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
            ${((entry.value as number) / 1000).toFixed(0)}K
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Specialized tooltip for pie charts
const PieTooltip = ({ active, payload }: PieTooltipProps) => {
  if (active && payload && payload.length && payload[0].value != null) {
    return (
      <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-gray-600">
        <p className="font-medium text-gray-200">{payload[0].name}</p>
        <p className="text-gray-100">
          Value: ${((payload[0].value as number) / 1000).toFixed(0)}K
        </p>
        <p className="text-gray-100">
          Percentage: {payload[0].payload.percentage}%
        </p>
      </div>
    );
  }
  return null;
};

const HomePage = ({ data, comID }: { data: DashboardData; comID: string }) => {
  const { setComId, setPeriod } = useSimulation();
  useEffect(() => {
    setComId(comID || "");
    setPeriod(data?.company?.current_period || 1);
  }, [comID, data?.company?.current_period, setComId, setPeriod]);
  const [currentPeriod] = useState(data?.company?.current_period || 1);
  const [isSimulating] = useState(false);
  const [, setHoveringBar] = useState(false);

  const hr_budget = data?.hr_decision?.total_budget || 0;
  const rd_budget = data?.rd_decision?.budget || 0;
  const production_budget = data?.production_decision?.budget || 0;
  const marketing_budget = data?.marketing_decision?.budget || 0;

  const departmentBudgets = [
    { name: "R&D", value: rd_budget, color: "#3B82F6", percentage: 28 },
    {
      name: "Production",
      value: production_budget,
      color: "#10B981",
      percentage: 40,
    },
    {
      name: "Marketing",
      value: marketing_budget,
      color: "#F59E0B",
      percentage: 22,
    },
    { name: "HR", value: hr_budget, color: "#EF4444", percentage: 10 },
  ];

  // Use real data instead of mock data
  const chartData = {
    revenue:
      data.financialHistory.length > 0
        ? data.financialHistory
        : [{ period: `P${currentPeriod}`, revenue: 0, profit: 0, costs: 0 }],
    departmentBudgets,
    productPerformance: data.productPerformance,
    hrMetrics:
      data.hrMetrics.length > 0
        ? data.hrMetrics
        : [
            {
              department: "No Data",
              employees: 0,
              satisfaction: 0,
              newHires: 0,
            },
          ],
    productionData:
      data.productionData.length > 0
        ? data.productionData
        : [{ month: "Current", produced: 0, defects: 0, efficiency: 0 }],
  };

  const router = useRouter();
  const handleSimulate = useCallback(() => {
    router.push(`/simulate/${comID}`);
  }, [router, comID]);

  const handleBarMouseOver = useCallback(() => {
    setHoveringBar(true);
  }, []);

  const handleBarMouseOut = useCallback(() => {
    setHoveringBar(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* CSS for animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.5s ease-out forwards;
        }
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
      `}</style>

      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#334155] shadow-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="animate-slide-in-left">
              <h1 className="text-4xl font-bold mb-2">{data?.company?.name}</h1>
              <p className="text-blue-100 text-lg">
                Business Simulation Dashboard
              </p>
              <div className="flex items-center mt-3 space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span className="text-sm">
                    Current Period: {data?.company?.current_period}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right animate-fade-in-up">
              {/* <div className="mb-4">
                <div className="text-3xl font-bold">Period {currentPeriod}</div>
              </div> */}
              <div className="flex gap-3">
                <button
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="bg-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {isSimulating ? "Simulating..." : "Simulate"}
                  <Play size={20} />
                </button>
                {/* <button
                  onClick={handleAdvance}
                  disabled={isPending}
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 disabled:opacity-50 transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {isPending ? "Processing..." : "Advance to Next Period"}
                  <ChevronRight size={20} />
                </button> */}
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
            value={`₹${((data?.company?.cash_balance ?? 0) / 100000).toFixed(
              1
            )}L`}
            subtitle="Available Funds"
            icon={DollarSign}
            change={currentPeriod > 1 ? 12.5 : undefined}
            className="stagger-2"
          />

          <DashboardCard
            title="Net Worth"
            value={`₹${(
              ((data?.company?.total_assets || 8750000) -
                (data?.company?.total_liabilities || 3200000)) /
              100000
            ).toFixed(1)}L`}
            subtitle="Assets - Liabilities"
            icon={TrendingUp}
            change={currentPeriod > 1 ? 8.3 : undefined}
            className="stagger-2"
          />
          <DashboardCard
            title="Total Revenue"
            value={`₹${(
              (data.financialHistory.length > 0
                ? data.financialHistory[data.financialHistory.length - 1]
                    ?.revenue || 0
                : 0) / 100000
            ).toFixed(1)}L`}
            subtitle="Current Period"
            icon={BarChart3}
            change={currentPeriod > 1 ? 15.2 : undefined}
            className="stagger-3"
          />
          <DashboardCard
            title="Active Products"
            value={data?.activeProductsCount}
            subtitle="In Market"
            icon={Package}
            change={currentPeriod > 1 ? 0 : undefined}
            className="stagger-4"
          />
        </div>

        {/* Revenue & Financial Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartCard
            title="Revenue & Profit Trend"
            subtitle="Last 5 periods"
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
                  tickFormatter={(value) => `$${value / 1000}K`}
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

          <ChartCard title="Department Budgets" subtitle="Current allocation">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={chartData.departmentBudgets}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={120}
                  paddingAngle={5}
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
                    ></div>
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
                value={chartData.hrMetrics
                  .reduce((sum, dept) => sum + dept.employees, 0)
                  .toString()}
                icon={Users}
                color="blue"
                trend={currentPeriod > 1 ? 8.3 : undefined}
              />
              <QuickStat
                label="New Hires"
                value={chartData.hrMetrics
                  .reduce((sum, dept) => sum + dept.newHires, 0)
                  .toString()}
                icon={Plus}
                color="green"
                trend={currentPeriod > 1 ? 15 : undefined}
              />
              <QuickStat
                label="Avg Satisfaction"
                value={
                  chartData.hrMetrics.length > 0
                    ? (
                        chartData.hrMetrics.reduce(
                          (sum, dept) => sum + dept.satisfaction,
                          0
                        ) / chartData.hrMetrics.length
                      ).toFixed(1)
                    : "0"
                }
                icon={Award}
                color="yellow"
                trend={currentPeriod > 1 ? 5 : undefined}
              />
              <QuickStat
                label="HR Budget"
                value={`₹${(hr_budget / 1000).toFixed(0)}K`}
                icon={Briefcase}
                color="purple"
                trend={currentPeriod > 1 ? -2 : undefined}
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
                value={data?.rd_decision?.pip?.toString() || "0"}
                icon={Lightbulb}
                color="yellow"
                trend={currentPeriod > 1 ? 12 : undefined}
              />
              <QuickStat
                label="Patents Filed"
                value={data?.rd_decision?.patented?.toString() || "0"}
                icon={Award}
                color="purple"
                trend={currentPeriod > 1 ? 50 : undefined}
              />
              <QuickStat
                label="R&D Budget"
                value={`₹${(rd_budget / 1000).toFixed(0)}K`}
                icon={Factory}
                color="blue"
                trend={currentPeriod > 1 ? -5 : undefined}
              />
              <QuickStat
                label="Time to Market"
                value={`${data?.rd_decision?.time_to_market || 0} mo`}
                icon={Target}
                color="green"
                trend={currentPeriod > 1 ? -15 : undefined}
              />
            </div>
          </ChartCard>
        </div>

        {/* Product Performance */}
        <ChartCard
          title="Product Portfolio Performance"
          subtitle="Current period metrics"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Sales Performance – Period {currentPeriod}
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={chartData.productPerformance}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    type="number"
                    tick={{ fill: "#6B7280" }}
                    stroke="#9CA3AF"
                    domain={[0, "dataMax + 200"]}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fill: "#6B7280" }}
                    stroke="#9CA3AF"
                    width={150}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "transparent" }}
                    isAnimationActive={false}
                  />
                  <Bar
                    dataKey="sales"
                    fill="#3B82F6"
                    radius={[0, 6, 6, 0]}
                    barSize={20}
                    onMouseOver={handleBarMouseOver}
                    onMouseOut={handleBarMouseOut}
                    name="Sales"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Market Share
              </h4>
              <div className="space-y-4">
                {chartData.productPerformance.length > 0 ? (
                  chartData.productPerformance.map((product) => (
                    <div
                      key={product.name}
                      className="p-4 rounded-lg bg-white/5"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-white">
                          {product.name}
                        </span>
                        <span className="text-sm text-gray-400">
                          {product.marketShare}% market share
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(product.marketShare * 2, 100)}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>
                          Revenue: ₹{(product.revenue / 1000).toFixed(0)}K
                        </span>
                        <span>Rating: {product.satisfaction}/5.0</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-lg bg-white/5 text-center">
                    <span className="text-gray-400">
                      No product performance data available
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default HomePage;
