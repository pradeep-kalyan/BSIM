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
import { SalesTooltip } from "./CustomTooltips";

interface SalesData {
  period: number;
  totalSales: number;
  salesRevenue: number;
}

interface SalesTrendProps {
  chartData: SalesData[];
  periodsLength: number;
}

const SalesTrend: React.FC<SalesTrendProps> = ({
  chartData,
  periodsLength,
}) => {
  return (
    <div data-swapy-slot="slot-total-sales-trend" className="lg:col-span-2">
      <div data-swapy-item="item-total-sales-trend">
        <ChartCard
          title="Total Sales Trend"
          subtitle={`Sales volume over last ${periodsLength} periods`}
        >
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
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
              <Tooltip content={<SalesTooltip />} isAnimationActive={false} />
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
  );
};

export default SalesTrend;
