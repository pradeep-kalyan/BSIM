export interface CompanyHistoryType {
  id: string;
  company_id: string;
  period: number;
  cash_balance: number;
  data?: string;
  total_assets: number;
  total_liabilities: number;
  marketing_budget: number;
  credit_rating?: string | null;
  brand_value: number;
}

export interface FinancialHistoryType {
  period: number;
  total_revenue?: number;
  revenue?: number;
  net_profit?: number;
  profit?: number;
  cash_balance?: number;
  operating_costs?: number;
  roi?: number;
  burn_rate?: number;
}

export interface ProductPerformanceType {
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
}

export interface HRRole {
  role_name: string;
  salary_per_head: number;
  head_count: number;
}

export interface HRMetricsType {
  period: number;
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
  roles?: HRRole[];
}

export interface ProductionDataType {
  id: string;
  company_id: string;
  period: number;
  units_to_produce: number;
  cost_per_unit: number;
  production_capacity: number;
  storage_capacity: number | null;
  inventory_value: number;
  defect_rate: number;
  finalised: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface RDDataType {
  period: number;
  budget?: number;
  pip?: number;
  patented?: number;
  time_to_market?: number;
}

export interface MarketingDataType {
  period: number;
  budget?: number;
}

export interface HRDecisionType {
  total_budget?: number;
  totalBudget?: number;
  employee_satisfaction?: number;
  employeeSatisfaction?: number;
  total_employee_count?: number | null;
  roles?: HRRole[];
}

export interface RDDecisionType {
  budget?: number;
  pip?: number;
  patented?: number;
  time_to_market?: number;
}

export interface ProductionDecisionType {
  budget?: number;
  units_to_produce?: number;
  defect_rate?: number;
  production_capacity?: number;
}

export interface MarketingDecisionType {
  budget?: number;
}

export interface FinanceDecisionType {
  total_revenue?: number;
  net_profit?: number;
  cash_balance?: number;
  operating_costs?: number;
  roi?: number;
  burn_rate?: number;
}

export interface DashboardData {
  company: {
    id: string;
    name: string;
    logo_url: string | null;
    current_period: number;
    cash_balance: number;
    data?: string;
    total_assets: number;
    total_liabilities: number;
    marketing_budget: number;
    credit_rating?: string | null;
    brand_value: number;
  };
  history: CompanyHistoryType[];
  financialHistory: FinancialHistoryType[];
  productPerformance: ProductPerformanceType[];
  hrMetrics: HRMetricsType[];
  productionData: ProductionDataType[];
  rdData: RDDataType[]; // Array of all R&D decisions
  marketingData: MarketingDataType[]; // Array of all marketing decisions
  hr_decision: HRDecisionType | null;
  rd_decision: RDDecisionType | null;
  production_decision: ProductionDecisionType | null;
  marketing_decision: MarketingDecisionType | null;
  finance_decision: FinanceDecisionType | null;
  activeProductsCount: number;
}

export interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

export interface PieTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      percentage: number;
    };
  }>;
}
export interface ProductInput {
  name: string;
  description?: string;
  category: string;
  quality_rating?: number;
  innovation_rating?: number;
  sustainability_rating?: number;
  production_cost?: number;
  selling_price?: number;
  inventory_level?: number;
  production_capacity?: number;
  development_cost?: number;
  marketing_budget?: number;
  status?: string;
  launch_period?: number;
  discontinue_period?: number;
}