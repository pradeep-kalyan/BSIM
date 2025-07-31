"use client";

import React from "react";
import {
  X,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Building2,
  ArrowUpCircle,
  ArrowDownCircle,
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

interface CompanyData {
  id: string;
  name: string;
  current_period: number;
  cash_balance: number;
}

interface FinanceComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyData: CompanyData;
  currentDecision: {
    investmentAmount: number;
    loanAmount: number;
    repayLoan: number;
    dividendPayout: number;
    equityIssue: number;
  };
  previousDecision?: {
    investment_amount?: number;
    loan_amount?: number;
    repay_loan?: number;
    dividend_payout?: number;
    equity_issue?: number;
    total_revenue?: number;
    net_profit?: number;
    cash_balance?: number;
    roi?: number;
  };
}

const FinanceComparisonModal: React.FC<FinanceComparisonModalProps> = ({
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

  // Calculate current metrics
  const currentCashInflow =
    currentDecision.loanAmount + currentDecision.equityIssue;
  const currentCashOutflow =
    currentDecision.investmentAmount +
    currentDecision.repayLoan +
    currentDecision.dividendPayout;
  const currentNetFlow = currentCashInflow - currentCashOutflow;

  // Calculate previous metrics
  const previousCashInflow =
    (previousDecision?.loan_amount || 0) +
    (previousDecision?.equity_issue || 0);
  const previousCashOutflow =
    (previousDecision?.investment_amount || 0) +
    (previousDecision?.repay_loan || 0) +
    (previousDecision?.dividend_payout || 0);
  const previousNetFlow = previousCashInflow - previousCashOutflow;

  // Changes
  const investmentChange = formatChange(
    currentDecision.investmentAmount,
    previousDecision?.investment_amount || 0
  );
  const loanChange = formatChange(
    currentDecision.loanAmount,
    previousDecision?.loan_amount || 0
  );
  const equityChange = formatChange(
    currentDecision.equityIssue,
    previousDecision?.equity_issue || 0
  );
  const netFlowChange = formatChange(currentNetFlow, previousNetFlow);

  const comparisonData = [
    {
      metric: "Investment",
      previous: previousDecision?.investment_amount || 0,
      current: currentDecision.investmentAmount,
    },
    {
      metric: "New Loans",
      previous: previousDecision?.loan_amount || 0,
      current: currentDecision.loanAmount,
    },
    {
      metric: "Loan Repayment",
      previous: previousDecision?.repay_loan || 0,
      current: currentDecision.repayLoan,
    },
    {
      metric: "Dividends",
      previous: previousDecision?.dividend_payout || 0,
      current: currentDecision.dividendPayout,
    },
    {
      metric: "Equity Issue",
      previous: previousDecision?.equity_issue || 0,
      current: currentDecision.equityIssue,
    },
  ];

  const cashFlowData = [
    {
      category: "Cash Inflow",
      previous: previousCashInflow,
      current: currentCashInflow,
    },
    {
      category: "Cash Outflow",
      previous: previousCashOutflow,
      current: currentCashOutflow,
    },
    {
      category: "Net Flow",
      previous: previousNetFlow,
      current: currentNetFlow,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Finance Decision Comparison
            </h2>
            <p className="text-slate-300 mt-1">
              {companyData.name} - Period {companyData.current_period}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-slate-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Key Changes Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <div className="flex items-center justify-between mb-2">
                <Building2 className="h-8 w-8 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">
                  Investment
                </span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                {formatCurrency(currentDecision.investmentAmount)}
              </p>
              <p
                className={`text-sm ${
                  investmentChange.isZero
                    ? "text-slate-400"
                    : investmentChange.isPositive
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {investmentChange.formatted}
              </p>
            </div>

            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <div className="flex items-center justify-between mb-2">
                <ArrowUpCircle className="h-8 w-8 text-green-400" />
                <span className="text-green-400 text-sm font-medium">
                  Cash Inflow
                </span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                {formatCurrency(currentCashInflow)}
              </p>
              <p
                className={`text-sm ${
                  formatChange(currentCashInflow, previousCashInflow).isZero
                    ? "text-slate-400"
                    : formatChange(currentCashInflow, previousCashInflow)
                        .isPositive
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {formatChange(currentCashInflow, previousCashInflow).formatted}
              </p>
            </div>

            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <div className="flex items-center justify-between mb-2">
                <ArrowDownCircle className="h-8 w-8 text-red-400" />
                <span className="text-red-400 text-sm font-medium">
                  Cash Outflow
                </span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                {formatCurrency(currentCashOutflow)}
              </p>
              <p
                className={`text-sm ${
                  formatChange(currentCashOutflow, previousCashOutflow).isZero
                    ? "text-slate-400"
                    : formatChange(currentCashOutflow, previousCashOutflow)
                        .isPositive
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {
                  formatChange(currentCashOutflow, previousCashOutflow)
                    .formatted
                }
              </p>
            </div>
          </div>

          {/* Net Cash Flow Highlight */}
          <div className="bg-slate-700/30 rounded-xl p-6 mb-8 border border-slate-600">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">
                Net Cash Flow Impact
              </h3>
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <p className="text-slate-400 text-sm">Previous</p>
                  <p
                    className={`text-2xl font-bold ${
                      previousNetFlow >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {formatCurrency(previousNetFlow)}
                  </p>
                </div>
                <TrendingUp
                  className={`h-8 w-8 ${
                    netFlowChange.isPositive
                      ? "text-green-400"
                      : netFlowChange.isZero
                      ? "text-slate-400"
                      : "text-red-400"
                  }`}
                />
                <div className="text-center">
                  <p className="text-slate-400 text-sm">Current</p>
                  <p
                    className={`text-2xl font-bold ${
                      currentNetFlow >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {formatCurrency(currentNetFlow)}
                  </p>
                </div>
              </div>
              <p
                className={`mt-4 text-lg ${
                  netFlowChange.isZero
                    ? "text-slate-400"
                    : netFlowChange.isPositive
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {netFlowChange.formatted}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Financial Decisions Comparison */}
            <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600">
              <h3 className="text-lg font-semibold text-white mb-4">
                Financial Decisions Comparison
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="metric"
                      stroke="#9CA3AF"
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickFormatter={(value) =>
                        `$${(value / 1000).toFixed(0)}K`
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#F9FAFB",
                      }}
                      formatter={(value: number) => [formatCurrency(value), ""]}
                    />
                    <Legend />
                    <Bar
                      dataKey="previous"
                      fill="#6B7280"
                      name="Previous Period"
                    />
                    <Bar
                      dataKey="current"
                      fill="#3B82F6"
                      name="Current Period"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cash Flow Comparison */}
            <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600">
              <h3 className="text-lg font-semibold text-white mb-4">
                Cash Flow Comparison
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="category" stroke="#9CA3AF" fontSize={12} />
                    <YAxis
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickFormatter={(value) =>
                        `$${(value / 1000).toFixed(0)}K`
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#F9FAFB",
                      }}
                      formatter={(value: number) => [formatCurrency(value), ""]}
                    />
                    <Legend />
                    <Bar
                      dataKey="previous"
                      fill="#6B7280"
                      name="Previous Period"
                    />
                    <Bar
                      dataKey="current"
                      fill="#10B981"
                      name="Current Period"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Detailed Changes Table */}
          <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600">
            <h3 className="text-lg font-semibold text-white mb-4">
              Detailed Changes
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-300 border-b border-slate-600">
                    <th className="text-left p-3">Decision</th>
                    <th className="text-right p-3">Previous</th>
                    <th className="text-right p-3">Current</th>
                    <th className="text-right p-3">Change</th>
                    <th className="text-center p-3">Impact</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-700/50">
                    <td className="p-3 text-white flex items-center">
                      <Building2 className="h-4 w-4 mr-2 text-blue-400" />
                      Investment Amount
                    </td>
                    <td className="text-right p-3 text-slate-300">
                      {formatCurrency(previousDecision?.investment_amount || 0)}
                    </td>
                    <td className="text-right p-3 text-white font-medium">
                      {formatCurrency(currentDecision.investmentAmount)}
                    </td>
                    <td
                      className={`text-right p-3 ${
                        investmentChange.isZero
                          ? "text-slate-400"
                          : investmentChange.isPositive
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {investmentChange.formatted}
                    </td>
                    <td className="text-center p-3">
                      {investmentChange.isZero ? (
                        <span className="text-slate-400">-</span>
                      ) : investmentChange.isPositive ? (
                        <TrendingDown className="h-4 w-4 text-red-400 mx-auto" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-green-400 mx-auto" />
                      )}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-700/50">
                    <td className="p-3 text-white flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-yellow-400" />
                      New Loans
                    </td>
                    <td className="text-right p-3 text-slate-300">
                      {formatCurrency(previousDecision?.loan_amount || 0)}
                    </td>
                    <td className="text-right p-3 text-white font-medium">
                      {formatCurrency(currentDecision.loanAmount)}
                    </td>
                    <td
                      className={`text-right p-3 ${
                        loanChange.isZero
                          ? "text-slate-400"
                          : loanChange.isPositive
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {loanChange.formatted}
                    </td>
                    <td className="text-center p-3">
                      {loanChange.isZero ? (
                        <span className="text-slate-400">-</span>
                      ) : loanChange.isPositive ? (
                        <TrendingUp className="h-4 w-4 text-green-400 mx-auto" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-400 mx-auto" />
                      )}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-700/50">
                    <td className="p-3 text-white flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-green-400" />
                      Equity Issue
                    </td>
                    <td className="text-right p-3 text-slate-300">
                      {formatCurrency(previousDecision?.equity_issue || 0)}
                    </td>
                    <td className="text-right p-3 text-white font-medium">
                      {formatCurrency(currentDecision.equityIssue)}
                    </td>
                    <td
                      className={`text-right p-3 ${
                        equityChange.isZero
                          ? "text-slate-400"
                          : equityChange.isPositive
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {equityChange.formatted}
                    </td>
                    <td className="text-center p-3">
                      {equityChange.isZero ? (
                        <span className="text-slate-400">-</span>
                      ) : equityChange.isPositive ? (
                        <TrendingUp className="h-4 w-4 text-green-400 mx-auto" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-400 mx-auto" />
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceComparisonModal;
