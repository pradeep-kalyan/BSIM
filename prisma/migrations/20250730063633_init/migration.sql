/*
  Warnings:

  - You are about to drop the column `product_capacity` on the `production` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "production" DROP COLUMN "product_capacity",
ADD COLUMN     "production_capacity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "storage_capacity" INTEGER DEFAULT 0;
