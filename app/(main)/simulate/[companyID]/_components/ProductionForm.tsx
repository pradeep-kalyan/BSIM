"use client";

import { IndianRupee, Factory, Package, AlertTriangle } from "lucide-react";
import React, { useEffect } from "react";
import DashboardCard from "@/ui/Card";
import { TriangleAlert } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  useCashBalance,
  useCompanyForm,
  useProductionForm,
} from "@/app/context/FormContext";
import { useSimulation } from "@/app/context/SimulationContext";

const formatNumber = (num: number) =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const ProductionForm = () => {
  const { data, setError, getError, updateData } = useProductionForm();
  const { cashBalance, projectedCashBalance, updateProductionBudgetImpact } =
    useCashBalance();
  const { period } = useSimulation();
  const { data: companyData } = useCompanyForm();
  const [budgetAlert, setBudgetAlert] = React.useState<string | null>(null);

  const handleChange = (fieldName: string, value: number) => {
    updateData({ [fieldName]: value });
    setError(fieldName, "");
    setBudgetAlert(null);

    // Check if the new production cost will exceed cash balance
    const newData = { ...data, [fieldName]: value };
    const newTotalCost =
      newData?.units_to_produce *
      newData?.cost_per_unit *
      (1 + newData?.defect_rate / 100);

    if (newTotalCost > projectedCashBalance) {
      setBudgetAlert(
        `Warning: Production cost of ₹${formatNumber(
          Math.round(newTotalCost)
        )} exceeds your projected cash balance of ₹${formatNumber(
          Math.round(projectedCashBalance)
        )}. Consider reducing production volume or cost per unit.`
      );
    }
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

  // Calculate total production budget impact
  const totalProductionBudget = React.useMemo(() => {
    const qualityInvestment = data?.quality_improvement_investment ?? 0;
    const efficiencyUpgrade = data?.efficiency_upgrade_cost ?? 0;
    const maintenance = data?.maintenance_budget ?? 0;
    const safety = data?.safety_investment ?? 0;
    const environmental = data?.environmental_compliance_cost ?? 0;
    const productionCost = totalCost ?? 0;

    return (
      qualityInvestment +
      efficiencyUpgrade +
      maintenance +
      safety +
      environmental +
      productionCost
    );
  }, [
    data?.quality_improvement_investment,
    data?.efficiency_upgrade_cost,
    data?.maintenance_budget,
    data?.safety_investment,
    data?.environmental_compliance_cost,
    totalCost,
  ]);

  // Update production budget impact whenever the total changes
  useEffect(() => {
    updateProductionBudgetImpact(totalProductionBudget);
  }, [totalProductionBudget, updateProductionBudgetImpact]);

  // Check for budget alerts when totalCost or projectedCashBalance changes
  useEffect(() => {
    if (totalCost && totalCost > projectedCashBalance) {
      setBudgetAlert(
        `Warning: Production cost of ₹${formatNumber(
          Math.round(totalCost)
        )} exceeds your projected cash balance of ₹${formatNumber(
          Math.round(projectedCashBalance)
        )}. Consider reducing production volume or cost per unit.`
      );
    } else {
      setBudgetAlert(null);
    }
  }, [totalCost, projectedCashBalance]);

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

        <div className="bg-slate-800/50 shadow-md rounded-2xl p-6 border border-slate-700">
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
                  Projected Cash Balance: ₹
                  {formatNumber(Math.round(projectedCashBalance))}
                </div>
              </div>
            </div>
          </div>

          {budgetAlert && (
            <div className="mt-6 space-y-4">
              <div
                className="bg-rose-900/60 border border-rose-700 text-rose-300 rounded-lg p-4"
                role="alert"
              >
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

export default ProductionForm;
