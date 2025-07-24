"use server";
import { prisma } from "@/app/functions/prisma";

export async function getFinancialSummary(companyId: string) {
  const result = await prisma.$queryRawUnsafe<
    { period: string; revenue: number; expenses: number }[]
  >(`
    SELECT
      CASE
        WHEN period BETWEEN 1 AND 3 THEN 'Q1'
        WHEN period BETWEEN 4 AND 6 THEN 'Q2'
        WHEN period BETWEEN 7 AND 9 THEN 'Q3'
        WHEN period BETWEEN 10 AND 12 THEN 'Q4'
        ELSE 'Other'
      END AS period,
      SUM(revenue) AS revenue,
      SUM(costs) AS expenses
    FROM performance_results
    WHERE company_id = '${companyId}'
    GROUP BY period
    ORDER BY period;
  `);

  return result;
}
