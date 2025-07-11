"use client";
import React from "react";

const Page = () => {
  return (
    <div className="p-8 bg-green-500 h-full">
      <h1 className="text-white text-3xl font-bold mb-6">Market Analysis</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Market Trends</h2>
          <p>Analyze current market trends and consumer behavior.</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Competitor Analysis</h2>
          <p>Monitor your competitors and their market strategies.</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Market Opportunities</h2>
          <p>Discover new market opportunities and potential growth areas.</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
