"use client";

import React from "react";
import { PlusCircle, Trash2, Check, TriangleAlert } from "lucide-react";
import { ToastContainer } from "react-toastify";
import {
  useCashBalance,
  useCompanyForm,
  useHRForm,
} from "@/app/context/FormContext";

import { useSimulation } from "@/app/context/SimulationContext";
import { Users, TrendingUp, Award, Building2, IndianRupee } from "lucide-react";

const HRDashboard = () => {
  const {
    data,
    updateData,

    updateExistingRole,

    addNewRole,
    updateNewRole,
    removeNewRole,
  } = useHRForm();

  const { cashBalance, projectedCashBalance, updateHRBudgetImpact } =
    useCashBalance();
  const { period } = useSimulation();
  const { data: companyData } = useCompanyForm();

  // State for validation and success feedback
  const [success, setSuccess] = React.useState(false);
  const [budgetAlert, setBudgetAlert] = React.useState<string | null>(null);

  // Calculate net hiring from newRoles and existing roles combined with NaN protection
  const netHiring =
    (data?.newRoles?.reduce((acc, r) => {
      const hires = isNaN(r.hires) ? 0 : r.hires || 0;
      return acc + hires;
    }, 0) || 0) +
    (data?.existingRoles?.reduce((acc, r) => {
      const hires = isNaN(r.hires) ? 0 : r.hires || 0;
      return acc + hires;
    }, 0) || 0);

  const formatCurrency = (value: number) => {
    return "₹" + value.toLocaleString(undefined, { minimumFractionDigits: 0 });
  };
  const totalExistingHeadCount = data.existingRoles.reduce((sum, role) => {
    const headCount = isNaN(role.current_head_count)
      ? 0
      : role.current_head_count || 0;
    return sum + headCount;
  }, 0);
  const totalHires = data.existingRoles.reduce((sum, role) => {
    const hires = isNaN(role.hires) ? 0 : role.hires || 0;
    return sum + hires;
  }, 0);

  const projectedSalaryBudget =
    data.existingRoles.reduce((sum, role) => {
      const headCount = isNaN(role.current_head_count)
        ? 0
        : role.current_head_count || 0;
      const hires = isNaN(role.hires) ? 0 : role.hires || 0;
      const fires = isNaN(role.fires) ? 0 : role.fires || 0;
      const salaryPerHead = isNaN(role.salary_per_head)
        ? 0
        : role.salary_per_head || 0;

      const adjustedHeadCount = headCount + hires - fires;
      return sum + salaryPerHead * Math.max(0, adjustedHeadCount);
    }, 0) +
    (data.newRoles?.reduce((sum, role) => {
      const salaryPerHead = isNaN(role.salary_per_head)
        ? 0
        : role.salary_per_head || 0;
      const hires = isNaN(role.hires) ? 0 : role.hires || 0;
      return sum + salaryPerHead * hires;
    }, 0) || 0);

  // Use projectedCashBalance for cash after calculation with NaN protection
  const trainingBudget = isNaN(data?.training_budget)
    ? 0
    : data?.training_budget || 0;
  const totalHRBudget =
    (isNaN(projectedSalaryBudget) ? 0 : projectedSalaryBudget) + trainingBudget;
  const cashAfter =
    (isNaN(projectedCashBalance) ? 0 : projectedCashBalance) - totalHRBudget;

  const totalFires = data.existingRoles.reduce((sum, role) => {
    const fires = isNaN(role.fires) ? 0 : role.fires || 0;
    return sum + fires;
  }, 0);

  // Validation function similar to other forms
  const handleValidate = () => {
    setSuccess(false);
    setBudgetAlert(null);

    // Basic validation checks with NaN protection
    if (isNaN(totalHRBudget) || totalHRBudget <= 0) {
      setBudgetAlert("⚠️ Total HR budget must be greater than zero");
      return;
    }

    if (isNaN(projectedSalaryBudget) || projectedSalaryBudget < 0) {
      setBudgetAlert("⚠️ Salary budget cannot be negative");
      return;
    }

    const trainingBudgetValue = isNaN(data.training_budget)
      ? 0
      : data.training_budget;
    if (trainingBudgetValue < 0) {
      setBudgetAlert("⚠️ Training budget cannot be negative");
      return;
    }

    const employeeSatisfaction = isNaN(data.employee_satisfaction)
      ? 0
      : data.employee_satisfaction;
    if (employeeSatisfaction < 0 || employeeSatisfaction > 100) {
      setBudgetAlert("⚠️ Employee satisfaction must be between 0 and 100");
      return;
    }

    // Update the HR budget impact in the cash balance system
    updateHRBudgetImpact(totalHRBudget);
    setSuccess(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-2">
      <ToastContainer position="top-right" />

      <div className="max-w-7xl mx-auto">
        {/* Metrics UI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 mb-2">
          {/* Company Info */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <Building2 className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white text-right">
                {companyData.name}
              </span>
            </div>
            <p className="text-slate-300">Period {period}</p>
            <p className="text-sm text-slate-400">
              {" "}
              Cash: {formatCurrency(cashBalance.originalCashBalance || 0)}{" "}
            </p>
          </div>

          {/* Projected Employees */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">
                {totalExistingHeadCount + totalHires - totalFires}
              </span>
            </div>
            <p className="text-slate-300">Projected Employees</p>
            <p className="text-sm text-slate-400">
              Current: {totalExistingHeadCount}
            </p>
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
              <span className="text-2xl font-bold text-white">
                {formatCurrency(trainingBudget)}
              </span>
            </div>
            <p className="text-slate-300">Training Budget</p>
            <p className="text-sm text-slate-400">
              Total HR: {formatCurrency(totalHRBudget || 0)}
            </p>
          </div>

          {/* Employee Satisfaction */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <Award className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">
                {isNaN(data.employee_satisfaction)
                  ? "0"
                  : data.employee_satisfaction.toFixed(0)}
                %
              </span>
            </div>
            <p className="text-slate-300">Employee Satisfaction</p>
            <p className="text-sm text-slate-400">
              Salary: {formatCurrency(projectedSalaryBudget || 0)}
            </p>
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
                        {role.current_head_count}
                      </td>
                      <td className="py-1">
                        <input
                          type="number"
                          min={0}
                          value={
                            isNaN(role.salary_per_head)
                              ? 0
                              : role.salary_per_head
                          }
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            updateExistingRole(index, {
                              salary_per_head: isNaN(value) ? 0 : value,
                            });
                            setSuccess(false);
                            setBudgetAlert(null);
                          }}
                          className="w-24 p-2 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-400"
                        />
                      </td>
                      <td className="py-1">
                        <input
                          type="number"
                          placeholder="0"
                          min={0}
                          value={isNaN(role.hires) ? 0 : role.hires ?? 0}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            updateExistingRole(index, {
                              hires: isNaN(value) ? 0 : value,
                            });
                            setSuccess(false);
                            setBudgetAlert(null);
                          }}
                          className="w-20 p-2 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-400"
                        />
                      </td>
                      <td className="py-1">
                        <input
                          type="number"
                          placeholder="0"
                          min={0}
                          value={isNaN(role.fires) ? 0 : role.fires ?? 0}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            updateExistingRole(index, {
                              fires: isNaN(value) ? 0 : value,
                            });
                            setSuccess(false);
                            setBudgetAlert(null);
                          }}
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
          <div>
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
              <p className="text-slate-400 italic mb-1">
                No new roles added yet.
              </p>
            )}

            {data?.newRoles?.map((role, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 items-end ml-6 mb-2"
              >
                {/* Role Name */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-300 mb-1">
                    Role Name
                  </label>
                  <input
                    type="text"
                    placeholder="Role Name"
                    value={role.role_name || ""}
                    onChange={(e) => {
                      updateNewRole(index, { role_name: e.target.value });
                      setSuccess(false);
                      setBudgetAlert(null);
                    }}
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
                    value={
                      isNaN(role.salary_per_head) ? 0 : role.salary_per_head
                    }
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      updateNewRole(index, {
                        salary_per_head: isNaN(value) ? 0 : value,
                      });
                      setSuccess(false);
                      setBudgetAlert(null);
                    }}
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
                    value={isNaN(role.hires) ? 0 : role.hires}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      updateNewRole(index, {
                        hires: isNaN(value) ? 0 : value,
                      });
                      setSuccess(false);
                      setBudgetAlert(null);
                    }}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2 mx-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Training Budget
              </label>
              <input
                type="number"
                value={
                  isNaN(data?.training_budget) ? 0 : data?.training_budget || 0
                }
                onChange={(e) => {
                  const value = Number(e.target.value);
                  updateData({
                    training_budget: isNaN(value) ? 0 : value,
                  });
                  setSuccess(false);
                  setBudgetAlert(null);
                }}
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
                value={
                  isNaN(data?.employee_satisfaction)
                    ? 0
                    : data?.employee_satisfaction || 0
                }
                onChange={(e) => {
                  const value = Number(e.target.value);
                  const clampedValue = Math.min(
                    100,
                    Math.max(0, isNaN(value) ? 0 : value)
                  );
                  updateData({
                    employee_satisfaction: clampedValue,
                  });
                  setSuccess(false);
                  setBudgetAlert(null);
                }}
                min={0}
                max={100}
                className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Validate Button */}
          <div className="flex justify-center mb-4 mx-6">
            <button
              type="button"
              onClick={handleValidate}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition shadow"
            >
              Validate HR Decisions
            </button>
          </div>

          {/* Validation Messages */}
          {(budgetAlert || success) && (
            <div className="mt-6 space-y-4 mx-6">
              {budgetAlert && (
                <div className="bg-rose-900/60 border border-rose-700 text-rose-300 rounded-lg p-4 animate-pulse">
                  <div className="flex items-start gap-3">
                    <TriangleAlert className="text-rose-500 mt-0.5" />
                    <p className="text-sm">{budgetAlert}</p>
                  </div>
                </div>
              )}
              {success && !budgetAlert && (
                <div className="bg-green-900/60 border border-white/80 text-white rounded-lg p-4 animate-bounce">
                  <div className="flex items-center gap-3">
                    <Check className="text-green-400 text-xl" />
                    <p className="text-xl font-semibold">
                      HR Decisions Validated Successfully!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Summary Section */}
          <h4 className="text-xl font-semibold text-white mb-2 ml-6">
            Decision Summary
          </h4>
          <div className="bg-slate-700/70 rounded-xl px-6 py-4 mx-6 grid grid-cols-2 md:grid-cols-3 gap-6 text-center text-white font-semibold">
            <div>
              <p className="text-slate-300 text-sm mb-1">Total HR Budget</p>
              <p className="text-2xl">{formatCurrency(totalHRBudget || 0)}</p>
            </div>
            <div>
              <p className="text-slate-300 text-sm mb-1">Available Cash</p>
              <p className="text-2xl">
                {formatCurrency(cashBalance.originalCashBalance || 0)}
              </p>
            </div>
            <div>
              <p className="text-slate-300 text-sm mb-1">Cash After HR</p>
              <p
                className={`text-2xl ${
                  (cashAfter || 0) < 0 ? "text-red-500" : "text-green-400"
                }`}
              >
                {formatCurrency(projectedCashBalance || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
