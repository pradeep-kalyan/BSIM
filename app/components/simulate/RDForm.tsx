"use client";

import React, { useState } from "react";
import {
  IndianRupee,
  FlaskConical,
  Timer,
  TriangleAlert,
  Award,
} from "lucide-react";
import InfoCard from "@/app/ui/InfoCard";
import { Slider } from "@/components/ui/slider";
import { useRDForm, useCashBalance } from "@/app/context/FormContext";
import formatCurrency from "@/app/functions/formatCurrency";

const RDForm = () => {
  const { data, updateData, getError, setError } = useRDForm();
  const { projectedCashBalance, cashBalance } = useCashBalance();

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
    <div className="h-full bg-slate-800/50 shadow-md p-4">
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
          Icon={Award}
          iconColor="text-purple-400"
          labelColor="text-white"
          valueColor="text-white"
          width="w-full"
          height="h-full"
        />
      </section>

      <div className="max-w-full mx-2 ">
        <div className="bg-slate-800/50 shadow-md rounded-2xl py-4 px-6 border border-slate-700">
          <h2 className="text-xl tracking-wide font-semibold font-roboto-sans text-white">
            Set R&D Strategy
          </h2>
          <hr className=" my-5 border border-slate-700" />
          <div className="grid gap-6 md:grid-cols-2 px-6">
            {/* R&D Budget Slider */}
            <div>
              <Slider
                label="R&D Budget"
                tooltipText="Amount you spend per year on creating new products and improving existing ones (₹ per year)"
                defaultValue={[data.budget ?? 0]}
                value={data.budget ?? 0}
                min={0}
                max={data.budget * 2 || 100000}
                onValueChange={(val) => handleChange("budget", val)}
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
                tooltipText="Number of new products you're currently developing and working on"
                defaultValue={[data.pip ?? 0]}
                value={data.pip ?? 0}
                min={0}
                max={20}
                onValueChange={(val) => handleChange("pip", val)}
              />
              {getError("pip") && (
                <p className="text-rose-400 text-xs mt-1">{getError("pip")}</p>
              )}
            </div>

            {/* Time to Market Slider */}
            <div>
              <Slider
                label="Time to Market"
                tooltipText="Number of months needed to complete and launch your new products"
                defaultValue={[data.time_to_market ?? 0]}
                value={data.time_to_market ?? 0}
                min={0}
                max={36}
                onValueChange={(val) => handleChange("time_to_market", val)}
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
                tooltipText="Number of patents you expect to get for your inventions and innovations"
                defaultValue={[data.patented ?? 0]}
                value={data.patented ?? 0}
                min={0}
                max={10}
                onValueChange={(val) => handleChange("patented", val)}
              />
              {getError("patented") && (
                <p className="text-rose-400 text-xs mt-1">
                  {getError("patented")}
                </p>
              )}
            </div>

            <div className="flex text-white  gap-6 items-center text-medium font-roboto-sans">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="flex flex-col gap-1">
                  <p>Available Cash:</p>
                  <p>{formatCurrency(cashBalance.originalCashBalance)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <div className="flex flex-col gap-1">
                  <p>R&D budget:</p>
                  <p>
                    {formatCurrency(
                      cashBalance.financeBudgetImpact - (data.budget ?? 0)
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="flex flex-col gap-1">
                  <p>Projected Balance:</p>
                  <p>{formatCurrency(projectedCashBalance ?? 0)}</p>
                </div>
              </div>
            </div>

            {/* Quality Improvements Slider */}
            <div>
              <Slider
                label="Quality Improvements"
                tooltipText="Percentage improvement you want to make in your products' quality over the year"
                defaultValue={[data.quality_changes ?? 0]}
                value={data.quality_changes ?? 0}
                isPercentage={true}
                min={0}
                max={100}
                onValueChange={(val) => handleChange("quality_changes", val)}
              />
              {getError("quality_changes") && (
                <p className="text-rose-400 text-xs mt-1">
                  {getError("quality_changes")}
                </p>
              )}
            </div>
          </div>

          {budgetAlert && (
            <div className="mt-6 space-y-4">
              <div className="bg-rose-900/60 border border-rose-700 text-rose-300 rounded-lg p-4 animate-pulse">
                <div className="flex items-start gap-3">
                  <TriangleAlert className="text-rose-500 mt-0.5" />
                  <p className="text-sm font-roboto-sans">{budgetAlert}</p>
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
