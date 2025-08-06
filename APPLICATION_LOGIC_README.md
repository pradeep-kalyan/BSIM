# Business Simulation Platform - Application Logic

## Overview

A comprehensive multi-company business simulation system where users make strategic decisions across 8 business functions and see real-time financial impact over multiple periods.

### Core Features

- **Period-Based Simulation**: Discrete time periods for decision-making
- **Multi-Department Management**: HR, Marketing, R&D, Production, Finance, Products, Sales
- **Real-time Cash Flow**: Live financial calculations and validation
- **Comparative Analytics**: Multi-company performance tracking

## Technology Stack

- **Frontend**: Next.js 15, React, TypeScript, Material-UI, Recharts
- **Backend**: Next.js Server Actions, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Custom JWT-based auth

## Core Data Models

### Company Entity

```typescript
interface Company {
  id: string;
  name: string;
  cash_balance: number;
  current_period: number;
  total_assets: number;
  total_liabilities: number;
  marketing_budget: number;
  credit_rating: string;
  brand_value: number;
}
```

### Financial Records

```typescript
interface Finance {
  total_revenue: number;
  net_profit: number;
  cash_balance: number;
  operating_costs: number;
  roi: number;
  investment_amount: number;
  loan_amount: number;
  repay_loan: number;
  dividend_payout: number;
  equity_issue: number;
}
```

## Application Flow

### 1. Setup Process

1. **Authentication**: User login via JWT
2. **Simulation Creation**: Define simulation parameters
3. **Company Creation**: Create virtual companies with initial cash balance

### 2. Decision-Making Cycle (8 Sequential Steps)

1. **Human Resources** → Employee planning and budget allocation
2. **Marketing** → Campaign planning and channel allocation
3. **Research & Development** → Innovation investment and projects
4. **Production** → Capacity planning and quality management
5. **Products** → Portfolio management and pricing
6. **Sales** → Sales targets and market strategy
7. **Finance** → Investment, loans, and dividend decisions
8. **Preview & Submit** → Final review and atomic submission

### 3. Core Processing Logic

- **Real-time Validation**: Each form validates against business rules
- **Cash Flow Protection**: Prevents decisions exceeding available cash
- **Atomic Submission**: All decisions submitted in single transaction
- **Period Advancement**: Automatic progression to next period

## Financial Engine

### Real-Time Cash Balance Calculation

```typescript
const projectedCashBalance = originalCashBalance - totalExpenses + totalIncome;

// Expenses include:
const totalExpenses =
  hrBudget +
  marketingBudget +
  rdBudget +
  productionBudget +
  investmentAmount +
  loanRepayment +
  dividendPayout;

// Income includes:
const totalIncome = salesRevenue + loanAmount + equityIssue;
```

### Key Financial Formulas

#### Revenue & Profit

```typescript
const revenue = salesVolume * sellingPrice;
const profit = revenue - (salesVolume * productionCost + operatingCosts);
const profitMargin = (profit / revenue) * 100;
const roi = (profit / totalCosts) * 100;
```

#### HR Budget Calculation

```typescript
const totalHRBudget =
  existingRoles.reduce((total, role) => {
    const adjustedHeadCount = role.currentHeadCount + role.hires - role.fires;
    return total + adjustedHeadCount * role.salaryPerHead;
  }, 0) +
  newRolesSalaryBudget +
  trainingBudget;
```

#### Production Metrics

```typescript
const totalProductionCost = unitsToProduceCode * costPerUnit;
const defectedUnits = Math.round((unitsToProduceConst * defectRate) / 100);
const efficiency = (unitsToProduceConst / productionCapacity) * 100;
```

## Form Management & Validation

### Real-Time Cash Tracking

```typescript
const useCashBalance = () => {
  const projectedCashBalance =
    originalCashBalance -
    hrBudgetImpact -
    marketingBudgetImpact -
    rdBudgetImpact -
    productionBudgetImpact -
    financeBudgetImpact +
    salesBudgetImpact;
};
```

### Business Rules Validation

- **Cash Flow**: No negative cash balance allowed
- **HR**: Employee counts cannot go negative after hires/fires
- **Marketing**: Online + Offline must equal total budget
- **Production**: Units cannot exceed capacity
- **Sales**: Market share must be 0-100%

### Comprehensive Submission Process

