-- CreateTable
CREATE TABLE `hr_decisions` (
    `id` VARCHAR(191) NOT NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `period` INTEGER NOT NULL,
    `training_budget` DOUBLE NOT NULL DEFAULT 0,
    `salary_budget` DOUBLE NOT NULL DEFAULT 0,
    `hires` INTEGER NOT NULL DEFAULT 0,
    `fires` INTEGER NOT NULL DEFAULT 0,
    `submitted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `hr_decisions_company_id_period_key`(`company_id`, `period`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `hr_decisions` ADD CONSTRAINT `hr_decisions_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
