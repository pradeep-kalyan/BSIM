/*
  Warnings:

  - You are about to drop the column `budget` on the `finance` table. All the data in the column will be lost.
  - You are about to drop the column `budget` on the `product_performances` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "finance" DROP COLUMN "budget";

-- AlterTable
ALTER TABLE "product_performances" DROP COLUMN "budget";
