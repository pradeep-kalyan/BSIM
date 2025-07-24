/*
  Warnings:

  - You are about to drop the column `created_at` on the `simulation_access` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `simulation_access` table. All the data in the column will be lost.
  - You are about to drop the `marketing_decisions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `production_decisions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rnd_decisions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `finance_decisions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_simulation_id_fkey";

-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_user_id_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_simulation_id_fkey";

-- DropForeignKey
ALTER TABLE "finance_decisions" DROP CONSTRAINT "finance_decisions_companyId_fkey";

-- DropForeignKey
ALTER TABLE "hr_decisions" DROP CONSTRAINT "hr_decisions_company_id_fkey";

-- DropForeignKey
ALTER TABLE "hr_role_decisions" DROP CONSTRAINT "hr_role_decisions_hr_decision_id_fkey";

-- DropForeignKey
ALTER TABLE "market_conditions" DROP CONSTRAINT "market_conditions_simulation_id_fkey";

-- DropForeignKey
ALTER TABLE "marketing_decisions" DROP CONSTRAINT "marketing_decisions_companyId_fkey";

-- DropForeignKey
ALTER TABLE "performance_results" DROP CONSTRAINT "performance_results_company_id_fkey";

-- DropForeignKey
ALTER TABLE "product_performances" DROP CONSTRAINT "product_performances_product_id_fkey";

-- DropForeignKey
ALTER TABLE "production_decisions" DROP CONSTRAINT "production_decisions_company_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_company_id_fkey";

-- DropForeignKey
ALTER TABLE "rnd_decisions" DROP CONSTRAINT "rnd_decisions_companyId_fkey";

-- DropForeignKey
ALTER TABLE "simulation_access" DROP CONSTRAINT "simulation_access_simulation_id_fkey";

-- DropForeignKey
ALTER TABLE "simulation_access" DROP CONSTRAINT "simulation_access_user_id_fkey";

-- DropForeignKey
ALTER TABLE "simulations" DROP CONSTRAINT "simulations_created_by_fkey";

-- AlterTable
ALTER TABLE "companies" ALTER COLUMN "current_period" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "finance_decisions" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "simulation_access" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "simulations" ADD COLUMN     "current_period" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "marketing_decisions";

-- DropTable
DROP TABLE "production_decisions";

-- DropTable
DROP TABLE "rnd_decisions";

-- CreateTable
CREATE TABLE "company_access" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "access_level" TEXT NOT NULL DEFAULT 'viewer',
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decisions" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "decision_data" TEXT NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "processed_at" TIMESTAMP(3),

    CONSTRAINT "decisions_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "company_access_company_id_user_id_key" ON "company_access"("company_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "budget_requests_companyId_period_department_key" ON "budget_requests"("companyId", "period", "department");
