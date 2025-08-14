import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { type ProductFormData } from "@/app/types/simulate";
import Mandatory from "@/app/ui/MandatoryIcon";
import { createPortal } from "react-dom";

interface ProductFormPageProps {
  mode: "add" | "edit";
  initialProduct?: Partial<ProductFormData>;
  onSubmit: (data: Partial<ProductFormData>) => void;
  onCancel: () => void;
  submitting?: boolean;
}

type Product = ProductFormData;

const emptyProduct: Product = {
  name: "",
  description: "",
  category: "",
  quality_rating: 1,
  innovation_rating: 1,
  sustainability_rating: 1,
  status: "development",
};

export default function ProductFormPage({
  mode,
  initialProduct,
  onSubmit,
  onCancel,
  submitting,
}: ProductFormPageProps) {
  const [product, setProduct] = useState<Product>(
    mode === "edit" && initialProduct
      ? {
        ...emptyProduct,
        ...initialProduct,
      }
      : emptyProduct
  );
  const [errors, setErrors] = useState<Partial<Record<keyof Product, string>>>(
    {}
  );

  useEffect(() => {
    if (mode === "edit" && initialProduct) {
      setProduct({
        ...emptyProduct,
        ...initialProduct,
      });
    }
    if (mode === "add") {
      setProduct(emptyProduct);
    }
    setErrors({});
  }, [mode, initialProduct]);

  const handleFieldChange = (
    field: keyof Product,
    value: string | number | undefined
  ) => {
    const newValue = field === "description" ? String(value || "") : value;

    setProduct((prev) => ({
      ...prev,
      [field]: newValue,
    }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validate = (data: Product): Partial<Record<keyof Product, string>> => {
    const newErrors: Partial<Record<keyof Product, string>> = {};
    if (!data.name || data.name.trim() === "")
      newErrors.name = "Product name required";
    if (!data.category || data.category.trim() === "")
      newErrors.category = "Category required";
    ["quality_rating", "innovation_rating", "sustainability_rating"].forEach(
      (key) => {
        const val = data[key as keyof Product];
        if (typeof val === "number" && (val < 1 || val > 10)) {
          newErrors[key as keyof Product] = "Must be 1-10";
        }
      }
    );
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate(product);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(product);
  };

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen bg-black/50 flex items-center justify-center z-[9999]">
      <div className="relative bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-xl w-[95%] mx-auto shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">
            {mode === "edit" ? "Edit Product" : "Add New Product"}
          </h3>
          <button
            onClick={() => onCancel()}
            className="text-red-400 hover:text-red-500 p-2 rounded-full transition-colors"
            title="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm text-slate-200 mb-1.5 font-medium">
              Product Name <Mandatory />
            </label>
            <Input
              type="text"
              value={product.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              className="w-full p-2 text-sm rounded bg-slate-900 text-white border-slate-600 focus:border-blue-500"
              required
            />
            {errors.name && (
              <div className="text-red-400 text-xs mt-1">{errors.name}</div>
            )}
          </div>

          {/* Category & Description in one row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-200 mb-1.5 font-medium">
                Category <Mandatory />
              </label>
              <Input
                type="text"
                value={product.category}
                onChange={(e) => handleFieldChange("category", e.target.value)}
                className="w-full p-2 text-sm rounded bg-slate-900 text-white border-slate-600 focus:border-blue-500"
                required
              />
              {errors.category && (
                <div className="text-red-400 text-xs mt-1">
                  {errors.category}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-200 mb-1.5 font-medium">
                Description
              </label>
              <Input
                type="text"
                value={product.description || ""}
                onChange={(e) =>
                  handleFieldChange("description", e.target.value)
                }
                className="w-full p-2 text-sm rounded bg-slate-900 text-white border-slate-600 focus:border-blue-500"
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Ratings */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-200 mb-1.5 font-medium">
                Quality (1-10)
              </label>
              <Input
                type="number"
                min="1"
                max="10"
                value={product.quality_rating}
                onChange={(e) =>
                  handleFieldChange("quality_rating", Number(e.target.value))
                }
                className="w-full p-2 text-sm rounded bg-slate-900 text-white border-slate-600 focus:border-blue-500"
              />
              {errors.quality_rating && (
                <div className="text-red-400 text-xs mt-1">
                  {errors.quality_rating}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-200 mb-1.5 font-medium">
                Innovation (1-10)
              </label>
              <Input
                type="number"
                min="1"
                max="10"
                value={product.innovation_rating}
                onChange={(e) =>
                  handleFieldChange("innovation_rating", Number(e.target.value))
                }
                className="w-full p-2 text-sm rounded bg-slate-900 text-white border-slate-600 focus:border-blue-500"
              />
              {errors.innovation_rating && (
                <div className="text-red-400 text-xs mt-1">
                  {errors.innovation_rating}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-200 mb-1.5 font-medium">
                Sustainability (1-10)
              </label>
              <Input
                type="number"
                min="1"
                max="10"
                value={product.sustainability_rating}
                onChange={(e) =>
                  handleFieldChange(
                    "sustainability_rating",
                    Number(e.target.value)
                  )
                }
                className="w-full p-2 text-sm rounded bg-slate-900 text-white border-slate-600 focus:border-blue-500"
              />
              {errors.sustainability_rating && (
                <div className="text-red-400 text-xs mt-1">
                  {errors.sustainability_rating}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 font-roboto-sans mt-6 pt-4 border-t border-slate-600">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 disabled:opacity-60"
              disabled={submitting}
            >
              {mode === "edit" ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
