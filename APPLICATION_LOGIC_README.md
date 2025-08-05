# Business Simulation Platform - Application Logic & Flow

## Table of Contents

1. [Overview](#overview)
2. [Application Architecture](#application-architecture)
3. [Data Models & Relationships](#data-models--relationships)
4. [Business Logic Flow](#business-logic-flow)
5. [Financial Calculations](#financial-calculations)
6. [Decision-Making Process](#decision-making-process)
7. [Simulation Engine](#simulation-engine)
8. [Performance Metrics](#performance-metrics)
9. [Period Advancement Logic](#period-advancement-logic)
10. [Dashboard Analytics](#dashboard-analytics)

## Overview

The Business Simulation Platform is a comprehensive multi-company business simulation system that allows users to make strategic decisions across various business functions and see their impact on company performance over multiple periods.

### Core Concept

- **Period-Based Simulation**: Business decisions are made for discrete time periods
- **Multi-Department Management**: Users manage HR, Marketing, R&D, Production, Finance, Products, and Sales
- **Real-time Analytics**: Dashboard provides immediate feedback on decisions and their financial impact
- **Comparative Analysis**: Companies can be compared across different metrics and performance indicators

## Application Architecture

### Technology Stack

- **Frontend**: Next.js 15, React, TypeScript, Material-UI, Recharts
- **Backend**: Next.js Server Actions, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Custom JWT-based auth system

### Key Components

1. **Simulation Management**: Creates and manages simulation environments
2. **Company Management**: Handles multiple companies within simulations
3. **Decision Forms**: Step-by-step wizard for making business decisions
4. **Analytics Dashboard**: Real-time performance visualization
5. **Comparison Tools**: Multi-company performance analysis

## Data Models & Relationships

### Core Entities

#### Company

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

#### Financial Records

```typescript
interface Finance {
  total_revenue: number;
  net_profit: number;
  cash_balance: number;
  operating_costs: number;
  roi: number;
  burn_rate: number;
  investment_amount: number;
  loan_amount: number;
  repay_loan: number;
  dividend_payout: number;
  equity_issue: number;
}
```

## Business Logic Flow

### 1. Simulation Setup

1. **User Registration/Login**: Authentication via JWT
2. **Simulation Creation**: Define simulation parameters and context
3. **Company Creation**: Users create their virtual companies
4. **Initial State**: Companies start with predefined cash balance and assets

### 2. Decision-Making Cycle

Each period, users make decisions across 8 key areas:

#### Decision Flow Sequence:

1. **Human Resources** → Employee planning and budget allocation
2. **Marketing** → Campaign planning and channel allocation
3. **Research & Development** → Innovation investment and project planning
4. **Production** → Capacity planning and quality management
5. **Products** → Portfolio management and pricing
6. **Sales** → Sales targets and market strategy
7. **Finance** → Investment, loans, and dividend decisions
8. **Preview & Submit** → Final review and submission

### 3. Validation & Processing

- **Real-time Validation**: Each form validates inputs against business rules
- **Cash Flow Validation**: Ensures decisions don't exceed available cash
- **Comprehensive Submission**: All decisions submitted atomically
- **Period Advancement**: Automatic progression to next period after submission

## Financial Calculations

### Cash Balance Management

The system maintains a real-time projected cash balance that updates as users make decisions:

```typescript
// Base calculation
const projectedCashBalance = originalCashBalance - totalExpenses + totalIncome;

// Where totalExpenses includes:
const totalExpenses =
  hrBudget +
  marketingBudget +
  rdBudget +
  productionBudget +
  investmentAmount +
  loanRepayment +
  dividendPayout;

// And totalIncome includes:
const totalIncome = salesRevenue + loanAmount + equityIssue;
```

### Key Financial Metrics

#### Revenue Calculation

```typescript
// Product-based revenue
const revenue = salesVolume * sellingPrice;

// Multi-product revenue
const totalRevenue = products.reduce((total, product) => {
  return total + product.salesVolume * product.sellingPrice;
}, 0);
```

#### Profit Calculation

```typescript
// Basic profit calculation
const profit = revenue - costs;

// Where costs include:
const costs = salesVolume * productionCost + operatingCosts;

// Profit margin
const profitMargin = (profit / revenue) * 100;
```

#### Return on Investment (ROI)

```typescript
const roi = (profit / totalCosts) * 100;
```

#### Burn Rate

```typescript
const burnRate = operatingCosts / 12; // Monthly burn rate
```

### HR Budget Calculations

#### Salary Budget

```typescript
// Existing roles
const existingSalaryBudget = existingRoles.reduce((total, role) => {
  const adjustedHeadCount = role.currentHeadCount + role.hires - role.fires;
  return total + adjustedHeadCount * role.salaryPerHead;
}, 0);

// New roles
const newRolesSalaryBudget = newRoles.reduce((total, role) => {
  return total + role.hires * role.salaryPerHead;
}, 0);

// Total HR budget
const totalHRBudget =
  existingSalaryBudget + newRolesSalaryBudget + trainingBudget;
```

#### Employee Metrics

```typescript
// Total employees after decisions
const totalEmployees =
  existingRoles.reduce((total, role) => {
    return total + Math.max(0, role.currentHeadCount + role.hires - role.fires);
  }, 0) + newRoles.reduce((total, role) => total + role.hires, 0);

// Employee satisfaction impact
const satisfactionChange = getPercentChange(
  currentSatisfaction,
  previousSatisfaction
);
```

### Production Calculations

#### Production Costs

```typescript
const totalProductionCost = unitsToProducesCode * costPerUnit;

// Defect calculations
const defectedUnits = Math.round((unitsToProduceConst * defectRate) / 100);
const goodUnits = unitsToProduceConst - defectedUnits;

// Efficiency calculation
const efficiency = (unitsToProduceConst / productionCapacity) * 100;
```

### Marketing Budget Allocation

```typescript
// Budget split validation
const isValidBudgetSplit = online + offline === totalBudget;

// Percentage allocation
const onlinePercentage = (online / totalBudget) * 100;
const offlinePercentage = (offline / totalBudget) * 100;
```

### R&D Investment Impact

```typescript
// R&D metrics tracked:
const rdMetrics = {
  budget: rdBudget,
  projectsInPipeline: pip,
  timeToMarket: timeToMarket,
  totalDevelopmentProjects: totalDevelopment,
  patentsFiled: patented,
  qualityImprovements: qualityChanges,
};
```

## Decision-Making Process

### Form Context Management

The application uses React Context to manage form state across all decision areas:

```typescript
// Cash balance tracking
const useCashBalance = () => {
  const [cashBalance, setCashBalance] = useState({
    originalCashBalance: 0,
    hrBudgetImpact: 0,
    marketingBudgetImpact: 0,
    rdBudgetImpact: 0,
    productionBudgetImpact: 0,
    financeBudgetImpact: 0,
    salesBudgetImpact: 0,
  });

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

### Validation Rules

#### Cash Flow Validation

- No decision can result in negative cash balance
- All budget allocations must be within available funds
- Real-time validation prevents invalid submissions

#### Business Logic Validation

- HR: Employee counts cannot be negative after hires/fires
- Marketing: Online + Offline must equal total budget
- Production: Units to produce cannot exceed capacity
- Sales: Market share must be between 0-100%

### Comprehensive Form Submission

All decisions are submitted atomically using a single transaction:

```typescript
const comprehensiveFormSubmission = async (companyId, formData) => {
  // Process all business areas in parallel
  const results = await Promise.all([
    submitHRDecision(),
    submitMarketingDecision(),
    submitRDDecision(),
    submitProductionDecision(),
    submitFinanceDecision(),
    submitProductData(),
    submitSalesData(),
  ]);

  // Store company history and advance period
  await storeHistoryAndAdvancePeriod();
};
```

## Simulation Engine

### Period Advancement Logic

When all decisions are submitted:

1. **Historical Data Storage**: Current company state saved to `company_history`
2. **Decision Processing**: All business decisions stored with period reference
3. **Financial Updates**: Company cash balance updated based on decisions
4. **Period Increment**: `current_period` incremented by 1
5. **State Reset**: Ready for next period's decisions

### Performance Calculation Engine

```typescript
// Period performance metrics
const calculatePeriodPerformance = (companyData, decisions) => {
  const revenue = calculateRevenue(decisions.sales, decisions.production);
  const costs = calculateCosts(decisions);
  const profit = revenue - costs;
  const marketShare = calculateMarketShare(
    decisions.sales,
    decisions.marketing
  );

  return {
    revenue,
    costs,
    profit,
    marketShare,
    roi: (profit / costs) * 100,
    cashFlow: revenue - costs,
    customerSatisfaction: decisions.sales.customerSatisfaction,
  };
};
```

## Performance Metrics

### Financial Performance Indicators

- **Revenue Growth**: Period-over-period revenue comparison
- **Profit Margins**: Gross and net profit margins
- **ROI**: Return on investment across all business areas
- **Cash Position**: Cash balance trends and projections
- **Asset Utilization**: Total assets vs. liabilities ratio

### Operational Metrics

- **Production Efficiency**: Capacity utilization and defect rates
- **Employee Productivity**: Revenue per employee
- **Market Position**: Market share and competitive standing
- **Innovation Index**: R&D investment as percentage of revenue

### Trend Analysis

```typescript
const getPercentChange = (current, previous) => {
  if (previous === 0 || !previous) return undefined;
  return +(((current - previous) / previous) * 100).toFixed(1);
};

// Applied to all key metrics for trend visualization
const trendAnalysis = {
  cashBalanceChange: getPercentChange(currentCash, previousCash),
  revenueChange: getPercentChange(currentRevenue, previousRevenue),
  profitChange: getPercentChange(currentProfit, previousProfit),
  marketShareChange: getPercentChange(currentShare, previousShare),
};
```

## Period Advancement Logic

### State Transition Process

1. **Pre-Validation**: Ensure all required decisions are made
2. **Data Validation**: Validate all form data against business rules
3. **Financial Calculation**: Calculate period-end financial position
4. **History Storage**: Store current state in `company_history` table
5. **Decision Recording**: Store all business decisions with period reference
6. **State Update**: Update company's current period and cash balance
7. **Cleanup**: Reset form state for next period

### Database Transaction Flow

```typescript
await prisma.$transaction(async (tx) => {
  // Store company history
  await tx.company_history.create({
    data: {
      company_id: companyId,
      period: currentPeriod,
      cash_balance: company.cash_balance,
      total_assets: company.total_assets,
      total_liabilities: company.total_liabilities,
      // ... other metrics
    },
  });

  // Update company for next period
  await tx.company.update({
    where: { id: companyId },
    data: {
      current_period: { increment: 1 },
      cash_balance: projectedBalance,
    },
  });
});
```

## Dashboard Analytics

### Real-Time Performance Tracking

The dashboard provides comprehensive analytics across multiple dimensions:

#### Financial Dashboard Cards

- **Cash Balance**: Current liquidity position with trend indicators
- **Net Worth**: Assets minus liabilities with growth percentage
- **Revenue**: Period revenue with period-over-period comparison
- **Active Products**: Product portfolio size and growth

#### Interactive Charts

1. **Revenue & Profit Trend**: Area chart showing financial performance over time
2. **Department Budget Allocation**: Pie chart showing budget distribution
3. **Production Metrics**: Bar chart showing production efficiency
4. **Product Performance**: Sales volume and market share by product

#### Comparative Analytics

```typescript
// Multi-period comparison
const periodComparison = periods.map((period) => {
  const periodData = getPeriodData(period);
  return {
    period,
    revenue: periodData.revenue,
    profit: periodData.profit,
    marketShare: periodData.marketShare,
    employees: periodData.employees,
  };
});
```

### Data Visualization Components

- **ResponsiveContainer**: Ensures charts adapt to screen size
- **Custom Tooltips**: Show detailed metrics on hover
- **Gradient Fills**: Visual enhancement for area charts
- **Color Coding**: Consistent color scheme across all visualizations

## Key Business Rules & Constraints

### Financial Constraints

- Companies cannot have negative cash balances
- All expenses must be covered by available funds
- Loan amounts cannot exceed creditworthiness limits

### Operational Constraints

- Production cannot exceed capacity
- Employee counts cannot be negative
- Market share is capped at 100% total across all companies

### Validation Framework

```typescript
// Example validation schema using Zod
const financeSchema = z.object({
  investment_amount: z.number().min(0),
  loan_amount: z.number().min(0),
  repay_loan: z.number().min(0),
  dividend_payout: z.number().min(0),
  equity_issue: z.number().min(0),
});
```

## Conclusion

The Business Simulation Platform provides a comprehensive, realistic business management experience through:

- **Complex Financial Modeling**: Realistic cash flow and financial calculations
- **Multi-Department Integration**: Interconnected business decisions
- **Real-Time Analytics**: Immediate feedback on decision impact
- **Period-Based Progression**: Structured business cycles
- **Comparative Analysis**: Multi-company performance evaluation

The system successfully simulates real-world business challenges while providing educational value and strategic decision-making practice.
