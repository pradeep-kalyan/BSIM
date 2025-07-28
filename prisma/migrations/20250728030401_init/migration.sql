/*
  Warnings:

  - You are about to drop the `Marketing` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Production` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rd` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Marketing" DROP CONSTRAINT "Marketing_company_id_fkey";

-- DropForeignKey
ALTER TABLE "Production" DROP CONSTRAINT "Production_company_id_fkey";

-- DropForeignKey
ALTER TABLE "Rd" DROP CONSTRAINT "Rd_company_id_fkey";

-- DropTable
DROP TABLE "Marketing";

-- DropTable
DROP TABLE "Production";

-- DropTable
DROP TABLE "Rd";

-- CreateTable
CREATE TABLE "production" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "units_produced" INTEGER NOT NULL,
    "cost_per_unit" INTEGER NOT NULL,
    "inventory_value" INTEGER NOT NULL,
    "defect_rate" INTEGER NOT NULL,
    "finalised" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "production_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rd" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "budget" INTEGER NOT NULL,
    "pip" INTEGER NOT NULL,
    "time_to_market" INTEGER NOT NULL,
    "total_development" INTEGER NOT NULL,
    "patented" INTEGER NOT NULL,
    "quality_changes" INTEGER NOT NULL,
    "finalised" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "budget" INTEGER NOT NULL,
    "offline" INTEGER NOT NULL,
    "online" INTEGER NOT NULL,
    "roi" INTEGER NOT NULL,
    "conversion_rate" INTEGER NOT NULL,
    "finalised" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_name_key" ON "products"("name");

-- AddForeignKey
ALTER TABLE "production" ADD CONSTRAINT "production_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rd" ADD CONSTRAINT "rd_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing" ADD CONSTRAINT "marketing_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
