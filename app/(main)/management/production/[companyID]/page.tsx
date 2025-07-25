import prisma from "@/app/functions/prisma";
import ProductionDashboard from "./ProductionDashboard";
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

  return (
    <div className="flex flex-col items-start justify-start min-h-screen bg-gray-100">
      <div className="w-full bg-white shadow-sm border-b">
        <h1 className="p-5 text-gray-800 text-2xl font-bold">
          Production Dashboard
        </h1>
      </div>
      <ProductionDashboard company={company} />
    </div>
  );
};

export default page;
