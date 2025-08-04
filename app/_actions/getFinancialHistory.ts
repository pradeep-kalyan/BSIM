"use server";

import prisma from "../functions/prisma";

export const getFinancialHistory = async (
  comID: string,
  periods: number = 5
) => {
  const company = await prisma.company.findUnique({
    where: { id: comID },
    select: { current_period: true },
  });

  if (!company) return [];

  const currentPeriod = company.current_period;
  const startPeriod = Math.max(1, currentPeriod - periods + 1);

  const financialData = await prisma.finance.findMany({
    where: {
      company_id: comID,
      period: {
        gte: startPeriod,
        lte: currentPeriod,
      },
    },
    orderBy: { period: "asc" },
    select: {
      period: true,
      total_revenue: true,
      net_profit: true,
      cash_balance: true,
    },
  });

  return financialData.map((data) => ({
    period: `P${data.period}`,
    revenue: data.total_revenue,
    profit: data.net_profit,
    costs: data.total_revenue - data.net_profit,
  }));
};
