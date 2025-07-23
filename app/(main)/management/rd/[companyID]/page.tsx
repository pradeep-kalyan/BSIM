"use client";

import React, { useState } from "react";
import DevelopmentCostsTab from "../components/DevelopmentCostsTab";
import InnovationMetricsTab from "../components/InnovationMetricsTab";
import ProductPipelineTab from "../components/ProductPipelineTab";
import DecisionTab from "../../_components/DecisionTab"; // Adjust if needed

export default function RandDPage() {
  const [activeTab, setActiveTab] = useState("development");

  // Mock data for props — replace with real data later
  const costData = [
    { name: "Project A", budget: 50000, spent: 30000 },
    { name: "Project B", budget: 75000, spent: 52000 },
    { name: "Project C", budget: 62000, spent: 43000 },
  ];

  const rdProjects = [
    { id: 1, name: "Alpha", budget: 50000, launchPeriod: "Q3 2025" },
    { id: 2, name: "Beta", budget: 75000, launchPeriod: "Q1 2026" },
    { id: 3, name: "Gamma", budget: 62000, launchPeriod: "Q4 2025" },
  ];

  const innovationData = [
    { month: "Jan", score: 75, timeToMarket: 7.2, roi: 23 },
    { month: "Feb", score: 78, timeToMarket: 7.0, roi: 25 },
    { month: "Mar", score: 82, timeToMarket: 6.8, roi: 28 },
  ];

  const pipelineStages = [
    { name: "Ideation", value: 3 },
    { name: "Prototype", value: 2 },
    { name: "Testing", value: 1 },
    { name: "Launch", value: 2 },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "development":
        return <DevelopmentCostsTab costData={costData} rdProjects={rdProjects} />;
      case "innovation":
        return <InnovationMetricsTab innovationData={innovationData} />;
      case "pipeline":
        return <ProductPipelineTab rdProjects={rdProjects} pipelineStages={pipelineStages} />;
      case "decision":
        return <DecisionTab />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">R&D Dashboard</h1>

      <div className="flex space-x-4 mb-6">
        {[
          { key: "development", label: "Development Costs" },
          { key: "innovation", label: "Innovation Metrics" },
          { key: "pipeline", label: "Product Pipeline" },
          { key: "decision", label: "Decision" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded font-medium ${
              activeTab === tab.key ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>{renderTabContent()}</div>
    </div>
  );
}
