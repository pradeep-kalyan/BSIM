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

const formatCurrency = (val: number): string => {
  if (val >= 1_00_00_000) return `₹${(val / 1_00_00_000).toFixed(1)}Cr`;
  if (val >= 1_00_000) return `₹${(val / 1_00_000).toFixed(1)}L`;
  if (val >= 1_000) return `₹${(val / 1_000).toFixed(1)}K`;
  return `₹${val}`;
};


const percent = (part: number, total: number) =>
  total > 0 ? ((part / total) * 100).toFixed(1) + "%" : "0%";

const MarketingForm = () => {
  const { data: marketingData, updateData } = useMarketingForm();
  const { cashBalance, projectedCashBalance, updateMarketingBudgetImpact } =
    useCashBalance();
  const { data: companyData } = useCompanyForm();
  const { period } = useSimulation();

  const [success, setSuccess] = useState(false);
  const [budgetError, setBudgetError] = useState<string | null>(null);

  const handleBudgetChange = (
    field: "budget" | "online" | "offline",
    value: number
  ) => {
    setSuccess(false);
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
  };

  const handleValidate = () => {
    setBudgetError(null);
    setSuccess(false);

    if (marketingData.budget <= 0) {
      setBudgetError("Marketing budget must be greater than zero.");
      return;
    }

    if (marketingData.budget > (cashBalance.originalCashBalance || 0)) {
      setBudgetError("Insufficient cash balance for this marketing budget.");
      return;
    }

    setSuccess(true);
    updateMarketingBudgetImpact(marketingData.budget);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-blue-300 mb-2">
            Marketing Dashboard
          </h1>
          <span className="text-lg text-slate-400 tracking-wide">
            Period {period} • {companyData?.name}
          </span>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <DashboardCard
            title="Total Budget"
            value={formatCurrency(frozenData.budget)}
            subtitle="Marketing Budget"
            icon={IndianRupee}
            size="small"
          />
          <DashboardCard
            title="Online Marketing"
            value={formatCurrency(frozenData.online)}
            subtitle="Digital Channels"
            icon={Globe}
            size="small"
          />
          <DashboardCard
            title="Offline Marketing"
            value={formatCurrency(frozenData.offline)}
            subtitle="Traditional Channels"
            icon={Store}
            size="small"
          />
        </section>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleValidate();
          }}
          className="bg-slate-800/50 shadow-md rounded-2xl p-6 border border-slate-700"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            Set Marketing Strategy
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <Inputbox
              label="Total Marketing Budget (₹)"
              name="budget"
              type="number"
              value={marketingData.budget.toString()}
              onChange={(e) =>
                handleBudgetChange("budget", parseInt(e.target.value) || 0)
              }
            />
            <Inputbox
              label="Online Marketing (₹)"
              name="online"
              type="number"
              value={marketingData.online.toString()}
              onChange={(e) =>
                handleBudgetChange("online", parseInt(e.target.value) || 0)
              }
            />
            <Inputbox
              label="Offline Marketing (₹)"
              name="offline"
              type="number"
              value={marketingData.offline.toString()}
              onChange={(e) =>
                handleBudgetChange("offline", parseInt(e.target.value) || 0)
              }
            />
        <div className="mt-4 text-sm text-slate-400 space-y-1">
            <p>Online: {percent(marketingData.online, marketingData.budget)}</p>
            <p>
              Offline: {percent(marketingData.offline, marketingData.budget)}
            </p>
          </div>

       <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="text-slate-300 text-sm">
                Available Cash Balance:{" "}
                {formatCurrency(cashBalance.originalCashBalance)}
              </div>
              <div
                className={`font-semibold ${
                  marketingData.budget > projectedCashBalance
                    ? "text-rose-400"
                    : "text-emerald-400"
                }`}
              >
                Projected Balance :{formatCurrency(projectedCashBalance)}
              </div>
              <div>
                <div
                  className={`font-semibold ${
                    marketingData.budget > projectedCashBalance
                      ? "text-rose-400"
                      : "text-emerald-400"
                  }`}
                >
                  Marketing Budget:
                  {formatCurrency(marketingData.budget)}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition shadow"
              >
                Validate
              </button>
            </div>
          </div>

          {(budgetError || success) && (
            <div className="mt-6 space-y-4">
              {budgetError && (
                <div className="bg-rose-900/60 border border-rose-700 text-rose-300 rounded-lg p-4 animate-pulse">
                  <div className="flex items-start gap-3">
                    <TriangleAlert className="text-rose-500 mt-0.5" />
                    <p className="text-sm">{budgetError}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-green-900/60 border border-white/80 text-white rounded-lg p-4 animate-bounce">
                  <div className="flex items-center gap-3">
                    <Check className="text-green-400 text-xl" />
                    <p className="text-xl font-semibold">
                      Marketing Validate Successfully!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default MarketingForm;
