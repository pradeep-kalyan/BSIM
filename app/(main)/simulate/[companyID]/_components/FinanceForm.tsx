"use client";

import React, { useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Factory,
  Package,
  IndianRupee,
  AlertTriangle,
} from "lucide-react";
import { useSimulation } from "@/app/context/SimulationContext";
import { Slider } from "@/components/ui/slider";
import {
  useCashBalance,
  useCompanyForm,
  useFinanceForm,
} from "@/app/context/FormContext";
import DashboardCard from "../../../homepage/Card";

const FinanceForm = () => {
const formatCurrency = (val: number): string => {
  if (val >= 1_00_00_000) return `₹${(val / 1_00_00_000).toFixed(1)}Cr`;
  if (val >= 1_00_000) return `₹${(val / 1_00_000).toFixed(1)}L`;
  if (val >= 1_000) return `₹${(val / 1_000).toFixed(1)}K`;
  return `₹${val}`;
};

  const { period } = useSimulation();
  const { data: companyData } = useCompanyForm();
  const { data, updateData, setError, updateFinanceBudgetImpact } =
    useFinanceForm();
  const { cashBalance, projectedCashBalance } = useCashBalance();

  // State for validation messages
  const [budgetAlert, setBudgetAlert] = React.useState<string | null>(null);

  // Calculate net finance impact dynamically
  const netFinanceImpact = React.useMemo(() => {
    const investment_amount = data?.investment_amount ?? 0;
    const loan_amount = data?.loan_amount ?? 0;
    const repay_loan = data?.repay_loan ?? 0;
    const dividend_payout = data?.dividend_payout ?? 0;
    const equity_issue = data?.equity_issue ?? 0;

    // Positive impact = cash inflow, Negative impact = cash outflow
    const cashInflow = loan_amount + equity_issue;
    const cashOutflow = investment_amount + repay_loan + dividend_payout;
    return cashInflow - cashOutflow;
  }, [
    data?.investment_amount,
    data?.loan_amount,
    data?.repay_loan,
    data?.dividend_payout,
    data?.equity_issue,
  ]);

  // Update finance budget impact dynamically whenever finance values change
  useEffect(() => {
    updateFinanceBudgetImpact(netFinanceImpact);
  }, [netFinanceImpact, updateFinanceBudgetImpact]);

  // Handle input changes
  const handleChange = (fieldName: string, value: number) => {
    updateData({ [fieldName]: value });
    setError(fieldName, "");
    setBudgetAlert(null);

    // Basic validation for negative cash balance
    const newProjectedBalance =
      cashBalance.originalCashBalance + netFinanceImpact;
    if (newProjectedBalance < 0) {
      setBudgetAlert(
        `This combination would result in negative cash balance: ${formatCurrency(
          newProjectedBalance
        )}`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto mt-2">
        {/* Header */}
        <header className="mb-10 flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold text-blue-300">
            Financial Dashboard
          </h1>
          <span className="text-lg text-slate-400 tracking-wide">
            Period {period} • {companyData?.name}
          </span>
        </header>

        {/* Finance Decision Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <DollarSign className="h-6 w-6 mr-2 text-green-400" />
            Financial Decisions
          </h3>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <DashboardCard
              title="Original Cash Balance"
              value={formatCurrency(cashBalance.originalCashBalance)}
              subtitle="MaxOutput per period"
              icon={Factory}
              size="large"
            />
            <DashboardCard
              title="Projected Cash Balance"
              value={formatCurrency(projectedCashBalance)}
              subtitle="After finance decisions"
              icon={PiggyBank}
              size="large"
            />
            <DashboardCard
              title="Total Liabilities"
              value={companyData?.total_liabilities}
              subtitle="Maximum storage capacity"
              icon={Package}
              size="large"
            />
            <DashboardCard
              title="Total Assets"
              value={companyData?.total_assets}
              subtitle="Value of planned inventory"
              icon={IndianRupee}
              size="large"
            />
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cash Inflows */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-green-400 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Cash Inflows
              </h4>

              {/* Loan Amount Slider */}
              <div>
                <Slider
                  label="Loan Amount (₹)"
                  defaultValue={[data?.loan_amount ?? 0]}
                  value={[data?.loan_amount ?? 0]}
                  min={0}
                  max={companyData?.cash_balance * 3 || 500000}
                  onValueChange={(val) => handleChange("loan_amount", val[0])}
                />
              </div>

              {/* Equity Issue Slider */}
              <div>
                <Slider
                  label="Equity Issue (₹)"
                  defaultValue={[data?.equity_issue ?? 0]}
                  value={[data?.equity_issue ?? 0]}
                  min={0}
                  max={companyData?.cash_balance * 2 || 300000}
                  onValueChange={(val) => handleChange("equity_issue", val[0])}
                />
              </div>
            </div>

            {/* Cash Outflows */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-red-400 flex items-center">
                <TrendingDown className="h-5 w-5 mr-2" />
                Cash Outflows
              </h4>

              {/* Investment Amount Slider */}
              <div>
                <Slider
                  label="Investment Amount (₹)"
                  defaultValue={[data?.investment_amount ?? 0]}
                  value={[data?.investment_amount ?? 0]}
                  min={0}
                  max={companyData?.cash_balance || 200000}
                  onValueChange={(val) =>
                    handleChange("investment_amount", val[0])
                  }
                />
              </div>

              {/* Loan Repayment Slider */}
              <div>
                <Slider
                  label="Loan Repayment (₹)"
                  defaultValue={[data?.repay_loan ?? 0]}
                  value={[data?.repay_loan ?? 0]}
                  min={0}
                  max={Math.min(
                    companyData?.total_liabilities || 100000,
                    companyData?.cash_balance || 100000
                  )}
                  onValueChange={(val) => handleChange("repay_loan", val[0])}
                />
              </div>

              {/* Dividend Payout Slider */}
              <div>
                <Slider
                  label="Dividend Payout (₹)"
                  defaultValue={[data?.dividend_payout ?? 0]}
                  value={[data?.dividend_payout ?? 0]}
                  min={0}
                  max={companyData?.cash_balance || 100000}
                  onValueChange={(val) =>
                    handleChange("dividend_payout", val[0])
                  }
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="text-xl text-blue-400 font-semibold">
                Net Finance Impact: {formatCurrency(netFinanceImpact)}
              </div>
              <div className="text-sm space-y-1">
                <div className="text-slate-300">
                  Original Cash Balance:{" "}
                  {formatCurrency(cashBalance.originalCashBalance)}
                </div>
                <div
                  className={`font-semibold ${
                    projectedCashBalance < 0
                      ? "text-rose-400"
                      : "text-emerald-400"
                  }`}
                >
                  Projected Cash Balance: {formatCurrency(projectedCashBalance)}
                </div>
              </div>
            </div>
          </div>

          {/* Validation Feedback */}
          {budgetAlert && (
            <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600 rounded-lg">
              <div className="flex items-center text-yellow-400">
                <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-sm">{budgetAlert}</span>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any notes about your financial decisions..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceForm;
