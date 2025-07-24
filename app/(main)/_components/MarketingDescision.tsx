"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";

const CAMPAIGN_TYPES = ["TV", "Digital", "Radio", "Print", "Outdoor", "Other"];

export interface MarketingDecisionFormValues {
  period: number | "";
  campaignType: string;
  budget: number | "";
  targetSegment?: string;
  prBudget: number | "";
  socialMediaBudget: number | "";
  productFocus?: string;
  notes?: string;
}

interface MarketingDecisionFormProps {
  onSubmit?: (values: MarketingDecisionFormValues) => Promise<void> | void;
  initialData?: Partial<MarketingDecisionFormValues>;
}

export default function MarketingDecisionForm({
  onSubmit,
  initialData = {},
}: MarketingDecisionFormProps) {
  const [form, setForm] = useState<MarketingDecisionFormValues>({
    period: initialData.period ?? "",
    campaignType: initialData.campaignType ?? "",
    budget: initialData.budget ?? "",
    targetSegment: initialData.targetSegment ?? "",
    prBudget: initialData.prBudget ?? "",
    socialMediaBudget: initialData.socialMediaBudget ?? "",
    productFocus: initialData.productFocus ?? "",
    notes: initialData.notes ?? "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
          Marketing Decision
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
          <div>
            <label
              htmlFor="campaignType"
              className="block font-semibold text-slate-700 dark:text-slate-200 mb-1"
            >
              Campaign Type *
            </label>
            <select
              id="campaignType"
              name="campaignType"
              required
              value={form.campaignType}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 focus:ring-2 focus:ring-pink-300 dark:focus:ring-indigo-800 focus:outline-none font-medium transition"
            >
              <option value="" disabled>
                Select campaign type
              </option>
              {CAMPAIGN_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <Field
            label="Total Budget"
            name="budget"
            type="number"
            value={form.budget}
            onChange={handleChange}
          />
          <Field
            label="PR Budget"
            name="prBudget"
            type="number"
            value={form.prBudget}
            onChange={handleChange}
          />
          <Field
            label="Social Media Budget"
            name="socialMediaBudget"
            type="number"
            value={form.socialMediaBudget}
            onChange={handleChange}
          />
          <Field
            label="Target Segment"
            name="targetSegment"
            type="text"
            value={form.targetSegment ?? ""}
            onChange={handleChange}
          />
          <Field
            label="Product Focus"
            name="productFocus"
            type="text"
            value={form.productFocus ?? ""}
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
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 focus:ring-2 focus:ring-pink-300 dark:focus:ring-indigo-800 focus:outline-none transition"
              rows={3}
              placeholder="Enter any additional information..."
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-10 w-full cursor-pointer py-3 rounded-xl bg-gradient-to-r from-pink-500 via-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white font-bold shadow-md transition duration-150 disabled:bg-pink-300 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit Marketing Decision"}
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
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 focus:ring-2 focus:ring-pink-300 dark:focus:ring-indigo-800 focus:outline-none font-medium transition placeholder:text-slate-400"
        placeholder={label}
      />
    </div>
  );
}
