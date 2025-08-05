"use client";

import { IndianRupee, Globe, Store, Check, TriangleAlert } from "lucide-react";
import React, { useState } from "react";
import DashboardCard from "@/ui/Card";
import {
  useMarketingForm,
  useCashBalance,
  useCompanyForm,
} from "@/app/context/FormContext";
import { useSimulation } from "@/app/context/SimulationContext";
import { Slider } from "@/components/ui/slider";

const formatCurrency = (val: number) =>
  `₹${val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

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

  const frozenData = React.useMemo(
    () => ({
      budget: marketingData.budget,
      online: marketingData.online,
      offline: marketingData.offline,
    }),
    [marketingData.budget, marketingData.online, marketingData.offline]
  );

  const handleBudgetChange = (
    field: "budget" | "online" | "offline",
    value: number
  ) => {
    setSuccess(false);

    // Ensure value is not negative
    if (value < 0) value = 0;

    if (field === "budget") {
      const half = Math.floor(value / 2);
      updateData({
        budget: value,
        online: half,
        offline: value - half,
      });
    } else {
      const newOnline = field === "online" ? value : marketingData.online;
      const newOffline = field === "offline" ? value : marketingData.offline;
      updateData({
        online: newOnline,
        offline: newOffline,
        budget: newOnline + newOffline,
      });
    }

    setBudgetError(null);
  };

  const handleValidate = () => {
    setBudgetError(null);
    setSuccess(false);

    if (marketingData.online + marketingData.offline !== marketingData.budget) {
      setBudgetError(" Online + Offline must equal total budget.");
      return;
    }
    setSuccess(true);
    updateMarketingBudgetImpact(
      cashBalance.originalCashBalance - projectedCashBalance
    );
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 min-h-screen p-6">
      <div className="max-w-5xl mx-auto py-8">
        <header className="mb-10 flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold text-blue-300">
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
            size="large"
          />
          <DashboardCard
            title="Online Marketing"
            value={formatCurrency(frozenData.online)}
            subtitle="Digital Channels"
            icon={Globe}
            size="large"
          />
          <DashboardCard
            title="Offline Marketing"
            value={formatCurrency(frozenData.offline)}
            subtitle="Traditional Channels"
            icon={Store}
            size="large"
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

          <div className="grid gap-6 md:grid-cols-1">
            <Slider
              label="Total Marketing Budget (₹)"
              defaultValue={[marketingData.budget]}
              value={[marketingData.budget]}
              min={0}
              max={companyData?.marketing_budget * 2 || 100000}
              onValueChange={(val) => handleBudgetChange("budget", val[0])}
            />

            <Slider
              label="Online Marketing (₹)"
              defaultValue={[marketingData.online]}
              value={[marketingData.online]}
              min={0}
              max={marketingData.budget}
              onValueChange={(val) => handleBudgetChange("online", val[0])}
            />

            <Slider
              label="Offline Marketing (₹)"
              defaultValue={[marketingData.offline]}
              value={[marketingData.offline]}
              min={0}
              max={marketingData.budget}
              onValueChange={(val) => handleBudgetChange("offline", val[0])}
            />
          </div>

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