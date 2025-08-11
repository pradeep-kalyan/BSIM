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
  Edit,
} from "lucide-react";
import React, { useState } from "react";
import InfoCard from "@/app/components/InfoCard";
import ProductFormPage from "./NewProduct";
import { useCompanyForm, useProductForm } from "@/app/context/FormContext";
import { useSimulation } from "@/app/context/SimulationContext";
// Data types
interface Product {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  quality_rating: number;
  innovation_rating: number;
  sustainability_rating: number;
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

const ProductsForm: React.FC<ProductsFormProps> = () => {
  // companyId is passed but not used since we're using context for data
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { products, addProduct, updateProductByIndex } = useProductForm();
  const { period } = useSimulation();

  const { data: companyData } = useCompanyForm();

  // Modal state for add/edit
  const [showProductForm, setShowProductForm] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // HANDLERS

  // Creating new product
  const handleAddProduct = async (productData: Partial<Product>) => {
    setSubmitting(true);
    setError(null);
    try {
      // Convert to ProductFormData format and add to context only - no DB call
      const newProduct = {
        id: `temp-${Date.now()}`, // Temporary ID for UI
        name: productData.name || "",
        description: productData.description || "",
        category: productData.category || "",
        quality_rating: productData.quality_rating || 0,
        innovation_rating: productData.innovation_rating || 0,
        sustainability_rating: productData.sustainability_rating || 0,
        status: "active",
        launch_period: undefined,
        discontinue_period: undefined,
      };

      addProduct(newProduct);
      setShowProductForm(false);
    } catch {
      setError("Failed to add product");
    } finally {
      setSubmitting(false);
    }
  };

  // Editing existing product
  const handleUpdateProduct = async (productData: Partial<Product>) => {
    setSubmitting(true);
    setError(null);
    try {
      if (!editProduct) return;

      // Find the index of the product to update
      const productIndex = products.findIndex((p) => p.id === editProduct.id);
      if (productIndex === -1) return;

      // Update product in context only - no DB call
      const updatedProduct = {
        name: productData.name || editProduct.name,
        description: productData.description || editProduct.description || "",
        category: productData.category || editProduct.category,
        quality_rating:
          productData.quality_rating ?? editProduct.quality_rating,
        innovation_rating:
          productData.innovation_rating ?? editProduct.innovation_rating,
        sustainability_rating:
          productData.sustainability_rating ??
          editProduct.sustainability_rating,
        status: editProduct.status,
        launch_period: editProduct.launch_period || undefined,
        discontinue_period: editProduct.discontinue_period || undefined,
      };

      updateProductByIndex(productIndex, updatedProduct);
      setShowProductForm(false);
      setEditProduct(null);
    } catch {
      setError("Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  // Launch product (status change only)
  const handleLaunchProduct = async (productId: string) => {
    setSubmitting(true);
    try {
      const productIndex = products.findIndex((p) => p.id === productId);
      if (productIndex !== -1) {
        updateProductByIndex(productIndex, {
          status: "active",
          launch_period: period || undefined,
        });
      }
    } catch {
      setError("Failed to launch product");
    } finally {
      setSubmitting(false);
    }
  };

  // Discontinue product (status change only)
  const handleDiscontinueProduct = async (productId: string) => {
    setSubmitting(true);
    try {
      const productIndex = products.findIndex((p) => p.id === productId);
      if (productIndex !== -1) {
        updateProductByIndex(productIndex, {
          status: "discontinued",
          discontinue_period: period || undefined,
        });
      }
    } catch {
      setError("Failed to discontinue product");
    } finally {
      setSubmitting(false);
    }
  };

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
  const developmentProducts = products.filter(
    (p) => p.status === "development"
  ).length;
  const avgQualityRating =
    products.length > 0
      ? products.reduce((acc, p) => acc + p.quality_rating, 0) / products.length
      : 0;

  // ---- RENDER ----

  if (!companyData) {
    return (
      <div className="min-h-screen bg-slate-800/50 shadow-md flex items-center justify-center">
        <p className="text-slate-300">No company data found</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 shadow-md py-2 px-6">
      <div className="max-w-7xl mx-auto mt-2">
        {/* Header */}
        <div>
          {error && (
            <div className="mb-4 p-3 bg-red-600/20 border border-red-600 rounded-lg text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <InfoCard
            label="Active Products"
            value={activeProducts}
            Icon={Package}
            width="w-full"
            height="h-full"
            iconColor="text-emerald-400"
          />
          <InfoCard
            label="In Development"
            value={developmentProducts}
            Icon={Lightbulb}
            width="w-full"
            height="h-full"
            iconColor="text-yellow-400"
          />
          <InfoCard
            label="Portfolio Value"
            value={""}
            isCurrency={true}
            Icon={IndianRupee}
            width="w-full"
            height="h-full"
            iconColor="text-green-400"
          />
          <InfoCard
            label="Avg Quality"
            value={parseFloat(avgQualityRating.toFixed(1))}
            Icon={Star}
            width="w-full"
            height="h-full"
            iconColor="text-yellow-300"
          />
        </div>

        {/* Products List */}
        <div className="bg-slate-800/50 shadow-md rounded-xl p-6 border border-slate-700 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="flex items-center text-2xl font-bold text-white mb-6">
              Product Portfolio
            </h2>
            <button
              onClick={() => {
                setFormMode("add");
                setEditProduct(null);
                setShowProductForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mb-2"
            >
              <Plus className="h-4 w-4" />
              New Product
            </button>
          </div>
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
                  className="bg-slate-800/50 shadow-md rounded-lg p-4 border border-slate-600"
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
                      <span className="text-slate-400">Quality:</span>
                      <span className="text-white">
                        {product.quality_rating}/10
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
                            width: `${
                              (product.sustainability_rating / 10) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Action buttons */}
                  <div className="mt-4 flex gap-2">
                    {product.status === "development" && (
                      <button
                        onClick={() =>
                          product.id && handleLaunchProduct(product.id)
                        }
                        disabled={submitting || !product.id}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <Play className="h-3 w-3" />
                        Launch
                      </button>
                    )}
                    {product.status === "active" && (
                      <button
                        onClick={() =>
                          product.id && handleDiscontinueProduct(product.id)
                        }
                        disabled={submitting || !product.id}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <Square className="h-3 w-3" />
                        Discontinue
                      </button>
                    )}
                    <button
                      onClick={() => {
                        // Convert ProductFormData to Product type for editing
                        if (product.id) {
                          const productForEdit: Product = {
                            id: product.id,
                            name: product.name,
                            description: product.description || null,
                            category: product.category,
                            quality_rating: product.quality_rating,
                            innovation_rating: product.innovation_rating,
                            sustainability_rating:
                              product.sustainability_rating,
                            status: product.status,
                            launch_period: product.launch_period || null,
                            discontinue_period:
                              product.discontinue_period || null,
                            latest_performance: null,
                          };
                          setEditProduct(productForEdit);
                          setFormMode("edit");
                          setShowProductForm(true);
                        }
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
