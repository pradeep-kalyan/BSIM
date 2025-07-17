/*
  Warnings:

  - You are about to drop the `simulation_access_request` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "simulation_access_request" DROP CONSTRAINT "simulation_access_request_requested_by_id_fkey";

-- DropForeignKey
ALTER TABLE "simulation_access_request" DROP CONSTRAINT "simulation_access_request_simulation_id_fkey";

-- DropTable
DROP TABLE "simulation_access_request";

-- CreateTable
CREATE TABLE "company_access" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "access_level" TEXT NOT NULL DEFAULT 'viewer',
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_access_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_access_company_id_user_id_key" ON "company_access"("company_id", "user_id");

-- AddForeignKey
ALTER TABLE "company_access" ADD CONSTRAINT "company_access_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_access" ADD CONSTRAINT "company_access_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
