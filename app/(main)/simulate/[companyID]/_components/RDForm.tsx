"use client";

import React, { useState, useEffect } from "react";
import { IndianRupee, FlaskConical, Timer, TriangleAlert } from "lucide-react";
import InfoCard from "@/app/components/InfoCard";
import { Slider } from "@/components/ui/slider";
import { useRDForm, useCashBalance } from "@/app/context/FormContext";
import formatCurrency from "@/app/functions/formatCurrency";

const RDForm = () => {
  const { data, updateData, getError, setError } = useRDForm();
  const { projectedCashBalance, cashBalance } = useCashBalance();

  const [budgetAlert, setBudgetAlert] = useState<string | null>(null);

  // Update R&D budget impact dynamically whenever budget or total_development changes
  useEffect(() => {
    // Budget impact is automatically handled by updateData in useRDForm hook
  }, [data.budget, data.total_development]);

  const handleChange = (fieldId: keyof typeof data, value: number) => {
    updateData({ [fieldId]: value });
    setError(fieldId, "");
    setBudgetAlert(null);

    // Basic validation for budget
    if (
      fieldId === "budget" &&
      value > (cashBalance.originalCashBalance || 0)
    ) {
      setBudgetAlert("Insufficient cash balance for this R&D budget.");
    }
  };

  return (
    <div className="bg-slate-800/50 shadow-md p-4">
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 mx-2">
        <InfoCard
          label="R&D Budget"
          value={formatCurrency(data.budget ?? 0)}
          isCurrency={true}
          Icon={IndianRupee}
          iconColor="text-yellow-400"
          labelColor="text-white"
          valueColor="text-white"
          width="w-full"
          height="h-full"
        />
        <InfoCard
          label="Products in Pipeline"
          value={data.pip ?? 0}
          isCurrency={false}
          Icon={FlaskConical}
          iconColor="text-blue-400"
          labelColor="text-white"
          valueColor="text-white"
          width="w-full"
          height="h-full"
        />
        <InfoCard
          label="Time to Market"
          value={`${data.time_to_market ?? 0} Months`}
          isCurrency={false}
          Icon={Timer}
          iconColor="text-green-400"
          labelColor="text-white"
          valueColor="text-white"
          width="w-full"
          height="h-full"
        />
        <InfoCard
          label="Quality Improvements"
          value={`${data.quality_changes ?? 0}%`}
          isCurrency={false}
          Icon={Timer}
          iconColor="text-green-400"
          labelColor="text-white"
          valueColor="text-white"
          width="w-full"
          height="h-full"
        />
      </section>

      <div className="max-w-full mx-2 ">
        <div className="bg-slate-800/50 shadow-md rounded-2xl py-4 px-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-2">
            Set R&D Strategy
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {/* R&D Budget Slider */}
            <div>
              <Slider
                label="R&D Budget (₹/year)"
                tooltipText="Total R&D allocation"
                defaultValue={[data.budget ?? 0]}
                value={[data.budget ?? 0]}
                min={0}
                max={data.budget * 2 || 100000}
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
                tooltipText="Products under development"
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
                label="Time to Market (in months)"
                tooltipText="Development to launch time"
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

            {/* Patents Expected Slider */}
            <div>
              <Slider
                label="Patents Expected"
                tooltipText="Intellectual property protection"
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
                tooltipText="Product quality enhancement"
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
          </div>

          {budgetAlert && (
            <div className="mt-6 space-y-4">
              <div className="bg-rose-900/60 border border-rose-700 text-rose-300 rounded-lg p-4 animate-pulse">
                <div className="flex items-start gap-3">
                  <TriangleAlert className="text-rose-500 mt-0.5" />
                  <p className="text-sm">{budgetAlert}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RDForm;
