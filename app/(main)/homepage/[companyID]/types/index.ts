import { ReactNode, ComponentType } from "react";

export interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ComponentType<{ size: number }>;
  change?: number;
  loading?: boolean;
  onClick?: () => void;
  gradient?: boolean;
  size?: "small" | "normal" | "large";
  className?: string;
}

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

export interface QuickStatProps {
  label: string;
  value: string | number;
  icon: ComponentType<{ size: number; className?: string }>;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
  trend?: number 
  
}

export interface CompanyData {
  id?: string;
  name?: string;
  current_period?: number;
  cash_balance?: number;
  total_assets?: number;
  total_liabilities?: number;
  products?: Array<{
    id?: string;
    name: string;
    category?: string;
    status?: string;
    quality_rating?: number;
    selling_price?: number;
    inventory_level?: number;
  }>;
}
