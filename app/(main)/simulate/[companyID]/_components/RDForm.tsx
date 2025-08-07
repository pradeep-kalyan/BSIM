"use client";

import React, { useState } from "react";
import { IndianRupee, FlaskConical, Timer, TriangleAlert } from "lucide-react";
import DashboardCard from "@/ui/Card";
import { Slider } from "@/components/ui/slider";
import {
  useRDForm,
  useCashBalance,
  useCompanyForm,
} from "@/app/context/FormContext";
import { useSimulation } from "@/app/context/SimulationContext";

const formatCurrency = (val: number) =>
  `₹${val.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const RDForm = () => {
  const { data, updateData, getError, setError } = useRDForm();
  const { projectedCashBalance, cashBalance } = useCashBalance();
  const { data: companyData } = useCompanyForm();
  const { period } = useSimulation();

  const [budgetAlert, setBudgetAlert] = useState<string | null>(null);

  const handleChange = (fieldId: keyof typeof data, value: number) => {
    updateData({ [fieldId]: value });
    setError(fieldId, "");
    setBudgetAlert(null);

    if (
      fieldId === "budget" &&
      value > (cashBalance.originalCashBalance || 0)
    ) {
      setBudgetAlert("Insufficient cash balance for this R&D budget.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 min-h-screen p-4">
      <div className="max-w-4xl mx-auto py-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-blue-300">R&D Dashboard</h1>
          <span className="text-sm text-slate-400">
            Period {period} • {companyData?.name}
          </span>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <DashboardCard
            title="R&D Budget"
            value={formatCurrency(data.budget ?? 0)}
            subtitle="Allocation"
            icon={IndianRupee}
            size="small"
          />
          <DashboardCard
            title="Products in Pipeline"
            value={data.pip ?? 0}
            subtitle="Upcoming"
            icon={FlaskConical}
            size="small"
          />
          <DashboardCard
            title="Time to Market"
            value={`${data.time_to_market ?? 0} mo`}
            subtitle="Avg per release"
            icon={Timer}
            size="small"
          />
        </section>

        <div className="bg-slate-800/50 shadow-md rounded-xl p-4 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">
            Set R&D Strategy
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                id: "budget",
                label: "R&D Budget (₹)",
                max: companyData?.cash_balance * 2 || 100000,
              },
              { id: "pip", label: "Products in Pipeline", max: 20 },
              { id: "time_to_market", label: "Time to Market (mo)", max: 36 },
              {
                id: "total_development",
                label: "Total Development Cost (₹)",
                max: companyData?.cash_balance * 3 || 150000,
              },
              { id: "patented", label: "Patents Expected", max: 10 },
              {
                id: "quality_changes",
                label: "Quality Improvements (%)",
                max: 100,
              },
            ].map(({ id, label, max }) => (
              <div key={id}>
                <Slider
                  label={label}
                  value={[data[id as keyof typeof data] ?? 0]}
                  min={0}
                  max={max}
                  onValueChange={(val) =>
                    handleChange(id as keyof typeof data, val[0])
                  }
                />
                {getError(id as keyof typeof data) && (
                  <p className="text-rose-400 text-xs mt-1">
                    {getError(id as keyof typeof data)}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-1 text-sm text-slate-300">
            <div>
              Available Cash: {formatCurrency(cashBalance.originalCashBalance)}
            </div>
            <div className="text-blue-400 font-semibold">
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
            <div className="text-blue-400 font-semibold">
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

          {budgetAlert && (
            <div className="mt-4 bg-rose-900/60 border border-rose-700 text-rose-300 rounded-lg p-3 text-xs flex gap-2 items-start">
              <TriangleAlert className="text-rose-500 mt-0.5 h-4 w-4" />
              <p>{budgetAlert}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RDForm;
