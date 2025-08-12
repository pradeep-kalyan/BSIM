"use client";

import { IndianRupee, Globe, Store, TriangleAlert } from "lucide-react";
import React, { useState } from "react";
import { useMarketingForm, useCashBalance } from "@/app/context/FormContext";
import formatCurrency from "@/app/functions/formatCurrency";
import { Slider } from "@/components/ui/slider";
import InfoCard from "@/app/ui/InfoCard";
import { TooltipWrapper } from "@/components/ui/tooltip";

const percent = (part: number, total: number) =>
  total > 0 ? ((part / total) * 100).toFixed(1) + "%" : "0%";

const MarketingForm = () => {
  const { data: marketingData, updateData } = useMarketingForm();
  const { cashBalance, projectedCashBalance } = useCashBalance();

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
    <div className="h-full bg-slate-800/50 shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Compact Metrics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <InfoCard
            label="Available Cash"
            value={formatCurrency(cashBalance.originalCashBalance || 0)}
            Icon={IndianRupee}
            iconColor="text-yellow-400"
            labelColor="text-white"
            valueColor="text-white"
            isCurrency={true}
            width="w-full"
            height="h-30"
          />

          <InfoCard
            label="Total Budget"
            value={formatCurrency(frozenData.budget)}
            Icon={IndianRupee}
            iconColor="text-blue-400"
            labelColor="text-white"
            valueColor="text-white"
            isCurrency={true}
            width="w-full"
            height="h-30"
            subtext="100%"
          />

          <InfoCard
            label="Online"
            value={formatCurrency(frozenData.online)}
            Icon={Globe}
            iconColor="text-green-400"
            labelColor="text-white"
            valueColor="text-white"
            isCurrency={true}
            width="w-full"
            height="h-30"
            subtext={percent(marketingData.online, marketingData.budget)}
          />

          <InfoCard
            label="Offline"
            value={formatCurrency(frozenData.offline)}
            Icon={Store}
            iconColor="text-purple-400"
            labelColor="text-white"
            valueColor="text-white"
            isCurrency={true}
            width="w-full"
            height="h-30"
            subtext={percent(marketingData.offline, marketingData.budget)}
          />
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
              <div className="bg-slate-800/50 shadow-md rounded-lg p-4 border border-slate-600">
                <TooltipWrapper
                  label="Total Marketing(₹/per year)"
                  text="Total marketing budget allocation"
                />
                <Slider
                  className="w-[200px]"
                  label={`${formatCurrency(marketingData.budget)}`}
                  value={[marketingData.budget]}
                  min={0}
                  max={Math.max(100000, marketingData.budget * 2)}
                  onValueChange={(val: number[]) => {
                    handleBudgetChange("budget", val[0]);
                  }}
                />
              </div>

              {/* Online Marketing */}
              <div className="bg-slate-800/50 shadow-md rounded-lg p-4 border border-slate-600">
                <TooltipWrapper
                  label="Online Marketing(₹/per year)"
                  text="Digital marketing channels budget"
                />
                <Slider
                  className="w-[200px]"
                  label={`${formatCurrency(marketingData.online)} (${percent(
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
              <div className="bg-slate-800/50 shadow-md rounded-lg p-4 border border-slate-600">
                <TooltipWrapper
                  label="Offline Marketing(₹/per year)"
                  text="Traditional marketing channels budget"
                />
                <Slider
                  className="w-[200px]"
                  label={`${formatCurrency(marketingData.offline)} (${percent(
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

            {/* Financial Impact Summary */}
            <div className="bg-slate-800/50 shadow-md rounded-lg p-4 border border-slate-500">
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
