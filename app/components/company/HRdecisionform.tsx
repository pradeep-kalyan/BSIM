"use client";

import React from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { Props } from "@/app/types/HR";

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
    <div>
      <h3 className="text-xl font-semibold text-slate-200 flex items-center gap-2 mb-3">
        HR Roles
        <button
          type="button"
          onClick={onAddRole}
          className="text-blue-400 hover:text-blue-500 transition"
        >
          <div className="flex items-center gap-2">
            <PlusCircle size={20} />
            <span>Add</span>
          </div>
        </button>
      </h3>

      {hrRoles.map((role, index) => (
        <div key={index} className="grid grid-cols-3 gap-4 mb-4 items-end">
          {/* Role Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Role
            </label>
            <input
              type="text"
              placeholder="Role Name"
              value={role.role_name}
              onChange={(e) => {
                const input = e.target.value;
                if (/^[A-Za-z\s]*$/.test(input)) {
                  onRoleChange(index, "role_name", input);
                }
              }}
              className={`w-full p-2 rounded bg-slate-800 text-white `}
            />
          </div>

          {/* Salary per Head */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Salary
            </label>
            <input
              type="number"
              placeholder="Salary per Head"
              value={role.salary_per_head}
              onChange={(e) =>
                onRoleChange(index, "salary_per_head", e.target.value)
              }
              min="0"
              step="0.01"
              className="w-full p-2 rounded bg-slate-800 text-white"
            />
          </div>

          {/* Head Count + Delete Button */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Count
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Head Count"
                value={role.head_count}
                onChange={(e) =>
                  onRoleChange(index, "head_count", e.target.value)
                }
                min="0"
                className="p-2 rounded bg-slate-800 text-white w-full"
              />
              <button
                type="button"
                onClick={() => onRemoveRole(index)}
                className="text-red-400 hover:text-red-500"
                disabled={hrRoles.length === 1}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Salary Budget (Auto)
          </label>
          <input
            type="number"
            value={totalSalary}
            readOnly
            className="w-full p-2 rounded bg-slate-700 text-white opacity-60 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Training Budget
          </label>
          <input
            type="number"
            value={trainingBudget}
            onChange={(e) =>
              onTrainingBudgetChange(parseFloat(e.target.value) || 0)
            }
            min="0"
            step="0.01"
            className="w-full p-2 rounded bg-slate-800 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Total HR Budget
          </label>
          <input
            type="number"
            value={totalBudget}
            readOnly
            className="w-full p-2 rounded bg-slate-700 text-white opacity-60 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Employee Satisfaction (0–100)
          </label>
          <input
            type="number"
            value={employeeSatisfaction}
            onChange={(e) =>
              onEmployeeSatisfactionChange(parseFloat(e.target.value) || 0)
            }
            min="0"
            max="100"
            step="0.01"
            className="w-full p-2 rounded bg-slate-800 text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default HRDecisionForm;
