/*
  Warnings:

  - Added the required column `userId` to the `finance_decisions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companies" ALTER COLUMN "current_period" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "finance_decisions" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "budget_requests" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "department" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "budget_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "budget_requests_companyId_period_department_key" ON "budget_requests"("companyId", "period", "department");
