"use client";
import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ChartCard from "@/app/ui/ChartCard";
import { PieTooltip } from "./CustomTooltips";

interface DepartmentBudgetData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface DepartmentBudgetChartProps {
  chartData: DepartmentBudgetData[];
  isCurrentPeriod: boolean;
  selectedPeriod: number;
}

const DepartmentBudgetChart: React.FC<DepartmentBudgetChartProps> = ({
  chartData,
  isCurrentPeriod,
  selectedPeriod,
}) => {
  return (
    <div data-swapy-slot="slot-department-budgets">
      <div
        data-swapy-item="item-department-budgets"
        className="chart-no-select"
      >
        <ChartCard
          title="Department Budgets"
          subtitle={`${
            isCurrentPeriod ? "Current" : `Period ${selectedPeriod}`
          } allocation`}
        >
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={100}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} isAnimationActive={false} />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {chartData.map((dept) => (
              <div
                key={dept.name}
                className="flex items-center justify-around p-2 rounded bg-white/5"
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
    </div>
  );
};

export default DepartmentBudgetChart;
