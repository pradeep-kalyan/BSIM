"use server";

import prisma from "../functions/prisma";

export const getProductPerformance = async (comID: string, period?: number) => {
  const company = await prisma.company.findUnique({
    where: { id: comID },
    select: { current_period: true },
  });

  if (!company) return [];

  const targetPeriod = period || company.current_period;

  const productPerformances = await prisma.product_performance.findMany({
    where: {
      period: targetPeriod,
      product: {
        company_id: comID,
        status: "Active",
      },
    },
    include: {
      product: {
        select: {
          name: true,
          quality_rating: true,
        },
      },
    },
  });

  return productPerformances.map((perf) => ({
    name: perf.product.name,
    sales: perf.sales_volume,
    revenue: perf.revenue,
    marketShare: perf.market_share,
    satisfaction: perf.customer_satisfaction,
  }));
};
