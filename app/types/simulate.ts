export interface FinanceFormData {
  investment_amount: number;
  loan_amount: number;
  repay_loan: number;
  dividend_payout: number;
  equity_issue: number;
}

export interface MarketingFormData {
  budget: number;
  offline: number;
  online: number;
}

export interface ProductionFormData {
  production_capacity: number;
  inventory_value: number;
  storage_capacity: number;
  defect_rate: number;
  quality_improvement_investment: number;
  efficiency_upgrade_cost: number;
  maintenance_budget: number;
  automation_level: number;
  safety_investment: number;
  environmental_compliance_cost: number;
  units_to_produce: number;
  cost_per_unit: number;
}

export interface HRRole {
  role_name: string;
  salary_per_head: number;
  head_count: number;
}

export interface ExistingRole {
  role_name: string;
  salary_per_head: number;
  current_head_count: number;
  hires: number;
  fires: number;
}

export interface NewRole {
  role_name: string;
  salary_per_head: number;
  hires: number;
}

export interface RoleInput {
  role_name: string;
  salary_per_head: number;
  hires: number;
  fires: number;
}

export interface HRFormData {
  existingRoles: ExistingRole[];
  newRoles: NewRole[];
  salary_budget: number;
  training_budget: number;
  total_budget: number;
  employee_satisfaction: number;
  total_employee_count: number;
}

export interface RDFormData {
  budget: number;
  pip: number;
  time_to_market: number;
  total_development: number;
  patented: number;
  quality_changes: number;
}

export interface SalesFormData {
  sales_volume: number;
  revenue: number;
  costs: number;
  profit: number;
  market_share: number;
  customer_satisfaction: number;
}

// Per-product sales data structure
export interface ProductSalesData {
  [productId: string]: SalesFormData;
}

export interface ProductFormData {
  id?: string; // Optional ID for tracking existing products
  name: string;
  description?: string | null;
  category: string;
  quality_rating: number;
  innovation_rating: number;
  sustainability_rating: number;
  production_cost: number;
  selling_price: number;
  inventory_level: number;
  production_capacity: number;
  development_cost: number;
  marketing_budget: number;
  status: string;
  launch_period?: number | null;
  discontinue_period?: number | null;
}

export interface CompanyFormData {
  name: string;
  description?: string;
  logo_url?: string;
  cash_balance: number;
  total_assets: number;
  total_liabilities: number;
  marketing_budget: number;
  credit_rating?: string;
  brand_value: number;
}

export interface SimulationFormData {
  name: string;
  description?: string;
  config: string;
  current_period: number;
  status: string;
}

// Cash balance tracking interface
export interface CashBalanceState {
  originalCashBalance: number;
  hrBudgetImpact: number;
  financeBudgetImpact: number;
  marketingBudgetImpact: number;
  productionBudgetImpact: number;
  rdBudgetImpact: number;
  salesBudgetImpact: number;
  productBudgetImpact: number;
}

// Form state interface with proper initialization tracking
export interface FormState {
  finance: FinanceFormData;
  marketing: MarketingFormData;
  production: ProductionFormData;
  hr: HRFormData;
  rd: RDFormData;
  sales: ProductSalesData; // Changed to handle multiple products
  product: ProductFormData[];
  company: CompanyFormData;
  simulation: SimulationFormData;
  cashBalance: CashBalanceState;
  projected_balance: number;
  isSubmitting: boolean;
  errors: Record<string, string>;
  isDirty: boolean;
  currentStep: number;
  totalSteps: number;
  completedSections: Record<string, boolean>;
  submissionStatus: "idle" | "submitting" | "success" | "error";
  submissionResults: Record<
    string,
    { success: boolean; error?: string; id?: string }
  >;
  isInitialized: boolean;
}

export interface FormContextType {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;

  // Initialization
  initializeForms: (data: Partial<FormState>) => void;

  // Helper functions
  updateFinance: (data: Partial<FinanceFormData>) => void;
  updateMarketing: (data: Partial<MarketingFormData>) => void;
  updateProduction: (data: Partial<ProductionFormData>) => void;
  updateHR: (data: Partial<HRFormData>) => void;
  updateRD: (data: Partial<RDFormData>) => void;
  updateSales: (data: ProductSalesData) => void;
  updateProduct: (data: Partial<ProductFormData>) => void;
  // New product array management functions
  addProduct: (product: ProductFormData) => void;
  updateProductByIndex: (
    index: number,
    product: Partial<ProductFormData>
  ) => void;
  removeProduct: (index: number) => void;
  setProducts: (products: ProductFormData[]) => void;

  updateCompany: (data: Partial<CompanyFormData>) => void;
  updateSimulation: (data: Partial<SimulationFormData>) => void;

