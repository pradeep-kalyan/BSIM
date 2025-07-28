/*
  Warnings:

  - A unique constraint covering the columns `[company_id,period]` on the table `marketing` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[company_id,period]` on the table `production` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[company_id,period]` on the table `rd` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "marketing_company_id_idx" ON "marketing"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "marketing_company_id_period_key" ON "marketing"("company_id", "period");

-- CreateIndex
CREATE INDEX "production_company_id_idx" ON "production"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "production_company_id_period_key" ON "production"("company_id", "period");

-- CreateIndex
CREATE INDEX "rd_company_id_idx" ON "rd"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "rd_company_id_period_key" ON "rd"("company_id", "period");
