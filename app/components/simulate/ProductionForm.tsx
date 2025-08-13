"use client";

import {
  IndianRupee,
  Box,
  Package,
  AlertTriangle,
  CheckCircle,
  Zap,
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

// Helper cost calculation
// Helper cost calculation
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
          total_cost:
            field === "units_to_produce" ||
              field === "cost_per_unit" ||
              field === "defect_rate"
              ? calculateProductionCost(
                field === "units_to_produce" ? value : prod.units_to_produce,
                field === "cost_per_unit" ? value : prod.cost_per_unit,
                field === "defect_rate" ? value : prod.defect_rate
              )
              : prod.total_cost,
        }
        : prod
    );

    updateProductionData({ ...productionData, products: updatedProducts });

    // Update inventory level if units changed
    // Update inventory level if units changed
    if (field === "units_to_produce") {
      const productIndex = productData.findIndex((p) => p.id === productId);
      if (productIndex >= 0) {
        updateProductByIndex(productIndex, {
          inventory_level: value,
        });
      }
    }

    setError(String(field), "");
    setError(String(field), "");
  }

  // Sync productData with productionData
  // Sync productData with productionData
  React.useEffect(() => {
    if (productData.length > 0) {
      const existingProductionIds = new Set(
        productionData.products.map((p) => p.product_id)
      );

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

        updateProductionData({
          ...productionData,
          products: [...productionData.products, ...newProductionEntries],
        });
        updateProductionData({
          ...productionData,
          products: [...productionData.products, ...newProductionEntries],
        });
      }
    }
  }, [productData, productionData, updateProductionData]);

  // Merge data
  // Merge data
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

  // Dropdown state
  const [selectedProductId, setSelectedProductId] = React.useState(
    mergedProducts[0]?.id || ""
  );
  const selectedProduct = mergedProducts.find(
    (p) => p.id === selectedProductId
  );

  // Totals
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
    <div className="bg-slate-800/50 shadow-md py-4 px-6">
      {/* Key Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <InfoCard
          label="Total Capacity"
          value={mergedProducts.reduce(
            (sum, prod) => sum + (prod.production_capacity || 0),
            0
          )}
          Icon={Box}
          iconColor="text-purple-400"
          labelColor="text-white"
          valueColor="text-white"
        />
        <InfoCard
          label="Planned Units"
          value={totalPlannedUnits}
          Icon={Package}
          iconColor="text-blue-400"
          labelColor="text-white"
          valueColor="text-white"
        />
        <InfoCard
          label="Storage Capacity"
          value={totalStorageCapacity}
          Icon={Warehouse}
          iconColor="text-indigo-400"
          labelColor="text-white"
          valueColor="text-white"
        />
        <InfoCard
          label="Inventory Value"
          value={totalInventoryValue}
          isCurrency
          Icon={IndianRupee}
          iconColor="text-yellow-400"
          labelColor="text-white"
          valueColor="text-white"
        />
      </section>
      <div className="flex items-center justify-between mb-3">
        <div className="flex text-xl text-white tracking-wide font-semibold font-roboto-sans">
          Production Strategy
        </div>
        {/* Product Selector */}
        <div className="flex items-center justify-center mr-8">
          <label className="block text-m font-medium font-roboto-sans text-white mb-2">
            Select Product:
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="bg-slate-800 text-white p-2 font-geist-sans rounded-md border border-slate-600 ml-3"
            >
              {mergedProducts
                .filter((product) => product.status === "active")
                .map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
            </select>
          </label>
        </div>
      </div>

      {/* Selected Product Config */}
      {selectedProduct ? (
        <div className="bg-slate-800/50 shadow-md rounded-xl border border-slate-600 p-6 mb-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white font-geist-sans">
              {selectedProduct.name}
            </h3>
            <div>
              {(() => {
                const productionEfficiency =
                  selectedProduct.production_capacity > 0
                    ? (selectedProduct.units_to_produce /
                      selectedProduct.production_capacity) *
                    100
                    : 0;
                if (productionEfficiency > 100)
                  return (
                    <div className="flex items-center gap-1 font-geist-sans text-red-400 bg-red-500/20 px-3 py-1 rounded-full text-sm">
                      <AlertTriangle className="h-4 w-4" /> Overload
                    </div>
                  );
                if (productionEfficiency > 80)
                  return (
                    <div className="flex items-center gap-1 font-geist-sans text-yellow-400 bg-yellow-500/20 px-3 py-1 rounded-full text-sm">
                      <Zap className="h-4 w-4" /> High Load
                    </div>
                  );
                return (
                  <div className="flex items-center gap-1 font-geist-sans text-green-400 bg-green-500/20 px-3 py-1 rounded-full text-sm">
                    <CheckCircle className="h-4 w-4" /> Optimal
                  </div>
                );
              })()}
            </div>
          </div>
          <hr className=" my-5 border border-slate-700" />

          {/* Sliders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-8">
            <div className="space-y-6">
              <Slider
                label="Units to Produce"
                tooltipText="Set the number of final usable units you want to produce (defect rate only affects production cost)"
                value={[selectedProduct.units_to_produce]}
                min={0}
                max={selectedProduct.production_capacity * 2 || 2000}
                onValueChange={(val) =>
                  selectedProduct.id &&
                  handleProductChange(
                    selectedProduct.id, // if needed use selectedProduct.id!
                    "units_to_produce",
                    val[0]
                  )
                }
              />

              <Slider
                label="Cost per Unit (₹)"
                tooltipText="The cost per unit affects your total production expenses and profit margins"
                value={[selectedProduct.cost_per_unit]}
                min={0}
                max={1000}
                onValueChange={(val) =>
                  selectedProduct.id &&
                  handleProductChange(selectedProduct.id, "cost_per_unit", val[0])
                }
              />

              <Slider
                label="Production Capacity"
                tooltipText="Production capacity determines how many units you can produce per year"
                value={[selectedProduct.production_capacity || 0]}
                min={0}
                max={selectedProduct.production_capacity || 10000}
                onValueChange={(val) =>
                  selectedProduct.id &&
                  handleProductChange(selectedProduct.id, "production_capacity", val[0])
                }
              />
            </div>

            <div className="space-y-6">
              <Slider
                label="Defect Rate (%)"
                tooltipText="Defect rate increases production costs (more units must be produced to get the target amount) but doesn't reduce final usable units"
                isPercentage
                value={[selectedProduct.defect_rate]}
                min={0}
                max={100}
                onValueChange={(val) =>
                  selectedProduct.id &&
                  handleProductChange(selectedProduct.id, "defect_rate", val[0])
                }
              />

              <Slider
                label="Storage Capacity"
                tooltipText="Storage capacity determines how many units you can store after production"
                value={[selectedProduct.storage_capacity || 0]}
                min={0}
                max={10000}
                onValueChange={(val) =>
                  selectedProduct.id &&
                  handleProductChange(selectedProduct.id, "storage_capacity", val[0])
                }
              />

              {/* Production Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mx-5">
                <div className="bg-slate-800/50 rounded-xl p-5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <IndianRupee className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-semibold font-roboto-sans text-green-400">
                      Production Cost
                    </span>
                  </div>
                  <div className="text-lg font-semibold text-white font-geist-sans">
                    ₹
                    {formatNumber(
                      Math.round(
                        calculateProductionCost(
                          selectedProduct.units_to_produce,
                          selectedProduct.cost_per_unit,
                          selectedProduct.defect_rate
                        )
                      )
                    )}
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Warehouse className="h-4 w-4 text-purple-400" />
                    <span className="text-sm text-purple-400 font-semibold font-roboto-sans">
                      Storage Usage
                    </span>
                  </div>
                  <div className="text-lg font-semibold text-white font-geist-sans">
                    {selectedProduct.storage_capacity > 0
                      ? `${(
                        (selectedProduct.units_to_produce /
                          selectedProduct.storage_capacity) *
                        100
                      ).toFixed(1)}%`
                      : "0.0%"}
                    <span className="text-sm text-slate-400 ml-2">
                      {selectedProduct.storage_capacity > 0
                        ? "of capacity"
                        : "No storage set"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      ) : null}

      {/* Financial Summary */}
      <div className="bg-slate-800/50 shadow-md rounded-lg p-4 border border-slate-500">
        <h4 className="text-lg tracking-wide font-semibold font-roboto-sans text-white mb-3">
          Financial Impact Summary
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-center">
          <div className="bg-slate-600/40 rounded-lg p-3">
            <p className="text-slate-300 text-xs mb-1 tracking-wide font-semibold font-electrolize">Total Production Cost</p>
            <p className="text-lg font-semibold text-white font-geist-sans">
              {formatCurrency(totalCost)}
            </p>
          </div>
          <div className="bg-slate-600/40 rounded-lg p-3">
            <p className="text-slate-300 text-xs mb-1 tracking-wide font-semibold font-electrolize">Available Cash</p>
            <p className="text-lg font-semibold text-white font-geist-sans">
              {formatCurrency(cashBalance.originalCashBalance ?? 0)}
            </p>
          </div>
          <div className="bg-slate-600/40 rounded-lg p-3">
            <p className="text-slate-300 text-xs mb-1 tracking-wide font-semibold font-electrolize">Cash After Production</p>
            <p
              className={`text-lg font-semibold ${totalCost > projectedCashBalance
                ? "font-geist-sans text-red-400"
                : "font-geist-sans text-emerald-400"
                }`}
            >
              {formatCurrency(Math.round(projectedCashBalance))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionForm;

