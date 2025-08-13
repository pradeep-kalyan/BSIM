"use client";

import React, { useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Wallet,
  Package,
  IndianRupee,
  AlertTriangle,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  useCashBalance,
  useCompanyForm,
  useFinanceForm,
} from "@/app/context/FormContext";
import InfoCard from "@/app/components/InfoCard";
import formatCurrency from "@/app/functions/formatCurrency";
const FinanceForm = () => {
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
    <div className="h-full bg-slate-800/50 shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto ">
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <InfoCard
            label="Original Cash Balance"
            value={formatCurrency(parseFloat(cashBalance.originalCashBalance.toFixed(0)))}
            isCurrency={true}
            Icon={Wallet}
            width="w-full"
            height="h-full"
            iconColor="text-green-400"
          />
          <InfoCard
            label="Projected Cash Balance"
            value={formatCurrency(parseFloat(projectedCashBalance.toFixed(0)))}
            isCurrency={true}
            Icon={PiggyBank}
            width="w-full"
            height="h-full"
            iconColor="text-purple-400"
          />
          <InfoCard
            label="Total Liabilities"
            value={formatCurrency(parseFloat(companyData?.total_liabilities.toFixed(0)))}
            isCurrency={true}
            Icon={Package}
            width="w-full"
            height="h-full"
            iconColor="text-red-400"
          />
          <InfoCard
            label="Total Assets"
            value={formatCurrency(parseFloat(companyData?.total_assets.toFixed(0)))}
            isCurrency={true}
            Icon={IndianRupee}
            width="w-full"
            height="h-full"
            iconColor="text-blue-400"
          />
        </section>

        {/* Finance Decision Form */}

        <h3 className="text-xl font-semibold text-white flex items-center mb-6">
          <DollarSign className="h-6 w-6 mr-2 text-green-400" />
          Financial Decisions
        </h3>

        <div className="bg-slate-800/50 shadow-md rounded-xl p-6 border border-slate-700 mb-6 mx-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-5">
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
                  tooltipText="Borrow cash from banks"
                  defaultValue={[data?.loan_amount ?? 0]}
                  value={[data?.loan_amount ?? 0]}
                  min={0}
                  max={500000}
                  onValueChange={(val) => handleChange("loan_amount", val[0])}
                />
              </div>

              {/* Equity Issue Slider */}
              <div>
                <Slider
                  label="Equity Issue (₹)"
                  tooltipText="Issue new shares"
                  defaultValue={[data?.equity_issue ?? 0]}
                  value={[data?.equity_issue ?? 0]}
                  min={0}
                  max={300000}
                  onValueChange={(val) => handleChange("equity_issue", val[0])}
                />
              </div>

              <div className="mt-6 text-white flex gap-6 items-center text-sm font-roboto-sans">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="flex flex-col gap-1">
                    <p>Net Finance Impact:</p>
                    <p>{formatCurrency(netFinanceImpact)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <div className="flex flex-col gap-1">
                    <p>Original Cash:</p>
                    <p>{formatCurrency(cashBalance.originalCashBalance)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="flex flex-col gap-1">
                    <p>Projected Cash:</p>
                    <p>{formatCurrency(projectedCashBalance)}</p>
                  </div>
                </div>
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
                  tooltipText="Invest in financial instruments"
                  defaultValue={[data?.investment_amount ?? 0]}
                  value={[data?.investment_amount ?? 0]}
                  min={0}
                  max={200000}
                  onValueChange={(val) =>
                    handleChange("investment_amount", val[0])
                  }
                />
              </div>

              {/* Loan Repayment Slider */}
              <div>
                <Slider
                  label="Loan Repayment (₹)"
                  tooltipText="Repay existing loans"
                  defaultValue={[data?.repay_loan ?? 0]}
                  value={[data?.repay_loan ?? 0]}
                  min={0}
                  max={100000}
                  onValueChange={(val) => handleChange("repay_loan", val[0])}
                />
              </div>

              {/* Dividend Payout Slider */}
              <div>
                <Slider
                  label="Dividend Payout (₹)"
                  tooltipText="Distribute to shareholders"
                  defaultValue={[data?.dividend_payout ?? 0]}
                  value={[data?.dividend_payout ?? 0]}
                  min={0}
                  max={100000}
                  onValueChange={(val) =>
                    handleChange("dividend_payout", val[0])
                  }
                />
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
        </div>
      </div>
    </div >
  );
};

export default FinanceForm;
