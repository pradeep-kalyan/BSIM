import React from "react";
import ProductTabsInterface from "../../_components/ProductTabs";
import { prisma } from "@/app/functions/prisma";

const Page = async ({ params }: { params: Promise<{ companyID: string }> }) => {
  const { companyID } = await params;

  // Get company with current_period and all product performance data
  const company = await prisma.company.findUnique({
    where: { id: companyID },
    select: {
      current_period: true,
      products: {
        include: { product_performances: true },
      },
    },
  });

  // Get all products with their performance data
  const allProducts = await prisma.product.findMany({
    where: {
      company_id: companyID,
    },
    include: {
      product_performances: {
        orderBy: { created_at: "desc" },
        take: 1, // Get the latest performance data
      },
    },
  });

  // Sort products by revenue (highest first) - include all products
  const RevenueProducts = [...allProducts].sort((a, b) => {
    const revenueA = a.product_performances[0]?.revenue || 0;
    const revenueB = b.product_performances[0]?.revenue || 0;
    return revenueB - revenueA;
  });

  // Sort products by units sold (highest first) - include all products
  const UnitsProducts = [...allProducts].sort((a, b) => {
    const unitsA = a.product_performances[0]?.sales_volume || 0;
    const unitsB = b.product_performances[0]?.sales_volume || 0;
    return unitsB - unitsA;
  });

  // Sort products by customer satisfaction (highest first) - include all products
  const RatingProducts = [...allProducts].sort((a, b) => {
    const satisfactionA = a.product_performances[0]?.customer_satisfaction || 0;
    const satisfactionB = b.product_performances[0]?.customer_satisfaction || 0;
    return satisfactionB - satisfactionA;
  });

  return (
    <div className="w-full min-h-screen px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Product Catalog</h1>
        <p className="text-slate-400">
          Manage and view your product portfolio and performance metrics
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/40 shadow-2xl p-4">
        <ProductTabsInterface
          products={company?.products ?? []}
          performance={
            company?.products?.flatMap(
              (product) => product.product_performances
            ) ?? []
          }
          RatingProducts={RatingProducts}
          RevenueProducts={RevenueProducts}
          UnitsProducts={UnitsProducts}
          company_id={companyID}
          current_period={company?.current_period ?? 1}
        />
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[15%] w-[250px] h-[250px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] -translate-x-1/2 -translate-y-1/2 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
    </div>
  );
};

export default Page;
