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
import formatCurrency from "@/app/functions/formatCurrency";
import InfoCard from "@/app/ui/InfoCard";
import { Users, Award, IndianRupee } from "lucide-react";
import { TooltipWrapper } from "@/components/ui/tooltip";

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
  const [selectedRoleIndex, setSelectedRoleIndex] = React.useState(0);
  const { cashBalance, projectedCashBalance, updateHRBudgetImpact } =
    useCashBalance();
  const { data: companyData } = useCompanyForm();

  // State for validation and success feedback
  const [success, setSuccess] = React.useState(false);
  const [budgetAlert, setBudgetAlert] = React.useState<string | null>(null);

  // Calculate total employee count
  const totalEmployeeCount = getTotalEmployees();
  const totalHires =
    data.existingRoles?.reduce((sum, role) => {
      const hires = isNaN(role.hires) ? 0 : role.hires || 0;
      return sum + hires;
    }, 0) +
    (data.newRoles?.reduce((sum, role) => {
      const hires = isNaN(role.hires) ? 0 : role.hires || 0;
      return sum + hires;
    }, 0) || 0);

  const totalFires = data.existingRoles?.reduce((sum, role) => {
    const fires = isNaN(role.fires) ? 0 : role.fires || 0;
    return sum + fires;
  }, 0);

  const projectedSalaryBudget =
    data.existingRoles?.reduce((sum, role) => {
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
      setBudgetAlert("Total HR budget must be greater than zero");
      return;
    }

    if (isNaN(projectedSalaryBudget) || projectedSalaryBudget <= 0) {
      setBudgetAlert("Salary budget cannot be negative and zero");
      return;
    }

    const trainingBudgetValue = isNaN(data.training_budget)
      ? 0
      : data.training_budget;
    if (trainingBudgetValue < 0) {
      setBudgetAlert("Training budget cannot be negative");
      return;
    }

    const employeeSatisfaction = isNaN(data.employee_satisfaction)
      ? 0
      : data.employee_satisfaction;
    if (employeeSatisfaction < 0 || employeeSatisfaction > 100) {
      setBudgetAlert("Employee satisfaction must be between 0 and 100");
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
            value={formatCurrency(totalHRBudget)}
            Icon={IndianRupee}
            iconColor="text-yellow-400"
            isCurrency={true}
            width="w-full"
            height="h-30"
          />

          <InfoCard
            label="Satisfaction"
            value={`${
              isNaN(data.employee_satisfaction)
                ? 0
                : parseFloat(data.employee_satisfaction.toFixed(0))
            }%`}
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
                <h3 className="text-lg tracking-wide font-semibold text-slate-100 font-sans-serif">
                  Current Workforce
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-white text-lg tracking-wide font-medium font-roboto-sans">
                  Select Role:
                </label>
                <select
                  value={selectedRoleIndex}
                  onChange={(e) => setSelectedRoleIndex(Number(e.target.value))}
                  className="p-2 rounded bg-slate-700 text-white border border-slate-500 tracking-wide font-medium font-geist-sans"
                >
                  {data.existingRoles?.map((role, idx) => (
                    <option key={idx} value={idx}>
                      {role.role_name}
                    </option>
                  ))}
                </select>
                <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm tracking-wide font-medium font-roboto-sans">
                  {data.existingRoles?.length} Roles
                </span>
              </div>
            </div>

            <div className="space-y-3 mx-5">
              {data?.existingRoles?.[selectedRoleIndex] && (
                <div className="bg-slate-800/50 shadow-md rounded-lg p-4 border border-slate-600">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-blue-400" />
                      <h4 className="text-lg tracking-wide font-semibold font-geist-sans text-white">
                        {data.existingRoles[selectedRoleIndex]?.role_name}
                      </h4>
                    </div>
                    <div className="text-sm text-slate-300 tracking-wide font-semibold font-roboto-sans">
                      Current:{" "}
                      {
                        data.existingRoles[selectedRoleIndex]
                          ?.current_head_count
                      }{" "}
                      • Projected:{" "}
                      {data.existingRoles[selectedRoleIndex]
                        .current_head_count +
                        (data.existingRoles[selectedRoleIndex].hires || 0) -
                        (data.existingRoles[selectedRoleIndex].fires || 0)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-600/30 rounded-lg p-3">
                      <TooltipWrapper
                        label="Salary per Employee"
                        text="How much money you pay each employee per year"
                      />
                      <Slider
                        label={`₹${(
                          data.existingRoles[selectedRoleIndex]
                            ?.salary_per_head || 0
                        ).toLocaleString()}`}
                        value={[
                          isNaN(
                            data.existingRoles[selectedRoleIndex]
                              ?.salary_per_head
                          )
                            ? 0
                            : data.existingRoles[selectedRoleIndex]
                                ?.salary_per_head,
                        ]}
                        min={0}
                        max={Math.max(
                          500000,
                          (data.existingRoles[selectedRoleIndex]
                            ?.salary_per_head || 0) * 1.5
                        )}
                        onValueChange={(val) => {
                          updateExistingRole(selectedRoleIndex, {
                            salary_per_head: val[0],
                          });
                          setSuccess(false);
                          setBudgetAlert(null);
                        }}
                      />
                    </div>

                    <div className="bg-slate-600/30 rounded-lg p-3">
                      <TooltipWrapper
                        label="Staffing Changes"
                        text="Change the number of employees in this role by hiring or firing"
                      />
                      <Slider
                        label={`Net: ${
                          (data.existingRoles[selectedRoleIndex]?.hires || 0) -
                          (data.existingRoles[selectedRoleIndex]?.fires || 0)
                        }`}
                        value={[
                          (data.existingRoles[selectedRoleIndex]?.hires || 0) -
                            (data.existingRoles[selectedRoleIndex]?.fires || 0),
                        ]}
                        min={
                          -data.existingRoles[selectedRoleIndex]
                            ?.current_head_count
                        }
                        max={50}
                        onValueChange={(val) => {
                          const netChange = Math.round(val[0]);
                          if (netChange >= 0) {
                            updateExistingRole(selectedRoleIndex, {
                              hires: netChange,
                              fires: 0,
                            });
                          } else {
                            updateExistingRole(selectedRoleIndex, {
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
              )}
            </div>
          </div>

          {/* New Roles Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold font-roboto-sans text-slate-100">
                Create New Positions
              </h3>
              <div className="flex items-center gap-2 ">
                <button
                  type="button"
                  onClick={() =>
                    addNewRole({
                      role_name: "",
                      salary_per_head: 50000,
                      hires: 1,
                    })
                  }
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm tracking-wide font-roboto-sans"
                >
                  <PlusCircle size={14} className="inline mr-1" />
                  Add Role
                </button>
                <span className="bg-green-500/20 text-green-300 px-2 py-1 font-medium rounded text-sm">
                  {data?.newRoles?.length || 0} New
                </span>
              </div>
            </div>

            {data?.newRoles?.length === 0 && (
              <div className="text-center py-4 bg-slate-700/30 rounded-lg border-2 border-dashed border-slate-600 mx-5">
                <p className="text-slate-400 text-sm tracking-wide font-semibold font-roboto-sans">
                  No new roles created yet
                </p>
              </div>
            )}

            <div className="space-y-3">
              {data?.newRoles?.map((role, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 shadow-md rounded-lg p-4 border border-slate-600 mx-5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg tracking-wide font-semibold font-geist-sans text-white">
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="text-m text-slate-300 mb-1 block tracking-wide font-semibold">
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
                        className="w-full p-3 rounded bg-slate-800 text-white tracking-wide font-semibold font-geist-sans border border-slate-500 focus:border-slate-300 focus:outline-none text-sm placeholder-slate-400 hover:bg-slate-700 transition-colors"
                      />
                    </div>

                    <div>
                      <TooltipWrapper
                        label="Salary"
                        text="Yearly pay for each person in this new job role"
                      />
                      <Slider
                        className="w-[200px]"
                        label={`${formatCurrency(
                          role.salary_per_head || 50000
                        )}`}
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
                      <TooltipWrapper
                        label="Headcount"
                        text="Number of people you want to hire for this new job role"
                      />
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
            <h3 className="text-lg tracking-wide font-semibold font-roboto-sans text-slate-100 mb-3">
              HR Budget & Culture
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-5">
              {/* Training Budget */}
              <div className="bg-slate-700/20 rounded-lg p-4 border border-slate-600">
                <TooltipWrapper
                  label="Training Budget"
                  text="Money you spend per year on teaching employees new skills and improving their abilities"
                />
                <Slider
                  label={`${formatCurrency(data?.training_budget || 0)}`}
                  value={
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
                <TooltipWrapper
                  label="Employee Satisfaction"
                  text="How happy your employees are working for your company"
                />
                <Slider
                  label={`${data?.employee_satisfaction?.toFixed(0)}%`}
                  value={[data?.employee_satisfaction || 0]}
                  isPercentage={true}
                  onValueChange={(val) => {
                    updateData({ employee_satisfaction: val[0] });
                    setSuccess(false);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Validation & Summary */}
          <div className="space-y-4">
            <div className="flex items-start justify-between relative mx-5">
              {/* Validation Messages (Left) */}
              <div className="space-y-2">
                {budgetAlert && (
                  <div className="bg-rose-900/80 border border-rose-600 text-rose-200 rounded-lg p-2">
                    <div className="flex items-center gap-2">
                      <TriangleAlert className="text-rose-400 h-4 w-4" />
                      <span className="text-sm">{budgetAlert}</span>
                    </div>
                  </div>
                )}
                {success && !budgetAlert && (
                  <div className="bg-green-900/80 border border-green-500 text-green-100 rounded-lg p-2">
                    <div className="flex items-center gap-2">
                      <Check className="text-green-400 h-4 w-4" />
                      <span className="text-sm font-semibold font-roboto-sans">
                        All HR decisions validated successfully!
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Validation Button (Fixed Right Corner) */}
              <div>
                <button
                  type="button"
                  onClick={handleValidate}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold font-roboto-sans tracking-wide transition-all"
                >
                  <Check className="h-4 w-4 inline mr-2" />
                  Validate HR Decisions
                </button>
              </div>
            </div>

            {/* Summary Section */}
            <div className="bg-slate-800/50 shadow-md rounded-lg p-4 border border-slate-500 mx-5">
              <h4 className="text-lg tracking-wide font-semibold font-roboto-sans text-white mb-3">
                Financial Impact Summary
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                <div className="bg-slate-600/40 rounded-lg p-3">
                  <p className="text-slate-300 text-xs tracking-wide font-semibold font-electrolize mb-1">
                    Salary Budget
                  </p>
                  <p className="text-lg font-bold font-geist-sans text-yellow-400">
                    {formatCurrency(projectedSalaryBudget || 0)}
                  </p>
                </div>
                <div className="bg-slate-600/40 rounded-lg p-3">
                  <p className="text-slate-300 text-xs tracking-wide font-semibold font-electrolize mb-1">
                    Training Budget
                  </p>
                  <p className="text-lg font-bold font-geist-sans text-blue-400">
                    {formatCurrency(data?.training_budget || 0)}
                  </p>
                </div>
                <div className="bg-slate-600/40 rounded-lg p-3">
                  <p className="text-slate-300 text-xs tracking-wide font-semibold font-electrolize mb-1">
                    Available Cash
                  </p>
                  <p className="text-lg font-bold font-geist-sans text-blue-300">
                    {formatCurrency(cashBalance.originalCashBalance || 0)}
                  </p>
                </div>

                <div className="bg-slate-600/40 rounded-lg p-3">
                  <p className="text-slate-300 text-xs mb-1 tracking-wide font-semibold font-electrolize">
                    Cash After HR
                  </p>
                  <p
                    className={`text-lg font-bold font-geist-sans ${
                      (projectedCashBalance || 0) < 0
                        ? "text-red-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {formatCurrency(projectedCashBalance || 0)}
                  </p>
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
