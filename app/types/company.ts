import { company } from "@prisma/client";
import { type ProductFormData } from "@/app/types/simulate";
export interface ExtendedCompany extends company {
  canAccess?: boolean;
  canEdit?: boolean;
  user_id: string; // The creator's user ID
}

export interface CompanyCardProps {
  companies: ExtendedCompany[];
  currentUserId?: string;
  onEdit?: (company: ExtendedCompany) => void;
  onDelete?: (id: string) => void;
  simulationName: string;
  simulationID?: string; // Optional, if you want to use it for navigation or other purposes
}
export interface Props {
  company: {
    id: string;
    name: string;
    description?: string | null;
    logo_url?: string | null;
    cash_balance?: number;
    total_assets?: number;
    total_liabilities?: number;
    marketing_budget?: number;
    brand_value?: number;
    company_access?: { user: { email: string } }[];
  };
  onClose: () => void;
  onUpdated?: () => void;
}
export interface ProductFormPageProps {
  mode: "add" | "edit";
  initialProduct?: Partial<ProductFormData>;
  onSubmit: (data: Partial<ProductFormData>) => void;
  onCancel: () => void;
  submitting?: boolean;
}
export interface Product {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  quality_rating: number;
  innovation_rating: number;
  sustainability_rating: number;
  status: string;
  launch_period?: number | null;
  discontinue_period?: number | null;
  latest_performance?: {
    sales_volume: number;
    revenue: number;
    costs: number;
    profit: number;
    market_share: number;
    customer_satisfaction: number;
  } | null;
}

export type CompanyLogoProps = {
  logoUrl?: string;
  companyName: string;
};
