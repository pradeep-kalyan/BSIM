"use client";
import Card from "@/ui/Card";
import { company, product } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

const HomePage = ({ company }: { company: company }) => {
  return (
    <div className="mx-auto h-full w-full overflow-auto bg-slate-900 text-white text-xl font-medium p-8 flex flex-col">
      <div className="bg-[#1f2937] flex justify-between items-center rounded-lg w-full h-fit p-8">
        <h1>{company?.name.toUpperCase()}</h1>
        <button className="text-lg bg-blue-400 hover:bg-blue-500 rounded-xl cursor-pointer p-3">
          Advance to next period
        </button>
      </div>
      <div className="w-full h-auto bg-[#1f2937] rounded-lg p-8 mt-6">
        <h2 className="text-2xl font-semibold">Financial Overview</h2>
        <hr className="m-3 text-gray-500" />
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4 w-full h-fit p-8">
          <Card
            width={"300px"}
            height={"150px"}
            title={"Cash Balance"}
            content={company?.cash_balance}
            contentColor={"#89baf4"}
            color={"#1e3a8a"}
          />
          <Card
            width={"300px"}
            height={"150px"}
            title={"Total Assets"}
            content={company?.total_assets}
            contentColor={"#76da9a"}
            color={"#14532d"}
          />
          <Card
            width={"300px"}
            height={"150px"}
            title={"Total Liabilities"}
            content={company?.total_liabilities}
            contentColor={"#d47a7a"}
            color={"#7f1d1d"}
          />
        </div>
      </div>
      {/* //products */}
      <div className=" rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Quality
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Inventory
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {company?.products?.map((product: product) => (
                <tr key={product.id}>
                  <td className="py-2 px-4 border-b border-gray-200 text-black">
                    {product.name}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-black">
                    {product.category.charAt(0).toUpperCase() +
                      product.category.slice(1)}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-black">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.status === "active"
                          ? "bg-green-100 text-green-800"
                          : product.status === "development"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.status.charAt(0).toUpperCase() +
                        product.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-black">
                    {product.quality_rating.toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-black">
                    ${product.selling_price}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-black">
                    {product.inventory_level}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-black">
                    <button className="text-blue-600 hover:text-blue-900 mr-2 text-[16px] cursor-pointer">
                      Produce
                    </button>
                    <button className="text-green-600 hover:text-green-900 mr-2 text-[16px] cursor-pointer">
                      Adjust Price
                    </button>
                    <button className="text-purple-600 hover:text-purple-900 text-[16px] cursor-pointer">
                      Marketing
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <button
            onClick={() => redirect("/products/create")}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Develop New Product
          </button>
        </div>
        <div className="w-full h-auto bg-[#1f2937] rounded-lg p-8 mt-6">
          <h2 className="text-2xl font-semibold">Market Overview</h2>
          <hr className="m-3 text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
