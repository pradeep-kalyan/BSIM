"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";

export interface RndDecisionFormValues {
  period: number | "";
  researchBudget: number | "";
  productInnovationBudget: number | "";
  processImprovementBudget: number | "";
  sustainabilityBudget: number | "";
  patentApplications: number | "";
  notes?: string;
}

interface RndDecisionFormProps {
  onSubmit?: (values: RndDecisionFormValues) => Promise<void> | void;
  initialData?: Partial<RndDecisionFormValues>;
}

export default function RndDecisionForm({
  onSubmit,
  initialData = {},
}: RndDecisionFormProps) {
  const [form, setForm] = useState<RndDecisionFormValues>({
    period: initialData.period ?? "",
    researchBudget: initialData.researchBudget ?? "",
    productInnovationBudget: initialData.productInnovationBudget ?? "",
    processImprovementBudget: initialData.processImprovementBudget ?? "",
    sustainabilityBudget: initialData.sustainabilityBudget ?? "",
    patentApplications: initialData.patentApplications ?? "",
    notes: initialData.notes ?? "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (onSubmit) await onSubmit(form);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-3xl shadow-2xl p-10 bg-white/80 dark:bg-slate-800/70 backdrop-blur-md border border-slate-200 dark:border-slate-700"
      >
        <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-white mb-8 text-center tracking-tight">
          R&amp;D Decision
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
            label="Research Budget"
            name="researchBudget"
            type="number"
            value={form.researchBudget}
            onChange={handleChange}
          />
          <Field
            label="Product Innovation Budget"
            name="productInnovationBudget"
            type="number"
            value={form.productInnovationBudget}
            onChange={handleChange}
          />
          <Field
            label="Process Improvement Budget"
            name="processImprovementBudget"
            type="number"
            value={form.processImprovementBudget}
            onChange={handleChange}
          />
          <Field
            label="Sustainability Budget"
            name="sustainabilityBudget"
            type="number"
            value={form.sustainabilityBudget}
            onChange={handleChange}
          />
          <Field
            label="Patent Applications"
            name="patentApplications"
            type="number"
            value={form.patentApplications}
            onChange={handleChange}
          />
          <div>
            <label
              htmlFor="notes"
              className="block font-semibold text-slate-700 dark:text-slate-200 mb-1"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 focus:ring-2 focus:ring-purple-300 dark:focus:ring-indigo-800 focus:outline-none transition"
              rows={3}
              placeholder="Enter any additional information..."
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-10 w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold shadow-md transition duration-150 disabled:bg-purple-300 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? "Submitting..." : "Submit R&D Decision"}
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
  value: string | number | "";
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
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 focus:ring-2 focus:ring-purple-300 dark:focus:ring-indigo-800 focus:outline-none font-medium transition placeholder:text-slate-400"
        placeholder={label}
      />
    </div>
  );
}
