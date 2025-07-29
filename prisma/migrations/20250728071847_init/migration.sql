-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'user',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `simulations` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `config` VARCHAR(191) NOT NULL DEFAULT '{}',
    `current_period` INTEGER NOT NULL DEFAULT 0,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `created_by` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `simulations_created_by_idx`(`created_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `companies` (
    `id` VARCHAR(191) NOT NULL,
    `simulation_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `logo_url` VARCHAR(191) NULL,
    `cash_balance` DOUBLE NOT NULL DEFAULT 0,
    `current_period` INTEGER NOT NULL DEFAULT 1,
    `data` VARCHAR(191) NOT NULL DEFAULT '{}',
    `total_assets` DOUBLE NOT NULL DEFAULT 0,
    `total_liabilities` DOUBLE NOT NULL DEFAULT 0,
    `credit_rating` VARCHAR(191) NULL,
    `brand_value` DOUBLE NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `companies_simulation_id_idx`(`simulation_id`),
    INDEX `companies_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `simulation_access` (
    `id` VARCHAR(191) NOT NULL,
    `simulation_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `access_level` VARCHAR(191) NOT NULL DEFAULT 'viewer',
    `granted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `simulation_access_simulation_id_idx`(`simulation_id`),
    INDEX `simulation_access_user_id_idx`(`user_id`),
    UNIQUE INDEX `simulation_access_simulation_id_user_id_key`(`simulation_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company_access` (
    `id` VARCHAR(191) NOT NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `access_level` VARCHAR(191) NOT NULL DEFAULT 'viewer',
    `granted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `company_access_company_id_idx`(`company_id`),
    INDEX `company_access_user_id_idx`(`user_id`),
    UNIQUE INDEX `company_access_company_id_user_id_key`(`company_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` VARCHAR(191) NOT NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `category` VARCHAR(191) NOT NULL,
    `quality_rating` DOUBLE NOT NULL DEFAULT 0,
    `innovation_rating` DOUBLE NOT NULL DEFAULT 0,
    `sustainability_rating` DOUBLE NOT NULL DEFAULT 0,
    `production_cost` DOUBLE NOT NULL DEFAULT 0,
    `selling_price` DOUBLE NOT NULL DEFAULT 0,
    `inventory_level` INTEGER NOT NULL DEFAULT 0,
    `production_capacity` INTEGER NOT NULL DEFAULT 2000,
    `development_cost` DOUBLE NOT NULL DEFAULT 0,
    `marketing_budget` DOUBLE NOT NULL DEFAULT 0,
    `status` VARCHAR(191) NOT NULL DEFAULT 'development',
    `launch_period` INTEGER NULL,
    `discontinue_period` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `products_name_key`(`name`),
    INDEX `products_company_id_idx`(`company_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `finance` (
    `id` VARCHAR(191) NOT NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `period` INTEGER NOT NULL,
    `total_revenue` DOUBLE NOT NULL DEFAULT 0,
    `net_profit` DOUBLE NOT NULL DEFAULT 0,
    `cash_balance` DOUBLE NOT NULL DEFAULT 0,
    `operating_costs` DOUBLE NOT NULL DEFAULT 0,
    `roi` DOUBLE NOT NULL DEFAULT 0,
    `burn_rate` DOUBLE NOT NULL DEFAULT 0,
    `finalised` BOOLEAN NOT NULL DEFAULT false,
    `investment_amount` DOUBLE NOT NULL DEFAULT 0,
    `loan_amount` DOUBLE NOT NULL DEFAULT 0,
    `repay_loan` DOUBLE NOT NULL DEFAULT 0,
    `dividend_payout` DOUBLE NOT NULL DEFAULT 0,
    `equity_issue` DOUBLE NOT NULL DEFAULT 0,
    `notes` VARCHAR(191) NULL,
    `processed` BOOLEAN NOT NULL DEFAULT false,
    `submitted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `processed_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `finance_company_id_idx`(`company_id`),
    INDEX `finance_user_id_idx`(`user_id`),
    UNIQUE INDEX `finance_company_id_period_key`(`company_id`, `period`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `production` (
    `id` VARCHAR(191) NOT NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `period` INTEGER NOT NULL,
    `units_produced` INTEGER NOT NULL,
    `cost_per_unit` INTEGER NOT NULL,
    `inventory_value` INTEGER NOT NULL,
    `defect_rate` INTEGER NOT NULL,
    `finalised` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hr_decisions` (
    `id` VARCHAR(191) NOT NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `period` INTEGER NOT NULL,
    `is_submitted` BOOLEAN NOT NULL DEFAULT false,
    `submitted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `salary_budget` DOUBLE NOT NULL DEFAULT 0,
    `training_budget` DOUBLE NOT NULL DEFAULT 0,
    `total_budget` DOUBLE NOT NULL DEFAULT 0,
    `employee_satisfaction` DOUBLE NOT NULL DEFAULT 0,
    `recruitment_cost` DOUBLE NOT NULL DEFAULT 0,
    `firing_cost` DOUBLE NOT NULL DEFAULT 0,

    INDEX `hr_decisions_company_id_idx`(`company_id`),
    UNIQUE INDEX `hr_decisions_company_id_period_key`(`company_id`, `period`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hr_role_decisions` (
    `id` VARCHAR(191) NOT NULL,
    `hr_decision_id` VARCHAR(191) NOT NULL,
    `role_name` VARCHAR(191) NOT NULL,
    `salary_per_head` DOUBLE NOT NULL,
    `head_count` INTEGER NOT NULL,

    INDEX `hr_role_decisions_hr_decision_id_idx`(`hr_decision_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rd` (
    `id` VARCHAR(191) NOT NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `period` INTEGER NOT NULL,
    `budget` INTEGER NOT NULL,
    `pip` INTEGER NOT NULL,
    `time_to_market` INTEGER NOT NULL,
    `total_development` INTEGER NOT NULL,
    `patented` INTEGER NOT NULL,
    `quality_changes` INTEGER NOT NULL,
    `finalised` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `marketing` (
    `id` VARCHAR(191) NOT NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `period` INTEGER NOT NULL,
    `budget` INTEGER NOT NULL,
    `offline` INTEGER NOT NULL,
    `online` INTEGER NOT NULL,
    `roi` INTEGER NOT NULL,
    `conversion_rate` INTEGER NOT NULL,
    `finalised` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_performances` (
    `id` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `period` INTEGER NOT NULL,
    `data` VARCHAR(191) NOT NULL DEFAULT '{}',
    `sales_volume` INTEGER NOT NULL DEFAULT 0,
    `revenue` DOUBLE NOT NULL DEFAULT 0,
    `costs` DOUBLE NOT NULL DEFAULT 0,
    `profit` DOUBLE NOT NULL DEFAULT 0,
    `market_share` DOUBLE NOT NULL DEFAULT 0,
    `customer_satisfaction` DOUBLE NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `product_performances_product_id_idx`(`product_id`),
    UNIQUE INDEX `product_performances_product_id_period_key`(`product_id`, `period`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
