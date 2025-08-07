"use client";

import React from "react";
import {
  TrendingUp,
  DollarSign,
  Users,
  Star,
  Package,
  AlertTriangle,
  Check,
} from "lucide-react";
import {
  useProductForm,
  useSalesForm,
  useCompanyForm,
  useCashBalance,
} from "@/app/context/FormContext";
import { useSimulation } from "@/app/context/SimulationContext";
import { Slider } from "@/components/ui/slider";
import DashboardCard from "../../../homepage/Card";

const formatNumber = (num: number) =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const Sales = () => {
  const { products } = useProductForm();
  const {
    data: salesData,
    updateData: updateSalesData,
    setError,
  } = useSalesForm();
  const { data: companyData } = useCompanyForm();
  const { period } = useSimulation();
  const { projectedCashBalance, updateSalesBudgetImpact } = useCashBalance();

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
      if (!product.id) return; // Skip products without IDs
      const pSales = salesData?.[product.id] || {};
      const salesVolume = pSales.sales_volume || 0;
      const revenue = salesVolume * (product.selling_price || 0);
      const costs = salesVolume * (product.production_cost || 0);
      const profit = revenue - costs;
      values[product.id] = { revenue, costs, profit };
    });
    return values;
  }, [products, salesData]);

  // Aggregate totals for dashboard
  const totalMetrics = React.useMemo(() => {
    let totalRevenue = 0,
      totalCosts = 0,
      totalProfit = 0,
      totalVolume = 0,
      totalMarketShare = 0,
      totalCustomerSatisfaction = 0,
      productCount = 0;

    products?.forEach((p) => {
      if (!p.id) return; // Skip products without IDs
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
      totalCustomerSatisfaction += pSales.customer_satisfaction || 0;
      productCount++;
    });

    const avgMarketShare =
      productCount > 0 ? totalMarketShare / productCount : 0;
    const avgCustomerSatisfaction =
      productCount > 0 ? totalCustomerSatisfaction / productCount : 0;

    return {
      totalRevenue,
      totalCosts,
      totalProfit,
      totalVolume,
      avgMarketShare,
      avgCustomerSatisfaction,
    };
  }, [products, calculatedValues, salesData]);

  // Update cash balance impact whenever total revenue changes
  React.useEffect(() => {
    updateSalesBudgetImpact(totalMetrics.totalRevenue);
  }, [totalMetrics.totalRevenue, updateSalesBudgetImpact]);

  // Ensure all products have sales data entries
  React.useEffect(() => {
    if (products && products.length > 0) {
      const updatedSalesData = { ...salesData };
      let hasUpdates = false;

      products.forEach((product) => {
        if (product.id && !updatedSalesData[product.id]) {
          updatedSalesData[product.id] = {
            sales_volume: 0,
            revenue: 0,
            costs: 0,
            profit: 0,
            market_share: 0,
            customer_satisfaction: 1,
          };
          hasUpdates = true;
        }
      });

      if (hasUpdates) {
        updateSalesData(updatedSalesData);
      }
    }
  }, [products, salesData, updateSalesData]);

  // Handle slider/input change per product
  const handleProductInputChange = (
    productId: string,
    field: string,
    value: number
  ) => {
    const currentProductSales = salesData[productId] || {
      sales_volume: 0,
      revenue: 0,
      costs: 0,
      profit: 0,
      market_share: 0,
      customer_satisfaction: 1,
    };

    const updatedSalesData = {
      ...salesData,
      [productId]: {
        ...currentProductSales,
        [field]: value,
      },
    };

    updateSalesData(updatedSalesData);
    setError(field, "");
    setSuccessProducts((prev) => ({ ...prev, [productId]: false }));
    setValidationAlerts((prev) => ({ ...prev, [productId]: null }));
  };

  // Validation per product
  const handleValidateProduct = (productId: string) => {
    const product = products?.find((p) => p.id === productId);
    const pSales = salesData?.[productId] || {};
    if (!product) return;

    if ((pSales.sales_volume || 0) <= 0) {
      setValidationAlerts((prev) => ({
        ...prev,
        [productId]: "⚠️ Sales volume must be greater than 0",
      }));
      return;
    }
    if (
      pSales.sales_volume &&
      pSales.sales_volume > (product.inventory_level || 0)
    ) {
      setValidationAlerts((prev) => ({
        ...prev,
        [productId]: `⚠️ Sales volume exceeds inventory (${product.inventory_level})`,
      }));
      return;
    }
    if ((pSales.market_share || 0) < 0 || (pSales.market_share || 0) > 100) {
      setValidationAlerts((prev) => ({
        ...prev,
        [productId]: "⚠️ Market share must be between 0 and 100%",
      }));
      return;
    }
    if (
      (pSales.customer_satisfaction || 0) < 1 ||
      (pSales.customer_satisfaction || 0) > 10
    ) {
      setValidationAlerts((prev) => ({
        ...prev,
        [productId]: "⚠️ Customer satisfaction must be between 1 and 10",
      }));
      return;
    }

    // Calculate inventory reduction
    const newInventoryLevel =
      (product.inventory_level || 0) - (pSales.sales_volume || 0);

    // Update the specific product's sales data with calculated values
    const updatedSalesData = {
      ...salesData,
      [productId]: {
        ...pSales,
        revenue: calculatedValues[productId]?.revenue || 0,
        costs: calculatedValues[productId]?.costs || 0,
        profit: calculatedValues[productId]?.profit || 0,
      },
    };

    updateSalesData(updatedSalesData);
    setSuccessProducts((prev) => ({
      ...prev,
      [productId]: true,
    }));

    // Show inventory reduction message
    setValidationAlerts((prev) => ({
      ...prev,
      [productId]: `✅ Validated! Inventory will be reduced to ${newInventoryLevel} units`,
    }));

    // Clear the alert after 3 seconds
    setTimeout(() => {
      setValidationAlerts((prev) => ({
        ...prev,
        [productId]: null,
      }));
    }, 3000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 min-h-screen p-6">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <header className="mb-10 flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold text-blue-300">
            Sales Dashboard
          </h1>
          <span className="text-lg text-slate-400 tracking-wide">
            Period {period} • {companyData?.name}
          </span>
        </header>

        {/* Dashboard Cards */}
        <section className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
          <DashboardCard
            title="Total Revenue"
            value={`₹${formatNumber(Math.round(totalMetrics.totalRevenue))}`}
            subtitle="Expected sales revenue"
            icon={DollarSign}
            size="large"
          />
          <DashboardCard
            title="Total Volume"
            value={totalMetrics.totalVolume}
            subtitle="Units to be sold"
            icon={Package}
            size="large"
          />
          <DashboardCard
            title="Avg Market Share"
            value={`${totalMetrics.avgMarketShare.toFixed(1)}%`}
            subtitle="Average across products"
            icon={TrendingUp}
            size="large"
          />
          <DashboardCard
            title="Avg Customer Satisfaction"
            value={`${totalMetrics.avgCustomerSatisfaction.toFixed(1)}/10`}
            subtitle="Average satisfaction score"
            icon={Users}
            size="large"
          />
          <DashboardCard
            title="Total Profit"
            value={`₹${formatNumber(Math.round(totalMetrics.totalProfit))}`}
            subtitle="Revenue minus costs"
            icon={Star}
            size="large"
          />
        </section>

        {/* Product Sales Config */}
        {products
          ?.filter((product) => product.id)
          .map((product) => {
            const productId = product.id!; // We know it exists due to filter
            const pSales = salesData?.[productId] || {};
            const calc = calculatedValues[productId] || {
              revenue: 0,
              costs: 0,
              profit: 0,
            };

            return (
              <div
                key={productId}
                className="bg-slate-800/50 shadow-md rounded-2xl p-6 mb-8 border border-slate-700 flex justify-between items-center"
              >
                <div className="flex flex-col justify-center items-center">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {product.name}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
                    <div className="text-slate-300">
                      <span className="font-medium text-blue-300">
                        Category:
                      </span>{" "}
                      <p className="text-white">{product.category}</p>
                    </div>
                    <div className="text-slate-300">
                      <span className="font-medium text-blue-300">Price:</span>{" "}
                      <p className="text-white">₹{product.selling_price}</p>
                    </div>
                    <div className="text-slate-300">
                      <span className="font-medium text-blue-300">
                        Inventory:
                      </span>{" "}
                      <p className="text-white">
                        {product.inventory_level} units
                      </p>
                    </div>
                    <div className="text-slate-300">
                      <span className="font-medium text-blue-300">
                        Cost/unit:
                      </span>{" "}
                      <p className="text-white">₹{product.production_cost}</p>
                    </div>
                  </div>
                  <div className=" text-slate-300">
                    <div>
                      Revenue: ₹{formatNumber(Math.round(calc.revenue))}
                    </div>
                    <div>Costs: ₹{formatNumber(Math.round(calc.costs))}</div>
                    <div>Profit: ₹{formatNumber(Math.round(calc.profit))}</div>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <Slider
                    label="Sales Volume (Units)"
                    tooltipText="Units to sell"
                    value={[pSales.sales_volume || 0]}
                    min={0}
                    max={product.inventory_level || 1000}
                    onValueChange={(val) =>
                      handleProductInputChange(
                        productId,
                        "sales_volume",
                        val[0]
                      )
                    }
                  />
                  <Slider
                    label="Market Share (%)"
                    tooltipText="Target market percentage"
                    value={[pSales.market_share || 0]}
                    min={0}
                    max={100}
                    onValueChange={(val) =>
                      handleProductInputChange(
                        productId,
                        "market_share",
                        val[0]
                      )
                    }
                  />
                  <Slider
                    label="Customer Satisfaction (1-10)"
                    tooltipText="Customer satisfaction rating"
                    value={[pSales.customer_satisfaction || 1]}
                    min={1}
                    max={10}
                    onValueChange={(val) =>
                      handleProductInputChange(
                        productId,
                        "customer_satisfaction",
                        val[0]
                      )
                    }
                  />
                </div>

                {/* Calculated fields */}

                {/* Actions */}
                <div className="mt-4 flex items-center gap-4">
                  <button
                    onClick={() => handleValidateProduct(productId)}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow"
                  >
                    Validate
                  </button>
                  {validationAlerts[productId] && (
                    <div className="flex items-center gap-2 text-rose-400">
                      <AlertTriangle size={18} /> {validationAlerts[productId]}
                    </div>
                  )}
                  {successProducts[productId] &&
                    !validationAlerts[productId] && (
                      <div className="flex items-center gap-2 text-green-400">
                        <Check size={18} /> Validated!
                      </div>
                    )}
                  {validationAlerts[productId] &&
                    validationAlerts[productId]?.startsWith("✅") && (
                      <div className="flex items-center gap-2 text-green-400">
                        <Check size={18} /> {validationAlerts[productId]}
                      </div>
                    )}
                </div>
              </div>
            );
          })}

        {/* Total Revenue Summary */}
        <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold text-blue-300 mb-3">
            Sales Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Total Revenue:</span>
              <p className="text-white font-semibold">
                ₹{formatNumber(Math.round(totalMetrics.totalRevenue))}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Total Costs:</span>
              <p className="text-white font-semibold">
                ₹{formatNumber(Math.round(totalMetrics.totalCosts))}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Total Profit:</span>
              <p className="text-white font-semibold">
                ₹{formatNumber(Math.round(totalMetrics.totalProfit))}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Total Volume:</span>
              <p className="text-white font-semibold">
                {totalMetrics.totalVolume} units
              </p>
            </div>
          </div>
        </div>

        {/* Projected Cash Balance */}
        <div className="mt-6 text-slate-300">
          Projected Cash Balance: ₹
          {formatNumber(Math.round(projectedCashBalance))}
        </div>
      </div>
    </div>
  );
};

export default Sales;
