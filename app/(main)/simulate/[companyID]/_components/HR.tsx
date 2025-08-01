"use client";

import React from "react";
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
import { ToastContainer } from "react-toastify";
import {
  useCashBalance,
  useHRForm,
  useHRInitialization,
} from "@/app/context/FormContext";
import { useSimulation } from "@/app/context/SimulationContext";

const HRDashboard = () => {
  const { data, updateData, updateExistingRole, updateNewRole } = useHRForm();
  const { cashBalance } = useCashBalance();
  const { period } = useSimulation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-2">
      <ToastContainer position="top-right" />

      {/* Metrics Skeleton */}
      <div className="max-w-7xl mx-auto mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 mb-2">
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 h-28"
            ></div>
          ))}
        </div>

        {/* HR Decision UI Skeleton */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl py-4 px-10 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-2">
            HR Decision - Period {period}
          </h2>

          {/* Existing Roles Skeleton */}
          <div className="mb-3">
            <h3 className="text-xl font-semibold text-slate-200 mb-4">
              Existing Roles {data?.existingRoles[0]?.current_head_count}
            </h3>
            <div className="overflow-x-auto border border-slate-600 px-8 pt-2 mx-4 rounded-lg h-40 bg-slate-700/40"></div>
          </div>

          {/* New Roles Skeleton */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-200">
                Add New Roles
              </h3>
              <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                <PlusCircle size={20} />
                Add Role
              </button>
            </div>
            <div className="ml-4 pt-2 space-y-4">
              {[...Array(1)].map((_, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-4 items-end">
                  {[...Array(3)].map((__, i) => (
                    <div
                      key={i}
                      className="p-3 rounded bg-slate-700 h-12 border border-slate-600"
                    ></div>
                  ))}
                  <div className="flex items-end">
                    <button className="text-red-400 hover:text-red-300 p-2">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget and Satisfaction Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 mx-4">
            {[...Array(2)].map((_, idx) => (
              <div
                key={idx}
                className="w-full h-14 p-3 rounded bg-slate-700 border border-slate-600"
              ></div>
            ))}
          </div>

          {/* Summary Skeleton */}
          <h4 className="text-lg font-semibold text-white mb-4 pt-2">
            Decision Summary - {data?.training_budget}
          </h4>
          <input
            type="number"
            value={data?.training_budget}
            onChange={(e) =>
              updateData({ training_budget: Number(e.target.value) })
            }
          />
          <div className="bg-slate-700/50 rounded-xl p-4 mb-3 mx-4 grid grid-cols-2 md:grid-cols-5 gap-4 h-20"></div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all">
              Preview Changes
            </button>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all">
              Submit HR Decision
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
