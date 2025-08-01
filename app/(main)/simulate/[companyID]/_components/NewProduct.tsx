import React, { useState, useEffect } from "react";

interface ProductFormPageProps {
  mode: "add" | "edit";
  initialProduct?: Partial<Product>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  submitting?: boolean;
}

type Product = {
  id?: string;
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
  status?: string;
};

const emptyProduct: Product = {
  name: "",
  description: "",
  category: "",
  quality_rating: 1,
  innovation_rating: 1,
  sustainability_rating: 1,
  production_cost: 0,
  selling_price: 0,
  inventory_level: 0,
  production_capacity: 1000,
  development_cost: 0,
  marketing_budget: 0,
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
  const [errors, setErrors] = useState<Partial<Record<keyof Product, string>>>({});

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
    setProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validate = (data: Product): Partial<Record<keyof Product, string>> => {
    const newErrors: Partial<Record<keyof Product, string>> = {};
    if (!data.name || data.name.trim() === "") newErrors.name = "Product name required";
    if (!data.category || data.category.trim() === "") newErrors.category = "Category required";
    ["quality_rating", "innovation_rating", "sustainability_rating"].forEach((key) => {
      const val = data[key as keyof Product];
      if (typeof val === "number" && (val < 1 || val > 10)) {
        newErrors[key as keyof Product] = "Must be 1-10";
      }
    });
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
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700/70 max-w-xl mx-auto mt-8 z-20 relative">
      <h3 className="text-xl font-semibold text-white mb-3">
        {mode === "edit" ? "Edit Product" : "Add New Product"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm text-slate-300 mb-1">Product Name</label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            className="w-full p-2 rounded bg-slate-900 text-white"
            required
          />
          {errors.name && <div className="text-red-400 text-xs">{errors.name}</div>}
        </div>
        {/* Category */}
        <div>
          <label className="block text-sm text-slate-300 mb-1">Category</label>
          <input
            type="text"
            value={product.category}
            onChange={(e) => handleFieldChange("category", e.target.value)}
            className="w-full p-2 rounded bg-slate-900 text-white"
            required
          />
          {errors.category && <div className="text-red-400 text-xs">{errors.category}</div>}
        </div>
        {/* Description */}
        <div>
          <label className="block text-sm text-slate-300 mb-1">Description</label>
          <textarea
            value={product.description || ""}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            className="w-full p-2 rounded bg-slate-900 text-white"
            rows={1}
          />
        </div>
        {/* Ratings */}
        <div className="grid grid-cols-3 gap-2">
          {([
            ["Quality Rating", "quality_rating"],
            ["Innovation Rating", "innovation_rating"],
            ["Sustainability Rating", "sustainability_rating"]
          ] as const).map(([label, key]) => (
            <div key={key}>
              <label className="block text-sm text-slate-300 mb-1">
                {label} (1-10)
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={product[key]}
                onChange={(e) => handleFieldChange(key, parseFloat(e.target.value) || 1)}
                className="w-full p-2 rounded bg-slate-900 text-white"
                required
              />
              {errors[key] && <div className="text-red-400 text-xs">{errors[key]}</div>}
            </div>
          ))}
        </div>
        {/* Other numeric fields */}
        <div className="grid grid-cols-3 gap-2">
          {([
            ["Production Cost", "production_cost"],
            ["Selling Price", "selling_price"],
            ["Inventory Level", "inventory_level"],
            ["Production Capacity", "production_capacity"],
            ["Development Cost", "development_cost"],
            ["Marketing Budget", "marketing_budget"]
          ] as const).map(([label, key]) => (
            <div key={key}>
              <label className="block text-sm text-slate-300 mb-1">{label}</label>
              <input
                type="number"
                min={0}
                step="any"
                value={product[key]}
                onChange={(e) =>
                  handleFieldChange(
                    key,
                    key==="inventory_level" || key==="production_capacity"
                    ? parseInt(e.target.value) || 0
                    : parseFloat(e.target.value) || 0
                  )
                }
                className="w-full p-2 rounded bg-slate-900 text-white"
                required
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
            disabled={submitting}
          >
            {mode === "edit" ? "Update Product" : "Add Product"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-600 text-white rounded"
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
