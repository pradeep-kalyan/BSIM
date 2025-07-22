-- CreateTable
CREATE TABLE "finance_decisions" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "investmentAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "loanAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "repayLoan" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dividendPayout" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "equityIssue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "finance_decisions_companyId_period_key" ON "finance_decisions"("companyId", "period");
