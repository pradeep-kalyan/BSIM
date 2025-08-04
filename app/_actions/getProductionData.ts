"use server";

import prisma from "../functions/prisma";

export const getProductionData = async (comID: string, periods: number = 5) => {
  const company = await prisma.company.findUnique({
    where: { id: comID },
    select: { current_period: true },
  });

  if (!company) return [];

  const currentPeriod = company.current_period;
  const startPeriod = Math.max(1, currentPeriod - periods + 1);

  const productionData = await prisma.production.findMany({
    where: {
      company_id: comID,
      period: {
        gte: startPeriod,
        lte: currentPeriod,
      },
    },
    orderBy: { period: "asc" },
  });

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return productionData.map((data, index) => ({
    month: months[index % 12] || `P${data.period}`,
    produced: data.units_to_produce,
    defects: Math.round(data.units_to_produce * (data.defect_rate / 100)),
    efficiency: Math.max(90, 100 - data.defect_rate), // Convert defect rate to efficiency
  }));
};
