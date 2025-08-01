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
import DashboardCard from "./Card";
import type { ProductFormData } from "@/app/context/FormContext";

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
  const [selectedProduct, setSelectedProduct] = React.useState<string>("");
  const [selectedProductData, setSelectedProductData] =
    React.useState<ProductFormData | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [validationAlert, setValidationAlert] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    if (selectedProduct && products) {
      const productData = products.find(
        (p) => (p.id || p.name) === selectedProduct
      );
      setSelectedProductData(productData || null);
    } else {
      setSelectedProductData(null);
    }
  }, [selectedProduct, products]);

  // Real-time calculation of costs and profit
  React.useEffect(() => {
    if (selectedProductData && salesData) {
      const salesVolume = salesData.sales_volume || 0;
      const revenue = salesData.revenue || 0;
      const productionCost = selectedProductData.production_cost || 0;
      const costs = salesVolume * productionCost;
      const profit = revenue - costs;

      // Only update if the calculated values are different to avoid infinite loops
      if (salesData.costs !== costs || salesData.profit !== profit) {
        updateSalesData({ costs: costs, profit: profit });
      }
    }
    // Disable exhaustive deps to prevent infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedProductData?.production_cost,
    salesData?.sales_volume,
    salesData?.revenue,
  ]);

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProduct(e.target.value);
    setSuccess(false);
    setValidationAlert(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateSalesData({ [name]: Number(value) || 0 });
    setError(name, "");
    setSuccess(false);
    setValidationAlert(null);
  };

  const handleValidate = () => {
    setSuccess(false);
    setValidationAlert(null);

    if (!selectedProduct || !selectedProductData) {
      setValidationAlert("⚠️ Please select a product first");
      return;
    }

    const salesVolume = salesData?.sales_volume || 0;
    const revenue = salesData?.revenue || 0;
    const marketShare = salesData?.market_share || 0;
    const customerSatisfaction = salesData?.customer_satisfaction || 0;

    // Validation checks
    if (salesVolume <= 0) {
      setValidationAlert("⚠️ Sales volume must be greater than 0");
      return;
    }

    if (salesVolume > (selectedProductData.inventory_level || 0)) {
      setValidationAlert(
        `⚠️ Sales volume (${salesVolume}) cannot exceed available inventory (${
          selectedProductData.inventory_level || 0
        })`
      );
      return;
    }

    if (revenue <= 0) {
      setValidationAlert("⚠️ Revenue must be greater than 0");
      return;
    }

    if (marketShare < 0 || marketShare > 100) {
      setValidationAlert("⚠️ Market share must be between 0 and 100%");
      return;
    }

    if (customerSatisfaction < 1 || customerSatisfaction > 10) {
      setValidationAlert("⚠️ Customer satisfaction must be between 1 and 10");
      return;
    }

    // Calculate costs and profit
    const costs = salesVolume * (selectedProductData.production_cost || 0);
    const profit = revenue - costs;

    // Update sales data with calculated values
    updateSalesData({
      sales_volume: salesVolume,
      revenue: revenue,
      costs: costs,
      profit: profit,
      market_share: marketShare,
      customer_satisfaction: customerSatisfaction,
    });

    updateSalesBudgetImpact(salesData?.revenue);

    // Note: updateSalesData (which is updateDataWithCashImpact) automatically handles the budget impact
    setSuccess(true);
  };

  // Calculate metrics for dashboard cards (with proper dependency array)
  const frozenSalesData = React.useMemo(
    () => ({
      sales_volume: salesData?.sales_volume ?? 0,
      revenue: salesData?.revenue ?? 0,
      costs: salesData?.costs ?? 0,
      profit: salesData?.profit ?? 0,
      market_share: salesData?.market_share ?? 0,
      customer_satisfaction: salesData?.customer_satisfaction ?? 0,
    }),
    [salesData?.revenue, salesData?.sales_volume, salesData?.costs, salesData?.profit, salesData?.market_share, salesData?.customer_satisfaction]
  );

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 min-h-screen p-6">
      <div className="max-w-5xl mx-auto py-8">
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
            value={`₹${formatNumber(Math.round(frozenSalesData.revenue))}`}
            subtitle="Expected sales revenue"
            icon={DollarSign}
            size="large"
          />
          <DashboardCard
            title="Sales Volume"
            value={frozenSalesData.sales_volume}
            subtitle="Units to be sold"
            icon={Package}
            size="large"
          />
          <DashboardCard
            title="Market Share"
            value={`${frozenSalesData.market_share}%`}
            subtitle="Market penetration"
            icon={TrendingUp}
            size="large"
          />
          <DashboardCard
            title="Customer Satisfaction"
            value={`${frozenSalesData.customer_satisfaction}/10`}
            subtitle="Satisfaction rating"
            icon={Users}
            size="large"
          />
          <DashboardCard
            title="Profit Margin"
            value={`₹${formatNumber(Math.round(frozenSalesData.profit))}`}
            subtitle="Revenue minus costs"
            icon={Star}
            size="large"
          />
        </section>

        {/* Sales Form */}
        <div className="bg-slate-800/50 shadow-md rounded-2xl p-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">
            Configure Sales Strategy
          </h2>

          {/* Product Selection */}
          <div className="mb-6">
            <label
              htmlFor="productSelection"
              className="block text-slate-200 font-semibold mb-2"
            >
              Select Product
            </label>
            <select
              id="productSelection"
              name="productSelection"
              value={selectedProduct}
              onChange={handleProductChange}
              className="w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="">Select a product...</option>
              {products?.map((product, index) => (
                <option
                  key={product.id || product.name + index}
                  value={product.id || product.name}
                  className="bg-slate-700 text-white"
                >
                  {`${product.name} - ${
                    product.inventory_level || 0
                  } units available (₹${product.selling_price}/unit)`}
                </option>
              ))}
            </select>
          </div>

          {/* Product Details Display */}
          {selectedProductData && (
            <div className="bg-slate-700/50 rounded-lg p-4 mb-6 border border-slate-600">
              <h3 className="text-lg font-semibold text-white mb-3">
                Selected Product Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-slate-300">
                  <span className="font-medium text-blue-300">Category:</span>
                  <p className="text-white">{selectedProductData.category}</p>
                </div>
                <div className="text-slate-300">
                  <span className="font-medium text-blue-300">
                    Selling Price:
                  </span>
                  <p className="text-white">
                    ₹{selectedProductData.selling_price}
                  </p>
                </div>
                <div className="text-slate-300">
                  <span className="font-medium text-blue-300">
                    Available Inventory:
                  </span>
                  <p className="text-white">
                    {selectedProductData.inventory_level || 0} units
                  </p>
                </div>
                <div className="text-slate-300">
                  <span className="font-medium text-blue-300">
                    Production Cost:
                  </span>
                  <p className="text-white">
                    ₹{selectedProductData.production_cost}/unit
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Sales Input Fields */}
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                id: "sales_volume",
                label: "Sales Volume (Units)",
                value: salesData?.sales_volume ?? 0,
                type: "number",
                step: 1,
                min: 0,
                max: selectedProductData?.inventory_level || undefined,
                placeholder: selectedProductData
                  ? `Max available: ${
                      selectedProductData.inventory_level || 0
                    } units`
                  : "Enter sales volume",
                disabled: !selectedProduct,
              },
              {
                id: "revenue",
                label: "Total Revenue (₹)",
                value: salesData?.revenue ?? 0,
                type: "number",
                step: 0.01,
                min: 0,
                placeholder: selectedProductData
                  ? `Suggested: ₹${(
                      (selectedProductData.selling_price || 0) *
                      (salesData?.sales_volume || 0)
                    ).toLocaleString()}`
                  : "Enter expected revenue",
                disabled: !selectedProduct,
              },
              {
                id: "market_share",
                label: "Market Share (%)",
                value: salesData?.market_share ?? 0,
                type: "number",
                step: 0.1,
                min: 0,
                max: 100,
                placeholder: "Market share percentage (0-100)",
                disabled: !selectedProduct,
              },
              {
                id: "customer_satisfaction",
                label: "Customer Satisfaction Rating",
                value: salesData?.customer_satisfaction ?? 0,
                type: "number",
                step: 0.1,
                min: 1,
                max: 10,
                placeholder: "Satisfaction rating (1-10)",
                disabled: !selectedProduct,
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
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  disabled={field.disabled}
                  className={`w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed transition-all`}
                />
              </div>
            ))}

            {/* Read-only Calculated Fields */}
            <div>
              <label
                htmlFor="costs"
                className="block text-slate-200 font-semibold mb-1"
              >
                Total Costs (₹)
              </label>
              <input
                id="costs"
                name="costs"
                type="text"
                value={formatNumber(Math.round(salesData?.costs || 0))}
                readOnly
                placeholder="Calculated total costs"
                className="w-full p-3 rounded-lg bg-slate-600 text-slate-300 border border-slate-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="profit"
                className="block text-slate-200 font-semibold mb-1"
              >
                Expected Profit (₹)
              </label>
              <input
                id="profit"
                name="profit"
                type="text"
                value={formatNumber(Math.round(salesData?.profit || 0))}
                readOnly
                placeholder="Calculated profit"
                className="w-full p-3 rounded-lg bg-slate-600 text-slate-300 border border-slate-600 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Summary Section */}
          <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="text-xl text-blue-400 font-semibold">
                Expected Profit: ₹
                {formatNumber(Math.round(salesData?.profit || 0))}
              </div>
              <div className="text-sm space-y-1">
                <div className="text-slate-300">
                  Revenue: ₹{formatNumber(salesData?.revenue || 0)}
                </div>
                <div className="text-slate-300">
                  Costs: ₹{formatNumber(Math.round(salesData?.costs || 0))}
                </div>
                <div className="text-slate-300">
                  Projected Cash Balance : ₹
                  {formatNumber(Math.round(projectedCashBalance))}
                </div>
                {selectedProductData && (
                  <div className="text-slate-300">
                    Profit Margin:{" "}
                    {salesData?.revenue && salesData?.revenue > 0
                      ? (
                          ((salesData?.profit || 0) / salesData.revenue) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleValidate}
              disabled={!selectedProduct}
              className={`px-8 py-3 rounded-lg font-semibold transition shadow ${
                selectedProduct
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-slate-600 text-slate-400 cursor-not-allowed"
              }`}
            >
              Validate Sales Strategy
            </button>
          </div>

          {/* Validation Messages */}
          {(validationAlert || success) && (
            <div className="mt-6 space-y-4">
              {validationAlert && (
                <div
                  className="bg-rose-900/60 border border-rose-700 text-rose-300 rounded-lg p-4 animate-pulse"
                  role="alert"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-rose-500 mt-0.5" />
                    <p className="text-sm">{validationAlert}</p>
                  </div>
                </div>
              )}

              {success && !validationAlert && (
                <div
                  className="bg-green-900/60 border border-white/80 text-white rounded-lg p-4 animate-bounce"
                  role="alert"
                >
                  <div className="flex items-center gap-3">
                    <Check className="text-green-400 text-xl" />
                    <p className="text-xl font-semibold">
                      Sales Strategy Validated Successfully!
                    </p>
                  </div>
                  <div className="mt-2 text-sm text-green-100">
                    Your sales configuration has been saved and is ready for
                    simulation.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sales;
