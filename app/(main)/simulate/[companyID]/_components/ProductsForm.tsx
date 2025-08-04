"use client";
import {
  IndianRupee,
  Plus,
  Star,
  Lightbulb,
  Leaf,
  Package,
  Play,
  Square,
  Loader2,
  Edit,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import DashboardCard from "./Card";
import {
  getCompanyData,
  getCompanyProducts,
  createProduct,
  launchProduct,
  discontinueProduct,
  updateProduct,
} from "@/app/_actions/product-actions";
import ProductFormPage from "./NewProduct";

// Data types
interface CompanyData {
  id: string;
  name: string;
  current_period: number;
  cash_balance: number;
}
interface Product {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  quality_rating: number;
  innovation_rating: number;
  sustainability_rating: number;
  production_cost: number;
  selling_price: number;
  inventory_level: number;
  production_capacity: number;
  development_cost: number;
  marketing_budget: number;
  status: string;
  launch_period?: number | null;
  discontinue_period?: number | null;
  latest_performance?: {
    sales_volume: number;
    revenue: number;
    costs: number;
    profit: number;
    market_share: number;
    customer_satisfaction: number;
  } | null;
}

interface ProductsFormProps {
  companyId: string;
}

const ProductsForm: React.FC<ProductsFormProps> = ({ companyId }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  // Modal state for add/edit
  const [showProductForm, setShowProductForm] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [company, companyProducts] = await Promise.all([
          getCompanyData(companyId),
          getCompanyProducts(companyId),
        ]);
        setCompanyData(company);
        setProducts(companyProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [companyId]);

  // HANDLERS

  // Creating new product
  const handleAddProduct = async (
    data: Omit<
      Product,
      | "id"
      | "status"
      | "launch_period"
      | "discontinue_period"
      | "latest_performance"
    >
  ) => {
    if (!companyData) return;
    setSubmitting(true);
    setError(null);
    try {
      await createProduct({
        company_id: companyId,
        description: data.description ?? undefined,
        ...data,
      });
      setShowProductForm(false);
      setEditProduct(null);
      setFormMode("add");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  // Editing existing product
  const handleUpdateProduct = async (data: Product) => {
    setSubmitting(true);
    setError(null);
    try {
      await updateProduct({
        product_id: data.id,
        name: data.name,
        description: data.description ?? undefined,
        category: data.category,
        quality_rating: data.quality_rating,
        innovation_rating: data.innovation_rating,
        sustainability_rating: data.sustainability_rating,
        production_cost: data.production_cost,
        selling_price: data.selling_price,
        production_capacity: data.production_capacity,
        development_cost: data.development_cost,
        marketing_budget: data.marketing_budget,
        status: data.status,
      });
      setShowProductForm(false);
      setEditProduct(null);
      setFormMode("add");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLaunchProduct = async (productId: string) => {
    if (!companyData) return;
    setSubmitting(true);
    setError(null);
    try {
      await launchProduct(productId, companyData.current_period);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to launch product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDiscontinueProduct = async (productId: string) => {
    if (!companyData) return;
    setSubmitting(true);
    setError(null);
    try {
      await discontinueProduct(productId, companyData.current_period);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to discontinue product"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // UI ONLY HELPERS

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "development":
        return "text-yellow-400 bg-yellow-400/20";
      case "active":
        return "text-green-400 bg-green-400/20";
      case "discontinued":
        return "text-red-400 bg-red-400/20";
      default:
        return "text-slate-400 bg-slate-400/20";
    }
  };

  const activeProducts = products.filter((p) => p.status === "active").length;
  const developmentProducts = products.filter((p) => p.status === "development")
    .length;
  const totalProductValue = products.reduce(
    (acc, p) => acc + p.selling_price * p.inventory_level,
    0
  );
  const avgQualityRating =
    products.length > 0
      ? products.reduce((acc, p) => acc + p.quality_rating, 0) / products.length
      : 0;

  // ---- RENDER ----

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-slate-300">Loading products dashboard...</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-2">
      <div className="max-w-7xl mx-auto mt-2">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Products Dashboard
              </h1>
              <p className="text-slate-400">
                Period {companyData.current_period} • {companyData.name}
              </p>
            </div>
            <button
              onClick={() => {
                setFormMode("add");
                setEditProduct(null);
                setShowProductForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Product
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <DashboardCard
            title="Active Products"
            value={activeProducts.toString()}
            subtitle="Currently Selling"
            icon={Package}
            size="small"
            gradient={true}
          />
          <DashboardCard
            title="In Development"
            value={developmentProducts.toString()}
            subtitle="Under Development"
            icon={Lightbulb}
            size="small"
            gradient={true}
          />
          <DashboardCard
            title="Portfolio Value"
            value={formatCurrency(totalProductValue)}
            subtitle="Total Inventory Value"
            icon={IndianRupee}
            size="small"
            gradient={true}
          />
          <DashboardCard
            title="Avg Quality"
            value={avgQualityRating.toFixed(1)}
            subtitle="Quality Rating"
            icon={Star}
            size="small"
            gradient={true}
          />
        </div>

        {/* Products List */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            Product Portfolio
          </h2>
          {products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">
                No products yet. Create your first product!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-white">
                      {product.name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        product.status
                      )}`}
                    >
                      {product.status}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">
                    {product.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Category:</span>
                      <span className="text-white">{product.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Price:</span>
                      <span className="text-white">
                        {formatCurrency(product.selling_price)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Quality:</span>
                      <span className="text-white">
                        {product.quality_rating}/10
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Inventory:</span>
                      <span className="text-white">
                        {product.inventory_level}
                      </span>
                    </div>
                  </div>
                  {/* Rating bars */}
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Star className="h-3 w-3 text-yellow-400" />
                      <div className="flex-1 bg-slate-600 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{
                            width: `${(product.quality_rating / 10) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-3 w-3 text-blue-400" />
                      <div className="flex-1 bg-slate-600 rounded-full h-2">
                        <div
                          className="bg-blue-400 h-2 rounded-full"
                          style={{
                            width: `${(product.innovation_rating / 10) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Leaf className="h-3 w-3 text-green-400" />
                      <div className="flex-1 bg-slate-600 rounded-full h-2">
                        <div
                          className="bg-green-400 h-2 rounded-full"
                          style={{
                            width: `${(product.sustainability_rating / 10) *
                              100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Action buttons */}
                  <div className="mt-4 flex gap-2">
                    {product.status === "development" && (
                      <button
                        onClick={() => handleLaunchProduct(product.id)}
                        disabled={submitting}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <Play className="h-3 w-3" />
                        Launch
                      </button>
                    )}
                    {product.status === "active" && (
                      <button
                        onClick={() => handleDiscontinueProduct(product.id)}
                        disabled={submitting}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <Square className="h-3 w-3" />
                        Discontinue
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditProduct(product);
                        setFormMode("edit");
                        setShowProductForm(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* ADD/EDIT FORM MODAL */}
        {showProductForm && (
          <div className="fixed z-50 top-0 left-0 w-full h-full flex items-center justify-center bg-slate-900/60">
            <div className="relative w-full max-w-xl">
              <div className="absolute top-1 right-2">
                <button
                  onClick={() => setShowProductForm(false)}
                  className="text-slate-400 bg-slate-800 rounded-full p-1 hover:text-white"
                  title="Close"
                >
                  ×
                </button>
              </div>
              <ProductFormPage
                mode={formMode}
                initialProduct={editProduct || undefined}
                onSubmit={
                  formMode === "edit" ? handleUpdateProduct : handleAddProduct
                }
                onCancel={() => setShowProductForm(false)}
                submitting={submitting}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsForm;