```typescript
const comprehensiveFormSubmission = async (companyId, formData) => {
  // Submit all business areas in parallel
  const results = await Promise.all([
    submitHRDecision(),
    submitMarketingDecision(),
    submitRDDecision(),
    submitProductionDecision(),
    submitFinanceDecision(),
    submitProductData(),
    submitSalesData(),
  ]);

  // Store history and advance period
  await storeHistoryAndAdvancePeriod();
};
```

## Period Advancement Engine

### State Transition Process

1. **Pre-Validation**: Ensure all required decisions completed
2. **Financial Calculation**: Calculate period-end financial position
3. **History Storage**: Store current state in `company_history` table
4. **Decision Recording**: Store all business decisions with period reference
5. **State Update**: Update company's current period and cash balance
6. **Reset**: Ready for next period's decisions

### Database Transaction

```typescript
await prisma.$transaction(async (tx) => {
  // Store company history
  await tx.company_history.create({
    data: { company_id: companyId, period: currentPeriod,
            cash_balance: company.cash_balance, ... }
  });

  // Update company for next period
  await tx.company.update({
    where: { id: companyId },
    data: { current_period: { increment: 1 }, cash_balance: projectedBalance }
  });
});
```

### Performance Calculation

```typescript
const calculatePeriodPerformance = (companyData, decisions) => {
  const revenue = calculateRevenue(decisions.sales, decisions.production);
  const costs = calculateCosts(decisions);
  const profit = revenue - costs;

  return {
    revenue,
    costs,
    profit,
    marketShare: calculateMarketShare(decisions.sales, decisions.marketing),
    roi: (profit / costs) * 100,
    cashFlow: revenue - costs,
  };
};
```

## Analytics & Dashboard

### Key Performance Indicators

- **Financial**: Revenue Growth, Profit Margins, ROI, Cash Position
- **Operational**: Production Efficiency, Employee Productivity, Market Share
- **Trend Analysis**: Period-over-period comparisons with percentage changes

### Real-Time Visualizations

- **Revenue & Profit Trend**: Area charts showing financial performance
- **Department Budget Allocation**: Pie charts for budget distribution
- **Production Metrics**: Bar charts for efficiency tracking
- **Product Performance**: Sales volume and market share analysis

### Trend Calculation

```typescript
const getPercentChange = (current, previous) => {
  if (previous === 0 || !previous) return undefined;
  return +(((current - previous) / previous) * 100).toFixed(1);
};
```

## Core Business Constraints

### Financial Rules

- No negative cash balances allowed
- All expenses must be covered by available funds
- Loan amounts limited by creditworthiness

### Operational Rules

- Production cannot exceed capacity
- Employee counts cannot go negative
- Market share capped at 100% total across companies

### Validation Framework

```typescript
const financeSchema = z.object({
  investment_amount: z.number().min(0),
  loan_amount: z.number().min(0),
  repay_loan: z.number().min(0),
  dividend_payout: z.number().min(0),
  equity_issue: z.number().min(0),
});
```

## Simulate Page - Data Flow & Logic

### Page Architecture

The simulate page (`/simulate/[companyID]`) is the core decision-making interface where users make strategic business decisions across 8 sequential steps. The page follows a wizard-based flow with real-time cash balance tracking.

### Data Flow Architecture

```
Page Load → Form Context Initialization → Step Navigation → Real-Time Calculations → Comprehensive Submission
```

### Step-by-Step Logic Flow

#### 1. **Page Initialization**

```typescript
// Main page component loads with company ID
const Page = async ({ params }: { params: Promise<{ companyID: string }> }) => {
  await getCurrentUser();
  const { companyID } = await params;
  return <Form companyId={companyID} />;
};
```

#### 2. **Form Context Setup**

The form uses React Context (`FormContext`) to manage state across all 8 steps:

```typescript
interface FormState {
  finance: FinanceFormData;
  marketing: MarketingFormData;
  production: ProductionFormData;
  hr: HRFormData;
  rd: RDFormData;
  sales: SalesFormData;
  product: ProductFormData[];
  cashBalance: CashBalanceState;
  projected_balance: number;
}
```

#### 3. **Real-Time Cash Balance Calculation**

Each form step updates cash balance impact in real-time:

