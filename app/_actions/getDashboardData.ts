"use server";

import prisma from "../functions/prisma";
import { getFinancialHistory } from "./getFinancialHistory";
import { getProductPerformance } from "./getProductPerformance";
import { getHRMetrics } from "./getHRMetrics";
import { getProductionData } from "./getProductionData";

export const getDashboardData = async ({ comID }: { comID: string }) => {
  const company = await prisma.company.findUnique({
    where: {
      id: comID,
    },
    include: {
      simulation: true,
      products: true,
    },
  });

  if (!company) {
    return {
      company: null,
      activeProductsCount: 0,
      hr_decision: null,
      finance_decision: null,
      marketing_decision: null,
      rd_decision: null,
      production_decision: null,
      financialHistory: [],
      productPerformance: [],
      hrMetrics: [],
      productionData: [],
    };
  }

  const activeProductsCount =
    company?.products.filter((product) => product.status === "Active").length ||
    0;
  const hr_decision = await prisma.hr_decision.findUnique({
    where: {
      company_id_period: {
        company_id: comID,
        period: company?.current_period ?? 0,
      },
    },
  });

  const finance_decision = await prisma.finance.findUnique({
    where: {
      company_id_period: {
        company_id: comID,
        period: company?.current_period ?? 1,
      },
    },
  });

  const marketing_decision = await prisma.marketing.findUnique({
    where: {
      company_id_period: {
        company_id: comID,
        period: company?.current_period ?? 1,
      },
    },
  });

  const rd_decision = await prisma.rd.findUnique({
    where: {
      company_id_period: {
        company_id: comID,
        period: company?.current_period ?? 1,
      },
    },
  });

  const production_decision = await prisma.production.findUnique({
    where: {
      company_id_period: {
        company_id: comID,
        period: company?.current_period ?? 1,
      },
    },
  });

  return {
    company,
    activeProductsCount,
    hr_decision,
    finance_decision,
    marketing_decision,
    rd_decision,
    production_decision,
    financialHistory: await getFinancialHistory(comID, 5),
    productPerformance: await getProductPerformance(comID),
    hrMetrics: await getHRMetrics(comID),
    productionData: await getProductionData(comID, 5),
  };
};
