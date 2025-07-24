"use client";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { TrendingUp, DollarSign, Target, Star } from "lucide-react";
import MarketingDecisionForm from "@/app/(main)/_components/MarketingDescision";

// Colorblind-friendly palette

// Types
interface ProductPerformanceType {
  period: number;
  revenue: number;
  profit?: number;
  // Add other fields as needed
}

interface ProductType {
  id: string;
  name: string;
  marketing_budget: number;
  product_performances: ProductPerformanceType[];
}
interface MarketingDashboardProps {
  data: {
    totalMarketingBudget: number;
    avgMarketingBudgetPerProduct: number;
    averageMarketShare: number;
    totalMarketShareLatestPeriod: number;
    averageCustomerSatisfaction: number;
    bestProductMarketShare: { product: ProductType; avgShare: number } | null;
    worstProductMarketShare: { product: ProductType; avgShare: number } | null;
    totalRevenue: number;
    totalCosts: number;
    totalProfit: number;
    totalSalesUnits: number;
    marketingProfitROI: number;
    productCount: number;
    latestPeriod: number;
    latestRevenue: number;
    latestCosts: number;
    latestProfit: number;
    latestSalesUnits: number;
    timeSeries: Array<{
      period: number;
      revenue: number;
      marketShare: number;
    }>;
  };
  company?: any;
}

