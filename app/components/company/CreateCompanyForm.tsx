"use client";

import React, { useState, useEffect } from "react";
import { createCompany, getFirstCompany } from "@/app/_actions/company";
import { getCurrentUser } from "@/app/functions/jwt";
import { Building2 } from "lucide-react";
import HRDecisionForm from "@/app/components/company/HRdecisionform";
import ProductForm from "./ProductForm";
import {
  createCompanySchema,
  HRschema,
  ProdIn,
  ProductInput,
} from "@/app/lib/validator/validator";
import { z } from "zod";
import { CustomInput } from "@/app/ui/CustomInput";

interface Props {
  simulationID: string;
  onCreated: () => void;
}

const CreateCompanyForm = ({ simulationID, onCreated }: Props) => {
  const [products, setProducts] = useState<ProductInput[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    logo_url: "",
    cash_balance: 0,
    total_assets: 0,
    total_liabilities: 0,
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
      } catch {}
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

  // HR role changes
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

  // Validate email before adding
  const handleAddEmail = () => {
    const emailSchema = z.string().email("Invalid email address");
    const result = emailSchema.safeParse(accessEmail);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    if (!accessEmails.includes(accessEmail)) {
      setAccessEmails((prev) => [...prev, accessEmail]);
      setAccessEmail("");
      setError("");
    }
  };

  const handleRemoveEmail = (email: string) => {
    setAccessEmails((prev) => prev.filter((e) => e !== email));
  };

  // Step-by-step validation
  const validateCurrentStep = () => {
    let result;
    switch (currentStep) {
      case 0:
        result = createCompanySchema.safeParse({
          ...form,
          accessEmails,
          products,
        });
        break;
      case 1:
        result = HRschema.safeParse({
          hrRoles: hrRoles.filter((r) => r.role_name.trim() !== ""),
          trainingBudget,
          employeeSatisfaction,
        });
        break;
      case 2:
        result = ProdIn.safeParse({ products });
        break;
      default:
        return true;
    }

    if (!result.success) {
      setError(result.error.issues[0].message);
      return false;
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateCurrentStep()) return;

    setLoading(true);
    setError("");

    try {
      const user = await getCurrentUser();
      if (!user) {
        setError("Login required to create company.");
        setLoading(false);
        return;
      }

      const { company } = await createCompany({
        simulation_id: simulationID,
        user_id: user.id,
        ...form,
        products,
        accessEmails,
        hrDecision: {
          period: 1,
          is_submitted: true,
          salary_budget: totalSalary,
          training_budget: trainingBudget,
          total_budget: totalBudget,
          employee_satisfaction: employeeSatisfaction,
          roles: hrRoles.filter((r) => r.role_name.trim() !== ""),
        },
      });

      // Reset state after success
      if (company) {
        setForm({
          name: "",
          description: "",
          logo_url: "",
          cash_balance: 0,
          total_assets: 0,
          total_liabilities: 0,
        });
        setHrRoles([{ role_name: "", salary_per_head: 0, head_count: 0 }]);
        setTrainingBudget(0);
        setEmployeeSatisfaction(0);
        onCreated();
      }
    } catch (err) {
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

  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700/50 backdrop-blur-sm">
      {/* Header & Steps */}
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

      {/* Error */}
      {error && (
        <div className="mb-6 p-2 bg-red-500/10 border border-red-500/20 rounded">
          <p className="text-red-400 text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 0 && (
          <div className="space-y-6">
            {/* Company Name & Logo */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CustomInput
                label="Company Name"
                value={form.name}
                onChange={(val) =>
                  setForm((p) => ({ ...p, name: String(val) }))
                }
                isText
                required
              />
              <CustomInput
                label="Logo URL"
                value={form.logo_url}
                onChange={(val) =>
                  setForm((p) => ({ ...p, logo_url: String(val) }))
                }
                isText
              />
            </div>

            {/* Description */}
            <CustomInput
              label="Description"
              value={form.description}
              onChange={(val) =>
                setForm((p) => ({ ...p, description: String(val) }))
              }
              isTextarea
            />

            {/* Financial Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <CustomInput
                label="Cash Balance"
                value={form.cash_balance}
                onChange={(val) =>
                  setForm((p) => ({ ...p, cash_balance: Number(val) }))
                }
                isCurrency
                currencySymbol="₹"
                min={0}
                step={1000}
                required
              />
              <CustomInput
                label="Total Assets"
                value={form.total_assets}
                onChange={(val) =>
                  setForm((p) => ({ ...p, total_assets: Number(val) }))
                }
                isCurrency
                currencySymbol="₹"
                min={0}
                step={1000}
                required
              />
              <CustomInput
                label="Total Liabilities"
                value={form.total_liabilities}
                onChange={(val) =>
                  setForm((p) => ({ ...p, total_liabilities: Number(val) }))
                }
                isCurrency
                currencySymbol="₹"
                min={0}
                step={1000}
                required
              />
            </div>

            <div className="space-y-3">
              <label className="block text-white font-medium">
                Access Emails
              </label>

              <div className="flex gap-3">
                <input
                  type="email"
                  value={accessEmail}
                  onChange={(e) => setAccessEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddEmail();
                    }
                  }}
                  placeholder="Enter email to grant access"
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddEmail}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium shadow-md hover:from-indigo-700 hover:to-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>

              {/* Email Pill List */}
              {accessEmails.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {accessEmails.map((email) => (
                    <span
                      key={email}
                      className="flex items-center gap-2 px-3 py-1 bg-slate-700 text-white rounded-full text-sm"
                    >
                      {email}
                      <button
                        type="button"
                        onClick={() => handleRemoveEmail(email)}
                        className="text-red-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div>
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
            <div className="m-2 text-white flex gap-6 items-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <p>Total Salary: ₹{totalSalary.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <p>Training Budget: ₹{trainingBudget.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <p>Total Budget: ₹{totalBudget.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <ProductForm
            products={products}
            onAddProduct={() =>
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
                  status: "active",
                  launch_period: 1,
                  discontinue_period: undefined,
                },
              ])
            }
            onRemoveProduct={(index) =>
              setProducts((prev) => prev.filter((_, i) => i !== index))
            }
            onProductChange={(index, field, value) =>
              setProducts((prev) => {
                const updated = [...prev];
                updated[index] = { ...updated[index], [field]: value };
                return updated;
              })
            }
          />
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t border-slate-700">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-6 py-3 bg-slate-700 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          {currentStep < 2 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white rounded"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded"
            >
              {loading ? "Creating..." : "Create Company"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateCompanyForm;
