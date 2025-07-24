"use client";

import React, { useState, useEffect } from "react";
import { Calculator, DollarSign, TrendingUp, PiggyBank } from "lucide-react";
import BudgetPlanning from "../tabs/BudgetPlanning";
import RevenueExpenses from "../tabs/RevenueExpenses";
import CashFlow from "../tabs/CashFlow";
import DecisionTab from "../../_components/DecisionTab";
import { getFinancialSummary } from "@/app/_actions/finance";

const tabs = [
  { name: "Budget Planning", icon: Calculator },
  { name: "Revenue & Expenses", icon: DollarSign },
  { name: "Cash Flow", icon: TrendingUp },
  { name: "Decisions", icon: PiggyBank },
];

const FinanceDashboard = ({ companyId }: { companyId: string }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].name);
  const [summaryData, setSummaryData] = useState<any>(null);

  useEffect(() => {
    if (activeTab === "Revenue & Expenses") {
      getFinancialSummary(companyId).then(setSummaryData);
    }
  }, [activeTab, companyId]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "Budget Planning":
        return <BudgetPlanning />;
      case "Revenue & Expenses":
  if (!summaryData) return <div className="text-slate-400">Loading revenue data...</div>;
  return <RevenueExpenses data={summaryData} />;

      case "Cash Flow":
        return <CashFlow />;
      case "Decisions":
        return <DecisionTab />;
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
          <p className="text-slate-400 mt-2">
            Essential financial analytics and decisions
          </p>
        </div>
        <div className="px-6 pb-2">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
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
                  <Icon size={18} className="mr-2" />
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

export default FinanceDashboard;
