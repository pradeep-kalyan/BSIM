import prisma from "@/app/functions/prisma";
import Card from "@/ui/Card";
import React from "react";

const page = async ({ params }: { params: { companyID: string } }) => {
  const { companyID } = await params;

  const company = await prisma.company.findUnique({
    where: {
      id: companyID,
    },
    include: {
      products: {
        include: {
          product_performances: {
            orderBy: { period: "desc" },
            take: 5, // Last 5 periods
          },
        },
      },
      performance_results: {
        orderBy: { period: "desc" },
        take: 5,
      },
    },
  });

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-red-500 text-xl font-semibold">
          Company not found
        </h1>
        <p className="text-gray-500">
          The requested company could not be found.
        </p>
      </div>
    );
  }

  // Basic calculations
  const totalProducts = company.products.length;
  const activeProducts = company.products.filter(
    (p) => p.status === "active"
  ).length;
  const developmentProducts = company.products.filter(
    (p) => p.status === "development"
  ).length;

  const totalRevenue = company.products.reduce(
    (acc, product) =>
      acc + (product.selling_price || 0) * (product.inventory_level || 0),
    0
  );

  const totalProductionCost = company.products.reduce(
    (acc, product) => acc + (product.production_cost || 0),
    0
  );

  const totalInventory = company.products.reduce(
    (acc, product) => acc + (product.inventory_level || 0),
    0
  );

  const totalProductionCapacity = company.products.reduce(
    (acc, product) => acc + (product.production_capacity || 0),
    0
  );

  const totalDevelopmentCost = company.products.reduce(
    (acc, product) => acc + (product.development_cost || 0),
    0
  );

  const totalMarketingBudget = company.products.reduce(
    (acc, product) => acc + (product.marketing_budget || 0),
    0
  );

  // Quality metrics
  const averageQuality =
    company.products.length > 0
      ? company.products.reduce((acc, p) => acc + p.quality_rating, 0) /
        company.products.length
      : 0;

  const averageInnovation =
    company.products.length > 0
      ? company.products.reduce((acc, p) => acc + p.innovation_rating, 0) /
        company.products.length
      : 0;

  const averageSustainability =
    company.products.length > 0
      ? company.products.reduce((acc, p) => acc + p.sustainability_rating, 0) /
        company.products.length
      : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProductStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "development":
        return "bg-blue-500";
      case "discontinued":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex flex-col items-start justify-start min-h-screen bg-gray-100">
      <div className="w-full bg-white shadow-sm border-b">
        <h1 className="p-5 text-gray-800 text-2xl font-bold">
          Production Dashboard
        </h1>
      </div>

      <div className="w-full flex-1 bg-slate-900 text-white p-8 space-y-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">{company.name}</h2>
          <p className="text-gray-300 text-lg">
            Period {} | Cash:{" "}
            {formatCurrency(company.cash_balance)}
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Card
            title="Total Products"
            content={totalProducts.toString()}
            width={280}
            height={120}
            contentColor="#89baf4"
            color="#1e3a8a"
          />
          <Card
            title="Active Products"
            content={activeProducts.toString()}
            width={280}
            height={120}
            contentColor="#76da9a"
            color="#14532d"
          />
          <Card
            title="In Development"
            content={developmentProducts.toString()}
            width={280}
            height={120}
            contentColor="#fbbf24"
            color="#d97706"
          />
          <Card
            title="Production Capacity"
            content={totalProductionCapacity.toLocaleString()}
            width={280}
            height={120}
            contentColor="#76da9a"
            color="#14532d"
          />
          <Card
            title="Current Inventory"
            content={totalInventory.toLocaleString()}
            width={280}
            height={120}
            contentColor="#c084fc"
            color="#581c87"
          />
          <Card
            title="Capacity Utilization"
            content={`${
              totalProductionCapacity > 0
                ? Math.round((totalInventory / totalProductionCapacity) * 100)
                : 0
            }%`}
            width={280}
            height={120}
            contentColor="#c084fc"
            color="#581c87"
          />
          <Card
            title="Avg Quality Rating"
            content={averageQuality.toFixed(1)}
            width={280}
            height={120}
            contentColor="#10b981"
            color="#064e3b"
          />
          <Card
            title="Innovation Score"
            content={averageInnovation.toFixed(1)}
            width={280}
            height={120}
            contentColor="#3b82f6"
            color="#1e3a8a"
          />
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Financial Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Potential Revenue:</span>
                <span className="text-green-400 font-semibold">
                  {formatCurrency(totalRevenue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Production Costs:</span>
                <span className="text-red-400 font-semibold">
                  {formatCurrency(totalProductionCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Development Costs:</span>
                <span className="text-red-400 font-semibold">
                  {formatCurrency(totalDevelopmentCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Marketing Budget:</span>
                <span className="text-yellow-400 font-semibold">
                  {formatCurrency(totalMarketingBudget)}
                </span>
              </div>
              <hr className="border-gray-600" />
              <div className="flex justify-between text-lg font-bold">
                <span>Net Profit Potential:</span>
                <span
                  className={
                    totalRevenue - totalProductionCost - totalDevelopmentCost >=
                    0
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {formatCurrency(
                    totalRevenue - totalProductionCost - totalDevelopmentCost
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Quality Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Average Quality</span>
                  <span className="font-semibold">
                    {averageQuality.toFixed(1)}/10
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(averageQuality / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Innovation Rating</span>
                  <span className="font-semibold">
                    {averageInnovation.toFixed(1)}/10
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(averageInnovation / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Sustainability</span>
                  <span className="font-semibold">
                    {averageSustainability.toFixed(1)}/10
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-400 h-2 rounded-full"
                    style={{ width: `${(averageSustainability / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Portfolio */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Product Portfolio</h3>
          {company.products.length === 0 ? (
            <p className="text-gray-400">
              No products found. Create your first product to get started.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-2">Product</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Category</th>
                    <th className="text-left py-2">Inventory</th>
                    <th className="text-left py-2">Capacity</th>
                    <th className="text-left py-2">Price</th>
                    <th className="text-left py-2">Quality</th>
                    <th className="text-left py-2">Launch Period</th>
                  </tr>
                </thead>
                <tbody>
                  {company.products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-700">
                      <td className="py-2 font-medium">{product.name}</td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${getProductStatusColor(
                            product.status
                          )} text-white`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="py-2 text-gray-300">{product.category}</td>
                      <td className="py-2">
                        {product.inventory_level.toLocaleString()}
                      </td>
                      <td className="py-2">
                        {product.production_capacity.toLocaleString()}
                      </td>
                      <td className="py-2">
                        {formatCurrency(product.selling_price || 0)}
                      </td>
                      <td className="py-2">
                        {product.quality_rating.toFixed(1)}/10
                      </td>
                      <td className="py-2">{product.launch_period || "TBD"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Production Planning */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Production Planning</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {company.products.map((product) => (
              <div key={product.id} className="bg-slate-700 rounded-lg p-4">
                <h4 className="font-semibold mb-2">{product.name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Current Stock:</span>
                    <span>{product.inventory_level.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Capacity:</span>
                    <span>{product.production_capacity.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Utilization:</span>
                    <span>
                      {product.production_capacity > 0
                        ? Math.round(
                            (product.inventory_level /
                              product.production_capacity) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${
                          product.production_capacity > 0
                            ? Math.min(
                                (product.inventory_level /
                                  product.production_capacity) *
                                  100,
                                100
                              )
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Conditions Impact */}
       
      </div>
    </div>
  );
};

export default page;
