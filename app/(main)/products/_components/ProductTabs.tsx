"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Package,
  TrendingUp,
  Star,
  DollarSign,
  ShoppingCart,
} from "lucide-react";
import { product, product_performance } from "@prisma/client";

type ProductWithPerformance = product & {
  product_performances: product_performance[];
};

const ProductTabsInterface = ({
  products,
  performance,
  RatingProducts,
  RevenueProducts,
  UnitsProducts,
}: {
  products: product[];
  performance: product_performance[];
  company_id?: string;
  current_period?: number;
  RatingProducts?: ProductWithPerformance[];
  RevenueProducts?: ProductWithPerformance[];
  UnitsProducts?: ProductWithPerformance[];
}) => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("products");
  const [sortBy, setSortBy] = useState("revenue");

  // Set initial tab based on URL parameter
  useEffect(() => {
    const tab = searchParams?.get?.("tab");
    if (tab === "performance" || tab === "products") {
      setActiveTab(tab);
    } else {
      setActiveTab("products");
    }
  }, [searchParams]);

  // Memoized sorted products list
  const sortedProductsList = useMemo(() => {
    let sourceProducts: ProductWithPerformance[] = [];

    if (sortBy === "revenue") {
      sourceProducts = RevenueProducts ?? [];
    } else if (sortBy === "units") {
      sourceProducts = UnitsProducts ?? [];
    } else if (sortBy === "rating") {
      sourceProducts = RatingProducts ?? [];
    }

    // Create array with performance data for sorting
    const productsWithPerf = sourceProducts.map((product) => {
      const perf = product.product_performances[0] || null;

      return {
        ...product,
        performanceData: perf,
        hasPerformanceData: !!perf,
      };
    });

    // Sort based on the selected criteria - prioritize products with performance data
    const sortedProducts = [...productsWithPerf];

    if (sortBy === "revenue") {
      sortedProducts.sort((a, b) => {
        // First, prioritize products with performance data
        if (a.hasPerformanceData && !b.hasPerformanceData) return -1;
        if (!a.hasPerformanceData && b.hasPerformanceData) return 1;

        // Then sort by revenue
        const revenueA = a.performanceData?.revenue || 0;
        const revenueB = b.performanceData?.revenue || 0;
        return revenueB - revenueA;
      });
    } else if (sortBy === "units") {
      sortedProducts.sort((a, b) => {
        // First, prioritize products with performance data
        if (a.hasPerformanceData && !b.hasPerformanceData) return -1;
        if (!a.hasPerformanceData && b.hasPerformanceData) return 1;

        // Then sort by units sold
        const unitsA = a.performanceData?.sales_volume || 0;
        const unitsB = b.performanceData?.sales_volume || 0;
        return unitsB - unitsA;
      });
    } else if (sortBy === "rating") {
      sortedProducts.sort((a, b) => {
        // First, prioritize products with performance data
        if (a.hasPerformanceData && !b.hasPerformanceData) return -1;
        if (!a.hasPerformanceData && b.hasPerformanceData) return 1;

        // Then sort by customer satisfaction
        const satisfactionA = a.performanceData?.customer_satisfaction || 0;
        const satisfactionB = b.performanceData?.customer_satisfaction || 0;
        return satisfactionB - satisfactionA;
      });
    }

    // Return top 10
    return sortedProducts.slice(0, 10);
  }, [sortBy, RatingProducts, RevenueProducts, UnitsProducts]);


  const TabButton = ({
    id,
    label,
    icon: Icon,
    isActive,
    onClick,
  }: {
    id: string;
    label: string;
    icon: React.ComponentType<{ size?: number }>;
    isActive: boolean;
    onClick: (id: string) => void;
  }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
        isActive
          ? "bg-blue-500 text-white shadow-md shadow-blue-500/30"
          : "text-slate-400 hover:text-white hover:bg-slate-700/40"
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  const ProductCard = ({ product }: { product: product }) => (
    <div className="bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-700/50 hover:border-slate-600/50">
      <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
        <Package size={48} className="text-slate-400" />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white">{product.name}</h3>
          <span className="text-sm text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
        <p className="text-slate-400 text-sm mb-4">{product.description}</p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-blue-400">
            ${product.selling_price}
          </span>
          <div className="flex items-center gap-1">
            <Star className="text-yellow-400 fill-current" size={16} />
            <span className="text-sm text-slate-300">
              {product.quality_rating}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>Stock: {product.inventory_level} units</span>
          <span
            className={`px-2 py-1 rounded ${
              product.inventory_level > 50
                ? "bg-green-500/20 text-green-400"
                : product.inventory_level > 20
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {product.inventory_level > 50
              ? "In Stock"
              : product.inventory_level > 20
              ? "Low Stock"
              : "Very Low"}
          </span>
        </div>
      </div>
    </div>
  );

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex bg-slate-800/60 backdrop-blur-sm rounded-full p-1 border border-slate-700/40 shadow-inner shadow-slate-800/40 mb-8 w-fit">
          <TabButton
            id="products"
            label="Products"
            icon={Package}
            isActive={activeTab === "products"}
            onClick={setActiveTab}
          />
          <TabButton
            id="performance"
            label="Performance"
            icon={TrendingUp}
            isActive={activeTab === "performance"}
            onClick={setActiveTab}
          />
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Products</p>
                    <p className="text-2xl font-bold text-white">
                      {products.length}
                    </p>
                  </div>
                  <Package className="text-blue-400" size={24} />
                </div>
              </div>
              <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Stock</p>
                    <p className="text-2xl font-bold text-white">
                      {products.reduce((sum, p) => sum + p.inventory_level, 0)}
                    </p>
                  </div>
                  <ShoppingCart className="text-green-400" size={24} />
                </div>
              </div>
              <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Avg Rating</p>
                    <p className="text-2xl font-bold text-white">
                      {products.length > 0
                        ? (
                            products.reduce(
                              (sum, p) => sum + p.quality_rating,
                              0
                            ) / products.length
                          ).toFixed(1)
                        : "N/A"}
                    </p>
                  </div>
                  <Star className="text-yellow-400" size={24} />
                </div>
              </div>
              <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Value</p>
                    <p className="text-2xl font-bold text-white">
                      $
                      {products
                        .reduce(
                          (sum, p) => sum + p.selling_price * p.inventory_level,
                          0
                        )
                        .toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="text-purple-400" size={24} />
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === "performance" && (
          <div className="space-y-6">
            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Total Revenue
                  </h3>
                  <DollarSign className="text-green-400" size={24} />
                </div>
                <p className="text-3xl font-bold text-green-400">
                  $
                  {performance
                    .reduce((sum, p) => sum + p.revenue, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Total Sales
                  </h3>
                  <ShoppingCart className="text-blue-400" size={24} />
                </div>
                <p className="text-3xl font-bold text-blue-400">
                  {performance.reduce((sum, p) => sum + p.sales_volume, 0)}
                </p>
              </div>
              <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Average Order Value
                  </h3>
                  <TrendingUp className="text-purple-400" size={24} />
                </div>
                <p className="text-3xl font-bold text-purple-400">
                  $
                  {performance.length > 0
                    ? (
                        performance.reduce((sum, p) => sum + p.revenue, 0) /
                        performance.reduce((sum, p) => sum + p.sales_volume, 0)
                      ).toFixed(2)
                    : "0.00"}
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Chart */}
              {/* Top Product Sales Chart (Line) */}
              <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Top Product Sales
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={performance
                      .filter((p) => p.sales_volume > 0)
                      .sort((a, b) => b.sales_volume - a.sales_volume)
                      .slice(0, 5)
                      .map((p) => ({
                        name:
                          products.find((prod) => prod.id === p.product_id)
                            ?.name || "Product",
                        sales: p.sales_volume,
                      }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue Chart */}
              {/* Product Revenue vs Cost Chart (Bar) */}
              {/* Revenue vs Production Cost (Line Chart) */}
              <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Revenue vs Production Cost
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={performance
                      .map((perf) => {
                        const productDetails = products.find(
                          (p) => p.id === perf.product_id
                        );
                        return {
                          name: productDetails?.name || "Product",
                          revenue: perf.revenue,
                          cost:
                            (productDetails?.production_cost ?? 0) *
                            perf.sales_volume,
                        };
                      })
                      .slice(0, 7)}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Revenue"
                    />
                    <Line
                      type="monotone"
                      dataKey="cost"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      name="Cost"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Top 10 Performing Products
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="revenue">Sort by Revenue</option>
                  <option value="units">Sort by Units Sold</option>
                  <option value="rating">Sort by Customer Satisfaction</option>
                </select>
              </div>
              <div className="space-y-4">
                {sortedProductsList.map((product, index) => {
                  const perf = product.performanceData;
                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600/30"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-slate-400">
                          #{index + 1}
                        </span>
                        <div>
                          <h4 className="font-medium text-white">
                            {product.name}
                          </h4>
                          <p className="text-sm text-slate-400">
                            {perf?.sales_volume ?? 0} units sold •
                            {sortBy === "rating"
                              ? ` Customer Satisfaction: ${
                                  perf?.customer_satisfaction ?? "N/A"
                                }`
                              : ` Rating: ${product.quality_rating}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-400">
                          {sortBy === "revenue"
                            ? `$${perf?.revenue?.toLocaleString() ?? "0"}`
                            : sortBy === "units"
                            ? `${
                                perf?.sales_volume?.toLocaleString() ?? "0"
                              } units`
                            : `${perf?.customer_satisfaction ?? "N/A"}`}
                        </p>
                        <p className="text-sm text-slate-400">
                          {sortBy === "revenue"
                            ? "Revenue"
                            : sortBy === "units"
                            ? "Units Sold"
                            : "Satisfaction"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabsInterface;
