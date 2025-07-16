/*
  Warnings:

  - You are about to drop the column `current_period` on the `simulations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "current_period" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "data" TEXT NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "market_conditions" ADD COLUMN     "data" TEXT NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "performance_results" ADD COLUMN     "data" TEXT NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "product_performances" ADD COLUMN     "data" TEXT NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "simulations" DROP COLUMN "current_period";
