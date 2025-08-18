"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ChartCard from "@/app/ui/ChartCard";
import { CustomTooltip } from "./CustomTooltips";

interface ProductionData {
  month: string;
  produced: number;
  defects: number;
  efficiency: number;
  period?: number;
}

interface ProductionMetricsProps {
  chartData: ProductionData[];
}

const ProductionMetrics: React.FC<ProductionMetricsProps> = ({ chartData }) => {
  return (
    <div data-swapy-slot="slot-production-metrics" className="lg:col-span-1">
      <div data-swapy-item="item-production-metrics">
        <ChartCard title="Production Metrics">
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={chartData}>
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
  );
};

export default ProductionMetrics;
