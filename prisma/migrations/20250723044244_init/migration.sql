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
    "current_period" INTEGER NOT NULL DEFAULT 0,
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
    "credit_rating" TEXT,
    "brand_value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "decisions" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "decision_data" TEXT NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "processed_at" TIMESTAMP(3),

    CONSTRAINT "decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_conditions" (
    "id" TEXT NOT NULL,
    "simulation_id" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "data" TEXT NOT NULL DEFAULT '{}',
    "total_market_size" DOUBLE PRECISION NOT NULL,
    "segment_distribution" TEXT NOT NULL,
    "economic_indicators" TEXT NOT NULL,
    "consumer_preferences" TEXT NOT NULL,
    "technology_trends" TEXT NOT NULL,
    "sustainability_importance" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "market_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_results" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "data" TEXT NOT NULL DEFAULT '{}',
    "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "costs" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "profit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "market_share" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cash_flow" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "roi" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "customer_satisfaction" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "employee_satisfaction" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sustainability_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "innovation_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "brand_value_change" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "performance_results_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "simulation_id" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "impact_area" TEXT NOT NULL,
    "impact_strength" DOUBLE PRECISION NOT NULL,
    "affected_companies" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_decisions" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "investmentAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "loanAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "repayLoan" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dividendPayout" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "equityIssue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget_requests" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "department" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "budget_requests_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "simulation_access_simulation_id_user_id_key" ON "simulation_access"("simulation_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "company_access_company_id_user_id_key" ON "company_access"("company_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "market_conditions_simulation_id_period_key" ON "market_conditions"("simulation_id", "period");

-- CreateIndex
CREATE UNIQUE INDEX "performance_results_company_id_period_key" ON "performance_results"("company_id", "period");

-- CreateIndex
CREATE UNIQUE INDEX "product_performances_product_id_period_key" ON "product_performances"("product_id", "period");

-- CreateIndex
CREATE UNIQUE INDEX "finance_decisions_companyId_period_key" ON "finance_decisions"("companyId", "period");

-- CreateIndex
CREATE UNIQUE INDEX "budget_requests_companyId_period_department_key" ON "budget_requests"("companyId", "period", "department");

-- CreateIndex
CREATE UNIQUE INDEX "hr_decisions_company_id_period_key" ON "hr_decisions"("company_id", "period");
