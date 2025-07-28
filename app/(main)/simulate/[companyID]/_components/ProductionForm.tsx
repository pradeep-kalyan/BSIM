"use client";
import {
  IndianRupee,
  Factory,
  Package,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Loader2,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import DashboardCard from "./Card";
import {
  getCompanyData,
  getHistoricalProductionData,
  getCurrentProductionDecision,
  submitProductionDecisionForPeriod,
} from "@/app/_actions/production-actions";

interface CompanyData {
  id: string;
  name: string;
  current_period: number;
  cash_balance: number;
}

interface HistoricalData {
  period: number;
  units_produced: number;
  cost_per_unit: number;
  inventory_value: number;
  defect_rate: number;
}

interface ProductionFormProps {
  companyId: string;
}

const ProductionForm: React.FC<ProductionFormProps> = ({ companyId }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);

  const [productionData, setProductionData] = useState({
    current: {
      units_produced: 0,
      cost_per_unit: 0,
      inventory_value: 0,
      defect_rate: 0,
    },
    previous: {
      units_produced: 0,
      cost_per_unit: 0,
      inventory_value: 0,
      defect_rate: 0,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [company, historical] = await Promise.all([
          getCompanyData(companyId),
          getHistoricalProductionData(companyId),
        ]);

        setCompanyData(company);
        setHistoricalData(historical);

        // Set default values based on last period
        if (historical.length > 0) {
          const lastPeriod = historical[historical.length - 1];
          const decision = await getCurrentProductionDecision(
            company.id,
            company.current_period
          );

          setProductionData({
            current: {
              units_produced:
                decision?.units_produced || lastPeriod.units_produced || 0,
              cost_per_unit:
                decision?.cost_per_unit || lastPeriod.cost_per_unit || 0,
              inventory_value:
                decision?.inventory_value || lastPeriod.inventory_value || 0,
              defect_rate: decision?.defect_rate || lastPeriod.defect_rate || 0,
            },
            previous: {
              units_produced: lastPeriod.units_produced,
              cost_per_unit: lastPeriod.cost_per_unit,
              inventory_value: lastPeriod.inventory_value,
              defect_rate: lastPeriod.defect_rate,
            },
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  const handleInputChange = (
    field: keyof typeof productionData.current,
    value: number
  ) => {
    setProductionData((prev) => ({
      ...prev,
      current: {
        ...prev.current,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!companyData) return;

    try {
      setSubmitting(true);
      setError(null);

      await submitProductionDecisionForPeriod({
        company_id: companyId,
        period: companyData.current_period,
        units_produced: productionData.current.units_produced,
        cost_per_unit: productionData.current.cost_per_unit,
        inventory_value: productionData.current.inventory_value,
        defect_rate: productionData.current.defect_rate,
      });

      // Refresh the page after submission
      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit production decision"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-slate-300">Loading production dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-slate-300">No company data found</p>
      </div>
    );
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const unitsChange = calculateChange(
    productionData.current.units_produced,
    productionData.previous.units_produced
  );
  const costChange = calculateChange(
    productionData.current.cost_per_unit,
    productionData.previous.cost_per_unit
  );
  const inventoryChange = calculateChange(
    productionData.current.inventory_value,
    productionData.previous.inventory_value
  );

  const totalProductionCost =
    productionData.current.units_produced *
    productionData.current.cost_per_unit;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-2">
      <div className="max-w-7xl mx-auto mt-2">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Production Dashboard
              </h1>
              <p className="text-slate-400">
                Period {companyData.current_period} • {companyData.name}
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <DashboardCard
            title="Units to Produce"
            value={productionData.current.units_produced.toLocaleString()}
            subtitle="Production Target"
            icon={Factory}
            size="small"
            gradient={true}
            change={unitsChange}
          />
          <DashboardCard
            title="Cost per Unit"
            value={formatCurrency(productionData.current.cost_per_unit)}
            subtitle="Manufacturing Cost"
            icon={IndianRupee}
            size="small"
            gradient={true}
            change={costChange}
          />
          <DashboardCard
            title="Inventory Value"
            value={formatCurrency(productionData.current.inventory_value)}
            subtitle="Current Inventory"
            icon={Package}
            size="small"
            gradient={true}
            change={inventoryChange}
          />
          <DashboardCard
            title="Defect Rate"
            value={`${productionData.current.defect_rate}%`}
            subtitle="Quality Control"
            icon={AlertTriangle}
            size="small"
            gradient={true}
            change={calculateChange(
              productionData.current.defect_rate,
              productionData.previous.defect_rate
            )}
          />
        </div>

        {/* Historical Performance */}
        {historicalData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {productionData.previous.units_produced.toLocaleString()}
              </div>
              <div className="text-slate-400 text-sm">Previous Production</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="h-8 w-8 text-red-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {productionData.previous.defect_rate}%
              </div>
              <div className="text-slate-400 text-sm">Previous Defect Rate</div>
            </div>
          </div>
        )}

        {/* Production Decision Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">
            Set Production Strategy
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Units to Produce */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Units to Produce
              </label>
              <input
                type="number"
                value={productionData.current.units_produced}
                onChange={(e) =>
                  handleInputChange(
                    "units_produced",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="Number of units to produce"
                className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-400"
              />
            </div>

            {/* Cost per Unit */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Cost per Unit
              </label>
              <input
                type="number"
                step="0.01"
                value={productionData.current.cost_per_unit}
                onChange={(e) =>
                  handleInputChange(
                    "cost_per_unit",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="Manufacturing cost per unit"
                className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-400"
              />
            </div>

            {/* Inventory Value */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Inventory Value
              </label>
              <input
                type="number"
                step="0.01"
                value={productionData.current.inventory_value}
                onChange={(e) =>
                  handleInputChange(
                    "inventory_value",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="Current inventory value"
                className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-400"
              />
            </div>

            {/* Defect Rate */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Target Defect Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={productionData.current.defect_rate}
                onChange={(e) =>
                  handleInputChange(
                    "defect_rate",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="Acceptable defect rate percentage"
                className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-400"
              />
            </div>
          </div>

          {/* Total Cost Display */}
          <div className="mt-6 bg-slate-700/50 rounded-lg p-4">
            <div className="text-center">
              <p className="text-slate-300 text-sm">Total Production Cost</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(totalProductionCost)}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              onClick={handleSubmit}
              disabled={
                submitting ||
                productionData.current.units_produced <= 0 ||
                productionData.current.cost_per_unit <= 0 ||
                companyData.cash_balance < totalProductionCost
              }
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Production Decision"
              )}
            </button>
          </div>

          {/* Budget Validation */}
          {companyData.cash_balance < totalProductionCost && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mt-4">
              <p className="text-red-200 text-sm">
                ⚠️ Insufficient cash balance. Required:{" "}
                {formatCurrency(totalProductionCost)}, Available:{" "}
                {formatCurrency(companyData.cash_balance)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductionForm;
