"use client";
<<<<<<< HEAD
import React from "react";
import { useRouter } from "next/navigation";
import Inputbox from "@/ui/Input-Box";
import { createProduct } from "@/app/_actions/products";
=======
>>>>>>> 02760c2242a0c670c98a8b91a88aad551ba6f4d7

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createCompany } from "@/app/_actions/company";
import { createHRDecisionWithRoles } from "@/app/_actions/hr";
import { getCurrentUser } from "@/app/functions/jwt";
import { Building2, Rocket, ImageIcon, PlusCircle, Trash2 } from "lucide-react";
import HRDecisionForm from "../../management/_components/department-forms/HRDecisionForm";

interface Props {
  simulationID: string;
  companyID: string;
  onCreated: () => void;
}

const CreateCompanyForm = ({ simulationID, onCreated }: Props) => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    logo_url: "",
    cash_balance: 0,
    total_assets: 0,
    total_liabilities: 0,
    credit_rating: "",
    brand_value: 0,
  });

  const [hrRoles, setHrRoles] = useState([
    { role_name: "", salary_per_head: 0, head_count: 0 },
  ]);
  const [salaryBudget, setSalaryBudget] = useState(0);
  const [trainingBudget, setTrainingBudget] = useState(0);
  const [employeeSatisfaction, setEmployeeSatisfaction] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalSalary = hrRoles.reduce(
    (acc, r) => acc + r.salary_per_head * r.head_count,
    0
  );
  const totalBudget = totalSalary + trainingBudget;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name.match(/balance|assets|liabilities|brand_value/)
        ? value === ""
          ? 0
          : parseFloat(value) || 0
        : value,
    }));
  };

  const handleHrChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setHrRoles((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]:
          field === "salary_per_head" || field === "head_count"
            ? parseFloat(value as string) || 0
            : value,
      };
      return updated;
    });
  };

  const addHrRole = () => {
    setHrRoles((prev) => [
      ...prev,
      { role_name: "", salary_per_head: 0, head_count: 0 },
    ]);
  };

  const removeHrRole = (index: number) => {
    setHrRoles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.name.trim()) {
      setError("Company name is required.");
      setLoading(false);
      return;
    }

    if (
      form.cash_balance < 0 ||
      form.total_assets < 0 ||
      form.total_liabilities < 0 ||
      form.brand_value < 0
    ) {
      setError("Financial values cannot be negative.");
      setLoading(false);
      return;
    }

