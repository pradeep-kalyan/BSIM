"use server";

import prisma from "../functions/prisma";

interface FinanceDecision {
  company_id: string;
  period: number;
  investment_amount: number;
  loan_amount: number;
  repay_loan: number;
  dividend_payout: number;
  equity_issue: number;
  notes?: string;
}

interface HistoricalFinanceData {
  period: number;
  total_revenue: number;
  net_profit: number;
  cash_balance: number;
  operating_costs: number;
  roi: number;
  burn_rate: number;
  investment_amount: number;
  loan_amount: number;
  repay_loan: number;
  dividend_payout: number;
  equity_issue: number;
}

export async function getCompanyData(companyId: string) {
  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        current_period: true,
        cash_balance: true,
      },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    return company;
  } catch (error) {
    console.error("Error fetching company data:", error);
    throw new Error("Failed to fetch company data");
  }
}

export async function getHistoricalFinanceData(
  companyId: string
): Promise<HistoricalFinanceData[]> {
  try {
    const financeData = await prisma.finance.findMany({
      where: { company_id: companyId },
      orderBy: { period: "asc" },
      select: {
        period: true,
        total_revenue: true,
        net_profit: true,
        cash_balance: true,
        operating_costs: true,
        roi: true,
        burn_rate: true,
        investment_amount: true,
        loan_amount: true,
        repay_loan: true,
        dividend_payout: true,
        equity_issue: true,
      },
    });

    return financeData;
  } catch (error) {
    console.error("Error fetching historical finance data:", error);
    throw new Error("Failed to fetch historical finance data");
  }
}

export async function getCurrentFinanceDecision(
  companyId: string,
  period: number
) {
  try {
    const decision = await prisma.finance.findFirst({
      where: {
        company_id: companyId,
        period: period,
      },
      select: {
        investment_amount: true,
        loan_amount: true,
        repay_loan: true,
        dividend_payout: true,
        equity_issue: true,
        notes: true,
        total_revenue: true,
        net_profit: true,
        cash_balance: true,
        operating_costs: true,
        roi: true,
        burn_rate: true,
      },
    });

    return decision;
  } catch (error) {
    console.error("Error fetching current finance decision:", error);
    return null;
  }
}

export async function submitFinanceDecisionForPeriod(
  decision: FinanceDecision
) {
  try {
    // Validate inputs
    if (
      decision.investment_amount < 0 ||
      decision.loan_amount < 0 ||
      decision.repay_loan < 0 ||
      decision.dividend_payout < 0 ||
      decision.equity_issue < 0
    ) {
      throw new Error("All financial amounts must be non-negative");
    }

    return await prisma.$transaction(async (tx) => {
      // Get company data
      const company = await tx.company.findUnique({
        where: { id: decision.company_id },
        select: { cash_balance: true },
      });

      if (!company) {
        throw new Error("Company not found");
      }

      // Calculate net cash flow
      const cashInflow = decision.loan_amount + decision.equity_issue;
      const cashOutflow =
        decision.investment_amount +
        decision.repay_loan +
        decision.dividend_payout;
      const netCashFlow = cashInflow - cashOutflow;

      // Check if company has sufficient cash for outflows
      if (company.cash_balance + cashInflow < cashOutflow) {
        throw new Error("Insufficient cash balance for planned transactions");
      }

      // Check if existing decision exists
      const existingDecision = await tx.finance.findFirst({
        where: {
          company_id: decision.company_id,
          period: decision.period,
        },
      });

      if (existingDecision) {
        // Calculate the difference in cash flow for updating
        const previousInflow =
          existingDecision.loan_amount + existingDecision.equity_issue;
        const previousOutflow =
          existingDecision.investment_amount +
          existingDecision.repay_loan +
          existingDecision.dividend_payout;
        const previousNetFlow = previousInflow - previousOutflow;

        const cashFlowDelta = netCashFlow - previousNetFlow;

        // Check if company has sufficient cash for the delta
        if (company.cash_balance < -cashFlowDelta && cashFlowDelta < 0) {
          throw new Error("Insufficient cash balance for updated decision");
        }

        // Update company cash balance
        if (cashFlowDelta !== 0) {
          await tx.company.update({
            where: { id: decision.company_id },
            data: {
              cash_balance: { increment: cashFlowDelta },
            },
          });
        }

        // Update existing decision
        await tx.finance.update({
          where: { id: existingDecision.id },
          data: {
            investment_amount: decision.investment_amount,
            loan_amount: decision.loan_amount,
            repay_loan: decision.repay_loan,
            dividend_payout: decision.dividend_payout,
            equity_issue: decision.equity_issue,
            notes: decision.notes,
          },
        });

        return existingDecision.id;
      } else {
        // Update company cash balance
        await tx.company.update({
          where: { id: decision.company_id },
          data: {
            cash_balance: { increment: netCashFlow },
          },
        });

        // Create new decision
        const newDecision = await tx.finance.create({
          data: {
            company_id: decision.company_id,
            period: decision.period,
            investment_amount: decision.investment_amount,
            loan_amount: decision.loan_amount,
            repay_loan: decision.repay_loan,
            dividend_payout: decision.dividend_payout,
            equity_issue: decision.equity_issue,
            notes: decision.notes || "",
          },
        });

        return newDecision.id;
      }
    });
  } catch (error) {
    console.error("Error in finance decision submission:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to submit finance decision"
    );
  }
}

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
