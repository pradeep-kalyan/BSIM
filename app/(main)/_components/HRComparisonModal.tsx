/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Award,
  Building2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import formatCurrency from "@/app/functions/formatCurrency";
interface ExistingRole {
  role_name: string;
  salary_per_head: number;
  current_head_count: number;
  hires: number;
  fires: number;
}

interface NewRole {
  role_name: string;
  salary_per_head: number;
  hires: number;
}

interface CompanyData {
  id: string;
  name: string;
  current_period: number;
  cash_balance: number;
}

interface ComparisonData {
  previous: {
    totalBudget: number;
    salaryBudget: number;
    trainingBudget: number;
    employeeSatisfaction: number;
    totalEmployees: number;
    totalHires: number;
    totalFires: number;
    roles: Array<{
      role_name: string;
      salary_per_head: number;
      head_count: number;
    }>;
  };
  current: {
    totalBudget: number;
    salaryBudget: number;
    trainingBudget: number;
    employeeSatisfaction: number;
    totalEmployees: number;
    totalHires: number;
    totalFires: number;
    roles: Array<{
      role_name: string;
      salary_per_head: number;
      head_count: number;
    }>;
  };
}

interface PreviousDecision {
  existing_roles: ExistingRole[];
  new_roles: NewRole[];
  training_budget: number;
  employee_satisfaction: number;
  salary_budget?: number;
  total_budget?: number;
  total_employees?: number;
  roles?: any[];
}

interface HRComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyData: CompanyData;
  existingRoles: ExistingRole[];
  newRoles: NewRole[];
  trainingBudget: number;
  employeeSatisfaction: number;
  previousDecision: PreviousDecision | null;
}

