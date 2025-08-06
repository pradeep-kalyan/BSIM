"use client";

import React from "react";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { useCashBalance } from "@/app/context/FormContext";

interface CashBalanceDisplayProps {
  showBreakdown?: boolean;
  className?: string;
}

const CashBalanceDisplay: React.FC<CashBalanceDisplayProps> = ({
  showBreakdown = false,
  className = "",
}) => {
  const { originalCashBalance, projectedCashBalance, cashBalance } =
    useCashBalance();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const netChange = projectedCashBalance - originalCashBalance;
  const isPositive = netChange > 0;
  const isZero = netChange === 0;

  return (
    <div
      className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 ${className}`}
    >
      <div className="space-y-4">
        {/* Current Cash Balance */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-slate-300 text-sm">Current Cash Balance</span>
          </div>
          <span className="text-lg font-bold text-white">
            {formatCurrency(originalCashBalance)}
          </span>
        </div>

        {/* Projected Cash Balance */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isZero ? (
              <DollarSign className="h-5 w-5 text-slate-400 mr-2" />
            ) : isPositive ? (
              <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-400 mr-2" />
            )}
            <span className="text-slate-300 text-sm">
              Projected Cash Balance
            </span>
          </div>
          <span
            className={`text-lg font-bold ${
              projectedCashBalance >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {formatCurrency(projectedCashBalance)}
          </span>
        </div>

        {/* Net Change */}
        {!isZero && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-600">
            <span className="text-slate-400 text-xs">Net Change</span>
            <span
              className={`text-sm font-medium ${
                isPositive ? "text-green-400" : "text-red-400"
              }`}
            >
              {isPositive ? "+" : ""}
              {formatCurrency(netChange)}
            </span>
          </div>
        )}

        {/* Breakdown */}
        {showBreakdown && (
          <div className="space-y-2 pt-3 border-t border-slate-600">
            <h4 className="text-xs font-medium text-slate-300 mb-2">
              Budget Impact Breakdown
            </h4>

            {cashBalance.hrBudgetImpact > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">HR Budget:</span>
                <span className="text-red-400">
                  -{formatCurrency(cashBalance.hrBudgetImpact)}
                </span>
              </div>
            )}

            {cashBalance.marketingBudgetImpact > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Marketing Budget:</span>
                <span className="text-red-400">
                  -{formatCurrency(cashBalance.marketingBudgetImpact)}
                </span>
              </div>
            )}

            {cashBalance.productionBudgetImpact > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Production Budget:</span>
                <span className="text-red-400">
                  -{formatCurrency(cashBalance.productionBudgetImpact)}
                </span>
              </div>
            )}

            {cashBalance.rdBudgetImpact > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">R&D Budget:</span>
                <span className="text-red-400">
                  -{formatCurrency(cashBalance.rdBudgetImpact)}
                </span>
              </div>
            )}

            {cashBalance.productBudgetImpact > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Product Budget:</span>
                <span className="text-red-400">
                  -{formatCurrency(cashBalance.productBudgetImpact)}
                </span>
              </div>
            )}

            {cashBalance.salesBudgetImpact > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Sales Revenue:</span>
                <span className="text-green-400">
                  +{formatCurrency(cashBalance.salesBudgetImpact)}
                </span>
              </div>
            )}

            {cashBalance.financeBudgetImpact !== 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Finance Impact:</span>
                <span
                  className={
                    cashBalance.financeBudgetImpact > 0
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {cashBalance.financeBudgetImpact > 0 ? "+" : ""}
                  {formatCurrency(cashBalance.financeBudgetImpact)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CashBalanceDisplay;
