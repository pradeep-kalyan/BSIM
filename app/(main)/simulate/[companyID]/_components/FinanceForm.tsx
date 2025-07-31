"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building2,
  Loader2,
  PiggyBank,
  CreditCard,
  Users,
  ArrowUpCircle,
  ArrowDownCircle,
  Calculator,
  BarChart3,
} from "lucide-react";
import {
  getCompanyData,
  getHistoricalFinanceData,
  getCurrentFinanceDecision,
  submitFinanceDecisionForPeriod,
} from "@/app/_actions/finance";
import { useFinanceForm, useCashBalance } from "@/app/context/FormContext";
import FinanceComparisonModal from "./FinanceComparison";

interface CompanyData {
  id: string;
  name: string;
  current_period: number;
  cash_balance: number;
}

interface HistoricalFinanceData {
  period: number;
  total_revenue: number;
  net_profit: number;
  cash_balance: number;
  operating_costs: number;
  roi: number;
  burn_rate: number;
  investment_amount: number;
  loan_amount: number;
  repay_loan: number;
  dividend_payout: number;
  equity_issue: number;
}

interface FinanceFormProps {
  companyId: string;
}

const FinanceForm: React.FC<FinanceFormProps> = ({ companyId }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalFinanceData[]>(
    []
  );

  // Use FormContext for finance form state
  const {
    data: financeData,
    updateData: updateFinanceData,
  } = useFinanceForm();

  // Use cash balance tracking
  const {
    setOriginalCashBalance,
    projectedCashBalance: contextProjectedCashBalance,
    cashBalance: cashBalanceState,
  } = useCashBalance();

  // Form state from context
  const investmentAmount = financeData.investment_amount || 0;
  const loanAmount = financeData.loan_amount || 0;
  const repayLoan = financeData.repay_loan || 0;
  const dividendPayout = financeData.dividend_payout || 0;
  const equityIssue = financeData.equity_issue || 0;

  const [notes, setNotes] = useState<string>("");
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [company, historical] = await Promise.all([
          getCompanyData(companyId),
          getHistoricalFinanceData(companyId),
        ]);

        setCompanyData(company);
        setHistoricalData(historical);

        // Set original cash balance in context
        setOriginalCashBalance(company.cash_balance);

        // Get current decision for this period
        const decision = await getCurrentFinanceDecision(
          company.id,
          company.current_period
        );

        // Set form values from current decision if available
        if (decision) {
          updateFinanceData({
            investment_amount: decision.investment_amount || 0,
            loan_amount: decision.loan_amount || 0,
            repay_loan: decision.repay_loan || 0,
            dividend_payout: decision.dividend_payout || 0,
            equity_issue: decision.equity_issue || 0,
          });
          setNotes(decision.notes || "");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId, updateFinanceData, setOriginalCashBalance]);

  const handleSubmit = async () => {
    if (!companyData) return;

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      await submitFinanceDecisionForPeriod({
        company_id: companyId,
        period: companyData.current_period,
        investment_amount: investmentAmount,
        loan_amount: loanAmount,
        repay_loan: repayLoan,
        dividend_payout: dividendPayout,
        equity_issue: equityIssue,
        notes: notes,
      });

      setSuccess("Finance decision submitted successfully!");

      // Refresh data after submission
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit decision"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-slate-300">Loading finance dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-slate-300">No company data found</p>
      </div>
    );
  }

  // Calculations
  const cashInflow = loanAmount + equityIssue;
  const cashOutflow = investmentAmount + repayLoan + dividendPayout;
  const netCashFlow = cashInflow - cashOutflow;
  const projectedCashBalance = companyData.cash_balance + netCashFlow;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const lastPeriodData =
    historicalData.length > 0
      ? historicalData[historicalData.length - 1]
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-2">
      {/* Comparison Modal */}
      {showComparison && (
        <FinanceComparisonModal
          isOpen={showComparison}
          onClose={() => setShowComparison(false)}
          companyData={companyData}
          currentDecision={{
            investmentAmount,
            loanAmount,
            repayLoan,
            dividendPayout,
            equityIssue,
          }}
          previousDecision={lastPeriodData || undefined}
        />
      )}

      <div className="max-w-7xl mx-auto mt-2">
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Finance Management
              </h1>
              <p className="text-slate-300">
                {companyData.name} - Period {companyData.current_period}
              </p>
            </div>
            <Building2 className="h-12 w-12 text-blue-400" />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <PiggyBank className="h-8 w-8 text-green-400" />
              <span className="text-green-400 text-sm font-medium">
                Current
              </span>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(companyData.cash_balance)}
            </p>
            <p className="text-slate-400 text-sm">Cash Balance</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <Calculator className="h-8 w-8 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">
                Projected
              </span>
            </div>
            <p
              className={`text-2xl font-bold ${
                contextProjectedCashBalance >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {formatCurrency(contextProjectedCashBalance)}
            </p>
            <p className="text-slate-400 text-sm">After All Decisions</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <ArrowUpCircle className="h-8 w-8 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Inflow</span>
            </div>
            <p className="text-2xl font-bold text-green-400">
              {formatCurrency(cashInflow)}
            </p>
            <p className="text-slate-400 text-sm">Loans + Equity</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <ArrowDownCircle className="h-8 w-8 text-red-400" />
              <span className="text-red-400 text-sm font-medium">Outflow</span>
            </div>
            <p className="text-2xl font-bold text-red-400">
              {formatCurrency(cashOutflow)}
            </p>
            <p className="text-slate-400 text-sm">Investments + Repayments</p>
          </div>
        </div>

        {/* Cash Balance Impact from Other Departments */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Building2 className="h-5 w-5 mr-2 text-blue-400" />
            Cross-Department Cash Impact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-slate-400 text-sm">HR Budget Impact</p>
              <p className="text-lg font-bold text-red-400">
                -{formatCurrency(cashBalanceState.hrBudgetImpact)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm">Marketing Impact</p>
              <p className="text-lg font-bold text-red-400">
                -{formatCurrency(cashBalanceState.marketingBudgetImpact)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm">Production Impact</p>
              <p className="text-lg font-bold text-red-400">
                -{formatCurrency(cashBalanceState.productionBudgetImpact)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm">R&D Impact</p>
              <p className="text-lg font-bold text-red-400">
                -{formatCurrency(cashBalanceState.rdBudgetImpact)}
              </p>
            </div>
          </div>
          <div className="mt-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-xs text-blue-200">
              💡 These values reflect budget decisions made in other department
              forms and automatically update your projected cash balance.
            </p>
          </div>
        </div>

        {/* Historical Performance */}
        {lastPeriodData && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
              Last Period Performance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-slate-400 text-sm">Revenue</p>
                <p className="text-xl font-bold text-green-400">
                  {formatCurrency(lastPeriodData.total_revenue)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-slate-400 text-sm">Net Profit</p>
                <p
                  className={`text-xl font-bold ${
                    lastPeriodData.net_profit >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {formatCurrency(lastPeriodData.net_profit)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-slate-400 text-sm">ROI</p>
                <p className="text-xl font-bold text-blue-400">
                  {lastPeriodData.roi.toFixed(1)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-slate-400 text-sm">Burn Rate</p>
                <p className="text-xl font-bold text-orange-400">
                  {formatCurrency(lastPeriodData.burn_rate)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Finance Decision Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <DollarSign className="h-6 w-6 mr-2 text-green-400" />
            Financial Decisions for Period {companyData.current_period}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cash Inflows */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-green-400 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Cash Inflows
              </h4>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Take New Loan
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={loanAmount}
                    onChange={(e) =>
                      updateFinanceData({
                        loan_amount: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Issue New Equity
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={equityIssue}
                    onChange={(e) =>
                      updateFinanceData({
                        equity_issue: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Cash Outflows */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-red-400 flex items-center">
                <TrendingDown className="h-5 w-5 mr-2" />
                Cash Outflows
              </h4>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Investment Amount
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={investmentAmount}
                    onChange={(e) =>
                      updateFinanceData({
                        investment_amount: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Loan Repayment
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={repayLoan}
                    onChange={(e) =>
                      updateFinanceData({
                        repay_loan: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Dividend Payout
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={dividendPayout}
                    onChange={(e) =>
                      updateFinanceData({
                        dividend_payout: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any notes about your financial decisions..."
            />
          </div>

          {/* Net Cash Flow Summary */}
          <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-slate-400 text-sm">Net Cash Flow</p>
                <p
                  className={`text-xl font-bold ${
                    netCashFlow >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {formatCurrency(netCashFlow)}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Current Cash</p>
                <p className="text-xl font-bold text-white">
                  {formatCurrency(companyData.cash_balance)}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Projected Cash</p>
                <p
                  className={`text-xl font-bold ${
                    projectedCashBalance >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {formatCurrency(projectedCashBalance)}
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => setShowComparison(true)}
              className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Compare Changes</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || projectedCashBalance < 0}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                projectedCashBalance < 0
                  ? "bg-red-600/50 text-red-300 cursor-not-allowed"
                  : submitting
                  ? "bg-blue-600/50 text-blue-300 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4" />
                  <span>Submit Finance Decision</span>
                </>
              )}
            </button>
          </div>

          {projectedCashBalance < 0 && (
            <p className="mt-2 text-red-400 text-sm text-right">
              Warning: Insufficient funds for these decisions
            </p>
          )}
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-4">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-900/50 border border-green-700 rounded-lg p-4 mb-4">
            <p className="text-green-300">{success}</p>
          </div>
        )}

        {/* Historical Data Table */}
        {historicalData.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-4">
              Historical Finance Data
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-300 border-b border-slate-600">
                    <th className="text-left p-2">Period</th>
                    <th className="text-right p-2">Revenue</th>
                    <th className="text-right p-2">Net Profit</th>
                    <th className="text-right p-2">Cash Balance</th>
                    <th className="text-right p-2">ROI</th>
                    <th className="text-right p-2">Investments</th>
                  </tr>
                </thead>
                <tbody>
                  {historicalData.slice(-5).map((data) => (
                    <tr
                      key={data.period}
                      className="text-slate-300 border-b border-slate-700/50"
                    >
                      <td className="p-2">{data.period}</td>
                      <td className="text-right p-2 text-green-400">
                        {formatCurrency(data.total_revenue)}
                      </td>
                      <td
                        className={`text-right p-2 ${
                          data.net_profit >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {formatCurrency(data.net_profit)}
                      </td>
                      <td className="text-right p-2">
                        {formatCurrency(data.cash_balance)}
                      </td>
                      <td className="text-right p-2 text-blue-400">
                        {data.roi.toFixed(1)}%
                      </td>
                      <td className="text-right p-2">
                        {formatCurrency(data.investment_amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceForm;
