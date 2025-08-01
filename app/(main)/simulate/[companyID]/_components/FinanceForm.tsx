"use client";

import React from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building2,
  PiggyBank,
  CreditCard,
  Factory,
  Package,
  IndianRupee,
  AlertTriangle,
  Check,
} from "lucide-react";
import { useSimulation } from "@/app/context/SimulationContext";
import {
  useCashBalance,
  useCompanyForm,
  useFinanceForm,
} from "@/app/context/FormContext";
import DashboardCard from "./Card";
import { createFinanceSchema } from "@/app/(main)/simulate/[companyID]/_utils/validator";

const FinanceForm = () => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  const { period, comId } = useSimulation();
  const { data: companyData } = useCompanyForm();
  const { data, updateData, setError, updateFinanceBudgetImpact } =
    useFinanceForm();
  const { cashBalance, projectedCashBalance } = useCashBalance();

  // State for validation and frozen projected balance
  const [success, setSuccess] = React.useState(false);
  const [budgetAlert, setBudgetAlert] = React.useState<string | null>(null);

  // Initialize frozen balance when component mounts
 

  // Handle input changes without updating projected balance
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? "" : e.target.value;
    updateData({ [e.target.name]: Number(value) });
    setError(e.target.name, "");
    setSuccess(false); // Reset success state when user makes changes
    setBudgetAlert(null); // Clear any previous alerts
  };

  // Validation function similar to ProductionForm
  const handleValidate = () => {
    // Reset states at the beginning
    setSuccess(false);
    setBudgetAlert(null);

    // Calculate the finance budget impact with null checks
    const investment_amount = data?.investment_amount ?? 0;
    const loan_amount = data?.loan_amount ?? 0;
    const repay_loan = data?.repay_loan ?? 0;
    const dividend_payout = data?.dividend_payout ?? 0;
    const equity_issue = data?.equity_issue ?? 0;

    // Positive impact = cash inflow, Negative impact = cash outflow
    const cashInflow = loan_amount + equity_issue;
    const cashOutflow = investment_amount + repay_loan + dividend_payout;
    const netFinanceImpact = cashInflow - cashOutflow;

    // Prepare data for validation
    const formData = {
      company_id: comId ?? "",
      user_id: null,
      period: period ?? 0,
      total_revenue: 0,
      net_profit: 0,
      cash_balance: cashBalance.originalCashBalance,
      operating_costs: 0,
      roi: 0,
      burn_rate: 0,
      finalised: false,
      investment_amount,
      loan_amount,
      repay_loan,
      dividend_payout,
      equity_issue,
      notes: "",
      processed: false,
    };

    // Validate using Zod schema
    const result = createFinanceSchema.safeParse(formData);

    if (!result.success) {
      // Handle validation errors
      const firstError = result.error.issues[0];
      setBudgetAlert(`⚠️ Validation error: ${firstError.message}`);
      return;
    }

    // Calculate new projected balance
    const newProjectedBalance =
      cashBalance.originalCashBalance + netFinanceImpact;

    // Check if projected balance would go negative
    if (newProjectedBalance < 0) {
      setBudgetAlert(
        `⚠️ This combination would result in negative cash balance: ${formatCurrency(
          newProjectedBalance
        )}`
      );
      return;
    }

    // If validation passes, update the budget impact and frozen balance
    updateFinanceBudgetImpact(netFinanceImpact);
    setSuccess(true);
    setBudgetAlert(null);
  };

  // Calculate net finance impact (positive = cash inflow, negative = cash outflow)
  const netFinanceImpact = Math.round(
    (data?.loan_amount ?? 0) +
      (data?.equity_issue ?? 0) -
      ((data?.investment_amount ?? 0) +
        (data?.repay_loan ?? 0) +
        (data?.dividend_payout ?? 0))
  );

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
              value={cashBalance.originalCashBalance}
              subtitle="Maximum units producible per period"
              icon={Factory}
              size="large"
            />
            <DashboardCard
              title="Projected Cash Balance"
              value={projectedCashBalance}
              subtitle="Projected balance after finance decisions"
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

              {[
                {
                  id: "loan_amount",
                  label: "Loan Amount",
                  value: data?.loan_amount ?? 0,
                  type: "number",
                  step: 1,
                  min: 0,
                  placeholder: "Enter loan amount",
                  icon: CreditCard,
                },
                {
                  id: "equity_issue",
                  label: "Equity Issue",
                  value: data?.equity_issue ?? 0,
                  type: "number",
                  step: 1,
                  min: 0,
                  placeholder: "Enter equity issue amount",
                  icon: DollarSign,
                },
              ].map(
                ({
                  id,
                  label,
                  value,
                  type,
                  step,
                  min,
                  placeholder,
                  icon: Icon,
                }) => (
                  <div key={id}>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {label}
                    </label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id={id}
                        name={id}
                        type={type}
                        min={min}
                        step={step}
                        className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={placeholder}
                        value={value}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Cash Outflows */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-red-400 flex items-center">
                <TrendingDown className="h-5 w-5 mr-2" />
                Cash Outflows
              </h4>

              {[
                {
                  id: "investment_amount",
                  label: "Investment Amount",
                  value: data?.investment_amount ?? 0,
                  type: "number",
                  step: 1,
                  min: 0,
                  placeholder: "Enter investment amount",
                  icon: Building2,
                },
                {
                  id: "repay_loan",
                  label: "Loan repayment",
                  value: data?.repay_loan ?? 0,
                  type: "number",
                  step: 1,
                  min: 0,
                  placeholder: "Enter repay amount",
                  icon: CreditCard,
                },
                {
                  id: "dividend_payout",
                  label: "Dividend Payout",
                  value: data?.dividend_payout ?? 0,
                  type: "number",
                  step: 1,
                  min: 0,
                  placeholder: "Enter dividend payout amount",
                  icon: DollarSign,
                },
              ].map(
                ({
                  id,
                  label,
                  value,
                  type,
                  step,
                  min,
                  placeholder,
                  icon: Icon,
                }) => (
                  <div key={id}>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {label}
                    </label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id={id}
                        name={id}
                        type={type}
                        min={min}
                        step={step}
                        className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={placeholder}
                        value={value}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )
              )}
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
                  Projected Cash Balance:{" "}
                  {formatCurrency(projectedCashBalance)}
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

          {success && (
            <div className="mt-6 p-4 bg-green-900/20 border border-green-600 rounded-lg">
              <div className="flex items-center text-green-400">
                <Check className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-sm">
                  ✅ Finance decisions validated successfully!
                </span>
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

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleValidate}
              className="px-6 py-2 rounded-lg font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 flex items-center space-x-2"
            >
              <span>Validate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceForm;
