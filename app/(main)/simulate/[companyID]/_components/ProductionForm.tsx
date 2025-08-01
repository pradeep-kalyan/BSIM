"use client";

import { IndianRupee, Factory, Package, AlertTriangle } from "lucide-react";
import React from "react";
import DashboardCard from "@/ui/Card";
import { Check, TriangleAlert } from "lucide-react";
import {
  useCashBalance,
  useCompanyForm,
  useProductionForm,
} from "@/app/context/FormContext";
import { useSimulation } from "@/app/context/SimulationContext";
import { CreateProduction, createProductionSchema } from "../_utils/validator";

const formatNumber = (num: number) =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const ProductionForm = () => {
  const { data, setError, getError, updateData } = useProductionForm();
  const { cashBalance, updateProductionBudgetImpact, projectedCashBalance } =
    useCashBalance();
  const { period, comId } = useSimulation();
  const { data: companyData } = useCompanyForm();
  const [budgetAlert, setBudgetAlert] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? "" : e.target.value;
    updateData({ [e.target.name]: Number(value) });
    setError(e.target.name, "");
    // Don't clear budget alert on every change - let validation handle it
    setSuccess(false); // Reset success state when user makes changes
  };

  const frozenData = React.useMemo(
    () => ({
      units_to_produce: data?.units_to_produce ?? 0,
      cost_per_unit: data?.cost_per_unit ?? 0,
      defect_rate: data?.defect_rate ?? 0,
      production_capacity: data?.production_capacity ?? 0,
      storage_capacity: data?.storage_capacity ?? 0,
    }),
    [data?.units_to_produce, data?.cost_per_unit, data?.defect_rate, data?.production_capacity, data?.storage_capacity]
  );

  const totalCost =
    data?.units_to_produce *
    data?.cost_per_unit *
    (1 + data?.defect_rate / 100);

  const handleValidate = () => {
    // Reset states at the beginning
    setSuccess(false);
    setBudgetAlert(null);

    const production_cost =
      data.units_to_produce * data.cost_per_unit * (1 + data.defect_rate / 100);
    const inventory_value = data.units_to_produce * data.cost_per_unit;

    const formData: CreateProduction = {
      company_id: comId ?? "",
      period: period ?? 0,
      production_capacity: Number(data.production_capacity),
      inventory_value,
      storage_capacity: Number(data.storage_capacity),
      cash_balance: companyData?.cash_balance ?? 0,
      defect_rate: Number(data.defect_rate),
      units_to_produce: Number(data.units_to_produce),
      cost_per_unit: Number(data.cost_per_unit),
      production_cost,
    };

    const result = createProductionSchema.safeParse(formData);

    const fieldKeys = [
      "units_to_produce",
      "cost_per_unit",
      "defect_rate",
      "production_capacity",
      "storage_capacity",
    ];

    // Clear old errors
    fieldKeys.forEach((key) => setError(key, ""));

    if (!result.success) {
      for (const issue of result.error.issues) {
        const path = issue.path?.[0];
        if (path === "production_cost") {
          setBudgetAlert(
            `⚠️ ${issue.message}. Required: ₹${formatNumber(
              Math.round(production_cost)
            )}, Available: ₹${formatNumber(companyData?.cash_balance ?? 0)}`
          );
        } else if (typeof path === "string" && fieldKeys.includes(path)) {
          setError(path, issue.message);
        } else {
          console.warn("Unhandled validation issue:", issue.message);
        }
      }
      return;
    }

    // Budget warning
    // Don't show success if there's a budget issue

    setBudgetAlert(null);
    setSuccess(true);

    updateProductionBudgetImpact(production_cost);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 min-h-screen p-6">
      <div className="max-w-5xl mx-auto py-8">
        <header className="mb-10 flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold text-blue-300">
            Production Dashboard
          </h1>
          <span className="text-lg text-slate-400 tracking-wide">
            Period {period} • {companyData?.name}
          </span>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
          <DashboardCard
            title="Production Capacity"
            value={frozenData.production_capacity}
            subtitle="Maximum units producible per period"
            icon={Factory}
            size="large"
          />
          <DashboardCard
            title="Planned Units"
            value={frozenData.units_to_produce}
            subtitle="Units scheduled for production"
            icon={Package}
            size="large"
          />
          <DashboardCard
            title="Storage Capacity"
            value={frozenData.storage_capacity}
            subtitle="Maximum storage capacity"
            icon={Package}
            size="large"
          />
          <DashboardCard
            title="Inventory Value"
            value={`₹${formatNumber(
              Math.round(frozenData.units_to_produce * frozenData.cost_per_unit)
            )}`}
            subtitle="Value of planned inventory"
            icon={IndianRupee}
            size="large"
          />
          <DashboardCard
            title="Defect Rate"
            value={`${frozenData.defect_rate}%`}
            subtitle="Expected defect percentage"
            icon={AlertTriangle}
            size="large"
          />
        </section>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleValidate();
          }}
          className="bg-slate-800/50 shadow-md rounded-2xl p-6 border border-slate-700"
          noValidate
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            Set Production Strategy
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                id: "units_to_produce",
                label: "Units to Produce",
                value: data?.units_to_produce ?? 0,
                type: "number",
                step: 1,
                min: 0,
                placeholder: "Enter number of units to produce",
              },
              {
                id: "cost_per_unit",
                label: "Cost per Unit (₹)",
                value: data?.cost_per_unit ?? 0,
                type: "number",
                step: 0.01,
                min: 0,
                placeholder: "Manufacturing cost per unit",
              },
              {
                id: "defect_rate",
                label: "Expected Defect Rate (%)",
                value: data?.defect_rate ?? 0,
                type: "number",
                step: 0.1,
                min: 0,
                max: 100,
                placeholder: "Expected defect rate percentage",
              },
              {
                id: "production_capacity",
                label: "Production Capacity (Units)",
                value: data?.production_capacity ?? 0,
                type: "number",
                step: 1,
                min: 0,
                placeholder: "Maximum production capacity per period",
              },
              {
                id: "storage_capacity",
                label: "Storage Capacity (Units)",
                value: data?.storage_capacity ?? 0,
                type: "number",
                step: 1,
                min: 0,
                placeholder: "Maximum storage capacity for finished goods",
              },
            ].map((field) => (
              <div key={field.id}>
                <label
                  htmlFor={field.id}
                  className="block text-slate-200 font-semibold mb-1"
                >
                  {field.label}
                </label>
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  step={field.step}
                  min={field.min}
                  max={field.max}
                  value={field.value}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className={`w-full p-3 rounded-lg bg-slate-700 text-white border ${
                    getError(field.id) ? "border-rose-500" : "border-slate-600"
                  } focus:ring-2 focus:ring-emerald-400`}
                />
                {getError(field.id) && (
                  <p className="text-rose-400 text-xs mt-1">
                    {getError(field.id)}
                  </p>
                )}
              </div>
            ))}

            {/* Read-only Inventory Value */}
            <div>
              <label
                htmlFor="inventory_value"
                className="block text-slate-200 font-semibold mb-1"
              >
                Inventory Value (₹)
              </label>
              <input
                id="inventory_value"
                name="inventory_value"
                type="text"
                value={formatNumber(
                  Math.round(data?.units_to_produce * data?.cost_per_unit)
                )}
                readOnly
                placeholder="Calculated inventory value"
                className="w-full p-3 rounded-lg bg-slate-600 text-slate-300 border border-slate-600 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="text-xl text-blue-400 font-semibold">
                Total Production Cost (incl.
                {Math.round(
                  (data?.units_to_produce * data?.defect_rate) / 100
                )}{" "}
                defected units): ₹{formatNumber(Math.round(totalCost))}
              </div>
              <div className="text-sm space-y-1">
                <div className="text-slate-300">
                  Available Cash Balance: ₹
                  {formatNumber(cashBalance.originalCashBalance ?? 0)}
                </div>
                <div
                  className={`font-semibold ${
                    totalCost > projectedCashBalance
                      ? "text-rose-400"
                      : "text-emerald-400"
                  }`}
                >
                  projectedCashBalance : ₹
                  {formatNumber(Math.round(projectedCashBalance))}
                </div>
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
                <div
                  className="bg-rose-900/60 border border-rose-700 text-rose-300 rounded-lg p-4 animate-pulse"
                  role="alert"
                >
                  <div className="flex items-start gap-3">
                    <TriangleAlert className="text-rose-500 mt-0.5" />
                    <p className="text-sm">{budgetAlert}</p>
                  </div>
                </div>
              )}

              {success && !budgetAlert && (
                <div
                  className="bg-green-900/60 border border-white/80 text-white rounded-lg p-4 animate-bounce"
                  role="alert"
                >
                  <div className="flex items-center gap-3">
                    <Check className="text-green-400 text-xl" />
                    <p className="text-xl font-semibold">
                      Form Validated Successfully
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

export default ProductionForm;
