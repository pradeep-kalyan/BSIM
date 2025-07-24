"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { CreateProductionDecision } from "@/app/_actions/products";
import { useSimulation } from "@/app/context/SimulationContext";

export interface ProductionDecisionFormValues {
  period: number | "";
  inventory_level: number | "";
  production_capacity: number | "";
}

interface ProductionDecisionFormProps {
  companyID?: string | null;
  onCreated?: (decision: {
    id: string;
    period: number;
    processed: boolean;
    company_id: string;
    inventory_level: number;
    production_capacity: number;
    submitted_at: Date;
  }) => void;
  period?: number | null;
}

export default function ProductionDecisionForm({
  companyID,
  onCreated,
  period: initialPeriod,
}: ProductionDecisionFormProps) {
  const [form, setForm] = useState<ProductionDecisionFormValues>({
    period: initialPeriod ?? "",
    inventory_level: "",
    production_capacity: "",
  });
  const [loading, setLoading] = useState(false);
  const { comId } = useSimulation();

  const currentCompanyId = companyID || comId;

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await CreateProductionDecision({
        ...form,
        company_id: currentCompanyId ?? "",
      });

      // Create decision object to pass to callback
      const decision = {
        id: `temp-${Date.now()}`, // Temporary ID since we don't get it back from the API
        period: Number(form.period),
        processed: true,
        company_id: currentCompanyId ?? "",
        inventory_level: Number(form.inventory_level),
        production_capacity: Number(form.production_capacity),
        submitted_at: new Date(),
      };

      if (onCreated) {
        onCreated(decision);
      }

      // Reset form
      setForm({
        period: initialPeriod ?? "",
        inventory_level: "",
        production_capacity: "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-3xl shadow-2xl p-10 bg-white/85 dark:bg-slate-800/70 backdrop-blur-md border border-slate-200 dark:border-slate-700"
      >
        <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-white mb-8 text-center tracking-tight">
          Production Decision
        </h1>
        <div className="space-y-6">
          <Field
            label="Period *"
            name="period"
            type="number"
            value={form.period}
            onChange={handleChange}
            required
          />
          <Field
            label="Inventory Level"
            name="inventory_level"
            type="number"
            value={form.inventory_level}
            onChange={handleChange}
          />
          <Field
            label="Production Capacity"
            name="production_capacity"
            type="number"
            value={form.production_capacity}
            onChange={handleChange}
          />
          <input
            type="text"
            name="comId"
            defaultValue={currentCompanyId ?? ""}
            hidden
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-10 w-full py-3 rounded-xl cursor-pointer bg-gradient-to-r from-green-500 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-blue-800 text-white font-bold shadow-md transition duration-150 disabled:bg-green-300 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit Production Decision"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type,
  value,
  onChange,
  required = false,
}: {
  label: string;
  name: string;
  type: "number" | "text";
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block font-semibold text-slate-700 dark:text-slate-200 mb-1"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 focus:ring-2 focus:ring-green-300 dark:focus:ring-indigo-800 focus:outline-none font-medium transition placeholder:text-slate-400"
        placeholder={label}
      />
    </div>
  );
}
