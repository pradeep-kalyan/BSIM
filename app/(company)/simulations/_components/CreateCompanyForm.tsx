"use client";

import React, { useState } from "react";
import { createCompany } from "@/app/_actions/company";
import { getCurrentUser } from "@/app/functions/jwt";
import { Building2, Rocket } from "lucide-react";
import { createHRDecisionWithRoles } from "@/app/_actions/hr";
import { useCompanyForm } from "@/app/context/FormContext";
import HRDecisionForm from "@/app/(main)/_components/HRdecisionform";
import Image from "next/image";
interface Props {
  simulationID: string;
  onCreated: () => void;
}

const CreateCompanyForm = ({ simulationID, onCreated }: Props) => {

  // Use FormContext for company form
  const { data: companyData, updateData: updateCompanyData } = useCompanyForm();

  const [hrRoles, setHrRoles] = useState([
    { role_name: "", salary_per_head: 0, head_count: 0 },
  ]);
  const [trainingBudget, setTrainingBudget] = useState(0);
  const [employeeSatisfaction, setEmployeeSatisfaction] = useState(0);
  const [accessEmail, setAccessEmail] = useState("");
  const [accessEmails, setAccessEmails] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Create form object from FormContext data
  const form = {
    name: companyData.name || "",
    description: companyData.description || "",
    logo_url: "",
    cash_balance: companyData.initial_capital || 0,
    total_assets: 0,
    total_liabilities: 0,
    credit_rating: "",
    brand_value: 0,
  };
  const totalSalary = hrRoles.reduce(
    (acc, r) => acc + r.salary_per_head * r.head_count,
    0
  );
  const totalBudget = totalSalary + trainingBudget;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "name") {
      updateCompanyData({ name: value });
    } else if (name === "description") {
      updateCompanyData({ description: value });
    } else if (name === "cash_balance") {
      updateCompanyData({
        initial_capital: value === "" ? 0 : parseFloat(value) || 0,
      });
    }
    // For other fields, we'll handle them separately if needed
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

      const { companyId } = await createCompany({
        simulation_id: simulationID,
        user_id: user.id,
        ...form,
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

      // Reset form using FormContext
      updateCompanyData({
        name: "",
        description: "",
        initial_capital: 0,
        company_type: "",
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

  return (
    <div className="w-full max-w-2xl bg-slate-900 p-8 rounded-2xl shadow-md border border-slate-700">
      <div className="flex items-center gap-2 mb-6">
        <Building2 size={28} className="text-blue-400" />
        <h2 className="text-3xl font-semibold text-white">Create Company</h2>
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
                <Image
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

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Grant Access (Email)
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={accessEmail}
              onChange={(e) => setAccessEmail(e.target.value)}
              className="w-full p-2 rounded bg-slate-800 text-white"
              placeholder="Enter email to grant access"
            />
            <button
              type="button"
              onClick={handleAddEmail}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>

          {accessEmails.length > 0 && (
            <ul className="mt-3 space-y-1 text-slate-300 text-sm">
              {accessEmails.map((email, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between bg-slate-800 p-2 rounded"
                >
                  {email}
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(email)}
                    className="text-red-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
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
