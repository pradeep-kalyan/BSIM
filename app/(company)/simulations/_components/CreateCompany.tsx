"use client";

import React, { useState, useEffect } from "react";
import { createCompany, getFirstCompany } from "@/app/_actions/company";
import { getCurrentUser } from "@/app/functions/jwt";
import { Building2, Rocket } from "lucide-react";
import HRDecisionForm from "@/app/(main)/_components/HRdecisionform";
import { createHRDecisionWithRoles } from "@/app/_actions/hr";
import ProductForm from "./ProductForm";
import CompanyDetailsForm from "./CompanyDetailsForm";

interface Props {
  simulationID: string;
  onCreated: () => void;
}

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

const CreateCompany = ({ simulationID, onCreated }: Props) => {
  const [products, setProducts] = useState<ProductInput[]>([
    {
      name: "",
      description: "",
      category: "",
      quality_rating: 0,
      innovation_rating: 0,
      sustainability_rating: 0,
      production_cost: 0,
      selling_price: 0,
      inventory_level: 0,
      production_capacity: 0,
      development_cost: 0,
      marketing_budget: 0,
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    logo_url: "",
    cash_balance: 0,
    total_assets: 0,
    total_liabilities: 0,
    marketing_budget: 0,
    brand_value: 0,
  });

  useEffect(() => {
    const loadFirstCompany = async () => {
      try {
        const firstCompany = await getFirstCompany(simulationID);
        
        if (firstCompany) {
          setForm((prev) => ({
            ...prev,
            description: firstCompany.description || "",
            logo_url: firstCompany.logo_url || "",
            cash_balance: firstCompany.cash_balance || 0,
            total_assets: firstCompany.total_assets || 0,
            total_liabilities: firstCompany.total_liabilities || 0,
            marketing_budget: firstCompany.marketing_budget || 0,
            brand_value: firstCompany.brand_value || 0,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
      }
    };

    loadFirstCompany();
  }, [simulationID]);

  const [currentStep, setCurrentStep] = useState(0);
  const [hrRoles, setHrRoles] = useState([
    { role_name: "", salary_per_head: 0, head_count: 0 },
  ]);
  const [trainingBudget, setTrainingBudget] = useState(0);
  const [employeeSatisfaction, setEmployeeSatisfaction] = useState(0);
  const [accessEmail, setAccessEmail] = useState("");
  const [accessEmails, setAccessEmails] = useState<string[]>([]);

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
      [name]: name.match(
        /balance|assets|liabilities|brand_value|marketing_budget/
      )
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

  const handleAddEmail = () => {
    if (accessEmail && !accessEmails.includes(accessEmail)) {
      setAccessEmails((prev) => [...prev, accessEmail]);
      setAccessEmail("");
    }
  };

  const handleRemoveEmail = (email: string) => {
    setAccessEmails((prev) => prev.filter((e) => e !== email));
  };

  const addProduct = () => {
    setProducts((prev) => [
      ...prev,
      {
        name: "",
        description: "",
        category: "",
        quality_rating: 0,
        innovation_rating: 0,
        sustainability_rating: 0,
        production_cost: 0,
        selling_price: 0,
        inventory_level: 0,
        production_capacity: 0,
        development_cost: 0,
        marketing_budget: 0,
      },
    ]);
  };

  const removeProduct = (index: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProductChange = (
    index: number,
    key: keyof ProductInput,
    value: string | number
  ) => {
    setProducts((prev) =>
      prev.map((product, i) =>
        i === index ? { ...product, [key]: value } : product
      )
    );
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

    try {
      const user = await getCurrentUser();
      if (!user) {
        setError("Login required to create company.");
        setLoading(false);
        return;
      }

      // Create company with products
      const { companyId } = await createCompany({
        simulation_id: simulationID,
        user_id: user.id,
        name: form.name,
        description: form.description,
        logo_url: form.logo_url,
        cash_balance: form.cash_balance,
        total_assets: form.total_assets,
        total_liabilities: form.total_liabilities,
        marketing_budget: form.marketing_budget,
        brand_value: form.brand_value,
        products,
        accessEmails,
      });

      await createHRDecisionWithRoles({
        company_id: companyId,
        period: 0,
        is_submitted: true,
        salary_budget: totalSalary,
        training_budget: trainingBudget,
        total_budget: totalBudget,
        employee_satisfaction: employeeSatisfaction,
        roles: hrRoles.filter((r) => r.role_name.trim() !== ""),
      });

      // Reset form state
      setForm({
        name: "",
        description: "",
        logo_url: "",
        cash_balance: 0,
        total_assets: 0,
        total_liabilities: 0,
        marketing_budget: 0,
        brand_value: 0,
      });
      setHrRoles([{ role_name: "", salary_per_head: 0, head_count: 0 }]);
      setTrainingBudget(0);
      setEmployeeSatisfaction(0);
      onCreated();
    } catch (err) {
      console.error("Failed to create company", err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      id: 0,
      title: "Company Details",
      description: "Basic company information",
    },
    { id: 1, title: "HR Setup", description: "Roles and team structure" },
    { id: 2, title: "Products", description: "Company products and services" },
  ];

  const canProceedToNext = () => {
    switch (currentStep) {
      case 0:
        return form.name.trim() !== "";
      case 1:
        return hrRoles.some((role) => role.role_name.trim() !== "");
      case 2:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToNext() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700/50 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-xl">
            <Building2 size={32} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Create Company</h2>
            <p className="text-slate-400">Set up your business simulation</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  currentStep === index
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : currentStep > index
                    ? "bg-green-500 text-white"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                {currentStep > index ? "✓" : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 mx-2 transition-colors duration-300 ${
                    currentStep > index ? "bg-green-500" : "bg-slate-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-2 bg-red-500/10 border border-red-500/20 rounded">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 0: Company Details */}
        {currentStep === 0 && (
          <CompanyDetailsForm
            form={form}
            accessEmail={accessEmail}
            accessEmails={accessEmails}
            setForm={setForm}
            setAccessEmail={setAccessEmail}
            handleChange={handleChange}
            handleAddEmail={handleAddEmail}
            handleRemoveEmail={handleRemoveEmail}
          />
        )}

        {/* Step 1: HR Setup */}
        {currentStep === 1 && (
          <div className="animate-in slide-in-from-right-5 duration-300">
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

            {/* HR Summary */}
            <div className="mt-6 p-2 bg-slate-800/30 border border-slate-700 rounded">
              <h5 className="text-white font-medium mb-2">Budget Summary</h5>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Total Salary:</span>
                  <p className="text-white font-medium">
                    ${totalSalary.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Training Budget:</span>
                  <p className="text-white font-medium">
                    ${trainingBudget.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Total Budget:</span>
                  <p className="text-white font-medium">
                    ${totalBudget.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Products */}
        {currentStep === 2 && (
          <div className="animate-in slide-in-from-right-5 duration-300">
            <ProductForm
              products={products}
              onAddProduct={addProduct}
              onRemoveProduct={removeProduct}
              onProductChange={handleProductChange}
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 font-medium rounded transition-all duration-200 ${
              currentStep === 0
                ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                : "bg-slate-700 hover:bg-slate-600 text-white"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </button>

          <div className="flex items-center gap-3">
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceedToNext()}
                className={`flex items-center gap-2 px-6 py-3 font-medium rounded transition-all duration-200 ${
                  canProceedToNext()
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25"
                    : "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                }`}
              >
                Next
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !form.name.trim()}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded shadow-lg shadow-blue-600/25 transition-all duration-200"
              >
                <Rocket size={18} />
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create Company"
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCompany;