const HRComparisonModal: React.FC<HRComparisonModalProps> = ({
  isOpen,
  onClose,
  companyData,
  existingRoles,
  newRoles,
  trainingBudget,
  employeeSatisfaction,
  previousDecision,
}) => {
  if (!isOpen || !previousDecision) return null;



  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const formatChange = (current: number, previous: number) => {
    const change = current - previous;
    const percentChange = previous !== 0 ? (change / previous) * 100 : 0;
    const isPositive = change > 0;
    const isZero = change === 0;

    return {
      absolute: change,
      percentage: percentChange,
      isPositive,
      isZero,
      formatted: isZero
        ? "No change"
        : `${isPositive ? "+" : ""}${formatCurrency(change)} (${
            isPositive ? "+" : ""
          }${percentChange.toFixed(1)}%)`,
    };
  };

  // Current decision calculations
  const currentSalaryFromExisting = existingRoles.reduce((acc, r) => {
    const newHeadCount = r.current_head_count + r.hires - r.fires;
    return newHeadCount > 0 ? acc + newHeadCount * r.salary_per_head : acc;
  }, 0);

  const currentSalaryFromNew = newRoles.reduce(
    (acc, r) => acc + r.hires * r.salary_per_head,
    0
  );
  const currentSalaryBudget = currentSalaryFromExisting + currentSalaryFromNew;

  const currentRecruitmentCost =
    existingRoles.reduce((acc, r) => acc + r.hires * r.salary_per_head, 0) +
    newRoles.reduce((acc, r) => acc + r.hires * r.salary_per_head, 0);

  const currentTotalBudget = trainingBudget + currentRecruitmentCost;
  const currentTotalHires =
    existingRoles.reduce((acc, r) => acc + r.hires, 0) +
    newRoles.reduce((acc, r) => acc + r.hires, 0);
  const currentTotalFires = existingRoles.reduce((acc, r) => acc + r.fires, 0);
  const currentEmployees = existingRoles.reduce(
    (acc, r) => acc + r.current_head_count,
    0
  );
  const currentProjectedEmployees =
    currentEmployees + currentTotalHires - currentTotalFires;

  // Previous decision data
  const previousSalaryBudget = previousDecision.salary_budget || 0;
  const previousTrainingBudget = previousDecision.training_budget || 0;
  const previousTotalBudget = previousDecision.total_budget || 0;
  const previousEmployeeSatisfaction =
    previousDecision.employee_satisfaction || 0;
  const previousTotalEmployees = previousDecision.total_employees || 0;

  // Create comparison data
  const comparisonData: ComparisonData = {
    previous: {
      totalBudget: previousTotalBudget,
      salaryBudget: previousSalaryBudget,
      trainingBudget: previousTrainingBudget,
      employeeSatisfaction: previousEmployeeSatisfaction,
      totalEmployees: previousTotalEmployees,
      totalHires: 0,
      totalFires: 0,
      roles: previousDecision.roles || [],
    },
    current: {
      totalBudget: currentSalaryBudget + trainingBudget,
      salaryBudget: currentSalaryBudget,
      trainingBudget: trainingBudget,
      employeeSatisfaction: employeeSatisfaction,
      totalEmployees: currentProjectedEmployees,
      totalHires: currentTotalHires,
      totalFires: currentTotalFires,
      roles: [
        ...existingRoles.map((r) => ({
          role_name: r.role_name,
          salary_per_head: r.salary_per_head,
          head_count: r.current_head_count + r.hires - r.fires,
        })),
        ...newRoles.map((r) => ({
          role_name: r.role_name,
          salary_per_head: r.salary_per_head,
          head_count: r.hires,
        })),
      ].filter((r) => r.head_count > 0),
    },
  };

  // Calculate changes
  const budgetChange = formatChange(
    comparisonData.current.totalBudget,
    comparisonData.previous.totalBudget
  );
  const salaryChange = formatChange(
    comparisonData.current.salaryBudget,
    comparisonData.previous.salaryBudget
  );
  const trainingChange = formatChange(
    comparisonData.current.trainingBudget,
    comparisonData.previous.trainingBudget
  );
  const satisfactionChange = formatChange(
    comparisonData.current.employeeSatisfaction,
    comparisonData.previous.employeeSatisfaction
  );
  const employeeChange = formatChange(
    comparisonData.current.totalEmployees,
    comparisonData.previous.totalEmployees
  );

  // Chart data
  const budgetComparisonData = [
    {
      category: "Total Budget",
      previous: comparisonData.previous.totalBudget,
      current: comparisonData.current.totalBudget,
    },
    {
      category: "Salary Budget",
      previous: comparisonData.previous.salaryBudget,
      current: comparisonData.current.salaryBudget,
    },
    {
      category: "Training Budget",
      previous: comparisonData.previous.trainingBudget,
      current: comparisonData.current.trainingBudget,
    },
  ];
  const chartData = roleComparisonData(comparisonData);
  function roleComparisonData(comparisonData: any) {
    const current = comparisonData.current.roles;
    const previous = comparisonData.previous.roles;

    return current.map((role: any) => {
      const prevRole = previous.find(
        (r: any) => r.role_name.toLowerCase() === role.role_name.toLowerCase()
      );

      return {
        role: role.role_name,
        previous: prevRole ? prevRole.current_head_count : 0,
        current: role.head_count,
      };
    });
  }

  const satisfactionData = [
    { period: "Previous", value: comparisonData.previous.employeeSatisfaction },
    { period: "Current", value: comparisonData.current.employeeSatisfaction },
  ];

  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
  ];

  const currentBudgetBreakdown = [
    {
      name: "Salary",
      value: comparisonData.current.salaryBudget,
      color: "#3B82F6",
    },
    {
      name: "Training",
      value: comparisonData.current.trainingBudget,
      color: "#10B981",
    },
  ].filter((item) => item.value > 0);

  const previousBudgetBreakdown = [
    {
      name: "Salary",
      value: comparisonData.previous.salaryBudget,
      color: "#3B82F6",
    },
    {
      name: "Training",
      value: comparisonData.previous.trainingBudget,
      color: "#10B981",
    },
  ].filter((item) => item.value > 0);

  const MetricCard = ({
    title,
    previous,
    current,
    formatter,
    icon: Icon,
  }: any) => {
    const change = (() => {
      const diff = current - previous;
      const percentChange = previous !== 0 ? (diff / previous) * 100 : 0;
      const isPositive = diff > 0;
      const isZero = diff === 0;

      return {
        absolute: diff,
        percentage: percentChange,
        isPositive,
        isZero,
        formatted: isZero
          ? "No change"
          : `${isPositive ? "+" : ""}${formatter(diff)} (${
              isPositive ? "+" : ""
            }${percentChange.toFixed(2)}%)`,
      };
    })();

    return (
      <div className="bg-slate-700/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon className="h-5 w-5 text-blue-400" />
          <span className="text-sm font-medium text-slate-300">{title}</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Previous:</span>
            <span className="text-sm text-slate-300">
              {formatter(previous)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Current:</span>
            <span className="text-sm text-white font-semibold">
              {formatter(current)}
            </span>
          </div>
          <div className="flex items-center gap-1 pt-1 border-t border-slate-600">
            {change.isZero ? (
              <span className="text-xs text-slate-400">No change</span>
            ) : (
              <>
                {change.isPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-400" />
                )}
                <span
                  className={`text-xs ${
                    change.isPositive ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {change.formatted}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 pb-2">
        <MetricCard
          title="Total Budget"
          previous={comparisonData.previous.totalBudget}
          current={comparisonData.current.totalBudget}
          formatter={formatCurrency}
          icon={DollarSign}
        />
        <MetricCard
          title="Salary Budget"
          previous={comparisonData.previous.salaryBudget}
          current={comparisonData.current.salaryBudget}
          formatter={formatCurrency}
          icon={Building2}
        />
        <MetricCard
          title="Training Budget"
          previous={comparisonData.previous.trainingBudget}
          current={comparisonData.current.trainingBudget}
          formatter={formatCurrency}
          icon={Award}
        />
        <MetricCard
          title="Employee Count"
          previous={comparisonData.previous.totalEmployees}
          current={comparisonData.current.totalEmployees}
          formatter={(val: number) => val.toString()}
          icon={Users}
        />
        <MetricCard
          title="Satisfaction"
          previous={comparisonData.previous.employeeSatisfaction}
          current={comparisonData.current.employeeSatisfaction}
          formatter={(val: number) => val.toFixed(2)}
          icon={TrendingUp}
        />
      </div>
      <div className="bg-slate-800 rounded-xl w-full border border-slate-700 p-2">
        <div className="p-6 space-y-6">
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Budget Comparison */}
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                Budget Comparison
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={budgetComparisonData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="category" stroke="#9CA3AF" />
                  <YAxis
                    stroke="#9CA3AF"
                    tickFormatter={(value) =>
                      `₹${(value / 10000000).toFixed(1)} Cr`
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F3F4F6",
                    }}
                    formatter={(value: any) => [formatCurrency(value), ""]}
                  />
                  <Legend />
                  <Bar dataKey="previous" fill="#3B82F6" name="Previous" />
                  <Bar dataKey="current" fill="#10B981" name="Current" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Role Distribution Comparison */}
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                Role Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="role"
                    stroke="#9CA3AF"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F3F4F6",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="previous" fill="#3B82F6" name="Previous" />
                  <Bar dataKey="current" fill="#10B981" name="Current" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary Cards */}
          <h3 className="text-lg font-semibold text-white mb-2">
            Impact Summary
          </h3>
          <div className="bg-slate-700/30 rounded-lg p-2">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {currentTotalHires}
                </div>
                <div className="text-sm text-slate-300">New Hires</div>
                <div className="text-xs text-slate-400 mt-1">
                  {currentTotalFires} Fires
                </div>
              </div>
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${
                    budgetChange.isPositive
                      ? "text-red-400"
                      : budgetChange.isZero
                      ? "text-slate-400"
                      : "text-green-400"
                  }`}
                >
                  {budgetChange.isZero
                    ? "→"
                    : budgetChange.isPositive
                    ? "↑"
                    : "↓"}
                </div>
                <div className="text-sm text-slate-300">Budget Change</div>
                <div className="text-xs text-slate-400 mt-1">
                  {budgetChange.formatted}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold text-green-400`}>
                  {formatCurrency(companyData.cash_balance)}
                </div>
                <div className="text-sm text-slate-300">Remaining Cash</div>
                <div className="text-xs text-slate-400 mt-1">
                  Before decision
                </div>
              </div>
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${
                    companyData.cash_balance <
                    companyData.cash_balance +
                      previousTotalBudget -
                      comparisonData.current.totalBudget
                      ? "text-green-400"
                      : satisfactionChange.isZero
                      ? "text-slate-400"
                      : "text-red-400"
                  }`}
                >
                  {formatCurrency(
                    companyData.cash_balance +
                      previousTotalBudget -
                      comparisonData.current.totalBudget
                  )}
                </div>
                <div className="text-sm text-slate-300">Remaining Cash</div>
                <div className="text-xs text-slate-400 mt-1">
                  After decision
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Back to Decision
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRComparisonModal;
