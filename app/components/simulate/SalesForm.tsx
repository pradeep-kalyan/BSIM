"use client";

import React from "react";
import {
  TrendingUp,
  IndianRupee,
  Package,
  AlertTriangle,
  Check,
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
    if (products && products.length > 0 && !selectedProductId) {
      const firstProduct = products.find((p) => p.id);
      if (firstProduct?.id) {
        setSelectedProductId(firstProduct.id);
      }
    }
  }, [products, selectedProductId]);

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
    <div className="h-full bg-slate-800/50 shadow-md py-4 px-6">
      {/* Top Info Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

      <div className="mx-auto my-4 font-roboto-sans">
        {/* Product Selection Dropdown */}
        <div className="flex gap-3 justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white pt-1">
            Sales & Performance
          </h2>
          <div className="flex items-center gap-2">
            <label className="block font-medium text-white align-center">
              Select Product:
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full md:w-64 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
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
                className="bg-slate-800/50 shadow-md rounded-2xl py-4 border border-slate-700 mb-4 px-5"
              >
                <h2 className="text-2xl font-bold font-roboto-sans text-white mb-2">
                  {product.name}
                </h2>
                <hr className="border-slate-700 mb-6" />

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left sliders */}
                  <div className="flex flex-col gap-4 flex-1">
                    <Slider
                      label="Sales Volume (Units)"
                      tooltipText="Number of units you plan to sell per year"
                      value={[pSales.sales_volume || 0]}
                      min={0}
                      max={pSales.sales_volume * 2 || 1000}
                      onValueChange={(val) =>
                        handleProductInputChange(id, "sales_volume", val[0])
                      }
                    />
                    <Slider
                      label="Selling Price per Unit (₹)"
                      tooltipText="Price you charge customers for each unit of this product"
                      value={[
                        pSales.selling_price || product.selling_price || 0,
                      ]}
                      min={0}
                      max={pSales.selling_price * 2 || 1000}
                      onValueChange={(val) =>
                        handleProductInputChange(id, "selling_price", val[0])
                      }
                    />
                  </div>

                  {/* Middle sliders */}
                  <div className="flex flex-col gap-4 flex-1">
                    <Slider
                      label="Customer Satisfaction (1-10)"
                      tooltipText="How satisfied customers are with this product on a scale of 1 to 10"
                      value={[pSales.customer_satisfaction || 1]}
                      min={1}
                      max={10}
                      onValueChange={(val) =>
                        handleProductInputChange(
                          id,
                          "customer_satisfaction",
                          val[0]
                        )
                      }
                    />
                    <Slider
                      label="Market Share (%)"
                      tooltipText="Percentage of the total market that this product aims to capture"
                      value={[pSales.market_share || 0]}
                      min={0}
                      max={100}
                      onValueChange={(val) =>
                        handleProductInputChange(id, "market_share", val[0])
                      }
                    />
                  </div>

                  {/* Right product info */}
                  <div className="flex flex-col gap-3 flex-1">
                    <div className="w-full p-4 rounded-lg bg-slate-800 text-white text-sm space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-400"></span>
                          <span className="text-blue-300 font-medium">
                            Category:
                          </span>
                        </div>
                        <span className="truncate max-w-[120px]">
                          {product.category}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-400"></span>
                          <span className="text-blue-300 font-medium">
                            Price:
                          </span>
                        </div>
                        <span>
                          ₹{pSales.selling_price || product.selling_price}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-400"></span>
                          <span className="text-blue-300 font-medium">
                            Inventory:
                          </span>
                        </div>
                        <span>{getAvailableInventory(id)} units</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-400"></span>
                          <span className="text-blue-300 font-medium">
                            Cost/unit:
                          </span>
                        </div>
                        <span>₹{product.production_cost}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row items-center justify-between gap-4 mt-6 w-full px-5">
                  {/* Left: Metrics */}
                  <div className="flex justify-start gap-8 font-roboto-sans text-white">
                    <div className="flex gap-2 items-center">
                      <span className="w-3 h-3 rounded-full bg-green-400"></span>
                      <span className="font-medium">Revenue:</span>
                      <span>₹{formatNumber(Math.round(calc.revenue))}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="w-3 h-3 rounded-full bg-red-400"></span>
                      <span className="font-medium">Costs:</span>
                      <span>₹{formatNumber(Math.round(calc.costs))}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                      <span className="font-medium">Profit:</span>
                      <span>₹{formatNumber(Math.round(calc.profit))}</span>
                    </div>
                  </div>

                  {/* Right: Validation + Button */}
                  <div className="flex flex-row items-end gap-5">
                    {validationAlerts[id] && (
                      <div className="h-6 flex items-center">
                        {validationAlerts[id] &&
                          !validationAlerts[id].startsWith("Validated!") && (
                            <div className="flex items-center gap-2 text-rose-400">
                              <AlertTriangle size={18} />
                              {validationAlerts[id]}
                            </div>
                          )}
                        {successProducts[id] && !validationAlerts[id] && (
                          <div className="flex items-center gap-2 text-green-400">
                            <Check size={18} />
                            Validated!
                          </div>
                        )}
                        {validationAlerts[id]?.startsWith("Validated!") && (
                          <div className="flex items-center gap-2 text-green-400">
                            <Check size={18} />
                            {validationAlerts[id]}
                          </div>
                        )}
                      </div>
                    )}
                    <div>
                      <button
                        onClick={() => handleValidateProduct(id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-roboto-sans rounded-lg shadow text-sm"
                      >
                        Validate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
      </div>
    </div>
  );
};

export default Sales;
