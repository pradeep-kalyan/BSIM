"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";

export interface FinanceDecisionFormValues {
  period: number | "";
  investmentAmount: number | "";
  loanAmount: number | "";
  repayLoan: number | "";
  dividendPayout: number | "";
  equityIssue: number | "";
  notes?: string;
}

interface FinanceDecisionFormProps {
  onSubmit?: (values: FinanceDecisionFormValues) => Promise<void> | void;
  initialData?: Partial<FinanceDecisionFormValues>;
}

export default function FinanceDecisionForm({
  onSubmit,
  initialData = {},
}: FinanceDecisionFormProps) {
  const [form, setForm] = useState<FinanceDecisionFormValues>({
    period: initialData.period ?? "",
    investmentAmount: initialData.investmentAmount ?? "",
    loanAmount: initialData.loanAmount ?? "",
    repayLoan: initialData.repayLoan ?? "",
    dividendPayout: initialData.dividendPayout ?? "",
    equityIssue: initialData.equityIssue ?? "",
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
          Finance Decision
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
            label="Investment Amount"
            name="investmentAmount"
            type="number"
            value={form.investmentAmount}
            onChange={handleChange}
          />
          <Field
            label="Loan Amount"
            name="loanAmount"
            type="number"
            value={form.loanAmount}
            onChange={handleChange}
          />
          <Field
            label="Repay Loan"
            name="repayLoan"
            type="number"
            value={form.repayLoan}
            onChange={handleChange}
          />
          <Field
            label="Dividend Payout"
            name="dividendPayout"
            type="number"
            value={form.dividendPayout}
            onChange={handleChange}
          />
          <Field
            label="Equity Issue"
            name="equityIssue"
            type="number"
            value={form.equityIssue}
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
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-800 focus:outline-none transition"
              rows={3}
              placeholder="Enter any additional information..."
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-10 w-full cursor-pointer py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white font-bold shadow-md transition duration-150 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit Finance Decision"}
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
  value: number | string | "";
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
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-800 focus:outline-none font-medium transition placeholder:text-slate-400"
        placeholder={label}
      />
    </div>
  );
}
