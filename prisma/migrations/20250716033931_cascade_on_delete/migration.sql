-- DropForeignKey
ALTER TABLE "simulation_access" DROP CONSTRAINT "simulation_access_simulation_id_fkey";

-- DropForeignKey
ALTER TABLE "simulation_access_request" DROP CONSTRAINT "simulation_access_request_simulation_id_fkey";

-- AddForeignKey
ALTER TABLE "simulation_access" ADD CONSTRAINT "simulation_access_simulation_id_fkey" FOREIGN KEY ("simulation_id") REFERENCES "simulations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulation_access_request" ADD CONSTRAINT "simulation_access_request_simulation_id_fkey" FOREIGN KEY ("simulation_id") REFERENCES "simulations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
