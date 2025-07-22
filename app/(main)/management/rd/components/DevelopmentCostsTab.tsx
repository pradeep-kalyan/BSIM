"use client";

import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { DollarSign, PiggyBank, TrendingUp } from "lucide-react";

export default function DevelopmentCostsTab({ costData, rdProjects }: any) {
  const totalBudget = rdProjects.reduce((sum: number, p: any) => sum + p.budget, 0);
  const totalSpent = costData.reduce((sum: number, c: any) => sum + c.spent, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Budget */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700">
          <div className="flex items-center gap-3 text-blue-400 mb-3">
            <DollarSign />
            <h3 className="font-medium">Total Budget</h3>
          </div>
          <p className="text-3xl font-bold text-white">${totalBudget.toLocaleString()}</p>
        </div>
        {/* Total Spent */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700">
          <div className="flex items-center gap-3 text-green-400 mb-3">
            <TrendingUp />
            <h3 className="font-medium">Total Spent</h3>
          </div>
          <p className="text-3xl font-bold text-white">${totalSpent.toLocaleString()}</p>
        </div>
        {/* Remaining */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700">
          <div className="flex items-center gap-3 text-orange-400 mb-3">
            <PiggyBank />
            <h3 className="font-medium">Remaining</h3>
          </div>
          <p className="text-3xl font-bold text-white">${(totalBudget - totalSpent).toLocaleString()}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700">
        <h2 className="text-xl font-semibold mb-4 text-white">Budget vs Spending</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={costData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="budget" fill="#3B82F6" name="Allocated Budget" />
            <Bar dataKey="spent" fill="#10B981" name="Spent" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
