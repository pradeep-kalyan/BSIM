"use client";

import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface HRDecision {
  training_budget: number;
  salary_budget: number;
  hires: number;
  fires: number;
}

interface PerformanceResult {
  period: number;
  employee_satisfaction: number;
  salary_budget?: number;
  training_budget?: number;
  hires?: number;
  fires?: number;
}

export default function HRPage() {
  const [companyId, setCompanyId] = useState<string>("");
  const [currentPeriod, setCurrentPeriod] = useState<number>(0);
  const [formData, setFormData] = useState<HRDecision>({
    training_budget: 0,
    salary_budget: 0,
    hires: 0,
    fires: 0,
  });
  const [performanceHistory, setPerformanceHistory] = useState<PerformanceResult[]>([]);
  const [predictedSatisfaction, setPredictedSatisfaction] = useState<number>(0);

  useEffect(() => {
    const fetchCurrentContext = async () => {
      try {
        const res = await fetch("/api/simulation/current");
        const data = await res.json();
        console.log(data);
        
        if (!res.ok || !data.company_id || data.current_period === undefined) {
          toast.error("Simulation or company not selected.");
          return;
        }
        setCompanyId(data.company_id);
        setCurrentPeriod(data.current_period);
      } catch {
        toast.error("Failed to fetch simulation info.");
      }
    };
    fetchCurrentContext();
  }, []);

  useEffect(() => {
    if (!companyId) return;
    const fetchHRData = async () => {
      try {
        const res = await fetch(`/api/hr/kpis?company_id=${companyId}`);
        const data = await res.json();
        if (res.ok) setPerformanceHistory(data);
        else toast.error("Could not load HR history.");
      } catch {
        toast.error("Server error while loading HR data.");
      }
    };
    fetchHRData();
  }, [companyId]);

  useEffect(() => {
    const base = performanceHistory.at(-1)?.employee_satisfaction ?? 50;
    const predicted =
      base +
      formData.training_budget * 0.002 +
      formData.salary_budget * 0.001 +
      formData.hires * 1 -
      formData.fires * 2;

    const clamped = Math.max(0, Math.min(100, parseFloat(predicted.toFixed(2))));
    setPredictedSatisfaction(clamped);
  }, [formData, performanceHistory]);

  const handleSubmit = async () => {
    if (!companyId || currentPeriod === undefined) {
      toast.error("No company or period context.");
      return;
    }

    if (
      formData.salary_budget < 0 ||
      formData.training_budget < 0 ||
      formData.hires < 0 ||
      formData.fires < 0 ||
      isNaN(formData.salary_budget) ||
      isNaN(formData.training_budget)
    ) {
      toast.error("Please enter valid non-negative values.");
      return;
    }

    const allZero = Object.values(formData).every((val) => val === 0);
    if (allZero) {
      toast.error("Please enter at least one non-zero value.");
      return;
    }

    try {
      const res = await fetch("/api/hr/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          company_id: companyId,
          period: currentPeriod,
          employee_satisfaction: predictedSatisfaction,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("HR decision submitted.");

        setPerformanceHistory((prev) => {
          const updated = prev.filter((item) => item.period !== currentPeriod);
          return [
            ...updated,
            {
              period: currentPeriod,
              employee_satisfaction: predictedSatisfaction,
              ...formData,
            },
          ];
        });

        resetForm();
      } else {
        toast.error(result.message || "Save failed.");
      }
    } catch {
      toast.error("Error saving HR decision.");
    }
  };

  const resetForm = () => {
    setFormData({
      salary_budget: 0,
      training_budget: 0,
      hires: 0,
      fires: 0,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ToastContainer position="top-right" />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">HR Decision Panel</h1>
          <p className="text-gray-600 mt-2">Manage employee satisfaction through strategic HR decisions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Decision Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Current Period: {currentPeriod}</h2>

              <div className="space-y-6">
                {/* Budget Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">Budget Allocation</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Training Budget
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={formData.training_budget}
                        onChange={(e) =>
                          setFormData({ ...formData, training_budget: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary Budget
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={formData.salary_budget}
                        onChange={(e) =>
                          setFormData({ ...formData, salary_budget: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Staffing Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">Staffing Changes</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hires
                      </label>
                      <input
                        type="number"
                        value={formData.hires}
                        onChange={(e) =>
                          setFormData({ ...formData, hires: parseInt(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fires
                      </label>
                      <input
                        type="number"
                        value={formData.fires}
                        onChange={(e) =>
                          setFormData({ ...formData, fires: parseInt(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Prediction Display */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm text-blue-600 font-medium mb-1">Predicted Employee Satisfaction</div>
                  <div className="text-2xl font-bold text-blue-900">{predictedSatisfaction}%</div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save Decisions
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Charts and Data */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chart Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Employee Satisfaction Trend</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="period"
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="employee_satisfaction"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Decision History</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Satisfaction
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Salary Budget
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Training Budget
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hires
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fires
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {performanceHistory.map((row, index) => (
                      <tr key={`${row.period}-${index}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {row.period}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {row.employee_satisfaction.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {row.salary_budget ? `$${row.salary_budget.toLocaleString()}` : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {row.training_budget ? `$${row.training_budget.toLocaleString()}` : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {row.hires ?? "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {row.fires ?? "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}