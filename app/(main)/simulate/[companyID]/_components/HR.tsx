"use client";

import React, { useState } from "react";
import {
  PlusCircle,
  Trash2,
} from "lucide-react";
import { ToastContainer } from "react-toastify";
import {
  useCashBalance,
  useCompanyForm,
  useHRForm,
  useHRInitialization,
} from "@/app/context/FormContext";
import { useSimulation } from "@/app/context/SimulationContext";
import {
  Users,
  TrendingUp,
  Award,
  Building2, IndianRupee,
} from "lucide-react";

const HRDashboard = () => {
  const {
    currentHRData,
    initializeHRWithRoles,
    initializeWithCompanyRoles,
    isInitialized,
    resetHRToDefaults,
  } = useHRInitialization();

  const {
    data,
    updateData,
    setError,
    getError,
    addExistingRole,
    updateExistingRole,
    removeExistingRole,
    addNewRole,
    updateNewRole,
    removeNewRole,
    clearAllRoles,
    calculateBudgetFromRoles,
    getRoleInputs,
  } = useHRForm();

  const { cashBalance } = useCashBalance();
  const { period } = useSimulation();
  const { data: companyData } = useCompanyForm();

  // Calculate net hiring from newRoles and existing roles combined
  const netHiring =
    (data?.newRoles?.reduce((acc, r) => acc + (r.hires || 0), 0) || 0) +
    (data?.existingRoles?.reduce((acc, r) => acc + (r.hires || 0), 0) || 0);

  const formatCurrency = (value: number) => {
    return "₹" + value.toLocaleString(undefined, { minimumFractionDigits: 0 });
  };
  const totalExistingHeadCount = data.existingRoles.reduce((sum, role) => sum + (role.head_count || 0), 0);
  const totalHires = data.existingRoles.reduce(
    (sum, role) => sum + (role.hires || 0),
    0
  );

  const projectedSalaryBudget = data.existingRoles.reduce((sum, role) => {
    const adjustedHeadCount = (role.head_count || 0) + (role.hires || 0) - (role.fires || 0);
    return sum + (role.salary_per_head * Math.max(0, adjustedHeadCount));
  }, 0) + (data.newRoles?.reduce((sum, role) => sum + (role.salary_per_head * (role.hires || 0)), 0) || 0);

  const cashAfter = (cashBalance.originalCashBalance ?? 0) - ((projectedSalaryBudget + data?.training_budget) || 0);
  const totalFires = data.existingRoles.reduce(
    (sum, role) => sum + (role.fires || 0),
    0
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <ToastContainer position="top-right" />

      <div className="max-w-7xl mx-auto">
        {/* Metrics UI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 mb-6">
          {/* Company Info */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <Building2 className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white text-right">{companyData.name}</span>
            </div>
            <p className="text-slate-300">Period {period}</p>
            <p className="text-sm text-slate-400"> Cash: {formatCurrency(cashBalance.originalCashBalance)} </p>
          </div>

          {/* Projected Employees */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">{totalExistingHeadCount + totalHires - totalFires}</span>
            </div>
            <p className="text-slate-300">Projected Employees</p>
            <p className="text-sm text-slate-400">Current: {totalExistingHeadCount}</p>
          </div>

          {/* New Hires / Fires */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8 text-green-400" />
              <span className="text-2xl font-bold text-white">{netHiring}</span>
            </div>
            <p className="text-slate-300">New Hires</p>
            <p className="text-sm text-slate-400">Fires: {totalFires}</p>
          </div>

          {/* HR Budget */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <IndianRupee className="h-8 w-8 text-yellow-400" />
              <span className="text-2xl font-bold text-white">{data.training_budget}</span>
            </div>
            <p className="text-slate-300">HR Budget</p>
            <p className="text-sm text-slate-400">
              Total: {data?.training_budget + data?.salary_budget}
            </p>
          </div>

          {/* Employee Satisfaction */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <Award className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">{data.employee_satisfaction}%</span>
            </div>
            <p className="text-slate-300">Employee Satisfaction</p>
            <p className="text-sm text-slate-400">Salary: {projectedSalaryBudget}</p>
          </div>
        </div>

        {/* HR Decision UI */}
        <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl py-4 px-10 border border-slate-700 shadow-lg">
          <h2 className="text-3xl font-bold text-white mb-2">
            HR Decision - Period {period}
          </h2>

          {/* Existing Roles */}
          <div className="mb-3">
            <h3 className="text-xl font-semibold text-slate-200 mb-4">
              Existing Roles
            </h3>
            <div className="overflow-x-auto border border-slate-600 px-8 pt-2 mx-4 rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-slate-300 border-b border-slate-600">
                    <th>Role</th>
                    <th>Current Count</th>
                    <th>Salary</th>
                    <th>Hires</th>
                    <th>Fires</th>
                  </tr>
                </thead>
                <tbody>
                  {data.existingRoles.map((role, index) => (
                    <tr key={index} className="border-b border-slate-700">
                      <td className="py-1 text-white">{role.role_name}</td>
                      <td className="py-1 text-slate-300">
                        {role.head_count}
                      </td>
                      <td className="py-1">
                        <input
                          type="number"
                          min={0}
                          value={role.salary_per_head}
                          onChange={(e) =>
                            updateExistingRole(
                              index,
                              {
                                salary_per_head: parseFloat(e.target.value) || 0
                              }
                            )
                          }
                          className="w-24 p-2 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-400"
                        />
                      </td>
                      <td className="py-1">
                        <input
                          type="number"
                          placeholder="0"
                          min={0}
                          value={role.hires ?? 0}
                          onChange={(e) =>
                            updateExistingRole(
                              index,
                              {
                                hires:
                                  parseInt(e.target.value) || 0
                              }
                            )
                          }
                          className="w-20 p-2 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-400"
                        />
                      </td>
                      <td className="py-1">
                        <input
                          type="number"
                          placeholder="0"
                          min={0}
                          value={role.fires ?? 0}
                          onChange={(e) =>
                            updateExistingRole(
                              index,
                              {
                                fires:
                                  parseInt(e.target.value) || 0
                              }
                            )
                          }
                          className="w-20 p-2 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-400"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add New Roles Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-2xl font-semibold text-slate-200">
                Add New Roles
              </h3>
              <button
                type="button"
                onClick={() =>
                  addNewRole({
                    role_name: "",
                    salary_per_head: 0,
                    hires: 0,
                  })
                }
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-semibold"
              >
                <PlusCircle size={22} />
                Add Role
              </button>
            </div>

            {data?.newRoles?.length === 0 && (
              <p className="text-slate-400 italic">No new roles added yet.</p>
            )}

            {data?.newRoles?.map((role, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 items-end ml-6 mb-4"
              >
                {/* Role Name */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-300 mb-1">
                    Role Name
                  </label>
                  <input
                    type="text"
                    placeholder="Role Name"
                    value={role.role_name}
                    onChange={(e) =>
                      updateNewRole(index, { role_name: e.target.value })
                    }
                    className="p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-400 focus:outline-none"
                  />
                </div>

                {/* Salary Per Head */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-300 mb-1">
                    Salary per Head
                  </label>
                  <input
                    type="number"
                    placeholder="Salary"
                    min={0}
                    value={role.salary_per_head}
                    onChange={(e) =>
                      updateNewRole(index, {
                        salary_per_head: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-400 focus:outline-none"
                  />
                </div>

                {/* Hires Count */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-300 mb-1">
                    Hires Count
                  </label>
                  <input
                    type="number"
                    placeholder="Hires"
                    min={0}
                    value={role.hires}
                    onChange={(e) =>
                      updateNewRole(index, {
                        hires: parseInt(e.target.value) || 0,
                      })
                    }
                    className="p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-400 focus:outline-none"
                  />
                </div>

                {/* Remove Button */}
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeNewRole(index)}
                    className="text-red-400 hover:text-red-300 p-2 transition-colors rounded"
                    aria-label={`Remove role ${role.role_name}`}
                    title="Remove Role"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Budget and Satisfaction Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mx-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Training Budget
              </label>
              <input
                type="number"
                value={data?.training_budget}
                onChange={(e) =>
                  updateData({
                    training_budget: Number(e.target.value),
                  })
                }
                min={0}
                className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Employee Satisfaction (%)
              </label>
              <input
                type="number"
                value={data?.employee_satisfaction}
                onChange={(e) =>
                  updateData({
                    employee_satisfaction: Math.min(100, Math.max(0, Number(e.target.value))),
                  })
                }
                min={0}
                max={100}
                className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Summary Section */}
          <h4 className="text-xl font-semibold text-white mb-5 ml-6">
            Decision Summary
          </h4>
          <div className="bg-slate-700/70 rounded-xl px-6 py-4 mx-6 grid grid-cols-2 md:grid-cols-3 gap-6 text-center text-white font-semibold">
            <div>
              <p className="text-slate-300 text-sm mb-1">Salary Budget</p>
              <p className="text-2xl">₹{projectedSalaryBudget?.toLocaleString()}</p>
            </div>

            <div>
              <p className="text-slate-300 text-sm mb-1">Total Budget</p>
              <p className="text-2xl">₹{(projectedSalaryBudget + data.training_budget)?.toLocaleString()}</p>
            </div>

            <div>
              <p className="text-slate-300 text-sm mb-1">Cash After</p>
              <p
                className={`text-2xl ${cashAfter < 0 ? "text-red-500" : "text-green-400"
                  }`}
              >
                ₹{cashAfter.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