```typescript
// Base cash balance calculation
const useCashBalance = () => {
  const projectedCashBalance =
    originalCashBalance -
    hrBudgetImpact -
    marketingBudgetImpact -
    rdBudgetImpact -
    productionBudgetImpact -
    financeBudgetImpact +
    salesBudgetImpact;
};

// Individual department calculations:
// HR Impact: salary_budget + training_budget + recruitment_cost + firing_cost
// Marketing Impact: total budget allocation
// R&D Impact: budget + total_development costs
// Production Impact: quality_investment + efficiency_upgrade + maintenance + safety + compliance
// Finance Impact: investment + loan_repayment + dividends - loan_amount - equity_issue
// Sales Impact: negative costs impact, positive revenue impact
```

### 8-Step Decision Process

#### Step 1: Human Resources (HR)

**Logic**: Manage workforce planning and budget allocation

```typescript
// HR Budget Calculation
const calculateHRBudget = () => {
  let salary_budget = 0;
  let recruitment_cost = 0;
  let firing_cost = 0;

  // Existing roles calculation
  existingRoles.forEach((role) => {
    const newHeadCount = role.current_head_count + role.hires - role.fires;
    salary_budget += newHeadCount * role.salary_per_head;
    recruitment_cost += role.hires * role.salary_per_head;
    firing_cost += role.fires * (role.salary_per_head / 12); // Severance
  });

  // New roles calculation
  newRoles.forEach((role) => {
    salary_budget += role.hires * role.salary_per_head;
    recruitment_cost += role.hires * role.salary_per_head;
  });

  return salary_budget + training_budget + recruitment_cost + firing_cost;
};
```

#### Step 2: Marketing

**Logic**: Plan marketing campaigns and budget allocation

```typescript
// Marketing Budget Validation
const validateMarketingBudget = (
  online: number,
  offline: number,
  total: number
) => {
  const isValidSplit = online + offline === total;
  const onlinePercentage = (online / total) * 100;
  const offlinePercentage = (offline / total) * 100;

  return { isValidSplit, onlinePercentage, offlinePercentage };
};
```

#### Step 3: Research & Development (R&D)

**Logic**: Innovation investment and project planning

```typescript
// R&D Impact Calculation
const rdBudgetImpact = rdBudget + totalDevelopmentCost;
const rdMetrics = {
  budget: rdBudget,
  projectsInPipeline: pip,
  timeToMarket: timeToMarket,
  totalDevelopmentProjects: totalDevelopment,
  patentsFiled: patented,
  qualityImprovements: qualityChanges,
};
```

#### Step 4: Production

**Logic**: Capacity planning and quality management

```typescript
// Production Calculations
const totalProductionCost = unitsToProduceCode * costPerUnit;
const defectedUnits = Math.round((unitsToProduceConst * defectRate) / 100);
const goodUnits = unitsToProduceConst - defectedUnits;
const efficiency = (unitsToProduceConst / productionCapacity) * 100;

// Production Budget Impact
const productionBudgetImpact =
  quality_improvement_investment +
  efficiency_upgrade_cost +
  maintenance_budget +
  safety_investment +
  environmental_compliance_cost;
```

#### Step 5: Products

**Logic**: Portfolio management and pricing

```typescript
// Product Budget Impact
const productBudgetImpact = development_cost + marketing_budget;

// Product Lifecycle Management
const productStatus = {
  development: "In development phase",
  launched: "Active in market",
  discontinued: "End of lifecycle",
};
```

#### Step 6: Sales

**Logic**: Sales targets and market strategy

```typescript
// Sales Calculations
const revenue = salesVolume * sellingPrice;
const profit = revenue - (salesVolume * productionCost + operatingCosts);
const profitMargin = (profit / revenue) * 100;

// Sales Impact (positive for revenue, negative for costs)
const salesBudgetImpact = revenue - costs;
```

#### Step 7: Finance

**Logic**: Investment, loans, and dividend decisions

```typescript
// Finance Impact Calculation
const financeBudgetImpact =
  -investment_amount + // Outflow
  -loan_repayment + // Outflow
  -dividend_payout + // Outflow
  +loan_amount + // Inflow
  +equity_issue; // Inflow
```

#### Step 8: Preview & Submit

**Logic**: Final review and comprehensive submission

### Comprehensive Submission Process

#### Data Aggregation

```typescript
const formData = {
  hr: { existingRoles, newRoles, salary_budget, training_budget, total_budget, ... },
  marketing: { budget, offline, online },
  rd: { budget, pip, time_to_market, total_development, patented, quality_changes },
  production: { production_capacity, units_to_produce, cost_per_unit, ... },
  finance: { investment_amount, loan_amount, repay_loan, dividend_payout, equity_issue },
  sales: { sales_volume, revenue, costs, profit, market_share, customer_satisfaction },
  product: { name, category, quality_rating, production_cost, selling_price, ... },
  projected_balance: projectedCashBalance,
  budget_impacts: budgetImpacts,
};
```

