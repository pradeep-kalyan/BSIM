/*
  Warnings:

  - You are about to drop the column `cost_per_unit` on the `production` table. All the data in the column will be lost.
  - You are about to drop the column `units_produced` on the `production` table. All the data in the column will be lost.
  - Added the required column `production_capacity` to the `production` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storage_capacity` to the `production` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "production" DROP COLUMN "cost_per_unit",
DROP COLUMN "units_produced",
ADD COLUMN     "production_capacity" INTEGER NOT NULL,
ADD COLUMN     "storage_capacity" INTEGER NOT NULL;
