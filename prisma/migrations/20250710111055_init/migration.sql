-- DropForeignKey
ALTER TABLE "simulations" DROP CONSTRAINT "simulations_created_by_fkey";

-- AddForeignKey
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