const CreateProduct = ({ companyID, onSuccess }: CreateProductProps) => {
  const router = useRouter();

  // Wrap createProduct to ensure it returns void and handle success
  const handleCreateProduct = async (formData: FormData) => {
    try {
      await createProduct(formData);
      onSuccess?.();
      // Redirect to catalogue page after successful creation
      router.push(`/products/catalog/${companyID}`);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-white/80 mb-8">
            Create New Product
          </h1>

          <form action={handleCreateProduct} className="space-y-8">
            {/* Basic Information */}
            <div className="rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white/80 mb-6 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Inputbox
                    type="text"
                    placeholder_text="Enter product name"
                    name="name"
                    label="Product Name"
                  />
                </div>

                <div className="md:col-span-2">
                  <Inputbox
                    type="textarea"
                    placeholder_text="Describe your product features and benefits"
                    name="description"
                    label="Description"
                  />
                </div>

                <Inputbox
                  type="text"
                  placeholder_text="e.g., Electronics, Clothing, Food"
                  name="category"
                  label="Category"
                />
              </div>
            </div>

            {/* Ratings */}
            <div className="rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white/80 mb-6 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                Product Ratings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Inputbox
                  type="number"
                  placeholder_text="1.0 - 5.0"
                  name="quality_rating"
                  label="Quality Rating"
                  props={{
                    step: 0.1,
                    min: 1,
                    max: 5,
                  }}
                />

                <Inputbox
                  type="number"
                  placeholder_text="1.0 - 5.0"
                  name="innovation_rating"
                  label="Innovation Rating"
                  props={{
                    step: 0.1,
                    min: 1,
                    max: 5,
                  }}
                />

                <Inputbox
                  type="number"
                  placeholder_text="1.0 - 5.0"
                  name="sustainability_rating"
                  label="Sustainability Rating"
                  props={{
                    step: 0.1,
                    min: 1,
                    max: 5,
                  }}
                />
              </div>
            </div>

            {/* Financial Information */}
            <div className="rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white/80 mb-6 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
                Financial Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Inputbox
                  type="number"
                  placeholder_text="0.00"
                  name="production_cost"
                  label="Production Cost ($) per 1 product"
                />

                <Inputbox
                  type="number"
                  placeholder_text="0.00"
                  name="selling_price"
                  label="Selling Price ($) per 1 product"
                />

                <Inputbox
                  type="number"
                  placeholder_text="0.00"
                  name="development_cost"
                  label="Development Cost ($)"
                />

                <Inputbox
                  type="number"
                  placeholder_text="0.00"
                  name="marketing_budget"
                  label="Marketing Budget ($)"
                />
              </div>
            </div>

            {/* Inventory & Production */}
            <div className="rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white/80 mb-6 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                Inventory & Production
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Inputbox
                  type="number"
                  placeholder_text="0"
                  name="inventory_level"
                  label="Current Inventory Level"
                />

                <Inputbox
                  type="number"
                  placeholder_text="2000"
                  name="production_capacity"
                  label="Production Capacity"
                />
              </div>
            </div>

            {/* Product Status */}
            <div className="rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white/80 mb-6 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Product Status
              </h2>

              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Status
                </label>
                <select
                  name="status"
                  className="w-full px-4 py-3 border border-black-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-black text-white"
                  defaultValue="development"
                >
                  <option value="development">🔧 Development</option>
                  <option value="production">🏭 Production</option>
                  <option value="launched">🚀 Launched</option>
                  <option value="discontinued">⏸️ Discontinued</option>
                </select>
              </div>
            </div>

            {/* Hidden company ID */}
            <input type="hidden" name="company_id" value={companyID} />

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span>Create Product</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p className="text-red-400 bg-red-500/10 px-4 py-2 rounded">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Company Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-800 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Description
          </label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-800 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Logo URL
          </label>
          <input
            type="text"
            name="logo_url"
            value={form.logo_url}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-800 text-white"
            placeholder="https://example.com/logo.png"
          />
          {form.logo_url && (
            <div className="mt-3 flex items-center gap-4">
              <div className="w-20 h-20 border border-slate-700 rounded-md overflow-hidden bg-slate-800">
                <img
                  src={form.logo_url}
                  alt="Logo Preview"
                  className="w-full h-full object-contain"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
              <p className="text-sm text-slate-400">Logo preview</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Cash Balance
            </label>
            <input
              type="number"
              name="cash_balance"
              value={form.cash_balance}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full p-2 rounded bg-slate-800 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Total Assets
            </label>
            <input
              type="number"
              name="total_assets"
              value={form.total_assets}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full p-2 rounded bg-slate-800 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Total Liabilities
            </label>
            <input
              type="number"
              name="total_liabilities"
              value={form.total_liabilities}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full p-2 rounded bg-slate-800 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Credit Rating
            </label>
            <input
              type="text"
              name="credit_rating"
              value={form.credit_rating}
              onChange={handleChange}
              className="w-full p-2 rounded bg-slate-800 text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Brand Value
          </label>
          <input
            type="number"
            name="brand_value"
            value={form.brand_value}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full p-2 rounded bg-slate-800 text-white"
          />
        </div>

        <HRDecisionForm
          hrRoles={hrRoles}
          onRoleChange={handleHrChange}
          onAddRole={addHrRole}
          onRemoveRole={removeHrRole}
          trainingBudget={trainingBudget}
          onTrainingBudgetChange={setTrainingBudget}
          employeeSatisfaction={employeeSatisfaction}
          onEmployeeSatisfactionChange={setEmployeeSatisfaction}
        />

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading || !form.name.trim()}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition"
          >
            <Rocket size={18} />
            {loading ? "Creating..." : "Create Company"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCompanyForm;
