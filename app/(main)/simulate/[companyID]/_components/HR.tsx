"use client";

import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Trash2,
  Users,
  TrendingUp,
  DollarSign,
  Award,
  Building2,
  Loader2,
} from "lucide-react";
import {
  getCompanyData,
  getHistoricalHRData,
  getCurrentRoles,
} from "@/app/_actions/hr-actions";
import { submitHRDecisionForPeriod } from "@/app/_actions/submitHRDecisionForPeriod";
import { getCurrentHRDecision } from "@/app/_actions/getCurrentHRDecision";
import HRComparisonModal from "./HRComparison";
import { toast, ToastContainer } from "react-toastify";

interface ExistingRole {
  role_name: string;
  salary_per_head: number;
  current_head_count: number;
  hires: number;
  fires: number;
}

interface NewRole {
  role_name: string;
  salary_per_head: number;
  hires: number;
}

interface CompanyData {
  id: string;
  name: string;
  current_period: number;
  cash_balance: number;
}

interface HistoricalData {
  period: number;
  total_budget: number;
  salary_budget: number;
  training_budget: number;
  employee_satisfaction: number;
  recruitment_cost: number;
  firing_cost: number;
  total_employees: number;
  roles: Array<{
    role_name: string;
    salary_per_head: number;
    head_count: number;
  }>;
}

interface HRDashboardProps {
  companyId: string;
}

