"use client";

import React from "react";
import { GitBranch } from "lucide-react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function ProductPipelineTab({ rdProjects, pipelineStages }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-xl">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
          <GitBranch className="w-5 h-5 text-purple-400" />
          Product Pipeline Overview
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-white mb-3">Pipeline Stages</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pipelineStages}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pipelineStages.map((entry: any, index: number) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-lg font-medium text-white mb-3">Project Timeline</h3>
            <div className="space-y-4">
              {rdProjects.map((project: any) => (
                <div key={project.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-slate-700/30 rounded-r-lg">
                  <h4 className="text-white font-medium">{project.name}</h4>
                  <p className="text-slate-300 text-sm">Launch: {project.launchPeriod}</p>
                  <div className="w-full bg-slate-600 h-2 rounded-full mt-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.random() * 60 + 20}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
