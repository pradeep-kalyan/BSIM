"use client";

import React, { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";

interface ProductInput {
  name: string;
  description?: string;
  category: string;
  quality_rating?: number;
  innovation_rating?: number;
  sustainability_rating?: number;
  production_cost?: number;
  selling_price?: number;
  inventory_level?: number;
  production_capacity?: number;
  development_cost?: number;
  marketing_budget?: number;
  status?: string;
  launch_period?: number;
  discontinue_period?: number;
}

// Only allow known safe keys
type ProductField = keyof ProductInput;

interface ProductFormProps {
  onChange: (products: ProductInput[]) => void;
}

export default function ProductForm({ onChange }: ProductFormProps) {
  const [products, setProducts] = useState<ProductInput[]>([
    { name: "", category: "" },
  ]);

  function updateProduct(index: number, field: ProductField, value: string | number) {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
    onChange(updated.filter((p) => p.name && p.category));
  }

  function addProduct() {
    setProducts([...products, { name: "", category: "" }]);
  }

  function removeProduct(index: number) {
    const updated = [...products];
    updated.splice(index, 1);
    setProducts(updated);
    onChange(updated.filter((p) => p.name && p.category));
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-slate-200 flex items-center gap-2 mb-1">
        Products
        <button
          type="button"
          onClick={addProduct}
          className="text-blue-400 hover:text-blue-500 transition"
        >
          <div className="flex items-center gap-2">
            <PlusCircle size={20} />
            <span>Add</span>
          </div>
        </button>
      </h3>

      {products.map((product, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-sm rounded-2xl px-6 py-3 border border-slate-700/50 space-y-4 mb-6"
        >
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-xl font-bold text-slate-100">
              Product {index + 1}
            </h3>
            <button
              onClick={() => removeProduct(index)}
              className="text-red-400 hover:text-red-500"
            >
              <Trash2 />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5 p-2 items-start">
            {/* Product Name */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) =>
                    updateProduct(index, "name", e.target.value)
                  }
                  className="w-full p-2 rounded bg-slate-800 text-white"
                  placeholder="Enter product name"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={product.category}
                  onChange={(e) =>
                    updateProduct(index, "category", e.target.value)
                  }
                  className="w-full p-2 rounded bg-slate-800 text-white"
                  placeholder="Enter category"
                />
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Description
              </label>
              <textarea
                value={product.description || ""}
                onChange={(e) =>
                  updateProduct(index, "description", e.target.value)
                }
                rows={1}
                className="w-full p-2 rounded bg-slate-800 text-white"
                placeholder="Describe the product"
              />
            </div>

            {/* Ratings */}
            {([
              ["Quality Rating", "quality_rating"],
              ["Innovation Rating", "innovation_rating"],
              ["Sustainability Rating", "sustainability_rating"],
            ] as const).map(([label, field]) => (
              <div key={field}>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  {label} (1–10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="0.1"
                  value={product[field] || 0}
                  onChange={(e) =>
                    updateProduct(index, field, parseFloat(e.target.value) || 0)
                  }
                  className="w-full p-2 rounded bg-slate-800 text-white"
                />
              </div>
            ))}

            {/* Financial Inputs */}
            {([
              ["Production Cost", "production_cost"],
              ["Selling Price", "selling_price"],
              ["Inventory Level", "inventory_level", "int"],
              ["Production Capacity", "production_capacity", "int"],
              ["Development Cost", "development_cost"],
              ["Marketing Budget", "marketing_budget"],
            ] as const).map(([label, field, type]) => (
              <div key={field}>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  {label}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={product[field] || 0}
                  onChange={(e) =>
                    updateProduct(
                      index,
                      field,
                      type === "int"
                        ? parseInt(e.target.value) || 0
                        : parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full p-2 rounded bg-slate-800 text-white"
                />
              </div>
            ))}
          </div>

          {/* Investment Summary */}
          {/* <div className="mt-4 bg-slate-700/40 rounded-lg p-4">
            <p className="text-slate-300 text-sm">Estimated Investment</p>
            <p className="text-xl font-bold text-white">
              ₹
              {(
                (product.development_cost || 0) +
                (product.marketing_budget || 0)
              ).toLocaleString()}
            </p>
          </div> */}
        </div>
      ))}
    </div>
  );
}