#### Server-Side Processing (`comprehensiveFormSubmission`)

The submission follows a parallel processing approach:

```typescript
const comprehensiveFormSubmission = async (companyId: string, formData: ComprehensiveFormData) => {
  // Step 1: Get company information
  const company = await prisma.company.findUnique({ where: { id: companyId } });

  // Step 2: Process all business areas in parallel
  const businessProcesses = [
    submitHRDecision(),
    submitMarketingDecision(),
    submitRDDecision(),
    submitProductionDecision(),
    submitFinanceDecision(),
    submitProductData(),
    submitSalesData()
  ];

  await Promise.all(businessProcesses);

  // Step 3: Store history and advance period (atomic transaction)
  await prisma.$transaction(async (tx) => {
    // Store company history
    await tx.company_history.create({
      data: { company_id: companyId, period: currentPeriod, ... }
    });

    // Advance period and update cash balance
    await tx.company.update({
      where: { id: companyId },
      data: {
        current_period: { increment: 1 },
        cash_balance: projectedBalance
      }
    });
  });
};
```

### Database Operations per Step

#### HR Decision Storage

```sql
-- Create HR decision record
INSERT INTO hr_decision (company_id, period, salary_budget, training_budget, total_budget, ...)

-- Create role decisions
INSERT INTO hr_role_decision (hr_decision_id, role_name, salary_per_head, head_count)
```

#### Marketing Decision Storage

```sql
INSERT INTO marketing (company_id, period, budget, offline, online, finalised)
```

#### R&D Decision Storage

```sql
INSERT INTO rd (company_id, period, budget, pip, time_to_market, total_development, ...)
```

#### Production Decision Storage

```sql
INSERT INTO production (company_id, period, units_to_produce, cost_per_unit,
                       production_capacity, defect_rate, finalised)
```

#### Finance Decision Storage

```sql
INSERT INTO finance (company_id, period, investment_amount, loan_amount,
                    repay_loan, dividend_payout, equity_issue, finalised)
```

#### Product Management

```sql
-- Create or update product
INSERT INTO product (company_id, name, category, quality_rating, production_cost, ...)
ON CONFLICT (company_id, name) DO UPDATE SET ...
```

#### Sales Performance Storage

```sql
INSERT INTO product_performance (product_id, period, sales_volume, revenue,
                                costs, profit, market_share, customer_satisfaction)
```

### Cash Flow Validation Rules

#### Real-Time Validation

- **Negative Cash Prevention**: `projectedCashBalance >= 0`
- **Budget Constraint**: `totalExpenses <= availableCash + incomingSources`
- **Business Logic**: Each department has specific validation rules

#### Validation Examples

```typescript
// HR Validation
const isValidHR = () => {
  const totalEmployees = existingRoles.reduce(
    (total, role) =>
      total + Math.max(0, role.currentHeadCount + role.hires - role.fires),
    0
  );
  return totalEmployees >= 0 && totalBudget <= availableCash;
};

// Marketing Validation
const isValidMarketing = () => online + offline === totalBudget;

// Production Validation
const isValidProduction = () => unitsToProduceConst <= productionCapacity;
```

### Error Handling & Recovery

#### Form-Level Error Handling

```typescript
try {
  const result = await comprehensiveFormSubmission(companyId, formData);
  if (result.success) {
    showSuccessMessage();
    redirect(`/homepage/${companyId}`);
  } else {
    showErrorMessage(result.message);
  }
} catch (error) {
  showGenericErrorMessage();
}
```

#### Server-Side Error Recovery

- **Partial Success Handling**: Continue processing even if some operations fail
- **Transaction Rollback**: Critical operations use database transactions
- **Graceful Degradation**: Non-critical failures don't stop period advancement

### Performance Optimizations

#### Parallel Processing

- All business decisions processed simultaneously (not sequentially)
- Database operations optimized with batch inserts where possible
- Real-time calculations use React useMemo and useCallback

#### State Management

- Form state persisted in React Context to prevent data loss
- Real-time validation prevents invalid submissions
- Optimistic UI updates for better user experience

This simulate page represents the core business logic engine of the application, handling complex multi-step decision making with real-time financial impact calculations and robust data persistence.
