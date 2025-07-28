"use client";

import React from "react";
import {
  X,
  TrendingUp,
  TrendingDown,
  Globe,
  Store,
  DollarSign,
  BarChart3,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface CompanyData {
  id: string;
  name: string;
  current_period: number;
  cash_balance: number;
}

interface MarketingData {
  budget: number;
  online: number;
  offline: number;
  roi?: number;
  conversion_rate?: number;
}

interface MarketingComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyData: CompanyData;
  currentDecision: MarketingData;
  previousDecision: MarketingData | null;
}

const MarketingComparisonModal: React.FC<MarketingComparisonModalProps> = ({
  isOpen,
  onClose,
  companyData,
  currentDecision,
  previousDecision,
}) => {
  if (!isOpen) return null;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const budgetData = [
    {
      name: "Previous Period",
      Total: previousDecision?.budget || 0,
      Online: previousDecision?.online || 0,
      Offline: previousDecision?.offline || 0,
    },
    {
      name: "Current Period",
      Total: currentDecision.budget,
      Online: currentDecision.online,
      Offline: currentDecision.offline,
    },
  ];

  const channelData = [
    { name: "Online", value: currentDecision.online, color: "#3B82F6" },
    { name: "Offline", value: currentDecision.offline, color: "#8B5CF6" },
  ];

  const budgetChange = previousDecision
    ? calculateChange(currentDecision.budget, previousDecision.budget)
    : 0;
  const onlineChange = previousDecision
    ? calculateChange(currentDecision.online, previousDecision.online)
    : 0;
  const offlineChange = previousDecision
    ? calculateChange(currentDecision.offline, previousDecision.offline)
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Marketing Budget Analysis
            </h2>
            <p className="text-slate-400 mt-1">
              Period {companyData.current_period} • {companyData.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-slate-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Budget */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="h-8 w-8 text-green-400" />
                <div
                  className={`flex items-center text-sm ${
                    budgetChange >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {budgetChange >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(budgetChange).toFixed(1)}%
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {formatCurrency(currentDecision.budget)}
              </div>
              <div className="text-slate-400 text-sm">
                Total Marketing Budget
              </div>
              {previousDecision && (
                <div className="text-slate-500 text-xs mt-1">
                  Previous: {formatCurrency(previousDecision.budget)}
                </div>
              )}
            </div>

            {/* Online Budget */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <Globe className="h-8 w-8 text-blue-400" />
                <div
                  className={`flex items-center text-sm ${
                    onlineChange >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {onlineChange >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(onlineChange).toFixed(1)}%
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {formatCurrency(currentDecision.online)}
              </div>
              <div className="text-slate-400 text-sm">Online Marketing</div>
              {previousDecision && (
                <div className="text-slate-500 text-xs mt-1">
                  Previous: {formatCurrency(previousDecision.online)}
                </div>
              )}
            </div>

            {/* Offline Budget */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <Store className="h-8 w-8 text-purple-400" />
                <div
                  className={`flex items-center text-sm ${
                    offlineChange >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {offlineChange >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(offlineChange).toFixed(1)}%
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {formatCurrency(currentDecision.offline)}
              </div>
              <div className="text-slate-400 text-sm">Offline Marketing</div>
              {previousDecision && (
                <div className="text-slate-500 text-xs mt-1">
                  Previous: {formatCurrency(previousDecision.offline)}
                </div>
              )}
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Budget Comparison Chart */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                Budget Comparison
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={budgetData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis
                    stroke="#9CA3AF"
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), ""]}
                    labelStyle={{ color: "#1F2937" }}
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Online" fill="#3B82F6" name="Online" />
                  <Bar dataKey="Offline" fill="#8B5CF6" name="Offline" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Channel Distribution */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-purple-400" />
                Channel Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Metrics */}
          {(currentDecision.roi ||
            currentDecision.conversion_rate ||
            previousDecision?.roi ||
            previousDecision?.conversion_rate) && (
            <div className="mt-8 bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                Performance Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(currentDecision.roi || previousDecision?.roi) && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {currentDecision.roi || 0}%
                    </div>
                    <div className="text-slate-400">Expected ROI</div>
                    {previousDecision?.roi && (
                      <div className="text-slate-500 text-sm mt-1">
                        Previous: {previousDecision.roi}%
                      </div>
                    )}
                  </div>
                )}
                {(currentDecision.conversion_rate ||
                  previousDecision?.conversion_rate) && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {((currentDecision.conversion_rate || 0) * 100).toFixed(
                        1
                      )}
                      %
                    </div>
                    <div className="text-slate-400">Conversion Rate</div>
                    {previousDecision?.conversion_rate && (
                      <div className="text-slate-500 text-sm mt-1">
                        Previous:{" "}
                        {(previousDecision.conversion_rate * 100).toFixed(1)}%
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketingComparisonModal;
