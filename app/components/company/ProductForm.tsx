"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { z } from "zod";
import { createProductSchema } from "@/app/lib/validator/validator";
import { ProductInput } from "@/app/lib/validator/validator";
import { CustomInput } from "@/app/ui/CustomInput";

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

  // Ensure at least one product exists by default
  useEffect(() => {
    if (products.length === 0) {
      onAddProduct();
    }
  }, [products.length, onAddProduct]);

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
      <h3 className="text-xl font-semibold text-slate-200 flex justify-between gap-2 mb-1">
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
            <button onClick={() => onRemoveProduct(index)}>
              <Trash2 />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5 p-2 items-start">
            {/* Product Name */}
            <CustomInput
              label="Product Name"
              value={product.name}
              onChange={(val) => handleFieldChange(index, "name", val)}
              required
              placeholder="Enter product name"
              isText
            />
            {errors[index]?.name && (
              <p className="text-red-400 text-xs mt-1">{errors[index]?.name}</p>
            )}

            {/* Category */}
            <CustomInput
              label="Category"
              value={product.category}
              onChange={(val) => handleFieldChange(index, "category", val)}
              required
              placeholder="Enter category"
              isText
            />
            {errors[index]?.category && (
              <p className="text-red-400 text-xs mt-1">
                {errors[index]?.category}
              </p>
            )}

            {/* Description */}
            <CustomInput
              label="Description"
              value={product.description || ""}
              onChange={(val) => handleFieldChange(index, "description", val)}
              placeholder="Describe the product"
              isTextarea
              rows={2}
            />
            {errors[index]?.description && (
              <p className="text-red-400 text-xs mt-1">
                {errors[index]?.description}
              </p>
            )}

            {/* Ratings */}
            {(
              [
                ["Quality Rating", "quality_rating"],
                ["Innovation Rating", "innovation_rating"],
                ["Sustainability Rating", "sustainability_rating"],
              ] as const
            ).map(([label, field]) => (
              <div key={field}>
                <CustomInput
                  label={`${label}`}
                  value={product[field] || 0}
                  onChange={(val) => handleFieldChange(index, field, val)}
                  isRating
                  min={1}
                  max={10}
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
