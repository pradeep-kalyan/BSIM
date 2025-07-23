"use client";

import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, PiggyBank } from "lucide-react";
import StatCard from "@/ui/StatCard";

const cashFlowData = [
  { month: "Jan", operating: 85000, investing: -45000, financing: 15000 },
  { month: "Feb", operating: 95000, investing: -50000, financing: 20000 },
  { month: "Mar", operating: 100000, investing: -50000, financing: 20000 },
  { month: "Apr", operating: 110000, investing: -55000, financing: 25000 },
];

const formatMoney = (value: number) => `$${(value / 1000).toFixed(0)}K`;

const formatChange = (change: number): string =>
  `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;

const getChange = (current: number, previous: number): number =>
  previous !== 0 ? ((current - previous) / Math.abs(previous)) * 100 : 0;

const CashFlow = () => {
  const current = cashFlowData[cashFlowData.length - 1];
  const prev = cashFlowData[cashFlowData.length - 2];

  const operatingChange = getChange(current.operating, prev.operating);
  const investingChange = getChange(current.investing, prev.investing);
  const financingChange = getChange(current.financing, prev.financing);

  const currentNet = current.operating + current.investing + current.financing;
  const prevNet = prev.operating + prev.investing + prev.financing;
  const netChange = getChange(currentNet, prevNet);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Operating Activities"
          value={formatMoney(current.operating)}
          change={formatChange(operatingChange)}
          isPositive={operatingChange >= 0}
          icon={TrendingUp}
        />
        <StatCard
          title="Investing Activities"
          value={formatMoney(current.investing)}
          change={formatChange(investingChange)}
          isPositive={investingChange >= 0}
          icon={TrendingDown}
        />
        <StatCard
          title="Financing Activities"
          value={formatMoney(current.financing)}
          change={formatChange(financingChange)}
          isPositive={financingChange >= 0}
          icon={DollarSign}
        />
        <StatCard
          title="Net Cash Flow"
          value={formatMoney(currentNet)}
          change={formatChange(netChange)}
          isPositive={netChange >= 0}
          icon={PiggyBank}
        />
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Cash Flow Activities</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={cashFlowData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              formatter={(value) => [`$${(Number(value) / 1000).toFixed(0)}K`, "Amount"]}
            />
            <Bar dataKey="operating" fill="#10B981" name="Operating" />
            <Bar dataKey="investing" fill="#EF4444" name="Investing" />
            <Bar dataKey="financing" fill="#3B82F6" name="Financing" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CashFlow;
