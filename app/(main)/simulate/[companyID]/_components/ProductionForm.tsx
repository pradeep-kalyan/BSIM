"use client";

import {
  IndianRupee,
  Factory,
  Package,
  AlertTriangle,
  Warehouse,
} from "lucide-react";
import React from "react";
import DashboardCard from "@/ui/Card";
import { Check, TriangleAlert } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  useCashBalance,
  useCompanyForm,
  useProductionForm,
} from "@/app/context/FormContext";
import { useSimulation } from "@/app/context/SimulationContext";
import { CreateProduction, createProductionSchema } from "../_utils/validator";

const formatNumber = (num: number) =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const formatCurrency = (val: number): string => {
  if (val >= 1_00_00_000) return `₹${(val / 1_00_00_000).toFixed(1)}Cr`;
  if (val >= 1_00_000) return `₹${(val / 1_00_000).toFixed(1)}L`;
  if (val >= 1_000) return `₹${(val / 1_000).toFixed(1)}K`;
  return `₹${val}`;
};
const ProductionForm = () => {
  const { data, setError, getError, updateData } = useProductionForm();
  const { cashBalance, updateProductionBudgetImpact, projectedCashBalance } =
    useCashBalance();
  const { period, comId } = useSimulation();
  const { data: companyData } = useCompanyForm();
  const [budgetAlert, setBudgetAlert] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleChange = (fieldName: string, value: number) => {
    updateData({ [fieldName]: value });
    setError(fieldName, "");
    setSuccess(false);
  };

  const frozenData = React.useMemo(
    () => ({
      units_to_produce: data?.units_to_produce ?? 0,
      cost_per_unit: data?.cost_per_unit ?? 0,
      defect_rate: data?.defect_rate ?? 0,
      production_capacity: data?.production_capacity ?? 0,
      storage_capacity: data?.storage_capacity ?? 0,
    }),
    [
      data?.units_to_produce,
      data?.cost_per_unit,
      data?.defect_rate,
      data?.production_capacity,
      data?.storage_capacity,
    ]
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

        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <DashboardCard
            title="Production Capacity"
            value={frozenData.production_capacity}
            subtitle="Max output per cycle"
            icon={Factory}
          />
          <DashboardCard
            title="Planned Units"
            value={frozenData.units_to_produce}
            subtitle="Scheduled production"
            icon={Package}
          />
          <DashboardCard
            title="Storage Capacity"
            value={frozenData.storage_capacity}
            subtitle="Max inventory space"
            icon={Warehouse}
          />
          <DashboardCard
            title="Inventory Value"
            value={`₹${formatNumber(
              Math.round(frozenData.units_to_produce * frozenData.cost_per_unit)
            )}`}
            subtitle="Planned stock value"
            icon={IndianRupee}
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
            {/* Units to Produce Slider */}
            <div>
              <Slider
                label="Units to Produce"
                defaultValue={[data?.units_to_produce ?? 0]}
                value={[data?.units_to_produce ?? 0]}
                min={0}
                max={Math.max(data?.production_capacity * 2 || 2000, 1000)}
                onValueChange={(val) =>
                  handleChange("units_to_produce", val[0])
                }
              />
              {getError("units_to_produce") && (
                <p className="text-rose-400 text-xs mt-1">
                  {getError("units_to_produce")}
                </p>
              )}
            </div>

            {/* Cost per Unit Slider */}
            <div>
              <Slider
                label="Cost per Unit (₹)"
                defaultValue={[data?.cost_per_unit ?? 0]}
                value={[data?.cost_per_unit ?? 0]}
                min={0}
                max={1000}
                onValueChange={(val) => handleChange("cost_per_unit", val[0])}
              />
              {getError("cost_per_unit") && (
                <p className="text-rose-400 text-xs mt-1">
                  {getError("cost_per_unit")}
                </p>
              )}
            </div>

            {/* Defect Rate Slider */}
            <div>
              <Slider
                label="Expected Defect Rate (%)"
                defaultValue={[data?.defect_rate ?? 0]}
                value={[data?.defect_rate ?? 0]}
                min={0}
                max={100}
                onValueChange={(val) => handleChange("defect_rate", val[0])}
              />
              {getError("defect_rate") && (
                <p className="text-rose-400 text-xs mt-1">
                  {getError("defect_rate")}
                </p>
              )}
            </div>

            {/* Production Capacity Slider */}
            <div>
              <Slider
                label="Production Capacity (Units)"
                defaultValue={[data?.production_capacity ?? 0]}
                value={[data?.production_capacity ?? 0]}
                min={0}
                max={5000}
                onValueChange={(val) =>
                  handleChange("production_capacity", val[0])
                }
              />
              {getError("production_capacity") && (
                <p className="text-rose-400 text-xs mt-1">
                  {getError("production_capacity")}
                </p>
              )}
            </div>

            {/* Storage Capacity Slider */}
            <div>
              <Slider
                label="Storage Capacity (Units)"
                defaultValue={[data?.storage_capacity ?? 0]}
                value={[data?.storage_capacity ?? 0]}
                min={0}
                max={10000}
                onValueChange={(val) =>
                  handleChange("storage_capacity", val[0])
                }
              />
              {getError("storage_capacity") && (
                <p className="text-rose-400 text-xs mt-1">
                  {getError("storage_capacity")}
                </p>
              )}
            </div>

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
                value={formatCurrency(
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
                defected units): ₹{formatCurrency(Math.round(totalCost))}
              </div>
              <div className="text-sm space-y-1">
                <div className="text-slate-300">
                  Available Cash Balance: 
                  {" "+formatCurrency(cashBalance.originalCashBalance ?? 0)}
                </div>
                <div
                  className={`font-semibold ${
                    totalCost > projectedCashBalance
                      ? "text-rose-400"
                      : "text-emerald-400"
                  }`}
                >
                  projectedCashBalance : 
                  {" "+formatCurrency(Math.round(projectedCashBalance))}
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
