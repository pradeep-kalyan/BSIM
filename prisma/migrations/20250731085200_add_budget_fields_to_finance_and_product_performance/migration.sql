-- AlterTable
ALTER TABLE "finance" ADD COLUMN     "budget" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "product_performances" ADD COLUMN     "budget" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "production" ADD COLUMN     "budget" INTEGER NOT NULL DEFAULT 0;
