-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "config" TEXT NOT NULL DEFAULT '{}',
    "current_period" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "simulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "simulation_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logo_url" TEXT,
    "cash_balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "current_period" INTEGER NOT NULL DEFAULT 1,
    "data" TEXT NOT NULL DEFAULT '{}',
    "total_assets" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_liabilities" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "marketing_budget" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "credit_rating" TEXT,
    "brand_value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_histories" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "cash_balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "data" TEXT NOT NULL DEFAULT '{}',
    "total_assets" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_liabilities" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "marketing_budget" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "credit_rating" TEXT,
    "brand_value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulation_access" (
    "id" TEXT NOT NULL,
    "simulation_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "access_level" TEXT NOT NULL DEFAULT 'viewer',
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "simulation_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_access" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "access_level" TEXT NOT NULL DEFAULT 'viewer',
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "quality_rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "innovation_rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sustainability_rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "production_cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "selling_price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "inventory_level" INTEGER NOT NULL DEFAULT 0,
    "production_capacity" INTEGER NOT NULL DEFAULT 2000,
    "development_cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "marketing_budget" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'development',
    "launch_period" INTEGER,
    "discontinue_period" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "user_id" TEXT,
    "period" INTEGER NOT NULL,
    "total_revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "net_profit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cash_balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "operating_costs" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "roi" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "burn_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "finalised" BOOLEAN NOT NULL DEFAULT false,
    "investment_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "loan_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "repay_loan" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dividend_payout" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "equity_issue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "units_to_produce" INTEGER NOT NULL,
    "cost_per_unit" INTEGER NOT NULL,
    "budget" INTEGER NOT NULL DEFAULT 0,
    "production_capacity" INTEGER NOT NULL DEFAULT 0,
    "storage_capacity" INTEGER DEFAULT 0,
    "inventory_value" INTEGER NOT NULL,
    "defect_rate" INTEGER NOT NULL,
    "finalised" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "production_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hr_decisions" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "is_submitted" BOOLEAN NOT NULL DEFAULT false,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "salary_budget" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "training_budget" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_budget" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "employee_satisfaction" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "recruitment_cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "firing_cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_employee_count" INTEGER DEFAULT 0,

    CONSTRAINT "hr_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hr_role_decisions" (
    "id" TEXT NOT NULL,
    "hr_decision_id" TEXT NOT NULL,
    "role_name" TEXT NOT NULL,
    "salary_per_head" DOUBLE PRECISION NOT NULL,
    "head_count" INTEGER NOT NULL,

    CONSTRAINT "hr_role_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rd" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "budget" INTEGER NOT NULL,
    "pip" INTEGER NOT NULL,
    "time_to_market" INTEGER NOT NULL,
    "total_development" INTEGER NOT NULL,
    "patented" INTEGER NOT NULL,
    "quality_changes" INTEGER NOT NULL,
    "finalised" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "budget" INTEGER NOT NULL,
    "offline" INTEGER NOT NULL,
    "online" INTEGER NOT NULL,
    "finalised" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_performances" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "data" TEXT NOT NULL DEFAULT '{}',
    "sales_volume" INTEGER NOT NULL DEFAULT 0,
    "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "costs" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "profit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "market_share" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "customer_satisfaction" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_performances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "simulations_created_by_idx" ON "simulations"("created_by");

-- CreateIndex
CREATE INDEX "companies_simulation_id_idx" ON "companies"("simulation_id");

-- CreateIndex
CREATE INDEX "companies_user_id_idx" ON "companies"("user_id");

-- CreateIndex
CREATE INDEX "company_histories_company_id_idx" ON "company_histories"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "company_histories_company_id_period_key" ON "company_histories"("company_id", "period");

-- CreateIndex
CREATE INDEX "simulation_access_simulation_id_idx" ON "simulation_access"("simulation_id");

-- CreateIndex
CREATE INDEX "simulation_access_user_id_idx" ON "simulation_access"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "simulation_access_simulation_id_user_id_key" ON "simulation_access"("simulation_id", "user_id");

-- CreateIndex
CREATE INDEX "company_access_company_id_idx" ON "company_access"("company_id");

-- CreateIndex
CREATE INDEX "company_access_user_id_idx" ON "company_access"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "company_access_company_id_user_id_key" ON "company_access"("company_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_name_key" ON "products"("name");

-- CreateIndex
CREATE INDEX "products_company_id_idx" ON "products"("company_id");

-- CreateIndex
CREATE INDEX "finance_company_id_idx" ON "finance"("company_id");

-- CreateIndex
CREATE INDEX "finance_user_id_idx" ON "finance"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "finance_company_id_period_key" ON "finance"("company_id", "period");

-- CreateIndex
CREATE INDEX "production_company_id_idx" ON "production"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "production_company_id_period_key" ON "production"("company_id", "period");

-- CreateIndex
CREATE INDEX "hr_decisions_company_id_idx" ON "hr_decisions"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "hr_decisions_company_id_period_key" ON "hr_decisions"("company_id", "period");

-- CreateIndex
CREATE INDEX "hr_role_decisions_hr_decision_id_idx" ON "hr_role_decisions"("hr_decision_id");

-- CreateIndex
CREATE INDEX "rd_company_id_idx" ON "rd"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "rd_company_id_period_key" ON "rd"("company_id", "period");

-- CreateIndex
CREATE INDEX "marketing_company_id_idx" ON "marketing"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "marketing_company_id_period_key" ON "marketing"("company_id", "period");

-- CreateIndex
CREATE INDEX "product_performances_product_id_idx" ON "product_performances"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_performances_product_id_period_key" ON "product_performances"("product_id", "period");
