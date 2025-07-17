-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_simulation_id_fkey";

-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_user_id_fkey";

-- DropForeignKey
ALTER TABLE "company_access" DROP CONSTRAINT "company_access_user_id_fkey";

-- DropForeignKey
ALTER TABLE "decisions" DROP CONSTRAINT "decisions_company_id_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_simulation_id_fkey";

-- DropForeignKey
ALTER TABLE "market_conditions" DROP CONSTRAINT "market_conditions_simulation_id_fkey";

-- DropForeignKey
ALTER TABLE "performance_results" DROP CONSTRAINT "performance_results_company_id_fkey";

-- DropForeignKey
ALTER TABLE "product_performances" DROP CONSTRAINT "product_performances_product_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_company_id_fkey";

-- DropForeignKey
ALTER TABLE "simulation_access" DROP CONSTRAINT "simulation_access_user_id_fkey";

-- DropForeignKey
ALTER TABLE "simulations" DROP CONSTRAINT "simulations_created_by_fkey";

-- AddForeignKey
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_simulation_id_fkey" FOREIGN KEY ("simulation_id") REFERENCES "simulations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulation_access" ADD CONSTRAINT "simulation_access_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_access" ADD CONSTRAINT "company_access_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market_conditions" ADD CONSTRAINT "market_conditions_simulation_id_fkey" FOREIGN KEY ("simulation_id") REFERENCES "simulations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_results" ADD CONSTRAINT "performance_results_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_performances" ADD CONSTRAINT "product_performances_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_simulation_id_fkey" FOREIGN KEY ("simulation_id") REFERENCES "simulations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
