-- AlterTable
ALTER TABLE `companies` MODIFY `current_period` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `simulations` MODIFY `current_period` INTEGER NOT NULL DEFAULT 1;
