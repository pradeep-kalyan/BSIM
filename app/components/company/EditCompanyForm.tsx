"use client";

import React, { useState } from "react";
import {
  updateCompany,
  grantAccessByEmail,
  revokeAccessByEmail,
} from "@/app/_actions/company";
import {
  Loader2,
  Save,
  X,
  Plus,
  Mail,
  Building2,
  DollarSign,
  TrendingUp,
  Shield,
  Users,
  Image,
  FileText,
  Star,
} from "lucide-react";
import formatCurrency from "@/app/functions/formatCurrency";
import { Props } from "@/app/types/company";

const EditCompanyForm: React.FC<Props> = ({ company, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    name: company.name || "",
    description: company.description || "",
    logo_url: company.logo_url || "",
    cash_balance: company.cash_balance || 0,
    total_assets: company.total_assets || 0,
    total_liabilities: company.total_liabilities || 0,
    marketing_budget: company.marketing_budget || 0,
    brand_value: company.brand_value || 0,
  });

  const [loading, setLoading] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [accessList, setAccessList] = useState<string[]>(
    company.company_access?.map((a) => a.user?.email).filter(Boolean) || []
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "cash_balance" ||
        name === "total_assets" ||
        name === "total_liabilities" ||
        name === "brand_value"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await updateCompany(company.id, formData);
    setLoading(false);
    if (onUpdated) onUpdated();
    onClose();
  };

  const handleAddEmail = async () => {
    const email = newEmail.trim().toLowerCase();
    if (!email || accessList.includes(email)) return;
    await grantAccessByEmail(company.id, email);
    setAccessList((prev) => [...prev, email]);
    setNewEmail("");
  };

  const handleRemoveEmail = async (email: string) => {
    await revokeAccessByEmail(company.id, email);
    setAccessList((prev) => prev.filter((e) => e !== email));
  };



  return (
    <div className="max-w-4xl mx-auto h-[90vh] overflow-y-auto px-4">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center pb-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Edit Company</h2>
              <p className="text-sm text-slate-400">
                Update company information and manage access
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Company Information Section */}
        <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">
              Company Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Building2 className="w-4 h-4" />
                Company Name
              </label>
              <input
                type="text"
                name="name"
                className="w-full bg-slate-800/50 border border-slate-600 rounded-xl p-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter company name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image className="w-4 h-4" />
                Logo URL
              </label>
              <input
                type="text"
                name="logo_url"
                className="w-full bg-slate-800/50 border border-slate-600 rounded-xl p-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                value={formData.logo_url}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <FileText className="w-4 h-4" />
                Description
              </label>
              <textarea
                name="description"
                className="w-full bg-slate-800/50 border border-slate-600 rounded-xl p-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter company description..."
              />
            </div>
          </div>
        </div>

        {/* Financial Information Section */}
        <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">
              Financial Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <DollarSign className="w-4 h-4" />
                Cash Balance
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="cash_balance"
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-xl p-3 pl-10 text-white placeholder-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                  value={formData.cash_balance}
                  onChange={handleChange}
                  placeholder="0"
                />
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <p className="text-xs text-slate-500">
                {formatCurrency(formData.cash_balance)}
              </p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <TrendingUp className="w-4 h-4" />
                Total Assets
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="total_assets"
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-xl p-3 pl-10 text-white placeholder-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                  value={formData.total_assets}
                  onChange={handleChange}
                  placeholder="0"
                />
                <TrendingUp className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <p className="text-xs text-slate-500">
                {formatCurrency(formData.total_assets)}
              </p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Shield className="w-4 h-4" />
                Total Liabilities
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="total_liabilities"
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-xl p-3 pl-10 text-white placeholder-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                  value={formData.total_liabilities}
                  onChange={handleChange}
                  placeholder="0"
                />
                <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <p className="text-xs text-slate-500">
                {formatCurrency(formData.total_liabilities)}
              </p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Star className="w-4 h-4" />
                Brand Value
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="brand_value"
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-xl p-3 pl-10 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  value={formData.brand_value}
                  onChange={handleChange}
                  placeholder="0"
                />
                <Star className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <p className="text-xs text-slate-500">
                {formatCurrency(formData.brand_value)}
              </p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <DollarSign className="w-4 h-4" />
                Marketing Budget
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="marketing_budget"
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-xl p-3 pl-10 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  value={formData.marketing_budget}
                  onChange={handleChange}
                />
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <p className="text-xs text-slate-500">
                {formatCurrency(formData.marketing_budget)}
              </p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <DollarSign className="w-4 h-4" />
                Marketing Budget
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="marketing_budget"
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-xl p-3 pl-10 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  value={formData.marketing_budget}
                  onChange={handleChange}
                />
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <p className="text-xs text-slate-500">
                {formatCurrency(formData.marketing_budget)}
              </p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <DollarSign className="w-4 h-4" />
                Marketing Budget
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="marketing_budget"
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-xl p-3 pl-10 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  value={formData.marketing_budget}
                  onChange={handleChange}
                />
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <p className="text-xs text-slate-500">
                {formatCurrency(formData.marketing_budget)}
              </p>
            </div>
          </div>
        </div>

        {/* Access Control Section */}
        <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">
                Access Control
              </h3>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-500/20 rounded-full">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-300">
                {accessList.length} users
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="email"
                  placeholder="Enter email address to grant access"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-3 pl-12 rounded-xl bg-slate-800/50 text-white text-sm border border-slate-600 placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                />
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              </div>
              <button
                onClick={handleAddEmail}
                type="button"
                className="px-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 "
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {accessList.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Authorized Users
                </h4>
                <div className="space-y-2">
                  {accessList.map((email) => (
                    <div
                      key={email}
                      className="flex justify-between items-center bg-slate-800/30 px-4 py-3 rounded-xl border border-slate-600/30 hover:bg-slate-800/50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center">
                          <Mail className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="text-sm font-medium text-white">
                          {email}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveEmail(email)}
                        type="button"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
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

        {/* Action Buttons */}
        <div className="sticky bottom-0 left-0 right-0 bg-slate-900 pt-6 pb-4 mt-auto border-t border-slate-700/50 z-10">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditCompanyForm;
