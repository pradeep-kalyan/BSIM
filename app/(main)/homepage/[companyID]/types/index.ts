import {
  finance,
  hr_decision,
  marketing,
  Prisma,
  production,
  rd,
} from "@prisma/client";
import { ReactNode, ComponentType } from "react";
import { LucideIcon } from "lucide-react";
export interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
   icon?: LucideIcon;
  change?: number;
  loading?: boolean;
  onClick?: () => void;
  gradient?: boolean;
  size?: "small" | "normal" | "large";
  className?: string;
  iconColor?: string;
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
  trend?: number;
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

// You need to import these from your Prisma client, e.g.
// import { Prisma } from "@prisma/client";
// Or, if using generated types, import them accordingly.

// Define specific result types for each query,
// reflecting the selected fields you used.

// Final return type:
export type DashboardData = {
  company: Prisma.companyGetPayload<{
    include: {
      simulation: true;
      products: true;
    };
  }> | null;
  activeProductsCount: number;
  hr_decision: hr_decision | null;
  finance_decision: finance | null;
  marketing_decision: marketing | null;
  rd_decision: rd | null;
  production_decision: production | null;
  financialHistory: Array<{
    period: string;
    revenue: number;
    profit: number;
    costs: number;
  }>;
  productPerformance: Array<{
    name: string;
    sales: number;
    revenue: number;
    marketShare: number;
    satisfaction: number;
  }>;
  hrMetrics: Array<{
    department: string;
    employees: number;
    satisfaction: number;
    newHires: number;
  }>;
  productionData: production[];
};
