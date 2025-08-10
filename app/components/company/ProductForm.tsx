"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { z } from "zod";
import { createProductSchema } from "@/app/lib/validator/validator";

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

type ProductField = keyof ProductInput;

interface ProductFormProps {
  products: ProductInput[];
  onAddProduct: () => void;
  onRemoveProduct: (index: number) => void;
  onProductChange: (
    index: number,
    key: keyof ProductInput,
    value: string | number
  ) => void;
}

export default function ProductForm({
  products,
  onAddProduct,
  onRemoveProduct,
  onProductChange,
}: ProductFormProps) {
  const [errors, setErrors] = useState<
    Array<{ [field in ProductField]?: string } | null>
  >([]);

  useEffect(() => {
    setErrors(products.map(() => null));
  }, [products.length, products]);

  function validateProducts(productsToValidate: ProductInput[]) {
    const result = z.array(createProductSchema).safeParse(productsToValidate);

    if (!result.success) {
      const errorArray: Array<Partial<Record<ProductField, string>>> =
        productsToValidate.map(() => ({}));

      for (const issue of result.error.issues) {
        if (issue.path.length >= 2) {
          const [index, field] = issue.path;
          if (
            typeof index === "number" &&
            typeof field === "string" &&
            errorArray[index]
          ) {
            errorArray[index][field as ProductField] = issue.message;
          }
        }
      }

      setErrors(errorArray.map((e) => (Object.keys(e).length > 0 ? e : null)));
      return false;
    }

    setErrors(productsToValidate.map(() => null));
    return true;
  }

  function handleFieldChange(
    index: number,
    field: ProductField,
    value: string | number
  ) {
    onProductChange(index, field, value);
    validateProducts(products);
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-slate-200 flex items-center gap-2 mb-1">
        Products
        <button
          type="button"
          onClick={onAddProduct}
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
              onClick={() => onRemoveProduct(index)}
              className="text-red-400 hover:text-red-500"
            >
              <Trash2 />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5 p-2 items-start">
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) =>
                    handleFieldChange(index, "name", e.target.value)
                  }
                  className="w-full p-2 rounded bg-slate-800 text-white"
                  placeholder="Enter product name"
                />
                {errors[index]?.name && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors[index]?.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={product.category}
                  onChange={(e) =>
                    handleFieldChange(index, "category", e.target.value)
                  }
                  className="w-full p-2 rounded bg-slate-800 text-white"
                  placeholder="Enter category"
                />
                {errors[index]?.category && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors[index]?.category}
                  </p>
                )}
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Description
              </label>
              <textarea
                value={product.description || ""}
                onChange={(e) =>
                  handleFieldChange(index, "description", e.target.value)
                }
                rows={1}
                className="w-full p-2 rounded bg-slate-800 text-white"
                placeholder="Describe the product"
              />
              {errors[index]?.description && (
                <p className="text-red-400 text-xs mt-1">
                  {errors[index]?.description}
                </p>
              )}
            </div>

            {(
              [
                ["Quality Rating", "quality_rating"],
                ["Innovation Rating", "innovation_rating"],
                ["Sustainability Rating", "sustainability_rating"],
              ] as const
            ).map(([label, field]) => (
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
                    handleFieldChange(
                      index,
                      field,
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full p-2 rounded bg-slate-800 text-white"
                />
                {errors[index]?.[field] && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors[index]?.[field]}
                  </p>
                )}
              </div>
            ))}

            {(
              [
                ["Production Cost", "production_cost"],
                ["Selling Price", "selling_price"],
                ["Inventory Level", "inventory_level", "int"],
                ["Production Capacity", "production_capacity", "int"],
                ["Development Cost", "development_cost"],
                ["Marketing Budget", "marketing_budget"],
              ] as const
            ).map(([label, field, type]) => (
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
                    handleFieldChange(
                      index,
                      field,
                      type === "int"
                        ? parseInt(e.target.value) || 0
                        : parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full p-2 rounded bg-slate-800 text-white"
                />
                {errors[index]?.[field] && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors[index]?.[field]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
