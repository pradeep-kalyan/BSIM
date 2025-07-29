-- AlterTable
ALTER TABLE `companies` ADD COLUMN `marketing_budget` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `current_period` INTEGER NOT NULL DEFAULT 0;
