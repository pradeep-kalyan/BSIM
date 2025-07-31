"use client";

import React from "react";
import { X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import DashboardCard from "@/ui/Card";
import ChartCard from "@/ui/ChartCard";

interface RdComparisonProps {
  current: {
    budget: number;
    pip: number;
    time_to_market: number;
    total_development: number;
    patented: number;
    quality_changes: number;
  };
  previous: {
    budget: number;
    pip: number;
    time_to_market: number;
    total_development: number;
    patented: number;
    quality_changes: number;
  };
  onClose: () => void;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) => {
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
      {payload.map((entry, index) => (
        <p key={index} className="text-gray-100">
          <span className="font-medium" style={{ color: entry.color }}>
            {entry.name}:
          </span>{" "}
          {entry.value}
        </p>
      ))}
    </div>
  );
};

const FinancialTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-gray-600">
        {label && <p className="font-medium mb-1 text-gray-200">{label}</p>}
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-gray-100">
            <span className="font-medium" style={{ color: entry.color }}>
              {entry.name}:
            </span>{" "}
            {entry.value === 0 ? "No data" : `$${entry.value.toFixed(1)}k`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const RdComparison: React.FC<RdComparisonProps> = ({ current, previous, onClose }) => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const budgetData = [
    { name: "Previous", value: previous.budget / 1000 },
    { name: "Current", value: current.budget / 1000 },
  ];

  const developmentData = [
    { name: "Previous", value: previous.total_development / 1000000 },
    { name: "Current", value: current.total_development / 1000000 },
  ];

  const performanceData = [
    {
      metric: "Pipeline",
      previous: previous.pip,
      current: current.pip,
    },
    {
      metric: "Patents",
      previous: previous.patented,
      current: current.patented,
    },
    {
      metric: "Quality %",
      previous: previous.quality_changes,
      current: current.quality_changes,
    },
  ];

  const metrics = [
    {
      label: "R&D Budget",
      current: formatCurrency(current.budget),
      previous: formatCurrency(previous.budget),
      change: calculateChange(current.budget, previous.budget),
    },
    {
      label: "Time to Market (months)",
      current: current.time_to_market,
      previous: previous.time_to_market,
      change: calculateChange(current.time_to_market, previous.time_to_market),
      inverse: true,
    },
    {
      label: "Total Development Cost",
      current: formatCurrency(current.total_development),
      previous: formatCurrency(previous.total_development),
      change: calculateChange(current.total_development, previous.total_development),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pb-2">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto border border-slate-700 relative">
        <button
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          onClick={onClose}
          aria-label="Close comparison modal"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-10 space-y-6">
          {/* Metrics Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric) => (
              <DashboardCard
                key={metric.label}
                title={metric.label}
                value={metric.current}
                subtitle={`Previous: ${metric.previous}`}
                change={metric.inverse ? -metric.change : metric.change}
                size="small"
              />
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Budget Comparison" subtitle="R&D spending in millions USD">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip content={<FinancialTooltip />} cursor={{ fill: "transparent" }} isAnimationActive={false} />
                    <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Performance Metrics" subtitle="Key R&D performance indicators">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="metric" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} isAnimationActive={false} />
                    <Bar dataKey="previous" fill="#6B7280" name="Previous" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="current" fill="#10B981" name="Current" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          <div className="flex justify-end gap-4 pb-7">
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

export default RdComparison;