const HRDashboard: React.FC<HRDashboardProps> = ({ companyId }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [, setHistoricalData] = useState<HistoricalData[]>([]);
  const [existingRoles, setExistingRoles] = useState<ExistingRole[]>([]);
  const [newRoles, setNewRoles] = useState<NewRole[]>([]);
  const [trainingBudget, setTrainingBudget] = useState<number>(0);
  const [employeeSatisfaction, setEmployeeSatisfaction] = useState<number>(50);
  const [currentDecision, setCurrentDecision] = useState<any>(null);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [company, historical, roles] = await Promise.all([
          getCompanyData(companyId),
          getHistoricalHRData(companyId),
          getCurrentRoles(companyId),
        ]);

        setCompanyData(company);
        setHistoricalData(historical);
        setExistingRoles(roles);

        // Set default values based on last period
        if (historical.length > 0) {
          const lastPeriod = historical[historical.length - 1];
          const decision = await getCurrentHRDecision(
            company.id,
            company.current_period
          );

          setCurrentDecision({
            ...lastPeriod,
            ...decision,
            roles,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  const handleExistingRoleChange = (
    index: number,
    field: "hires" | "fires" | "salary_per_head",
    value: number
  ) => {
    const updated = [...existingRoles];
    updated[index][field] = value;
    setExistingRoles(updated);
  };

  const handleNewRoleChange = (
    index: number,
    field: "role_name" | "salary_per_head" | "hires",
    value: string | number
  ) => {
    const updated = [...newRoles];
    (updated[index] as any)[field] = value;
    setNewRoles(updated);
  };

  const addNewRole = () => {
    setNewRoles((prev) => [
      ...prev,
      { role_name: "", salary_per_head: 0, hires: 0 },
    ]);
  };

  const removeNewRole = (index: number) => {
    const updated = [...newRoles];
    updated.splice(index, 1);
    setNewRoles(updated);
  };

  const handleSubmit = async () => {
    if (!companyData) return;

    const duplicateNewRole = newRoles.find(
      (newRole, i) =>
        existingRoles.some(
          (er) => er.role_name.toLowerCase() === newRole.role_name.toLowerCase()
        ) ||
        newRoles.findIndex(
          (r, j) =>
            j !== i &&
            r.role_name.toLowerCase() === newRole.role_name.toLowerCase()
        ) !== -1
    );

    if (duplicateNewRole) {
      toast.error(`Role "${duplicateNewRole.role_name}" already exists.`);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const allRoles = [
        ...existingRoles.map((role) => ({
          role_name: role.role_name,
          salary_per_head: role.salary_per_head,
          hires: role.hires,
          fires: role.fires,
        })),
        ...newRoles.map((role) => ({
          role_name: role.role_name,
          salary_per_head: role.salary_per_head,
          hires: role.hires,
          fires: 0,
        })),
      ];

      await submitHRDecisionForPeriod({
        company_id: companyId,
        period: companyData.current_period,
        training_budget: trainingBudget,
        employee_satisfaction: employeeSatisfaction,
        roles: allRoles,
      });

      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit decision"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-slate-300">Loading HR dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-slate-300">No company data found</p>
      </div>
    );
  }

  // Calculations
  const salaryFromExisting = existingRoles.reduce((acc, r) => {
    const newHeadCount = r.current_head_count + r.hires - r.fires;
    return newHeadCount > 0 ? acc + newHeadCount * r.salary_per_head : acc;
  }, 0);

  const salaryFromNew = newRoles.reduce(
    (acc, r) => acc + r.hires * r.salary_per_head,
    0
  );
  const salaryBudget = salaryFromExisting + salaryFromNew;

  const recruitmentCost =
    existingRoles.reduce((acc, r) => acc + r.hires * r.salary_per_head, 0) +
    newRoles.reduce((acc, r) => acc + r.hires * r.salary_per_head, 0);

  const firedSalary = existingRoles.reduce(
    (acc, r) => acc + r.fires * r.salary_per_head,
    0
  );
  // const firingCost = existingRoles.reduce((acc, r) => acc + r.fires * 5000, 0);
  const totalBudget = trainingBudget + recruitmentCost;

  const totalHires =
    existingRoles.reduce((acc, r) => acc + r.hires, 0) +
    newRoles.reduce((acc, r) => acc + r.hires, 0);
  const totalFires = existingRoles.reduce((acc, r) => acc + r.fires, 0);
  const currentEmployees = existingRoles.reduce(
    (acc, r) => acc + r.current_head_count,
    0
  );
  const projectedEmployees = currentEmployees + totalHires - totalFires;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-2">
      <ToastContainer position="top-right" />

      {showComparison && (
        <div className="max-w-7xl mx-auto mt-2">
          <HRComparisonModal
            isOpen={showComparison}
            onClose={() => setShowComparison(false)}
            companyData={companyData}
            existingRoles={existingRoles}
            newRoles={newRoles}
            trainingBudget={trainingBudget}
            employeeSatisfaction={employeeSatisfaction}
            previousDecision={currentDecision}
          />
        </div>
      )}

      {/* Key Metrics */}
      {!showComparison && (
        <div className="max-w-7xl mx-auto mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 mb-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-2 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <Building2 className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold text-white text-right">
                  {companyData.name}
                </span>
              </div>
              <p className="text-slate-300">
                Period {companyData.current_period}
              </p>
              <p className="text-sm text-slate-400">
                Cash: {formatCurrency(companyData.cash_balance)}
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold text-white">
                  {projectedEmployees}
                </span>
              </div>
              <p className="text-slate-300">Projected Employees</p>
              <p className="text-sm text-slate-400">
                Current: {currentEmployees}
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-2 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-8 w-8 text-green-400" />
                <span className="text-2xl font-bold text-white">
                  {totalHires}
                </span>
              </div>
              <p className="text-slate-300">New Hires</p>
              <p className="text-sm text-slate-400">Fires: {totalFires}</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-2 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="h-8 w-8 text-yellow-400" />
                <span className="text-2xl font-bold text-white">
                  {formatCurrency(totalBudget)}
                </span>
              </div>
              <p className="text-slate-300">HR Budget</p>
              <p className="text-sm text-slate-400">
                {" "}
                Total: {formatCurrency(salaryBudget + totalBudget)}
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-2 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <Award className="h-8 w-8 text-purple-400" />
                <span className="text-2xl font-bold text-white">
                  {employeeSatisfaction}%
                </span>
              </div>
              <p className="text-slate-300">Employee Satisfaction</p>
              <p className="text-sm text-slate-400">
                Salary :{formatCurrency(salaryBudget)}
              </p>
            </div>
          </div>

          {/* HR Decision Form */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl py-4 px-10 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-2">
              HR Decision - Period {companyData.current_period}
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
                    {existingRoles.map((role, index) => (
                      <tr key={index} className="border-b border-slate-700">
                        <td className="py-1 text-white">{role.role_name}</td>
                        <td className="py-1 text-slate-300">
                          {role.current_head_count}
                        </td>
                        <td className="py-1">
                          <input
                            type="number"
                            min={0}
                            value={role.salary_per_head}
                            onChange={(e) =>
                              handleExistingRoleChange(
                                index,
                                "salary_per_head",
                                parseFloat(e.target.value) || 0
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
                            value={role.hires}
                            onChange={(e) =>
                              handleExistingRoleChange(
                                index,
                                "hires",
                                parseInt(e.target.value) || 0
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
                            value={role.fires}
                            onChange={(e) =>
                              handleExistingRoleChange(
                                index,
                                "fires",
                                parseInt(e.target.value) || 0
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

            {/* New Roles */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-200">
                  Add New Roles
                </h3>
                <button
                  type="button"
                  onClick={addNewRole}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <PlusCircle size={20} />
                  Add Role
                </button>
              </div>

              {newRoles.map((role, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-4 items-end ml-4 pt-2"
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
                        handleNewRoleChange(index, "role_name", e.target.value)
                      }
                      className="p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-400"
                    />
                  </div>

                  {/* Salary */}
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
                        handleNewRoleChange(
                          index,
                          "salary_per_head",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-400"
                    />
                  </div>

                  {/* Hires */}
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
                        handleNewRoleChange(
                          index,
                          "hires",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-400"
                    />
                  </div>

                  {/* Remove Button */}
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeNewRole(index)}
                      className="text-red-400 hover:text-red-300 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Budget and Satisfaction */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 mx-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Training Budget
                </label>
                <input
                  type="number"
                  value={trainingBudget}
                  onChange={(e) =>
                    setTrainingBudget(parseFloat(e.target.value) || 0)
                  }
                  min={0}
                  className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Employee Satisfaction (%)
                </label>
                <input
                  type="number"
                  value={employeeSatisfaction}
                  onChange={(e) =>
                    setEmployeeSatisfaction(parseFloat(e.target.value) || 0)
                  }
                  min={0}
                  max={100}
                  className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-400"
                />
              </div>
            </div>

            {/* Summary */}
            <h4 className="text-lg font-semibold text-white mb-4 pt-2">
              Decision Summary
            </h4>
            <div className="bg-slate-700/50 rounded-xl p-4 mb-3 mx-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-slate-300 text-sm">Salary Budget</p>
                  <p className="text-xl font-bold text-white">
                    {formatCurrency(salaryBudget)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-300 text-sm">HR Budget</p>
                  <p className="text-xl font-bold text-white">
                    {formatCurrency(totalBudget)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-300 text-sm">Total Budget</p>
                  <p className="text-xl font-bold text-white">
                    {formatCurrency(totalBudget + salaryBudget)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-300 text-sm">Net Hiring</p>
                  <p className="text-xl font-bold text-white">
                    {totalHires - totalFires}
                  </p>
                </div>
                <div>
                  <p className="text-slate-300 text-sm">Cash After</p>
                  <p
                    className={`text-xl font-bold ${
                      companyData.cash_balance - totalBudget < 0
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {formatCurrency(
                      companyData.cash_balance +
                        currentDecision.training_budget +
                        firedSalary -
                        totalBudget
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowComparison(true)}
                disabled={!currentDecision}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all"
              >
                Preview Changes
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitting || companyData.cash_balance < totalBudget}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  submitting || companyData.cash_balance < totalBudget
                    ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                }`}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Submit HR Decision"
                )}
              </button>
            </div>

            {companyData.cash_balance < totalBudget && (
              <p className="text-red-400 text-sm mt-2">
                Insufficient cash balance. Required:{" "}
                {formatCurrency(totalBudget)}, Available:{" "}
                {formatCurrency(companyData.cash_balance)}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HRDashboard;
