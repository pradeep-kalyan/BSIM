"use client";

import React from "react";
import LogoPreview from "./LogoPreview";

interface FormState {
  name: string;
  description: string;
  logo_url: string;
  cash_balance: number;
  total_assets: number;
  total_liabilities: number;
  marketing_budget: number;
  brand_value: number;
}

interface Props {
  form: FormState;
  accessEmail: string;
  accessEmails: string[];
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  setAccessEmail: React.Dispatch<React.SetStateAction<string>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddEmail: () => void;
  handleRemoveEmail: (email: string) => void;
}

const CompanyDetailsForm = ({
  form,
  accessEmail,
  accessEmails,
  setForm,
  setAccessEmail,
  handleChange,
  handleAddEmail,
  handleRemoveEmail,
}: Props) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
      {/* Company Name & Logo Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            Company Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            placeholder="Enter company name"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            Logo URL
          </label>
          <input
            type="url"
            name="logo_url"
            value={form.logo_url}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
            placeholder="https://example.com/logo.png"
          />
        </div>
      </div>

      {/* Description with Logo Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={(e) =>
              setForm((prev: FormState) => ({ ...prev, description: e.target.value }))
            }
            rows={3}
            className="w-full p-2 rounded bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 resize-none"
            placeholder="Brief description of your company..."
          />
        </div>

        <div className="lg:col-span-1 flex flex-col items-center justify-center">
          <p className="text-xs text-slate-400 mt-1 mb-1">Logo Preview</p>
          <div className="w-24 h-24 border-2 border-dashed border-slate-600 rounded bg-slate-800/30 flex items-center justify-center overflow-hidden">
            <LogoPreview src={form.logo_url || ""} />
          </div>
        </div>
      </div>

      {/* Financial Information */}
      <div className="space-y-2">
        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
          Financial Information
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Company Budget</label>
            <input
              type="number"
              name="cash_balance"
              value={form.cash_balance}
              onChange={handleChange}
              min={0}
              step={0.01}
              className="w-full p-2 rounded bg-slate-800/50 border border-slate-700 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Total Assets</label>
            <input
              type="number"
              name="total_assets"
              value={form.total_assets}
              onChange={handleChange}
              min={0}
              step={0.01}
              className="w-full p-2 rounded bg-slate-800/50 border border-slate-700 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Total Liabilities</label>
            <input
              type="number"
              name="total_liabilities"
              value={form.total_liabilities}
              onChange={handleChange}
              min={0}
              step={0.01}
              className="w-full p-2 rounded bg-slate-800/50 border border-slate-700 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Brand Value</label>
            <input
              type="number"
              name="brand_value"
              value={form.brand_value}
              onChange={handleChange}
              min={0}
              step={0.01}
              className="w-full p-2 rounded bg-slate-800/50 border border-slate-700 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Marketing Budget</label>
            <input
              type="number"
              name="marketing_budget"
              value={form.marketing_budget}
              onChange={handleChange}
              min={0}
              step={0.01}
              className="w-full p-2 rounded bg-slate-800/50 border border-slate-700 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Access Management */}
      <div className="space-y-2">
        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
          Access Management
        </h4>

        <div className="flex gap-3">
          <input
            type="email"
            value={accessEmail}
            onChange={(e) => setAccessEmail(e.target.value)}
            className="flex-1 p-2 rounded bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
            placeholder="Enter email to grant access"
          />
          <button
            type="button"
            onClick={handleAddEmail}
            disabled={!accessEmail || accessEmails.includes(accessEmail)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded transition-all duration-200"
          >
            Add
          </button>
        </div>

        {accessEmails.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Access Granted To ({accessEmails.length})
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-32 overflow-y-auto">
              {accessEmails.map((email, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-800/50 border border-slate-700 rounded"
                >
                  <span className="text-white text-sm truncate">{email}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(email)}
                    className="ml-2 text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetailsForm;
