"use client";

import React, { useState } from "react";
import {
  IndianRupee,
  FlaskConical,
  Timer,
  Check,
  TriangleAlert,
} from "lucide-react";
import DashboardCard from "@/ui/Card";
import { Slider } from "@/components/ui/slider";
import {
  useRDForm,
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

const RDForm = () => {
  const { data, updateData, getError, setError } = useRDForm();
  const { projectedCashBalance, updateRDBudgetImpact, cashBalance } =
    useCashBalance();
  const { data: companyData } = useCompanyForm();
  const { period } = useSimulation();

  const [success, setSuccess] = useState(false);
  const [budgetAlert, setBudgetAlert] = useState<string | null>(null);

  const fieldDefs: {
    id: keyof typeof data;
    label: string;
    placeholder: string;
    min?: number;
    step?: number;
  }[] = [
    {
      id: "budget",
      label: "R&D Budget (₹)",
      placeholder: "Enter total R&D budget",
      min: 0,
      step: 1,
    },
    {
      id: "pip",
      label: "Products in Pipeline",
      placeholder: "Upcoming products in development",
      min: 0,
      step: 1,
    },
    {
      id: "time_to_market",
      label: "Time to Market (months)",
      placeholder: "Avg. time to market",
      min: 0,
      step: 1,
    },
    {
      id: "total_development",
      label: "Total Development Cost (₹)",
      placeholder: "Expected cost of all developments",
      min: 0,
      step: 1,
    },
    {
      id: "patented",
      label: "Patents Expected",
      placeholder: "Number of patents expected",
      min: 0,
      step: 1,
    },
    {
      id: "quality_changes",
      label: "Quality Improvements (%)",
      placeholder: "Quality improvement target (%)",
      min: 0,
      step: 0.1,
    },
  ];

  const handleChange = (fieldId: keyof typeof data, value: number) => {
    updateData({ [fieldId]: value });
    setError(fieldId, "");
    setSuccess(false);
  };

  const handleValidate = () => {
    setSuccess(false);
    setBudgetAlert(null);

    const totalBudget = data.budget ?? 0;

    fieldDefs.forEach(({ id }) => setError(id, ""));

    if (totalBudget <= 0) {
      setError("budget", "Budget must be greater than zero");
      return;
    }

    updateRDBudgetImpact(totalBudget);
    setSuccess(true);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 min-h-screen p-6">
      <div className="max-w-5xl mx-auto py-8">
        <header className="mb-10 flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold text-blue-300">
            R&D Dashboard
          </h1>
          <span className="text-lg text-slate-400 tracking-wide">
            Period {period} • {companyData?.name}
          </span>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <DashboardCard
            title="R&D Budget"
            value={formatCurrency(data.budget ?? 0)}
            subtitle="Total R&D Allocation"
            icon={IndianRupee}
            size="small"
          />
          <DashboardCard
            title="Products in Pipeline"
            value={data.pip ?? 0}
            subtitle="Upcoming product count"
            icon={FlaskConical}
            size="small"
          />
          <DashboardCard
            title="Time to Market"
            value={`${data.time_to_market ?? 0} months`}
            subtitle="Avg time per release"
            icon={Timer}
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
            Set R&D Strategy
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {/* R&D Budget Slider */}
            <div>
              <Slider
                label="R&D Budget (₹)"
                defaultValue={[data.budget ?? 0]}
                value={[data.budget ?? 0]}
                min={0}
                max={companyData?.cash_balance * 2 || 100000}
                onValueChange={(val) => handleChange("budget", val[0])}
              />
              {getError("budget") && (
                <p className="text-rose-400 text-xs mt-1">
                  {getError("budget")}
                </p>
              )}
            </div>

            {/* Products in Pipeline Slider */}
            <div>
              <Slider
                label="Products in Pipeline"
                defaultValue={[data.pip ?? 0]}
                value={[data.pip ?? 0]}
                min={0}
                max={20}
                onValueChange={(val) => handleChange("pip", val[0])}
              />
              {getError("pip") && (
                <p className="text-rose-400 text-xs mt-1">{getError("pip")}</p>
              )}
            </div>

            {/* Time to Market Slider */}
            <div>
              <Slider
                label="Time to Market (months)"
                defaultValue={[data.time_to_market ?? 0]}
                value={[data.time_to_market ?? 0]}
                min={0}
                max={36}
                onValueChange={(val) => handleChange("time_to_market", val[0])}
              />
              {getError("time_to_market") && (
                <p className="text-rose-400 text-xs mt-1">
                  {getError("time_to_market")}
                </p>
              )}
            </div>

            {/* Total Development Cost Slider */}
            <div>
              <Slider
                label="Total Development Cost (₹)"
                defaultValue={[data.total_development ?? 0]}
                value={[data.total_development ?? 0]}
                min={0}
                max={companyData?.cash_balance * 3 || 150000}
                onValueChange={(val) =>
                  handleChange("total_development", val[0])
                }
              />
              {getError("total_development") && (
                <p className="text-rose-400 text-xs mt-1">
                  {getError("total_development")}
                </p>
              )}
            </div>

            {/* Patents Expected Slider */}
            <div>
              <Slider
                label="Patents Expected"
                defaultValue={[data.patented ?? 0]}
                value={[data.patented ?? 0]}
                min={0}
                max={10}
                onValueChange={(val) => handleChange("patented", val[0])}
              />
              {getError("patented") && (
                <p className="text-rose-400 text-xs mt-1">
                  {getError("patented")}
                </p>
              )}
            </div>

            {/* Quality Improvements Slider */}
            <div>
              <Slider
                label="Quality Improvements (%)"
                defaultValue={[data.quality_changes ?? 0]}
                value={[data.quality_changes ?? 0]}
                min={0}
                max={100}
                onValueChange={(val) => handleChange("quality_changes", val[0])}
              />
              {getError("quality_changes") && (
                <p className="text-rose-400 text-xs mt-1">
                  {getError("quality_changes")}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="text-slate-300">
                Available Cash:{" "}
                {formatCurrency(cashBalance.originalCashBalance)}
              </div>
              <div className="text-xl text-blue-400 font-semibold">
                R&D budget:{" "}
                <span
                  className={
                    projectedCashBalance - (data.budget ?? 0) < 0
                      ? "text-rose-400"
                      : "text-emerald-400"
                  }
                >
                  {formatCurrency(
                    cashBalance.financeBudgetImpact - (data.budget ?? 0)
                  )}
                </span>
              </div>

              <div className="text-xl text-blue-400 font-semibold">
                Projected Balance:{" "}
                <span
                  className={
                    projectedCashBalance - (data.budget ?? 0) < 0
                      ? "text-rose-400"
                      : "text-emerald-400"
                  }
                >
                  {formatCurrency(projectedCashBalance ?? 0)}
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition shadow"
            >
              Validate
            </button>
          </div>

          {(budgetAlert || success) && (
            <div className="mt-6 space-y-4">
              {budgetAlert && (
                <div className="bg-rose-900/60 border border-rose-700 text-rose-300 rounded-lg p-4 animate-pulse">
                  <div className="flex items-start gap-3">
                    <TriangleAlert className="text-rose-500 mt-0.5" />
                    <p className="text-sm">{budgetAlert}</p>
                  </div>
                </div>
              )}
              {success && !budgetAlert && (
                <div className="bg-green-900/60 border border-white/80 text-white rounded-lg p-4 animate-bounce">
                  <div className="flex items-center gap-3">
                    <Check className="text-green-400 text-xl" />
                    <p className="text-xl font-semibold">
                      R&D Plan Validated Successfully
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

export default RDForm;
