"use client";

import React from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { CustomInput } from "@/app/ui/CustomInput";

interface HRRole {
  role_name: string;
  salary_per_head: number;
  head_count: number;
}

interface Props {
  hrRoles: HRRole[];
  onRoleChange: (index: number, field: string, value: string | number) => void;
  onAddRole: () => void;
  onRemoveRole: (index: number) => void;
  trainingBudget: number;
  onTrainingBudgetChange: (value: number) => void;
  employeeSatisfaction: number;
  onEmployeeSatisfactionChange: (value: number) => void;
}

const HRDecisionForm = ({
  hrRoles,
  onRoleChange,
  onAddRole,
  onRemoveRole,
  trainingBudget,
  onTrainingBudgetChange,
  employeeSatisfaction,
  onEmployeeSatisfactionChange,
}: Props) => {
  const totalSalary = hrRoles.reduce(
    (acc, r) => acc + r.salary_per_head * r.head_count,
    0
  );
  const totalBudget = totalSalary + trainingBudget;

  return (
    <div className="space-y-8">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-slate-100">HR Roles</h3>
        <button
          type="button"
          onClick={onAddRole}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors shadow-sm"
        >
          <PlusCircle size={18} />
          Add Role
        </button>
      </div>

      {/* Roles Section */}
      <div className="space-y-5">
        {hrRoles.map((role, index) => (
          <div
            key={index}
            className="grid md:grid-cols-4 gap-4 items-end bg-slate-800 p-5 rounded-lg border border-slate-700"
          >
            {/* Role Name */}
            <CustomInput
              label="Role"
              value={role.role_name}
              onChange={(val) => {
                if (/^[A-Za-z\s]*$/.test(String(val))) {
                  onRoleChange(index, "role_name", val);
                }
              }}
              isText
              required
              placeholder="Role Name"
            />

            {/* Salary per Head */}
            <CustomInput
              label="Salary per Head"
              value={role.salary_per_head}
              onChange={(val) =>
                onRoleChange(index, "salary_per_head", Number(val))
              }
              isCurrency
              currencySymbol="₹"
              min={0}
              step={1000}
              required
            />

            {/* Head Count */}
            <CustomInput
              label="Head Count"
              value={role.head_count}
              onChange={(val) => onRoleChange(index, "head_count", Number(val))}
              isNumeric
              min={0}
              required
            />

            {/* Delete Button */}
            <div className="flex justify-end md:justify-start">
              <button
                type="button"
                onClick={() => onRemoveRole(index)}
                className="flex items-center justify-center w-full text-red-500 cursor-pointer md:w-auto px-3 py-2 rounded-lg disabled:opacity-50"
                disabled={hrRoles.length === 1}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Budgets & Satisfaction Section */}
      <div className="grid md:grid-cols-2 gap-6 bg-slate-900 p-6 rounded-lg border border-slate-700">
        <CustomInput
          label="Salary Budget (Auto)"
          value={totalSalary}
          onChange={() => {}}
          isCurrency
          readOnly
          currencySymbol="₹"
        />

        <CustomInput
          label="Training Budget"
          value={trainingBudget}
          onChange={(val) => onTrainingBudgetChange(Number(val))}
          isCurrency
          currencySymbol="₹"
          min={0}
          step={1000}
          required
        />

        <CustomInput
          label="Total HR Budget"
          value={totalBudget}
          onChange={() => {}}
          isCurrency
          currencySymbol="₹"
          readOnly
        />

        <CustomInput
          label="Employee Satisfaction"
          value={employeeSatisfaction}
          onChange={(val) => onEmployeeSatisfactionChange(Number(val))}
          isPercentage
          min={0}
          max={100}
          step={1}
          required
        />
      </div>
    </div>
  );
};

export default HRDecisionForm;
