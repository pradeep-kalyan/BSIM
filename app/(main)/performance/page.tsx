"use client";
import React from "react";

const Page = () => {
  return (
    <div className="p-8 bg-purple-500 h-full">
      <h1 className="text-white text-3xl font-bold mb-6">
        Performance Metrics
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Financial Performance</h2>
          <p>View your company's financial metrics and KPIs here.</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Operational Efficiency</h2>
          <p>Monitor your operational efficiency and productivity metrics.</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
