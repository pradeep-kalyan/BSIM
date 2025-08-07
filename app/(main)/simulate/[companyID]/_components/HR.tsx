"use client";

import React from "react";
import {
  PlusCircle,
  Trash2,
  Check,
  TriangleAlert,
  UserPlus,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { ToastContainer } from "react-toastify";
import { Slider } from "@/components/ui/slider";
import {
  useCashBalance,
  useCompanyForm,
  useHRForm,
  useHRRoleManagement,
} from "@/app/context/FormContext";
import InfoCard from "@/app/components/InfoCard"
import { useSimulation } from "@/app/context/SimulationContext";
import { Users, Award, Building2, IndianRupee } from "lucide-react";

const HRDashboard = () => {
  const {
    data,
    updateData,
    updateExistingRole,
    addNewRole,
    updateNewRole,
    removeNewRole,
  } = useHRForm();

  // Get total employee count from the HR role management hook
  const { getTotalEmployees } = useHRRoleManagement();

  const { cashBalance, projectedCashBalance, updateHRBudgetImpact } =
    useCashBalance();
  const { period } = useSimulation();
  const { data: companyData } = useCompanyForm();

  // State for validation and success feedback
  const [success, setSuccess] = React.useState(false);
  const [budgetAlert, setBudgetAlert] = React.useState<string | null>(null);

  // Calculate total employee count
  const totalEmployeeCount = getTotalEmployees();

  // Calculate net hiring from newRoles and existing roles combined with NaN protection
  const formatCurrency = (value: number) => {
    return "₹" + value.toLocaleString(undefined, { minimumFractionDigits: 0 });
  };

  const totalExistingHeadCount = data.existingRoles.reduce((sum, role) => {
    const headCount = isNaN(role.current_head_count)
      ? 0
      : role.current_head_count || 0;
    return sum + headCount;
  }, 0);
  const totalHires =
    data.existingRoles.reduce((sum, role) => {
      const hires = isNaN(role.hires) ? 0 : role.hires || 0;
      return sum + hires;
    }, 0) +
    (data.newRoles?.reduce((sum, role) => {
      const hires = isNaN(role.hires) ? 0 : role.hires || 0;
      return sum + hires;
    }, 0) || 0);

  const totalFires = data.existingRoles.reduce((sum, role) => {
    const fires = isNaN(role.fires) ? 0 : role.fires || 0;
    return sum + fires;
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

  // Update budget impact whenever calculated budget changes
  React.useEffect(() => {
    updateHRBudgetImpact(totalHRBudget);
  }, [totalHRBudget, updateHRBudgetImpact]);

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
    setSuccess(true);
  };

  return (
    <div className="bg-slate-800/50 shadow-md py-4 px-6">
      <ToastContainer position="top-right" />

      <div className="max-w-7xl mx-auto">
        {/* Compact Metrics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <InfoCard
            label="Total Staff"
            value={totalEmployeeCount}
            Icon={Users}
            iconColor="text-blue-400"
            isCurrency={false}
            width="w-full"
            height="h-30"
          />

          <InfoCard
            label="New Hires"
            value={totalHires}
            Icon={TrendingUp}
            iconColor="text-green-400"
            isCurrency={false}
            width="w-full"
            height="h-30"
            subtext={""}
          />

          <InfoCard
            label="Layoffs"
            value={totalFires}
            Icon={TrendingDown}
            iconColor="text-red-400"
            isCurrency={false}
            width="w-full"
            height="h-30"
            subtext={""}
          />

          <InfoCard
            label="HR Budget"
            value={totalHRBudget}
            Icon={IndianRupee}
            iconColor="text-yellow-400"
            isCurrency={true}
            currencyCode="INR"
            width="w-full"
            height="h-30"
          />

          <InfoCard
            label="Satisfaction"
            value={
              `${isNaN(data.employee_satisfaction)
                ? 0
                : parseFloat(data.employee_satisfaction.toFixed(0))}%`
            }
            Icon={Award}
            iconColor="text-purple-400"
            isCurrency={false}
            width="w-full"
            height="h-30"
            subtext=""
          />
        </div>

        {/* Compact HR Decision Interface */}
        <div className="bg-slate-800/50 shadow-md rounded-xl py-4 px-4 border border-slate-600">

          {/* Existing Roles Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-bold text-slate-100">
                  Current Workforce
                </h3>
              </div>
              <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm">
                {data.existingRoles.length} Roles
              </span>
            </div>

            <div className="space-y-3">
              {data.existingRoles.map((role, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 shadow-md rounded-lg p-4 border border-slate-600"
                >
                  {/* Role Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-blue-400" />
                      <h4 className="text-lg font-bold text-white">
                        {role.role_name}
                      </h4>
                    </div>
                    <div className="text-sm text-slate-300">
                      Current: {role.current_head_count} • Projected:{" "}
                      {role.current_head_count +
                        (role.hires || 0) -
                        (role.fires || 0)}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Salary Control */}
                    <div className="bg-slate-600/30 rounded-lg p-3">
                      <h5 className="text-sm font-semibold text-white mb-2">
                        Salary per Employee
                      </h5>
                      <Slider
                        label={`₹${(
                          role.salary_per_head || 0
                        ).toLocaleString()}`}
                        value={[
                          isNaN(role.salary_per_head)
                            ? 0
                            : role.salary_per_head,
                        ]}
                        min={0}
                        max={Math.max(
                          500000,
                          (role.salary_per_head || 0) * 1.5
                        )}
                        onValueChange={(val) => {
                          updateExistingRole(index, {
                            salary_per_head: val[0],
                          });
                          setSuccess(false);
                          setBudgetAlert(null);
                        }}
                      />
                    </div>

                    {/* Staffing Control */}
                    <div className="bg-slate-600/30 rounded-lg p-3">
                      <h5 className="text-sm font-semibold text-white mb-2">
                        Staffing Changes
                      </h5>
                      <Slider
                        label={`Net: ${(role.hires || 0) - (role.fires || 0)}`}
                        value={[(role.hires || 0) - (role.fires || 0)]}
                        min={-role.current_head_count}
                        max={50}
                        onValueChange={(val) => {
                          const netChange = Math.round(val[0]);
                          if (netChange >= 0) {
                            updateExistingRole(index, {
                              hires: netChange,
                              fires: 0,
                            });
                          } else {
                            updateExistingRole(index, {
                              hires: 0,
                              fires: Math.abs(netChange),
                            });
                          }
                          setSuccess(false);
                          setBudgetAlert(null);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Roles Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-slate-100">
                Create New Positions
              </h3>
              <div className="flex items-center gap-2">
                <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-sm">
                  {data?.newRoles?.length || 0} New
                </span>
                <button
                  type="button"
                  onClick={() =>
                    addNewRole({
                      role_name: "",
                      salary_per_head: 50000,
                      hires: 1,
                    })
                  }
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                >
                  <PlusCircle size={14} className="inline mr-1" />
                  Add Role
                </button>
              </div>
            </div>

            {data?.newRoles?.length === 0 && (
              <div className="text-center py-4 bg-slate-700/30 rounded-lg border-2 border-dashed border-slate-600">
                <p className="text-slate-400 text-sm">
                  No new roles created yet
                </p>
              </div>
            )}

            <div className="space-y-3">
              {data?.newRoles?.map((role, index) => (
                <div
                  key={index}
                  className="bg-green-700/20 rounded-lg p-4 border border-green-500/30"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-bold text-white">
                      {role.role_name || "New Position"}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeNewRole(index)}
                      className="text-red-400 hover:text-red-300 bg-red-500/10 px-2 py-1 rounded text-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm text-slate-300 mb-1 block">
                        Position Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Senior Developer"
                        value={role.role_name || ""}
                        onChange={(e) => {
                          updateNewRole(index, { role_name: e.target.value });
                          setSuccess(false);
                          setBudgetAlert(null);
                        }}
                        className="w-full p-3 rounded bg-slate-800 text-white border border-slate-500 focus:border-green-400 focus:outline-none text-sm placeholder-slate-400 hover:bg-slate-700 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-slate-300 mb-1 block">
                        Monthly Salary
                      </label>
                      <Slider
                        className="w-[200px]"
                        label={`₹${(
                          role.salary_per_head || 50000
                        ).toLocaleString()}`}
                        value={[
                          isNaN(role.salary_per_head)
                            ? 50000
                            : role.salary_per_head,
                        ]}
                        min={10000}
                        max={200000}
                        onValueChange={(val) => {
                          updateNewRole(index, { salary_per_head: val[0] });
                          setSuccess(false);
                          setBudgetAlert(null);
                        }}
                      />
                    </div>

                    <div>
                      <label className="text-sm text-slate-300 mb-1 block">
                        Positions to Fill
                      </label>
                      <Slider
                        className="w-[200px]"
                        label={`${role.hires || 1} positions`}
                        value={[isNaN(role.hires) ? 1 : role.hires]}
                        min={1}
                        max={20}
                        onValueChange={(val) => {
                          updateNewRole(index, { hires: Math.round(val[0]) });
                          setSuccess(false);
                          setBudgetAlert(null);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget & Satisfaction Controls */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-100 mb-3">
              HR Budget & Culture
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Training Budget */}
              <div className="bg-slate-700/20 rounded-lg p-4 border border-slate-600">
                <h4 className="text-sm font-bold text-white mb-2">
                  Training & Development
                </h4>
                <Slider
                  label={`Training Budget: ₹${(
                    data?.training_budget || 0
                  ).toLocaleString()}`}
                  value={[
                    isNaN(data?.training_budget)
                      ? 0
                      : data?.training_budget || 0,
                  ]}
                  min={0}
                  max={Math.min(companyData?.cash_balance || 100000, 500000)}
                  onValueChange={(val) => {
                    updateData({ training_budget: val[0] });
                    setSuccess(false);
                    setBudgetAlert(null);
                  }}
                />
              </div>

              {/* Employee Satisfaction */}
              <div className="bg-slate-700/20 rounded-lg p-4 border border-slate-600">
                <h4 className="text-sm font-bold text-white mb-2">
                  Employee Satisfaction
                </h4>
                <Slider
                  label={`Target: ${(data?.employee_satisfaction || 70).toFixed(
                    0
                  )}%`}
                  value={[
                    isNaN(data?.employee_satisfaction)
                      ? 70
                      : data?.employee_satisfaction || 70,
                  ]}
                  min={0}
                  max={100}
                  onValueChange={(val) => {
                    updateData({ employee_satisfaction: val[0] });
                    setSuccess(false);
                    setBudgetAlert(null);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Validation & Summary */}
          <div className="space-y-4">
            {/* Validation Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleValidate}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold transition-all"
              >
                <Check className="h-4 w-4 inline mr-2" />
                Validate HR Decisions
              </button>
            </div>

            {/* Validation Messages */}
            {(budgetAlert || success) && (
              <div className="space-y-2">
                {budgetAlert && (
                  <div className="bg-rose-900/80 border border-rose-600 text-rose-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <TriangleAlert className="text-rose-400 h-4 w-4" />
                      <span className="text-sm">{budgetAlert}</span>
                    </div>
                  </div>
                )}
                {success && !budgetAlert && (
                  <div className="bg-green-900/80 border border-green-500 text-green-100 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Check className="text-green-400 h-4 w-4" />
                      <span className="text-sm">
                        All HR decisions validated successfully!
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Summary Section */}
            <div className="bg-slate-800/50 shadow-md rounded-lg p-4 border border-slate-500">
              <h4 className="text-lg font-bold text-white mb-3">
                Financial Impact Summary
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
                <div className="bg-slate-600/40 rounded-lg p-3">
                  <p className="text-slate-300 text-xs mb-1">Salary Budget</p>
                  <p className="text-lg font-bold text-yellow-400">
                    {formatCurrency(projectedSalaryBudget || 0)}
                  </p>
                </div>
                <div className="bg-slate-600/40 rounded-lg p-3">
                  <p className="text-slate-300 text-xs mb-1">Training Budget</p>
                  <p className="text-lg font-bold text-blue-400">
                    {formatCurrency(data?.training_budget || 0)}
                  </p>
                </div>
                <div className="bg-slate-600/40 rounded-lg p-3">
                  <p className="text-slate-300 text-xs mb-1">Available Cash</p>
                  <p className="text-lg font-bold text-blue-300">
                    {formatCurrency(cashBalance.originalCashBalance || 0)}
                  </p>
                </div>

                <div className="bg-slate-600/40 rounded-lg p-3">
                  <p className="text-slate-300 text-xs mb-1">Cash After HR</p>
                  <p
                    className={`text-lg font-bold ${(projectedCashBalance || 0) < 0
                      ? "text-red-400"
                      : "text-emerald-400"
                      }`}
                  >
                    {formatCurrency(projectedCashBalance || 0)}
                  </p>
                </div>
              </div>

              {/* Workforce Changes Summary */}
              <div className="mt-4 pt-4 border-t border-slate-600">
                <h5 className="text-sm font-bold text-slate-300 mb-2">
                  Workforce Changes
                </h5>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-blue-500/10 rounded-lg p-2">
                    <p className="text-xs text-blue-300">Current Staff</p>
                    <p className="text-lg font-bold text-white">
                      {totalExistingHeadCount}
                    </p>
                  </div>
                  <div className="bg-green-500/10 rounded-lg p-2">
                    <p className="text-xs text-green-300">Net Change</p>
                    <p
                      className={`text-lg font-bold ${totalHires - totalFires >= 0
                        ? "text-green-400"
                        : "text-red-400"
                        }`}
                    >
                      {totalHires - totalFires >= 0 ? "+" : ""}
                      {totalHires - totalFires}
                    </p>
                  </div>
                  <div className="bg-purple-500/10 rounded-lg p-2">
                    <p className="text-xs text-purple-300">Total Staff</p>
                    <p className="text-lg font-bold text-white">
                      {totalEmployeeCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;