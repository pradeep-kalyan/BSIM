"use client";

import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Lightbulb, Clock, TrendingUp } from "lucide-react";

export default function InnovationMetricsTab({ innovationData }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Innovation Score */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
          <div className="flex items-center gap-3 text-purple-400 mb-3">
            <Lightbulb />
            <h3 className="font-medium">Innovation Score</h3>
          </div>
          <p className="text-3xl font-bold text-white">82/100</p>
          <p className="text-green-400 text-sm">+7 from last month</p>
        </div>
        {/* Time-to-Market */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
          <div className="flex items-center gap-3 text-blue-400 mb-3">
            <Clock />
            <h3 className="font-medium">Time to Market</h3>
          </div>
          <p className="text-3xl font-bold text-white">6.8 months</p>
          <p className="text-green-400 text-sm">-0.4 months</p>
        </div>
        {/* ROI */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
          <div className="flex items-center gap-3 text-green-400 mb-3">
            <TrendingUp />
            <h3 className="font-medium">R&D ROI</h3>
          </div>
          <p className="text-3xl font-bold text-white">28%</p>
          <p className="text-green-400 text-sm">+3%</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700">
        <h2 className="text-xl font-semibold mb-6 text-white">Innovation Trends</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={innovationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#8B5CF6" strokeWidth={3} />
            <Line type="monotone" dataKey="timeToMarket" stroke="#3B82F6" strokeWidth={3} />
            <Line type="monotone" dataKey="roi" stroke="#10B981" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