// Card component for reuse
function MarketingCard({
  title,
  value,
  change,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  change?: string | number;
  icon: any;
  color?: string;
}) {
  let trendColor = "";
  let trendArrow = null;
  if (typeof change === "number") {
    trendColor = change >= 0 ? "text-green-400" : "text-red-400";
    trendArrow = (
      <TrendingUp
        className={`h-4 w-4 mr-1 ${
          change >= 0 ? "text-green-400" : "text-red-400"
        }`}
        style={{ transform: change >= 0 ? "none" : "rotate(180deg)" }}
      />
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-5 border border-gray-700 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Icon
          className={`h-6 w-6 ${color ? `text-${color}-400` : "text-gray-400"}`}
        />
        <span className="font-semibold text-white">{title}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {change !== undefined && typeof change === "number" && (
        <div className={`text-sm ${trendColor} flex items-center`}>
          {trendArrow}
          {Math.abs(change)}%
        </div>
      )}
    </div>
  );
}

// Budget Allocation BarChart (horizontal, with labels)
function BudgetAllocationBarChart({
  data,
}: {
  data: Array<{ name: string; value: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(60 * data.length, 220)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis type="number" stroke="#9CA3AF" />
        <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={180} />
        <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" name="Budget ($)">
          <LabelList
            dataKey="percentage"
            position="right"
            formatter={(v) => `${v}%`}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// Marketing Spend vs Revenue Chart
function SpendVsRevenueChart({
  data,
}: {
  data: Array<{ name: string; marketing_budget: number; revenue: number }>;
}) {
  // Sort by revenue for better UX
  const sorted = [...data].sort((a, b) => b.revenue - a.revenue);
  return (
    <ResponsiveContainer width="100%" height={Math.max(70 * data.length, 300)}>
      <BarChart
        data={sorted}
        margin={{ top: 20, right: 24, left: 9, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="name" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1F2937",
            border: "1px solid #374151",
          }}
          formatter={(value, name) => [
            `$${(value as number).toLocaleString()}`,
            name === "marketing_budget"
              ? "Marketing Budget"
              : name === "revenue"
              ? "Revenue"
              : "Profit",
          ]}
        />
        <Legend />
        <Bar dataKey="marketing_budget" fill="#2b83ba" name="Budget ($)">
          <LabelList
            dataKey="marketing_budget"
            position="top"
            formatter={(v) => (v ? `$${v.toLocaleString()}` : "$0")}
          />
        </Bar>
        <Bar dataKey="revenue" fill="#fdae61" name="Revenue ($)">
          <LabelList
            dataKey="revenue"
            position="top"
            formatter={(v) => (v ? `$${v.toLocaleString()}` : "$0")}
          />
        </Bar>
        {/* If you want to show profit (if you have that data) */}
        {/* <Bar dataKey="profit" fill="#82ca9d" name="Profit ($)" /> */}
      </BarChart>
    </ResponsiveContainer>
  );
}

// Performance Trend Line Chart
function PerformanceTrendsChart({
  data,
}: {
  data: Array<{
    period: number;
    revenue: number;
    roi: number;
    market_share: number;
  }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="period" stroke="#9CA3AF" />
        <YAxis
          yAxisId="left"
          stroke="#8884d8"
          label={{ value: "Revenue (K)", angle: -90, position: "insideLeft" }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="#82ca9d"
          label={{
            value: "ROI / Market Share (%)",
            angle: 90,
            position: "insideRight",
          }}
          domain={[0, 100]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1F2937",
            border: "1px solid #374151",
          }}
          formatter={(value, name) => {
            if (name === "Revenue (K)")
              return [`$${(value as number).toLocaleString()}K`, "Revenue (K)"];
            return [`${value}%`, name];
          }}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="revenue"
          stroke="#8884d8"
          name="Revenue (K)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="roi"
          stroke="#2b83ba"
          name="ROI (%)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="market_share"
          stroke="#fdae61"
          name="Market Share (%)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Main component
export function MarketingDashboard({ data }: MarketingDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard");

  // "Current" values: Use latest period if available, else fallback
  const currentMarketShare = Math.min(
    100,
    data.totalMarketShareLatestPeriod || data.averageMarketShare
  );
  const averageCustomerSatisfaction = data.averageCustomerSatisfaction || 0;

  // ROI: as a percent for display
  const currentROI = Math.round((data.marketingProfitROI || 0) * 100);

  // Timeseries/recharts
  const trendData = (data.timeSeries || []).map((row) => ({
    period: row.period,
    revenue: Math.round(row.revenue / 1000), // To K, readable
    roi: Math.round(
      data.totalMarketingBudget
        ? ((row.revenue - data.totalCosts) / data.totalMarketingBudget) * 100
        : 0
    ),
    market_share: Math.min(100, Math.round(row.marketShare * 100) / 100),
  }));

  // All products (try company.products, else fallback to best/worst)
  const allProducts: ProductType[] = (data as any)?.company?.products || [
    ...(data.bestProductMarketShare?.product
      ? [data.bestProductMarketShare.product]
      : []),
    ...(data.worstProductMarketShare?.product
      ? [data.worstProductMarketShare.product]
      : []),
  ];

  // Assemble budget allocation bar chart data
  const budgetDistribution = allProducts
    .filter((p) => p.marketing_budget > 0)
    .map((p) => ({
      name: p.name,
      value: p.marketing_budget,
      percentage: data.totalMarketingBudget
        ? ((100 * p.marketing_budget) / data.totalMarketingBudget).toFixed(1)
        : "0.0",
    }));

  // Spend vs Revenue BarChart data (per product)
  const spendVsEarned = allProducts.map((p) => {
    // Find latest performance for each product
    const latestPerf =
      p.product_performances && p.product_performances.length
        ? p.product_performances.reduce((prev, curr) =>
            curr.period > prev.period ? curr : prev
          )
        : null;
    return {
      name: p.name,
      marketing_budget: p.marketing_budget || 0,
      revenue: latestPerf ? latestPerf.revenue : 0,
      // profit: latestPerf ? latestPerf.profit : 0,  // Uncomment if you have, and add bar in component above
    };
  });

  // Placeholder example: you may calculate actual change values as desired.
  const budgetChange = 4; // last period vs previous period in %, negative = drop
  const marketShareChange = -1.2;
  const satisfactionChange = 0.18;
  const roiChange = 2.7;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Tabs */}
      <div className="mb-8 flex gap-4">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "dashboard"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-300"
          }`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "decision"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-300"
          }`}
          onClick={() => setActiveTab("decision")}
        >
          Decision Making
        </button>
      </div>

      {activeTab === "dashboard" && (
        <div className="max-w-7xl mx-auto">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MarketingCard
              title="Total Marketing Budget"
              value={`$${(data.totalMarketingBudget || 0).toLocaleString()}`}
              change={budgetChange}
              icon={DollarSign}
              color="green"
            />
            <MarketingCard
              title="Market Share"
              value={`${Math.round(currentMarketShare * 100) / 100}%`}
              change={marketShareChange}
              icon={Target}
              color="blue"
            />
            <MarketingCard
              title="Customer Satisfaction"
              value={`${(averageCustomerSatisfaction || 0).toFixed(2)} / 10`}
              change={satisfactionChange}
              icon={Star}
              color="yellow"
            />
            <MarketingCard
              title="Marketing ROI"
              value={`${currentROI}%`}
              change={roiChange}
              icon={TrendingUp}
              color="purple"
            />
          </div>

          {/* Budget Distribution Bar Chart */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              Marketing Budget Allocation by Product
            </h3>
            {budgetDistribution.length > 0 ? (
              <BudgetAllocationBarChart data={budgetDistribution} />
            ) : (
              <div className="text-gray-400 text-center py-12">
                No product marketing budget data available.
              </div>
            )}
          </div>

          {/* Spend vs Revenue Bar Chart */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              Marketing Spend vs Revenue by Product
            </h3>
            {spendVsEarned.length > 0 ? (
              <SpendVsRevenueChart data={spendVsEarned} />
            ) : (
              <div className="text-gray-400 text-center py-12">
                No per-product spend/revenue data available.
              </div>
            )}
          </div>

          {/* Performance Trends Line Chart */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              Performance Trends Over Time
            </h3>
            {trendData.length > 0 ? (
              <PerformanceTrendsChart data={trendData} />
            ) : (
              <div className="text-gray-400 text-center py-12">
                No time series data available.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "decision" && (
        <div className="max-w-4xl mx-auto">
          <MarketingDecisionForm />
        </div>
      )}
    </div>
  );
}
