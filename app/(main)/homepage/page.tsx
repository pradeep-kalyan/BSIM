"use client";
import React from "react";

const Page = () => {
  return (
    <div className="p-8 bg-blue-500 h-full">
      <h1 className="text-white text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Business Overview</h2>
          <p>
            Welcome to your business dashboard. Here you can monitor your
            company's performance.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          <p>Your recent business activities will appear here.</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <p>Access frequently used features and actions from here.</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
