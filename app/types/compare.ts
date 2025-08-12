export interface Company {
  id: string;
  name: string;
  cash_balance: number;
  total_assets: number;
  total_liabilities: number;
  brand_value: number;
  marketing_budget: number;
  current_period: number;
  finance: {
    total_revenue: number;
    net_profit: number;
    roi: number;
    burn_rate: number;
  };
  hr: {
    total_budget: number;
    employee_satisfaction: number;
  };
  rd: {
    budget: number;
    patented: number;
    quality_changes: number;
  };
  production: {
    production_capacity: number;
    defect_rate: number;
  };
  products: Array<{
    name: string;
    market_share: number;
    customer_satisfaction: number;
  }>;
}
export interface CompanyOption {
  id: string;
  name: string;
}
