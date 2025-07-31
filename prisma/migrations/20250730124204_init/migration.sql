/*
  Warnings:

  - You are about to drop the column `units_to_produced` on the `production` table. All the data in the column will be lost.
  - Added the required column `units_to_produce` to the `production` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "production" DROP COLUMN "units_to_produced",
ADD COLUMN     "units_to_produce" INTEGER NOT NULL;
