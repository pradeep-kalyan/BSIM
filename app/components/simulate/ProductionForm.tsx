"use client";

import {
  IndianRupee,
  Factory,
  Package,
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Zap,
  BarChart3,
  Calculator,
  Warehouse,
} from "lucide-react";
import React from "react";
import { Slider } from "@/components/ui/slider";
import {
  useCashBalance,
  useProductForm,
  useProductionForm,
} from "@/app/context/FormContext";
import InfoCard from "@/app/components/InfoCard";
import formatCurrency from "@/app/functions/formatCurrency";

// Type for production data per product - matches DB schema
type ProductProductionData = {
  product_id: string;
  units_to_produce: number;
  cost_per_unit: number;
  total_cost: number;
  production_capacity: number;
  storage_capacity: number;
  inventory_value: number;
  defect_rate: number;
};

const formatNumber = (num: number) =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// Helper function for consistent cost calculation
const calculateProductionCost = (
  targetUnits: number,
  costPerUnit: number,
  defectRate: number
): number => {
  if (targetUnits === 0 || costPerUnit === 0) return 0;
  const totalUnitsRequired = targetUnits / (1 - defectRate / 100);
  return totalUnitsRequired * costPerUnit;
};

const ProductionForm = () => {
  const {
    data: productionData,
    setError,
    updateData: updateProductionData,
  } = useProductionForm();
  const { data: productData, updateProductByIndex } = useProductForm();
  const { cashBalance, projectedCashBalance } = useCashBalance();

  function handleProductChange(
    productId: string,
    field: keyof Omit<ProductProductionData, "product_id">,
    value: number
  ) {
    const updatedProducts = productionData.products.map((prod) =>
      prod.product_id === productId
        ? {
            ...prod,
            [field]: value,
            // Auto-calculate total_cost when relevant fields change
            total_cost:
              field === "units_to_produce" ||
              field === "cost_per_unit" ||
              field === "defect_rate"
                ? calculateProductionCost(
                    field === "units_to_produce"
                      ? value
                      : prod.units_to_produce,
                    field === "cost_per_unit" ? value : prod.cost_per_unit,
                    field === "defect_rate" ? value : prod.defect_rate
                  )
                : prod.total_cost,
          }
        : prod
    );

    updateProductionData({ ...productionData, products: updatedProducts });

    // Update the product's inventory level to reflect production output
    if (field === "units_to_produce") {
      const productIndex = productData.findIndex((p) => p.id === productId);
      if (productIndex >= 0) {
        updateProductByIndex(productIndex, {
          inventory_level: value,
        });
      }
    }

    setError(String(field), ""); // Clear error
  }

  // Initialize production data for products that don't have it yet
  React.useEffect(() => {
    if (productData.length > 0) {
      const existingProductionIds = new Set(
        productionData.products.map((p) => p.product_id)
      );

      // Find products that don't have production entries
      const productsNeedingProduction = productData.filter(
        (product) => product.id && !existingProductionIds.has(product.id)
      );

      if (productsNeedingProduction.length > 0) {
        const newProductionEntries = productsNeedingProduction.map(
          (product) => ({
            product_id: product.id || "",
            units_to_produce: 0,
            cost_per_unit: 0,
            total_cost: 0,
            production_capacity: product.production_capacity || 2000,
            storage_capacity: 0,
            inventory_value: 0,
            defect_rate: 0,
          })
        );

        // Add new entries to existing production data
        const updatedProducts = [
          ...productionData.products,
          ...newProductionEntries,
        ];
        updateProductionData({ ...productionData, products: updatedProducts });
      }
    }
  }, [productData, productionData, updateProductionData]);

  // Merge product info with production info
  const mergedProducts = productData.map((prod) => {
    const productionEntry = productionData.products.find(
      (p) => p.product_id === prod.id
    );
    return {
      ...prod,
      ...(productionEntry || {
        product_id: prod.id || "",
        units_to_produce: 0,
        cost_per_unit: 0,
        total_cost: 0,
        production_capacity: prod.production_capacity || 2000,
        storage_capacity: 0,
        inventory_value: 0,
        defect_rate: 0,
      }),
    };
  });

  const totalCost = mergedProducts.reduce(
    (sum, prod) =>
      sum +
      (prod.total_cost ||
        calculateProductionCost(
          prod.units_to_produce,
          prod.cost_per_unit,
          prod.defect_rate
        )),
    0
  );

  // Calculate aggregated metrics for info cards
  const totalPlannedUnits = mergedProducts.reduce(
    (sum, prod) => sum + prod.units_to_produce,
    0
  );
  const totalStorageCapacity = mergedProducts.reduce(
    (sum, prod) => sum + (prod.storage_capacity || 0),
    0
  );
  const totalInventoryValue = mergedProducts.reduce(
    (sum, prod) => sum + (prod.inventory_value || 0),
    0
  );

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl py-6 px-8 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Factory className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Production Management
          </h1>
        </div>
        <p className="text-slate-400 text-lg">
          Optimize your production strategy and manage capacity efficiently
        </p>
      </div>

      {/* Key Metrics Dashboard */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 hover:scale-105 transition-transform duration-200">
          <InfoCard
            label="Total Capacity"
            value={mergedProducts.reduce(
              (sum, prod) => sum + (prod.production_capacity || 0),
              0
            )}
            Icon={Factory}
            iconColor="text-purple-400"
            labelColor="text-white"
            valueColor="text-white"
          />
          <div className="mt-2 text-xs text-purple-300">
            Maximum production potential
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4 hover:scale-105 transition-transform duration-200">
          <InfoCard
            label="Planned Units"
            value={totalPlannedUnits}
            Icon={Package}
            iconColor="text-blue-400"
            labelColor="text-white"
            valueColor="text-white"
          />
          <div className="mt-2 text-xs text-blue-300 flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            {mergedProducts.reduce(
              (sum, prod) => sum + (prod.production_capacity || 0),
              0
            ) > 0
              ? `${(
                  (totalPlannedUnits /
                    mergedProducts.reduce(
                      (sum, prod) => sum + (prod.production_capacity || 0),
                      0
                    )) *
                  100
                ).toFixed(1)}% capacity used`
              : "No capacity defined"}
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 backdrop-blur-sm border border-indigo-500/30 rounded-xl p-4 hover:scale-105 transition-transform duration-200">
          <InfoCard
            label="Storage Capacity"
            value={totalStorageCapacity}
            Icon={Warehouse}
            iconColor="text-indigo-400"
            labelColor="text-white"
            valueColor="text-white"
          />
          <div className="mt-2 text-xs text-indigo-300">
            Available storage space
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-4 hover:scale-105 transition-transform duration-200">
          <InfoCard
            label="Inventory Value"
            value={totalInventoryValue}
            isCurrency={true}
            Icon={IndianRupee}
            iconColor="text-yellow-400"
            labelColor="text-white"
            valueColor="text-white"
          />
          <div className="mt-2 text-xs text-yellow-300">
            Current stock valuation
          </div>
        </div>
      </section>

      {/* Production Configuration */}
      <div className="max-w-full mx-auto">
        <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-lg shadow-2xl rounded-3xl px-10 py-8 border border-slate-600/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Production Strategy
              </h2>
              <p className="text-slate-400">
                Configure production parameters for each product
              </p>
            </div>
          </div>

          {mergedProducts.map((product, index) => {
            // units_to_produce now means final usable units - no defect deduction needed
            const effectiveUnits = product.units_to_produce;
            const productionEfficiency =
              product.production_capacity > 0
                ? (product.units_to_produce / product.production_capacity) * 100
                : 0;
            const storageUtilization =
              product.storage_capacity > 0
                ? (product.units_to_produce / product.storage_capacity) * 100
                : 0;

            return (
              <div
                key={product.id}
                className="bg-gradient-to-r from-slate-700/60 to-slate-600/60 backdrop-blur-sm border border-slate-500/30 rounded-2xl p-6 mb-8 hover:shadow-xl transition-all duration-300"
              >
                {/* Product Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white text-lg">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-slate-300 mt-1">
                        <span className="flex items-center gap-1">
                          <Factory className="h-4 w-4" />
                          Capacity:{" "}
                          {formatNumber(product.production_capacity || 0)}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          Efficiency: {productionEfficiency.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2">
                    {productionEfficiency > 100 ? (
                      <div className="flex items-center gap-1 text-red-400 bg-red-500/20 px-3 py-1 rounded-full text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        Overload
                      </div>
                    ) : productionEfficiency > 80 ? (
                      <div className="flex items-center gap-1 text-yellow-400 bg-yellow-500/20 px-3 py-1 rounded-full text-sm">
                        <Zap className="h-4 w-4" />
                        High Load
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-green-400 bg-green-500/20 px-3 py-1 rounded-full text-sm">
                        <CheckCircle className="h-4 w-4" />
                        Optimal
                      </div>
                    )}
                  </div>
                </div>

                {/* Configuration Sliders */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-6">
                    <Slider
                      label="📦 Units to Produce"
                      tooltipText="Set the number of final usable units you want to produce (defect rate only affects production cost)"
                      value={[product.units_to_produce]}
                      min={0}
                      max={product.production_capacity * 2 || 2000}
                      onValueChange={(val) =>
                        product.id &&
                        handleProductChange(
                          product.id,
                          "units_to_produce",
                          val[0]
                        )
                      }
                    />

                    <Slider
                      label="💰 Cost per Unit (₹)"
                      tooltipText="The cost per unit affects your total production expenses and profit margins"
                      value={[product?.cost_per_unit]}
                      min={0}
                      max={1000}
                      onValueChange={(val) =>
                        product.id &&
                        handleProductChange(product.id, "cost_per_unit", val[0])
                      }
                    />
                    <Slider
                      label="🏪 Production Capacity"
                      tooltipText="Production capacity determines how many units you can produce per year"
                      value={[product.production_capacity || 0]}
                      min={0}
                      max={product.production_capacity || 10000}
                      onValueChange={(val) =>
                        product.id &&
                        handleProductChange(
                          product.id,
                          "production_capacity",
                          val[0]
                        )
                      }
                    />
                  </div>

                  <div className="space-y-6">
                    <Slider
                      label="⚠️ Defect Rate (%)"
                      tooltipText="Defect rate increases production costs (more units must be produced to get the target amount) but doesn't reduce final usable units"
                      isPercentage
                      value={[product.defect_rate]}
                      min={0}
                      max={100}
                      onValueChange={(val) =>
                        product.id &&
                        handleProductChange(product.id, "defect_rate", val[0])
                      }
                    />

                    <Slider
                      label="🏪 Storage Capacity"
                      tooltipText="Storage capacity determines how many units you can store after production"
                      value={[product.storage_capacity || 0]}
                      min={0}
                      max={10000}
                      onValueChange={(val) =>
                        product.id &&
                        handleProductChange(
                          product.id,
                          "storage_capacity",
                          val[0]
                        )
                      }
                    />
                  </div>
                </div>

                {/* Production Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="h-4 w-4 text-green-400" />
                      <span className="text-sm font-semibold text-green-400">
                        Production Cost
                      </span>
                    </div>
                    <div className="text-xl font-bold text-white">
                      ₹
                      {formatNumber(
                        Math.round(
                          calculateProductionCost(
                            product.units_to_produce,
                            product.cost_per_unit,
                            product.defect_rate
                          )
                        )
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-semibold text-blue-400">
                        Effective Units
                      </span>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {formatNumber(effectiveUnits)}
                      <span className="text-sm text-slate-400 ml-2">
                        {product.defect_rate > 0
                          ? `(${product.defect_rate}% defect rate affects cost only)`
                          : "No defects"}
                      </span>
                      <div className="text-xs text-blue-300 mt-1">
                        💡 This amount will be available for sales
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Warehouse className="h-4 w-4 text-purple-400" />
                      <span className="text-sm font-semibold text-purple-400">
                        Storage Usage
                      </span>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {product.storage_capacity > 0
                        ? `${storageUtilization.toFixed(1)}%`
                        : "N/A"}
                      <span className="text-sm text-slate-400 ml-2">
                        {product.storage_capacity > 0
                          ? "of capacity"
                          : "No storage set"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Financial Summary */}
          <div className="mt-10 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-lg rounded-2xl p-6 border border-slate-600/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Financial Overview
              </h3>
            </div>

            {/* Production-Sales Relationship Info */}
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-semibold text-blue-400">
                  Production → Sales Relationship
                </span>
              </div>
              <p className="text-sm text-blue-300">
                The units you produce here will determine the maximum inventory
                available for sales. Your sales volume cannot exceed your
                production output.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Total Production Cost */}
              <div className="bg-gradient-to-r from-blue-500/20 to-indigo-600/20 border border-blue-500/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <IndianRupee className="h-5 w-5 text-blue-400" />
                  <span className="text-lg font-semibold text-blue-400">
                    Total Production Cost
                  </span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  ₹{formatNumber(Math.round(totalCost))}
                </div>
                <div className="text-sm text-blue-300">
                  Cost for {totalPlannedUnits} units across all products
                </div>
              </div>

              {/* Cash Balance */}
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Warehouse className="h-5 w-5 text-green-400" />
                  <span className="text-lg font-semibold text-green-400">
                    Available Cash
                  </span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {formatCurrency(cashBalance.originalCashBalance ?? 0)}
                </div>
                <div className="text-sm text-green-300">
                  Current liquidity position
                </div>
              </div>

              {/* Projected Balance */}
              <div
                className={`${
                  totalCost > projectedCashBalance
                    ? "bg-gradient-to-r from-red-500/20 to-rose-600/20 border border-red-500/30"
                    : "bg-gradient-to-r from-emerald-500/20 to-green-600/20 border border-emerald-500/30"
                } rounded-xl p-5`}
              >
                <div className="flex items-center gap-2 mb-3">
                  {totalCost > projectedCashBalance ? (
                    <>
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      <span className="text-lg font-semibold text-red-400">
                        Cash After Production
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                      <span className="text-lg font-semibold text-emerald-400">
                        Cash After Production
                      </span>
                    </>
                  )}
                </div>
                <div
                  className={`text-3xl font-bold mb-2 ${
                    totalCost > projectedCashBalance
                      ? "text-red-300"
                      : "text-emerald-300"
                  }`}
                >
                  {formatCurrency(Math.round(projectedCashBalance))}
                </div>
                <div
                  className={`text-sm ${
                    totalCost > projectedCashBalance
                      ? "text-red-400"
                      : "text-emerald-400"
                  }`}
                >
                  {totalCost > projectedCashBalance
                    ? "⚠️ Insufficient funds - consider reducing production"
                    : "✅ Sufficient funds for planned production"}
                </div>
              </div>
            </div>

            {/* Production Efficiency Insights */}
            <div className="mt-6 pt-6 border-t border-slate-600/40">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                Production Insights
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {mergedProducts.length}
                  </div>
                  <div className="text-slate-400">Products in Production</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {Math.round(
                      mergedProducts.reduce(
                        (sum, prod) =>
                          sum +
                          (prod.production_capacity > 0
                            ? (prod.units_to_produce /
                                prod.production_capacity) *
                              100
                            : 0),
                        0
                      ) / mergedProducts.length
                    )}
                    %
                  </div>
                  <div className="text-slate-400">Avg. Capacity Usage</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {(
                      mergedProducts.reduce(
                        (sum, prod) => sum + prod.defect_rate,
                        0
                      ) / mergedProducts.length
                    ).toFixed(1)}
                    %
                  </div>
                  <div className="text-slate-400">Avg. Defect Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    ₹{Math.round(totalCost / (totalPlannedUnits || 1))}
                  </div>
                  <div className="text-slate-400">Cost per Unit</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionForm;
