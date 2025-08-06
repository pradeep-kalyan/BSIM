import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";

interface ProductFormPageProps {
  mode: "add" | "edit";
  initialProduct?: Partial<Product>;
  onSubmit: (data: Partial<Product>) => void;
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
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700/70 max-w-xl mx-auto mt-8 z-20 relative">
      <h3 className="text-xl font-semibold text-white mb-3">
        {mode === "edit" ? "Edit Product" : "Add New Product"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm text-slate-300 mb-1">
            Product Name
          </label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            className="w-full p-2 rounded bg-slate-900 text-white"
            required
          />
          {errors.name && (
            <div className="text-red-400 text-xs">{errors.name}</div>
          )}
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
          {errors.category && (
            <div className="text-red-400 text-xs">{errors.category}</div>
          )}
        </div>
        {/* Description */}
        <div>
          <label className="block text-sm text-slate-300 mb-1">
            Description
          </label>
          <textarea
            value={product.description || ""}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            className="w-full p-2 rounded bg-slate-900 text-white"
            rows={1}
          />
        </div>
        {/* Ratings */}
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              ["Quality Rating (1-10)", "quality_rating"],
              ["Innovation Rating (1-10)", "innovation_rating"],
              ["Sustainability Rating (1-10)", "sustainability_rating"],
            ] as const
          ).map(([label, key]) => (
            <div key={key}>
              <Slider
                label={label}
                defaultValue={[product[key]]}
                value={[product[key]]}
                min={1}
                max={10}
                onValueChange={(val) => handleFieldChange(key, val[0])}
              />
              {errors[key] && (
                <div className="text-red-400 text-xs mt-1">{errors[key]}</div>
              )}
            </div>
          ))}
        </div>
        {/* Other numeric fields */}
        <div className="grid grid-cols-2 gap-4">
          {/* Production Cost Slider */}
          <div>
            <Slider
              label="Production Cost (₹)"
              defaultValue={[product.production_cost]}
              value={[product.production_cost]}
              min={0}
              max={10000}
              onValueChange={(val) =>
                handleFieldChange("production_cost", val[0])
              }
            />
          </div>

          {/* Selling Price Slider */}
          <div>
            <Slider
              label="Selling Price (₹)"
              defaultValue={[product.selling_price]}
              value={[product.selling_price]}
              min={0}
              max={15000}
              onValueChange={(val) =>
                handleFieldChange("selling_price", val[0])
              }
            />
          </div>

          {/* Inventory Level Slider */}
          <div>
            <Slider
              label="Inventory Level"
              defaultValue={[product.inventory_level]}
              value={[product.inventory_level]}
              min={0}
              max={5000}
              onValueChange={(val) =>
                handleFieldChange("inventory_level", Math.round(val[0]))
              }
            />
          </div>

          {/* Production Capacity Slider */}
          <div>
            <Slider
              label="Production Capacity"
              defaultValue={[product.production_capacity]}
              value={[product.production_capacity]}
              min={0}
              max={10000}
              onValueChange={(val) =>
                handleFieldChange("production_capacity", Math.round(val[0]))
              }
            />
          </div>

          {/* Development Cost Slider */}
          <div>
            <Slider
              label="Development Cost (₹)"
              defaultValue={[product.development_cost]}
              value={[product.development_cost]}
              min={0}
              max={50000}
              onValueChange={(val) =>
                handleFieldChange("development_cost", val[0])
              }
            />
          </div>

          {/* Marketing Budget Slider */}
          <div>
            <Slider
              label="Marketing Budget (₹)"
              defaultValue={[product.marketing_budget]}
              value={[product.marketing_budget]}
              min={0}
              max={25000}
              onValueChange={(val) =>
                handleFieldChange("marketing_budget", val[0])
              }
            />
          </div>
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
