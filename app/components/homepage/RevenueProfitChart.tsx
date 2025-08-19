"use client";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ChartCard from "@/app/ui/ChartCard";
import { FinancialTooltip } from "./CustomTooltips";

interface RevenueProfitChartProps {
  chartData: Array<{
    period: number;
    revenue: number;
    profit: number;
    total_revenue: number;
  }>;
  periodsLength: number;
  maxPeriod: number;
}

const RevenueProfitChart: React.FC<RevenueProfitChartProps> = ({
  chartData,
  periodsLength,
  maxPeriod,
}) => {
  return (
    <div data-swapy-slot="slot-revenue" className="lg:col-span-2">
      <div data-swapy-item="item-revenue">
        <ChartCard
          title="Revenue & Profit Trend"
          subtitle={`Last ${periodsLength} periods (up to Period ${maxPeriod})`}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
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
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
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
      </div>
    </div>
  );
};

export default RevenueProfitChart;
