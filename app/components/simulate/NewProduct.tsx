import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
// import { useForm } from "@/app/context/FormContext";
import { type ProductFormData } from "@/app/types/simulate";

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
  // const { updateProductBudgetImpact } = useForm();
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

    // Update budget impact when development_cost or marketing_budget changes
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

  return (
    <div className="bg-slate-800 rounded-lg p-3 border border-slate-700/70 max-w-md mx-auto mt-4 z-20 relative">
      <h3 className="text-lg tracking-wide font-semibold font-roboto-sans text-white mb-2 ">
        {mode === "edit" ? "Edit Product" : "Add New Product"}
      </h3>

      <div className="absolute top-1 right-2">
        <button
          onClick={() => onCancel()}
          className="text-red-400 hover:text-red-500 bg-slate-800 rounded-full m-2 hover:text-white"
          title="Close"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Name */}
        <div>
          <label className="block text-xs text-slate-200 mb-1 tracking-wide font-semibold font-geist-sans">
            Product Name
          </label>
          <Input
            type="text"
            value={product.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            className="w-full p-1.5 text-sm rounded bg-slate-900 text-white border-slate-600"
            required
          />
          {errors.name && (
            <div className="text-red-400 text-xs">{errors.name}</div>
          )}
        </div>

        {/* Category & Description in one row */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-slate-200 mb-1 tracking-wide font-semibold font-geist-sans">
              Category
            </label>
            <Input
              type="text"
              value={product.category}
              onChange={(e) => handleFieldChange("category", e.target.value)}
              className="w-full p-1.5 text-sm rounded bg-slate-900 text-white border-slate-600"
              required
            />
            {errors.category && (
              <div className="text-red-400 text-xs">{errors.category}</div>
            )}
          </div>

          <div>
            <label className="block text-xs text-slate-200 mb-1 tracking-wide font-semibold font-geist-sans">
              Description
            </label>
            <Input
              type="text"
              value={product.description || ""}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              className="w-full p-1.5 text-sm rounded bg-slate-900 text-white border-slate-600"
              placeholder="Optional"
            />
          </div>
        </div>

        {/* Ratings */}
        <div className="grid grid-cols-3 gap-2 tracking-wide font-semibold font-geist-sans">
          <div>
            <label className="block text-xs text-slate-200 mb-1">
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
              className="w-full p-1.5 text-sm rounded bg-slate-900 text-white border-slate-600"
            />
            {errors.quality_rating && (
              <div className="text-red-400 text-xs">
                {errors.quality_rating}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs text-slate-200 mb-1">
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
              className="w-full p-1.5 text-sm rounded bg-slate-900 text-white border-slate-600"
            />
            {errors.innovation_rating && (
              <div className="text-red-400 text-xs">
                {errors.innovation_rating}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs text-slate-200 mb-1">
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
              className="w-full p-1.5 text-sm rounded bg-slate-900 text-white border-slate-600"
            />
            {errors.sustainability_rating && (
              <div className="text-red-400 text-xs">
                {errors.sustainability_rating}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            type="submit"
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded disabled:opacity-60 hover:bg-blue-700 transition-colors font-roboto-sans"
            disabled={submitting}
          >
            {mode === "edit" ? "Update" : "Add Product"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-sm bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors font-roboto-sans"
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
