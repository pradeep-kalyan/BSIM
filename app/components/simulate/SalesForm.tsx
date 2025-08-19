"use client";

import React from "react";
import {
  TrendingUp,
  IndianRupee,
  Package,
  AlertTriangle,
  Check,
  CheckCircle,
  Zap,
} from "lucide-react";
import {
  useProductForm,
  useSalesForm,
  useCashBalance,
  useProductionForm,
} from "@/app/context/FormContext";
import { Slider } from "@/components/ui/slider";
import InfoCard from "@/app/ui/InfoCard";

const formatNumber = (num: number) =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const Sales = () => {
  const { products } = useProductForm();
  const {
    data: salesData,
    updateData: updateSalesData,
    setError,
  } = useSalesForm();
  const { data: productionData } = useProductionForm();
  const { updateSalesBudgetImpact } = useCashBalance();

  // Get inventory from production or existing level
  const getAvailableInventory = React.useCallback(
    (productId: string) => {
      const prodEntry = productionData.products?.find(
        (prod) => prod.product_id === productId
      );
      if (prodEntry) return prodEntry.units_to_produce;
      const product = products?.find((p) => p.id === productId);
      return product?.inventory_level || 0;
    },
    [productionData.products, products]
  );

  const [selectedProductId, setSelectedProductId] = React.useState<string>("");
  React.useEffect(() => {
    if (!selectedProductId) {
      setSelectedProductId("");
    }
  }, [selectedProductId]);

  const [validationAlerts, setValidationAlerts] = React.useState<
    Record<string, string | null>
  >({});
  const [successProducts, setSuccessProducts] = React.useState<
    Record<string, boolean>
  >({});

  // Calculate per-product values
  const calculatedValues = React.useMemo(() => {
    const values: Record<
      string,
      { revenue: number; costs: number; profit: number }
    > = {};
    products?.forEach((product) => {
      if (!product.id) return;
      const pSales = salesData?.[product.id] || {};
      const salesVolume = pSales.sales_volume || 0;
      const sellingPrice = pSales.selling_price || product.selling_price || 0;
      const revenue = salesVolume * sellingPrice;
      const costs = salesVolume * (product.production_cost || 0);
      const profit = revenue - costs;
      values[product.id] = { revenue, costs, profit };
    });
    return values;
  }, [products, salesData]);

  // Aggregate totals
  const totalMetrics = React.useMemo(() => {
    let totalRevenue = 0,
      totalCosts = 0,
      totalProfit = 0,
      totalVolume = 0,
      totalMarketShare = 0,
      totalCS = 0,
      productCount = 0;

    products?.forEach((p) => {
      if (!p.id) return;
      const vals = calculatedValues[p.id] || {
        revenue: 0,
        costs: 0,
        profit: 0,
      };
      const pSales = salesData?.[p.id] || {};
      totalRevenue += vals.revenue;
      totalCosts += vals.costs;
      totalProfit += vals.profit;
      totalVolume += pSales.sales_volume || 0;
      totalMarketShare += pSales.market_share || 0;
      totalCS += pSales.customer_satisfaction || 0;
      productCount++;
    });

    return {
      totalRevenue,
      totalCosts,
      totalProfit,
      totalVolume,
      avgMarketShare: productCount > 0 ? totalMarketShare / productCount : 0,
      avgCustomerSatisfaction: productCount > 0 ? totalCS / productCount : 0,
    };
  }, [products, calculatedValues, salesData]);

  // Update cash balance impact
  React.useEffect(() => {
    updateSalesBudgetImpact(totalMetrics.totalRevenue);
  }, [totalMetrics.totalRevenue, updateSalesBudgetImpact]);

  // Initialize sales data if missing
  React.useEffect(() => {
    if (products && products.length > 0) {
      const updated = { ...salesData };
      let hasUpdates = false;
      products.forEach((product) => {
        if (product.id && !updated[product.id]) {
          updated[product.id] = {
            sales_volume: 0,
            selling_price: product.selling_price || 1000,
            revenue: 0,
            costs: 0,
            profit: 0,
            market_share: 0,
            customer_satisfaction: 1,
          };
          hasUpdates = true;
        }
      });
      if (hasUpdates) updateSalesData(updated);
    }
  }, [products, salesData, updateSalesData]);

  // Handle change
  const handleProductInputChange = (
    productId: string,
    field: string,
    value: number
  ) => {
    const current = salesData[productId] || {
      sales_volume: 0,
      selling_price:
        products?.find((p) => p.id === productId)?.selling_price || 0,
      revenue: 0,
      costs: 0,
      profit: 0,
      market_share: 0,
      customer_satisfaction: 1,
    };
    const updatedData = {
      ...salesData,
      [productId]: { ...current, [field]: value },
    };
    updateSalesData(updatedData);
    setError(field, "");
    setSuccessProducts((prev) => ({ ...prev, [productId]: false }));
    setValidationAlerts((prev) => ({ ...prev, [productId]: null }));
  };

  // Validate
  const handleValidateProduct = (productId: string) => {
    const product = products?.find((p) => p.id === productId);
    const pSales = salesData?.[productId] || {};
    if (!product) return;

    const availableInventory = getAvailableInventory(productId);
    if ((pSales.sales_volume || 0) <= 0)
      return setValidationAlerts((prev) => ({
        ...prev,
        [productId]: "Sales volume must be greater than 0",
      }));
    if ((pSales.selling_price || 0) <= 0)
      return setValidationAlerts((prev) => ({
        ...prev,
        [productId]: "Selling price must be greater than 0",
      }));
    if (pSales.sales_volume > availableInventory)
      return setValidationAlerts((prev) => ({
        ...prev,
        [productId]: `Sales volume (${pSales.sales_volume}) exceeds available inventory (${availableInventory})`,
      }));
    if ((pSales.market_share || 0) < 0 || (pSales.market_share || 0) > 100)
      return setValidationAlerts((prev) => ({
        ...prev,
        [productId]: "Market share must be between 0 and 100%",
      }));
    if (
      (pSales.customer_satisfaction || 0) < 1 ||
      (pSales.customer_satisfaction || 0) > 10
    )
      return setValidationAlerts((prev) => ({
        ...prev,
        [productId]: "Customer satisfaction must be between 1 and 10",
      }));

    const newInventory = availableInventory - (pSales.sales_volume || 0);
    const updatedData = {
      ...salesData,
      [productId]: {
        ...pSales,
        revenue: calculatedValues[productId]?.revenue || 0,
        costs: calculatedValues[productId]?.costs || 0,
        profit: calculatedValues[productId]?.profit || 0,
      },
    };
    updateSalesData(updatedData);
    setSuccessProducts((prev) => ({ ...prev, [productId]: true }));
    setValidationAlerts((prev) => ({
      ...prev,
      [productId]: `Validated! Inventory will be reduced to ${newInventory} units`,
    }));
    setTimeout(() => {
      setValidationAlerts((prev) => ({ ...prev, [productId]: null }));
    }, 3000);
  };

  return (
    <div className="min-h-full bg-slate-800/50 shadow-md py-4 px-3 sm:px-6">
      {/* Top Info Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <InfoCard
          label="Total Revenue"
          value={totalMetrics.totalRevenue}
          isCurrency
          Icon={IndianRupee}
          iconColor="text-green-400"
        />
        <InfoCard
          label="Total Volume"
          value={totalMetrics.totalVolume}
          Icon={Package}
          iconColor="text-blue-400"
        />
        <InfoCard
          label="Avg Market Share"
          value={`${parseFloat(totalMetrics.avgMarketShare.toFixed(1))}%`}
          Icon={TrendingUp}
          iconColor="text-violet-400"
        />
        <InfoCard
          label="Total Profit"
          value={totalMetrics.totalProfit}
          isCurrency
          Icon={IndianRupee}
          iconColor="text-green-300"
        />
      </section>

      <div className="mx-auto font-roboto-sans">
        {/* Header and Product Selection */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Sales & Performance
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-white text-sm sm:text-lg tracking-wide font-medium font-roboto-sans whitespace-nowrap">
              Select Product:
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="p-2 rounded bg-slate-700 text-white border border-slate-500 tracking-wide font-medium font-geist-sans min-w-0 flex-1 sm:flex-none sm:min-w-[200px]"
            >
              <option value="">-- Select Product --</option>
              {products
                ?.filter((p) => p.id && p.status === "active")
                .map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Display Selected Product */}
        {selectedProductId &&
          (() => {
            const product = products?.find((p) => p.id === selectedProductId);
            if (!product) return null;

            const id = product.id!;
            const pSales = salesData?.[id] || {};
            const calc = calculatedValues[id] || {
              revenue: 0,
              costs: 0,
              profit: 0,
            };

            return (
              <div
                key={id}
                className="bg-slate-800/50 shadow-md rounded-2xl px-4 sm:px-6 py-4 sm:py-6 border border-slate-700 mb-4"
              >
                {/* Product Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white font-geist-sans">
                    {product.name}
                  </h3>
                  <div>
                    {(() => {
                      if (product.status === "active") {
                        return (
                          <div className="flex items-center gap-1 font-geist-sans text-green-400 bg-green-500/20 px-3 py-1 rounded-full text-sm">
                            <CheckCircle className="h-4 w-4" /> Active
                          </div>
                        );
                      }
                      if (product.status === "development") {
                        return (
                          <div className="flex items-center gap-1 font-geist-sans text-yellow-400 bg-yellow-500/20 px-3 py-1 rounded-full text-sm">
                            <Zap className="h-4 w-4" /> Development
                          </div>
                        );
                      }
                      if (product.status === "discontinued") {
                        return (
                          <div className="flex items-center gap-1 font-geist-sans text-red-400 bg-red-500/20 px-3 py-1 rounded-full text-sm">
                            <AlertTriangle className="h-4 w-4" /> Discontinued
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>
                <hr className="mt-2 mb-4 border border-slate-700" />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Sliders Section */}
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Sales Controls */}
                    <div className="space-y-4">
                      <Slider
                        label="Sales Volume (Units)"
                        tooltipText="Number of units you plan to sell this year"
                        value={pSales.sales_volume || 0}
                        min={0}
                        max={pSales.sales_volume * 2 || 1000}
                        onValueChange={(val) =>
                          handleProductInputChange(id, "sales_volume", val)
                        }
                      />
                      <Slider
                        label="Selling Price per Unit (₹)"
                        tooltipText="Price per unit you will charge customers for this product (₹ per unit)"
                        value={
                          pSales.selling_price || product.selling_price || 0
                        }
                        min={0}
                        max={pSales.selling_price * 2 || 1000}
                        onValueChange={(val) =>
                          handleProductInputChange(id, "selling_price", val)
                        }
                      />
                    </div>

                    {/* Performance Controls */}
                    <div className="space-y-4">
                      <Slider
                        label="Customer Satisfaction (1-10)"
                        tooltipText="How satisfied customers are with this product (rating from 1 to 10)"
                        value={pSales.customer_satisfaction || 1}
                        min={1}
                        max={10}
                        onValueChange={(val) =>
                          handleProductInputChange(
                            id,
                            "customer_satisfaction",
                            val
                          )
                        }
                      />
                      <Slider
                        label="Market Share (%)"
                        tooltipText="Percentage of the total market you want to capture with this product"
                        value={pSales.market_share || 0}
                        min={0}
                        max={100}
                        onValueChange={(val) =>
                          handleProductInputChange(id, "market_share", val)
                        }
                      />
                    </div>
                  </div>

                  {/* Product Info Section */}
                  <div className="lg:col-span-1">
                    <div className="bg-slate-700/30 rounded-lg p-4 h-full">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Product Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-400"></span>
                            <span className="text-blue-300 text-sm sm:text-base">
                              Category:
                            </span>
                          </div>
                          <span
                            className="text-white text-sm sm:text-base truncate max-w-[120px] sm:max-w-none"
                            title={product.category}
                          >
                            {product.category}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-400"></span>
                            <span className="text-blue-300 text-sm sm:text-base">
                              Price:
                            </span>
                          </div>
                          <span className="text-white text-sm sm:text-base">
                            ₹
                            {formatNumber(
                              pSales.selling_price || product.selling_price || 0
                            )}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-400"></span>
                            <span className="text-blue-300 text-sm sm:text-base">
                              Inventory:
                            </span>
                          </div>
                          <span className="text-white text-sm sm:text-base">
                            {getAvailableInventory(id)} units
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-400"></span>
                            <span className="text-blue-300 text-sm sm:text-base">
                              Cost/unit:
                            </span>
                          </div>
                          <span className="text-white text-sm sm:text-base">
                            ₹{formatNumber(product.production_cost || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Section - Metrics and Validation */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Financial Metrics */}
                  <div className="flex flex-col sm:flex-row gap-4 font-roboto-sans text-white w-full lg:w-auto">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-400 flex-shrink-0"></span>
                      <span className="font-medium text-sm sm:text-base">
                        Revenue:
                      </span>
                      <span className="text-sm sm:text-base">
                        ₹{formatNumber(Math.round(calc.revenue))}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-400 flex-shrink-0"></span>
                      <span className="font-medium text-sm sm:text-base">
                        Costs:
                      </span>
                      <span className="text-sm sm:text-base">
                        ₹{formatNumber(Math.round(calc.costs))}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-yellow-400 flex-shrink-0"></span>
                      <span className="font-medium text-sm sm:text-base">
                        Profit:
                      </span>
                      <span className="text-sm sm:text-base">
                        ₹{formatNumber(Math.round(calc.profit))}
                      </span>
                    </div>
                  </div>

                  {/* Validation Section */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                    {/* Validation Message */}
                    {validationAlerts[id] && (
                      <div className="flex items-start sm:items-center gap-2 text-sm max-w-full">
                        {validationAlerts[id] &&
                          !validationAlerts[id].startsWith("Validated!") && (
                            <div className="flex items-start gap-2 text-rose-400">
                              <AlertTriangle
                                size={16}
                                className="mt-0.5 flex-shrink-0"
                              />
                              <span className="break-words">
                                {validationAlerts[id]}
                              </span>
                            </div>
                          )}
                        {successProducts[id] && !validationAlerts[id] && (
                          <div className="flex items-center gap-2 text-green-400">
                            <Check size={16} />
                            <span>Validated!</span>
                          </div>
                        )}
                        {validationAlerts[id]?.startsWith("Validated!") && (
                          <div className="flex items-start gap-2 text-green-400">
                            <Check size={16} className="mt-0.5 flex-shrink-0" />
                            <span className="break-words">
                              {validationAlerts[id]}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Validate Button */}
                    <button
                      onClick={() => handleValidateProduct(id)}
                      className="px-4 sm:px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-roboto-sans rounded-lg shadow text-sm sm:text-base transition-colors whitespace-nowrap flex-shrink-0"
                    >
                      Validate
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

        {/* No Product Selected State */}
        {!selectedProductId && (
          <div className="flex justify-center items-center bg-slate-800/50 shadow-md rounded-2xl py-16 sm:py-24 border border-slate-700 mb-4 px-5">
            <div className="text-center">
              <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-lg font-roboto-sans text-slate-300 mb-1">
                No Product Selected
              </p>
              <p className="text-sm text-slate-400">
                Choose a product from the dropdown above to manage sales data
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sales;
