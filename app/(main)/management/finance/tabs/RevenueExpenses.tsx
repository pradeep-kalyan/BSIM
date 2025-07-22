"use client";

import React from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import StatCard from "@/ui/StatCard";

interface DataPoint {
  period: string;
  revenue: number;
  expenses: number;
}

const formatChange = (change: number): string =>
  `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;

const RevenueExpenses = ({ data }: { data: DataPoint[] }) => {
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalExpenses = data.reduce((sum, d) => sum + d.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;

  const prev = data.length > 1 ? data[data.length - 2] : null;
  const current = data.length > 0 ? data[data.length - 1] : null;

  const revenueChange =
    prev && prev.revenue !== 0
      ? ((current!.revenue - prev.revenue) / prev.revenue) * 100
      : 0;

  const expensesChange =
    prev && prev.expenses !== 0
      ? ((current!.expenses - prev.expenses) / prev.expenses) * 100
      : 0;

  const prevProfit = prev ? prev.revenue - prev.expenses : 0;
  const currProfit = current ? current.revenue - current.expenses : 0;
  const profitChange =
    prevProfit !== 0 ? ((currProfit - prevProfit) / Math.abs(prevProfit)) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${(totalRevenue / 1000).toFixed(0)}K`}
          change={formatChange(revenueChange)}
          isPositive={revenueChange >= 0}
          icon={TrendingUp}
        />
        <StatCard
          title="Total Expenses"
          value={`$${(totalExpenses / 1000).toFixed(0)}K`}
          change={formatChange(expensesChange)}
          isPositive={expensesChange < 0} // Lower expenses is better
          icon={TrendingDown}
        />
        <StatCard
          title="Net Profit"
          value={`$${(netProfit / 1000).toFixed(0)}K`}
          change={formatChange(profitChange)}
          isPositive={profitChange >= 0}
          icon={DollarSign}
        />
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Revenue vs Expenses</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="period" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip formatter={(value) => [`$${(Number(value) / 1000).toFixed(0)}K`, "Amount"]} />
            <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={0.6} fill="#10B981" />
            <Area type="monotone" dataKey="expenses" stroke="#EF4444" fillOpacity={0.6} fill="#EF4444" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueExpenses;
