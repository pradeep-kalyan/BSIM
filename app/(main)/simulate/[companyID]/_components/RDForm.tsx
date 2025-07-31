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
import { useRDForm, useCashBalance, useCompanyForm } from "@/app/context/FormContext";
import { useSimulation } from "@/app/context/SimulationContext";

const formatCurrency = (val: number) =>
  `₹${val.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const RDForm = () => {
  const { data, updateData, getError, setError } = useRDForm();
  const { projectedCashBalance, updateRDBudgetImpact } = useCashBalance();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name as keyof typeof data;
    updateData({ [key]: Number(value) });
    setError(key, "");
    setSuccess(false);
  };

  const handleValidate = () => {
    setSuccess(false);
    setBudgetAlert(null);

    const totalBudget = data.budget ?? 0;
    const balance = companyData?.cash_balance ?? 0;

    fieldDefs.forEach(({ id }) => setError(id, ""));

    if (totalBudget <= 0) {
      setError("budget", "Budget must be greater than zero");
      return;
    }

    if (totalBudget > balance) {
      setBudgetAlert(
        ` Insufficient cash balance. Required: ${formatCurrency(
          totalBudget
        )}, Available: ${formatCurrency(balance)}`
      );
      return;
    }

    updateRDBudgetImpact(totalBudget);
    setSuccess(true);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 min-h-screen p-6">
      <div className="max-w-5xl mx-auto py-8">
        <header className="mb-10 flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold text-blue-300">R&D Dashboard</h1>
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
            size="large"
          />
          <DashboardCard
            title="Products in Pipeline"
            value={data.pip ?? 0}
            subtitle="Upcoming product count"
            icon={FlaskConical}
            size="large"
          />
          <DashboardCard
            title="Time to Market"
            value={`${data.time_to_market ?? 0} months`}
            subtitle="Avg time per release"
            icon={Timer}
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
          <h2 className="text-2xl font-bold text-white mb-6">Set R&D Strategy</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {fieldDefs.map(({ id, label, placeholder, min, step }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-slate-200 font-semibold mb-1">
                  {label}
                </label>
                <input
                  id={id}
                  name={id}
                  type="number"
                  placeholder={placeholder}
                  step={step}
                  min={min}
                  value={data[id] ?? 0}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg bg-slate-700 text-white border ${
                    getError(id) ? "border-rose-500" : "border-slate-600"
                  } focus:ring-2 focus:ring-emerald-400`}
                />
                {getError(id) && (
                  <p className="text-rose-400 text-xs mt-1">{getError(id)}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="text-xl text-blue-400 font-semibold">
                Cash After R&D:{" "}
                <span
                  className={
                    projectedCashBalance - (data.budget ?? 0) < 0
                      ? "text-rose-400"
                      : "text-emerald-400"
                  }
                >
                  {formatCurrency(projectedCashBalance - (data.budget ?? 0))}
                </span>
              </div>
              <div className="text-slate-300">
                Available Cash: {formatCurrency(projectedCashBalance)}
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
