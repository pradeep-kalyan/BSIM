import { DashboardData } from "@/app/types/homepage";

export interface ChartDataTypes {
  revenue: Array<{
    period: number;
    revenue: number;
    profit: number;
    total_revenue: number;
  }>;
  sales: Array<{
    period: number;
    totalSales: number;
    salesRevenue: number;
  }>;
  departmentBudgets: Array<{
    name: string;
    value: number;
    color: string;
    percentage: number;
  }>;
  productPerformance: Array<{
    period: number;
    name?: string;
    product?: {
      name: string;
    };
    sales_volume?: number;
    market_share?: number;
    revenue?: number;
    profit?: number;
    customer_satisfaction?: number;
  }>;
  hrMetrics: Array<{
    department?: string;
    employees?: number;
    satisfaction?: number;
    newHires?: number;
    totalBudget?: number;
    total_budget?: number;
    employeeSatisfaction?: number;
    employee_satisfaction?: number;
    totalEmployees?: number;
    total_employee_count?: number;
    period?: number;
    roles?: Array<{
      role_name: string;
      salary_per_head: number;
      head_count: number;
    }>;
  }>;
  productionData: Array<{
    month: string;
    produced: number;
    defects: number;
    efficiency: number;
    period?: number;
  }>;
}

export interface HomePageProps {
  data: DashboardData;
  comID: string;
}

export interface PeriodCalculations {
  periods: number[];
  isCurrentPeriod: boolean;
  currentPeriod: number;
  companyHistory?: {
    id: string;
    company_id: string;
    period: number;
    cash_balance: number;
    total_assets: number;
    total_liabilities: number;
    brand_value: number;
  };
  companyHistoryPrev?: {
    id: string;
    company_id: string;
    period: number;
    cash_balance: number;
    total_assets: number;
    total_liabilities: number;
    brand_value: number;
  };
}

export interface PercentageChange {
  cashChange?: number;
  netWorthChange?: number;
  revenueChange?: number;
  prodChange?: number;
  totalEmployeesChange?: number;
  newHiresChange?: number;
  avgSatisfactionChange?: number;
  hrBudgetChange?: number;
}
