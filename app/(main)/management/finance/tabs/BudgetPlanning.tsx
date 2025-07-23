"use client";

import React, { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, CartesianGrid, XAxis, YAxis, Bar } from "recharts";

const initialBudgetData = [
  { name: "Marketing", amount: 50000, color: "#3B82F6" },
  { name: "Operations", amount: 80000, color: "#10B981" },
  { name: "R&D", amount: 70000, color: "#8B5CF6" },
  { name: "HR & Admin", amount: 30000, color: "#F59E0B" },
];

const BudgetPlanning = () => {
  const [budgetAllocations, setBudgetAllocations] = useState(initialBudgetData);
  const totalBudget = budgetAllocations.reduce((sum, dept) => sum + dept.amount, 0);

  const updateBudget = (deptIndex: number, amount: number) => {
    const updated = budgetAllocations.map((dept, idx) =>
      idx === deptIndex ? { ...dept, amount } : dept
    );
    setBudgetAllocations(updated);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {budgetAllocations.map((item, index) => {
          const percentage = ((item.amount / totalBudget) * 100).toFixed(1);
          return (
            <div key={index} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <h4 className="text-white text-lg font-semibold mb-2">{item.name}</h4>
              <input
                type="range"
                min={0}
                max={200000}
                step={1000}
                value={item.amount}
                onChange={(e) => updateBudget(index, Number(e.target.value))}
                className="w-full mb-2"
              />
              <p className="text-white text-sm">Budget: ${item.amount.toLocaleString()}</p>
              <p className="text-slate-400 text-sm">{percentage}% of total</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Budget Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={budgetAllocations} cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={5} dataKey="amount">
                {budgetAllocations.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${(Number(value) / 1000).toFixed(0)}K`, "Amount"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Department Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetAllocations}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip formatter={(value) => [`$${(Number(value) / 1000).toFixed(0)}K`, "Budget"]} />
              <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanning;
