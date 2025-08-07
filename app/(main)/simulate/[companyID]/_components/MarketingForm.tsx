"use client";

import {
  IndianRupee,
  Globe,
  Store,
  Check,
  TriangleAlert,
  Building2,
} from "lucide-react";
import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import {
  useMarketingForm,
  useCashBalance,
  useCompanyForm,
} from "@/app/context/FormContext";
import { useSimulation } from "@/app/context/SimulationContext";
import formatCurrency from "@/app/functions/formatCurrency";


const percent = (part: number, total: number) =>
  total > 0 ? ((part / total) * 100).toFixed(1) + "%" : "0%";

const MarketingForm = () => {
  const { data: marketingData, updateData } = useMarketingForm();
  const { cashBalance, projectedCashBalance } = useCashBalance();
  const { data: companyData } = useCompanyForm();
  const { period } = useSimulation();

  const [budgetError, setBudgetError] = useState<string | null>(null);

  const handleBudgetChange = (
    field: "budget" | "online" | "offline",
    value: number
  ) => {
    setBudgetError(null);

    // Ensure value is not negative
    if (value < 0) value = 0;

    if (field === "budget") {
      const half = Math.floor(value / 2);
      updateData({
        budget: value,
        online: half,
        offline: value - half,
      });
    } else if (field === "online") {
      // When online changes, offline adjusts to maintain the total or creates a new total
      const newOnline = value;
      const currentOffline = marketingData.offline || 0;
      const newBudget = newOnline + currentOffline;
      updateData({
        online: newOnline,
        offline: currentOffline,
        budget: newBudget,
      });
    } else if (field === "offline") {
      // When offline changes, online stays the same and total adjusts
      const newOffline = value;
      const currentOnline = marketingData.online || 0;
      const newBudget = currentOnline + newOffline;
      updateData({
        online: currentOnline,
        offline: newOffline,
        budget: newBudget,
      });
    }

    // Basic validation
    if (value > (cashBalance.originalCashBalance || 0)) {
      setBudgetError("Insufficient cash balance for this marketing budget.");
    }
  };

  const frozenData = React.useMemo(() => {
    const { budget, online, offline } = marketingData;
    return { budget, online, offline };
  }, [marketingData]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-blue-300 mb-2">
            Marketing Dashboard
          </h1>
          <div className="flex items-center gap-2 text-slate-400">
            <Building2 className="h-4 w-4" />
            <span>
              Period {period} • {companyData?.name}
            </span>
          </div>
        </div>

        {/* Compact Metrics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Company Cash */}
          <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center gap-2 mb-2">
              <IndianRupee className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-bold text-white">
                Available Cash
              </span>
            </div>
            <p className="text-lg font-bold text-white">
              {formatCurrency(cashBalance.originalCashBalance || 0)}
            </p>
          </div>

          {/* Total Budget */}
          <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center gap-2 mb-2">
              <IndianRupee className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-bold text-white">Total Budget</span>
            </div>
            <p className="text-lg font-bold text-white">
              {formatCurrency(frozenData.budget)}
            </p>
          </div>

          {/* Online Marketing */}
          <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-green-400" />
              <span className="text-sm font-bold text-white">Online</span>
            </div>
            <p className="text-lg font-bold text-white">
              {formatCurrency(frozenData.online)}
            </p>
            <p className="text-xs text-slate-400">
              {percent(marketingData.online, marketingData.budget)}
            </p>
          </div>

          {/* Offline Marketing */}
          <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center gap-2 mb-2">
              <Store className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-bold text-white">Offline</span>
            </div>
            <p className="text-lg font-bold text-white">
              {formatCurrency(frozenData.offline)}
            </p>
            <p className="text-xs text-slate-400">
              {percent(marketingData.offline, marketingData.budget)}
            </p>
          </div>
        </div>

        {/* Marketing Strategy Form */}
        <div className="bg-slate-800/90 rounded-xl p-6 border border-slate-600">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Globe className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Marketing Strategy
              </h2>
              <p className="text-slate-400 text-sm">
                Configure your marketing budget allocation
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Budget Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Marketing Budget */}
              <div className="bg-slate-700/40 rounded-lg p-4 border border-slate-600">
                <h4 className="text-sm font-bold text-white mb-3">
                  Total Marketing Budget
                </h4>
                <Slider
                  className="w-[200px]"
                  label={`₹${marketingData.budget.toLocaleString()}`}
                  value={[marketingData.budget]}
                  min={0}
                  max={Math.max(100000, marketingData.budget * 2)}
                  onValueChange={(val: number[]) => {
                    handleBudgetChange("budget", val[0]);
                  }}
                />
              </div>

              {/* Online Marketing */}
              <div className="bg-slate-700/40 rounded-lg p-4 border border-green-500/30">
                <h4 className="text-sm font-bold text-white mb-3">
                  Online Marketing
                </h4>
                <Slider
                  className="w-[200px]"
                  label={`₹${marketingData.online.toLocaleString()} (${percent(
                    marketingData.online,
                    marketingData.budget
                  )})`}
                  value={[marketingData.online]}
                  min={0}
                  max={Math.max(50000, marketingData.budget * 2)}
                  onValueChange={(val: number[]) => {
                    handleBudgetChange("online", val[0]);
                  }}
                />
              </div>

              {/* Offline Marketing */}
              <div className="bg-slate-700/40 rounded-lg p-4 border border-purple-500/30">
                <h4 className="text-sm font-bold text-white mb-3">
                  Offline Marketing
                </h4>
                <Slider
                  className="w-[200px]"
                  label={`₹${marketingData.offline.toLocaleString()} (${percent(
                    marketingData.offline,
                    marketingData.budget
                  )})`}
                  value={[marketingData.offline]}
                  min={0}
                  max={Math.max(50000, marketingData.budget * 2)}
                  onValueChange={(val: number[]) => {
                    handleBudgetChange("offline", val[0]);
                  }}
                />
              </div>
            </div>

            {/* Info Section */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-500/20 rounded">
                  <Check className="h-3 w-3 text-blue-400" />
                </div>
                <div className="text-sm text-blue-200">
                  <p className="font-medium mb-1">Dynamic Budget Allocation</p>
                  <p className="text-blue-300/80">
                    Adjust individual online/offline amounts to automatically
                    update total budget, or set total budget to split evenly
                    between channels.
                  </p>
                </div>
              </div>
            </div>

            {/* Financial Impact Summary */}
            <div className="bg-slate-700/80 rounded-lg p-4 border border-slate-500">
              <h4 className="text-lg font-bold text-white mb-3">
                Financial Impact Summary
              </h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-slate-600/40 rounded-lg p-3">
                  <p className="text-slate-300 text-xs mb-1">
                    Marketing Budget
                  </p>
                  <p className="text-lg font-bold text-white">
                    {formatCurrency(marketingData.budget)}
                  </p>
                </div>
                <div className="bg-slate-600/40 rounded-lg p-3">
                  <p className="text-slate-300 text-xs mb-1">Available Cash</p>
                  <p className="text-lg font-bold text-white">
                    {formatCurrency(cashBalance.originalCashBalance || 0)}
                  </p>
                </div>
                <div className="bg-slate-600/40 rounded-lg p-3">
                  <p className="text-slate-300 text-xs mb-1">Remaining Cash</p>
                  <p
                    className={`text-lg font-bold ${
                      projectedCashBalance < 0
                        ? "text-red-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {formatCurrency(projectedCashBalance)}
                  </p>
                </div>
              </div>
            </div>

            {/* Validation Messages */}
            {budgetError && (
              <div className="space-y-4">
                <div className="bg-rose-900/60 border border-rose-700 text-rose-300 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <TriangleAlert className="text-rose-500 mt-0.5 h-4 w-4" />
                    <p className="text-sm">{budgetError}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingForm;
