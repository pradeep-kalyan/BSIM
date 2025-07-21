"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Calculator,
} from "lucide-react";

const tabs = [
  { name: "Budget Planning", icon: Calculator },
  { name: "Revenue & Expenses", icon: DollarSign },
  { name: "Cash Flow", icon: TrendingUp },
  { name: "Decisions", icon: PiggyBank },
];

const initialBudgetData = [
  { name: "Marketing", amount: 50000, color: "#3B82F6" },
  { name: "Operations", amount: 80000, color: "#10B981" },
  { name: "R&D", amount: 70000, color: "#8B5CF6" },
  { name: "HR & Admin", amount: 30000, color: "#F59E0B" },
];

const revenueExpenseData = [
  { period: "Q1", revenue: 280000, expenses: 200000 },
  { period: "Q2", revenue: 300000, expenses: 220000 },
  { period: "Q3", revenue: 320000, expenses: 240000 },
  { period: "Q4", revenue: 350000, expenses: 260000 },
];

const cashFlowData = [
  { month: "Jan", operating: 85000, investing: -45000, financing: 15000 },
  { month: "Feb", operating: 95000, investing: -50000, financing: 20000 },
  { month: "Mar", operating: 100000, investing: -50000, financing: 20000 },
  { month: "Apr", operating: 110000, investing: -55000, financing: 25000 },
];

const Page = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].name);
  const [budgetAllocations, setBudgetAllocations] = useState(initialBudgetData);

  const totalBudget = budgetAllocations.reduce((sum, dept) => sum + dept.amount, 0);

 const updateBudget = (deptIndex: number, amount: number) => {
  const updatedBudgets = budgetAllocations.map((dept, idx) =>
    idx === deptIndex ? { ...dept, amount } : dept
  );
  setBudgetAllocations(updatedBudgets);
};

  type StatCardProps = {
    title: string;
    value: string;
    change?: string;
    isPositive: boolean;
    icon: React.ComponentType<{ className?: string; size?: number }>;
  };

  const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive, icon: Icon }) => (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 ${isPositive ? "text-green-400" : "text-red-400"}`}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="ml-1 text-sm">{change}</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-blue-500/20 rounded-lg">
          <Icon className="text-blue-400" size={24} />
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "Budget Planning":
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
                    <Pie
                      data={budgetAllocations}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="amount"
                    >
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

      case "Revenue & Expenses":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Total Revenue" value="$300K" change="+12.5%" isPositive={true} icon={TrendingUp} />
              <StatCard title="Total Expenses" value="$220K" change="+8.2%" isPositive={false} icon={TrendingDown} />
              <StatCard title="Net Profit" value="$80K" change="+18.7%" isPositive={true} icon={DollarSign} />
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Revenue vs Expenses</h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={revenueExpenseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="period" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip formatter={(value) => [`$${(Number(value) / 1000).toFixed(0)}K`, "Amount"]} />
                  <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={0.6} fill="#10B981" />
                  <Area type="monotone" dataKey="expenses" stroke="#EF4444" fillOpacity={0.6} fill="#EF4444" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case "Cash Flow":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard title="Operating Activities" value="$100K" change="+15.2%" isPositive={true} icon={TrendingUp} />
              <StatCard title="Investing Activities" value="-$50K" change="Expected" isPositive={false} icon={TrendingDown} />
              <StatCard title="Financing Activities" value="$20K" change="+25.0%" isPositive={true} icon={DollarSign} />
              <StatCard title="Net Cash Flow" value="$70K" change="+12.8%" isPositive={true} icon={PiggyBank} />
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Cash Flow Activities</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip formatter={(value) => [`$${(Number(value) / 1000).toFixed(0)}K`, "Amount"]} />
                  <Bar dataKey="operating" fill="#10B981" name="Operating" />
                  <Bar dataKey="investing" fill="#EF4444" name="Investing" />
                  <Bar dataKey="financing" fill="#3B82F6" name="Financing" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case "Decisions":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl text-white">
              <h2 className="text-2xl font-bold mb-2">Strategic Finance Decisions</h2>
              <p className="opacity-90">Make informed decisions to optimize financial performance</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Budget Reallocation</h3>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
                  Increase Marketing by 20%
                </button>
              </div>
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Early Loan Repayment</h3>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg">
                  Pay Down Loan
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Finance Dashboard
          </h1>
          <p className="text-slate-400 mt-2">Essential financial analytics and decisions</p>
        </div>
        <div className="px-6 pb-2">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                    activeTab === tab.name
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
                  }`}
                >
                  <IconComponent size={18} className="mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="p-6">{renderTabContent()}</div>
    </div>
  );
};

export default Page;