  // HR Role management functions
  addExistingRole: (role: ExistingRole) => void;
  updateExistingRole: (index: number, role: Partial<ExistingRole>) => void;
  removeExistingRole: (index: number) => void;
  addNewRole: (role: NewRole) => void;
  updateNewRole: (index: number, role: Partial<NewRole>) => void;
  removeNewRole: (index: number) => void;
  clearAllRoles: () => void;

  // Cash balance management
  setOriginalCashBalance: (amount: number) => void;
  updateHRBudgetImpact: (impact: number) => void;
  updateFinanceBudgetImpact: (impact: number) => void;
  updateMarketingBudgetImpact: (impact: number) => void;
  updateProductionBudgetImpact: (impact: number) => void;
  updateRDBudgetImpact: (impact: number) => void;
  updateSalesBudgetImpact: (impact: number) => void;
  updateProductBudgetImpact: (impact: number) => void;
  getProjectedCashBalance: () => number;

  setSubmitting: (submitting: boolean) => void;
  setError: (field: string, error: string) => void;
  setErrors: (errors: Record<string, string>) => void;
  clearErrors: () => void;

  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  setTotalSteps: (total: number) => void;

  resetForm: (formType?: keyof FormState) => void;
  resetAll: () => void;

  // Validation helpers
  hasErrors: () => boolean;
  getError: (field: string) => string | undefined;
  validateField: (field: string, value: unknown) => string | undefined;

  // Comprehensive submission methods
  setFormCompleted: (section: string, completed: boolean) => void;
  bulkUpdateForms: (data: Partial<FormState>) => void;
  getAllFormData: () => FormState;
  validateAllForms: () => { valid: boolean; errors: Record<string, string> };
  getCompletionStatus: () => {
    completed: number;
    total: number;
    sections: string[];
  };
}

export type FormAction =
  | { type: "UPDATE_FINANCE"; payload: Partial<FinanceFormData> }
  | { type: "UPDATE_MARKETING"; payload: Partial<MarketingFormData> }
  | { type: "UPDATE_PRODUCTION"; payload: Partial<ProductionFormData> }
  | { type: "UPDATE_HR"; payload: Partial<HRFormData> }
  | { type: "UPDATE_RD"; payload: Partial<RDFormData> }
  | { type: "UPDATE_SALES"; payload: ProductSalesData } // Changed to ProductSalesData
  | { type: "UPDATE_PRODUCT"; payload: Partial<ProductFormData> } // For backward compatibility
  | { type: "ADD_PRODUCT"; payload: ProductFormData }
  | {
      type: "UPDATE_PRODUCT_BY_INDEX";
      payload: { index: number; product: Partial<ProductFormData> };
    }
  | { type: "REMOVE_PRODUCT"; payload: number } // Remove by index
  | { type: "SET_PRODUCTS"; payload: ProductFormData[] } // Set entire products array
  | { type: "UPDATE_COMPANY"; payload: Partial<CompanyFormData> }
  | { type: "UPDATE_SIMULATION"; payload: Partial<SimulationFormData> }
  | { type: "ADD_EXISTING_ROLE"; payload: ExistingRole }
  | {
      type: "UPDATE_EXISTING_ROLE";
      payload: { index: number; role: Partial<ExistingRole> };
    }
  | { type: "REMOVE_EXISTING_ROLE"; payload: number }
  | { type: "ADD_NEW_ROLE"; payload: NewRole }
  | {
      type: "UPDATE_NEW_ROLE";
      payload: { index: number; role: Partial<NewRole> };
    }
  | { type: "REMOVE_NEW_ROLE"; payload: number }
  | { type: "CLEAR_ALL_ROLES" }
  | { type: "SET_ORIGINAL_CASH_BALANCE"; payload: number }
  | { type: "UPDATE_HR_BUDGET_IMPACT"; payload: number }
  | { type: "UPDATE_FINANCE_BUDGET_IMPACT"; payload: number }
  | { type: "UPDATE_MARKETING_BUDGET_IMPACT"; payload: number }
  | { type: "UPDATE_PRODUCTION_BUDGET_IMPACT"; payload: number }
  | { type: "UPDATE_RD_BUDGET_IMPACT"; payload: number }
  | { type: "UPDATE_SALES_BUDGET_IMPACT"; payload: number }
  | { type: "UPDATE_PRODUCT_BUDGET_IMPACT"; payload: number }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "SET_ERRORS"; payload: Record<string, string> }
  | { type: "SET_ERROR"; payload: { field: string; error: string } }
  | { type: "CLEAR_ERRORS" }
  | { type: "SET_DIRTY"; payload: boolean }
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_TOTAL_STEPS"; payload: number }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "RESET_FORM"; payload?: keyof FormState }
  | { type: "RESET_ALL" }
  | {
      type: "SET_FORM_COMPLETED";
      payload: { section: string; completed: boolean };
    }
  | { type: "INITIALIZE_FORMS"; payload: Partial<FormState> }
  | { type: "BULK_UPDATE_FORMS"; payload: Partial<FormState> };
