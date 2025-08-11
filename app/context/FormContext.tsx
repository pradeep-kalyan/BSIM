"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import {
  CashBalanceState,
  CompanyFormData,
  ExistingRole,
  FinanceFormData,
  FormState,
  HRFormData,
  MarketingFormData,
  NewRole,
  ProductFormData,
  ProductionFormData,
  ProductSalesData,
  RDFormData,
  RoleInput,
  SimulationFormData,
  FormContextType,
  FormAction,
} from "../types/simulate";

// Default values matching Zod schema defaults
const getDefaultFinanceData = (): FinanceFormData => ({
  investment_amount: 0,
  loan_amount: 0,
  repay_loan: 0,
  dividend_payout: 0,
  equity_issue: 0,
});

const getDefaultProductionData = (): ProductionFormData => ({
  products: [], // Array of ProductProductionData matching DB schema
});

const getDefaultHRData = (): HRFormData => ({
  existingRoles: [],
  newRoles: [],
  salary_budget: 0,
  training_budget: 0,
  total_budget: 0,
  employee_satisfaction: 0,
  total_employee_count: 0,
});

const getDefaultRDData = (): RDFormData => ({
  budget: 0,
  pip: 0,
  time_to_market: 0,
  total_development: 0,
  patented: 0,
  quality_changes: 0,
});

const getDefaultSalesData = (): ProductSalesData => ({});

export const getDefaultProductData = (): ProductFormData => ({
  name: "",
  description: "",
  category: "",
  quality_rating: 0,
  innovation_rating: 0,
  sustainability_rating: 0,
  production_cost: 0,
  selling_price: 0,
  inventory_level: 0,
  production_capacity: 2000,
  development_cost: 0,
  marketing_budget: 0,
  status: "active",
});

export const getDefaultCompanyData = (): CompanyFormData => ({
  name: "",
  description: "",
  logo_url: "",
  cash_balance: 100000,
  total_assets: 0,
  total_liabilities: 0,
  marketing_budget: 0,
  credit_rating: "",
  brand_value: 0,
});

const getDefaultSimulationData = (): SimulationFormData => ({
  name: "",
  description: "",
  config: "{}",
  current_period: 0,
  status: "active",
});

const getDefaultCashBalance = (): CashBalanceState => ({
  originalCashBalance: 100000,
  hrBudgetImpact: 0,
  financeBudgetImpact: 0,
  marketingBudgetImpact: 0,
  productionBudgetImpact: 0,
  rdBudgetImpact: 0,
  salesBudgetImpact: 0,
  productBudgetImpact: 0,
});

const getDefaultMarketingData = () => ({
  budget: 0,
  offline: 0,
  online: 0,
});

// Initial state with minimal defaults - real data comes from DB via initializeForms()
const initialState: FormState = {
  finance: {} as FinanceFormData,
  marketing: {} as MarketingFormData,
  production: {} as ProductionFormData,
  hr: {} as HRFormData,
  rd: {} as RDFormData,
  sales: {} as ProductSalesData,
  product: [], // Initialize as empty array
  company: {} as CompanyFormData,
  simulation: {} as SimulationFormData,
  cashBalance: {
    originalCashBalance: 0,
    hrBudgetImpact: 0,
    financeBudgetImpact: 0,
    marketingBudgetImpact: 0,
    productionBudgetImpact: 0,
    rdBudgetImpact: 0,
    salesBudgetImpact: 0,
    productBudgetImpact: 0,
  },
  projected_balance: 0,
  isSubmitting: false,
  errors: {},
  isDirty: false,
  currentStep: 1,
  totalSteps: 1,
  completedSections: {},
  submissionStatus: "idle",
  submissionResults: {},
  isInitialized: false,
};

// Reducer function with proper initialization handling
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "INITIALIZE_FORMS":
      return {
        ...state,
        ...action.payload,
        finance: { ...getDefaultFinanceData(), ...action.payload.finance },
        marketing: {
          ...getDefaultMarketingData(),
          ...action.payload.marketing,
        },
        production: {
          ...getDefaultProductionData(),
          ...action.payload.production,
        },
        hr: { ...getDefaultHRData(), ...action.payload.hr },
        rd: { ...getDefaultRDData(), ...action.payload.rd },
        sales: { ...getDefaultSalesData(), ...action.payload.sales },
        product: action.payload.product || [], // Use the provided array or empty array
        company: { ...getDefaultCompanyData(), ...action.payload.company },
        simulation: {
          ...getDefaultSimulationData(),
          ...action.payload.simulation,
        },
        cashBalance: {
          ...getDefaultCashBalance(),
          ...action.payload.cashBalance,
        },
        isInitialized: true,
      };

    case "UPDATE_FINANCE":
      return {
        ...state,
        finance: { ...state.finance, ...action.payload },
        isDirty: true,
      };

    case "UPDATE_MARKETING":
      return {
        ...state,
        marketing: { ...state.marketing, ...action.payload },
        isDirty: true,
      };

    case "UPDATE_PRODUCTION":
      return {
        ...state,
        production: { ...state.production, ...action.payload },
        isDirty: true,
      };

    case "UPDATE_HR":
      return {
        ...state,
        hr: { ...state.hr, ...action.payload },
        isDirty: true,
      };

    case "ADD_EXISTING_ROLE":
      return {
        ...state,
        hr: {
          ...state.hr,
          existingRoles: [...state.hr.existingRoles, action.payload],
        },
        isDirty: true,
      };

    case "UPDATE_EXISTING_ROLE":
      return {
        ...state,
        hr: {
          ...state.hr,
          existingRoles: state.hr.existingRoles.map((role, index) =>
            index === action.payload.index
              ? { ...role, ...action.payload.role }
              : role
          ),
        },
        isDirty: true,
      };

    case "REMOVE_EXISTING_ROLE":
      return {
        ...state,
        hr: {
          ...state.hr,
          existingRoles: state.hr.existingRoles.filter(
            (_, index) => index !== action.payload
          ),
        },
        isDirty: true,
      };

    case "ADD_NEW_ROLE":
      return {
        ...state,
        hr: {
          ...state.hr,
          newRoles: [...state.hr.newRoles, action.payload],
        },
        isDirty: true,
      };

    case "UPDATE_NEW_ROLE":
      return {
        ...state,
        hr: {
          ...state.hr,
          newRoles: state.hr.newRoles.map((role, index) =>
            index === action.payload.index
              ? { ...role, ...action.payload.role }
              : role
          ),
        },
        isDirty: true,
      };

    case "REMOVE_NEW_ROLE":
      return {
        ...state,
        hr: {
          ...state.hr,
          newRoles: state.hr.newRoles.filter(
            (_, index) => index !== action.payload
          ),
        },
        isDirty: true,
      };

    case "CLEAR_ALL_ROLES":
      return {
        ...state,
        hr: {
          ...state.hr,
          existingRoles: [],
          newRoles: [],
        },
        isDirty: true,
      };

    case "UPDATE_RD":
      return {
        ...state,
        rd: { ...state.rd, ...action.payload },
        isDirty: true,
      };

    case "UPDATE_SALES":
      return {
        ...state,
        sales: { ...state.sales, ...action.payload },
        isDirty: true,
      };

    case "UPDATE_PRODUCT":
      // For backward compatibility - add to end of array if no products exist, otherwise update first product
      return {
        ...state,
        product:
          state.product.length === 0
            ? [{ ...getDefaultProductData(), ...action.payload }]
            : state.product.map((product, index) =>
                index === 0 ? { ...product, ...action.payload } : product
              ),
        isDirty: true,
      };

    case "ADD_PRODUCT":
      return {
        ...state,
        product: [...state.product, action.payload],
        isDirty: true,
      };

    case "UPDATE_PRODUCT_BY_INDEX":
      return {
        ...state,
        product: state.product.map((product, index) =>
          index === action.payload.index
            ? { ...product, ...action.payload.product }
            : product
        ),
        isDirty: true,
      };

    case "REMOVE_PRODUCT":
      return {
        ...state,
        product: state.product.filter((_, index) => index !== action.payload),
        isDirty: true,
      };

    case "SET_PRODUCTS":
      return {
        ...state,
        product: action.payload,
        isDirty: true,
      };

    case "UPDATE_COMPANY":
      return {
        ...state,
        company: { ...state.company, ...action.payload },
        isDirty: true,
      };

    case "UPDATE_SIMULATION":
      return {
        ...state,
        simulation: { ...state.simulation, ...action.payload },
        isDirty: true,
      };

    case "SET_ORIGINAL_CASH_BALANCE":
      return {
        ...state,
        cashBalance: {
          ...state.cashBalance,
          originalCashBalance: action.payload,
        },
      };

    case "UPDATE_HR_BUDGET_IMPACT":
      return {
        ...state,
        cashBalance: {
          ...state.cashBalance,
          hrBudgetImpact: action.payload,
        },
      };

    case "UPDATE_FINANCE_BUDGET_IMPACT":
      return {
        ...state,
        cashBalance: {
          ...state.cashBalance,
          financeBudgetImpact: action.payload,
        },
      };

    case "UPDATE_MARKETING_BUDGET_IMPACT":
      return {
        ...state,
        cashBalance: {
          ...state.cashBalance,
          marketingBudgetImpact: action.payload,
        },
      };

    case "UPDATE_PRODUCTION_BUDGET_IMPACT":
      return {
        ...state,
        cashBalance: {
          ...state.cashBalance,
          productionBudgetImpact: action.payload,
        },
      };

    case "UPDATE_RD_BUDGET_IMPACT":
      return {
        ...state,
        cashBalance: {
          ...state.cashBalance,
          rdBudgetImpact: action.payload,
        },
      };

    case "UPDATE_SALES_BUDGET_IMPACT":
      return {
        ...state,
        cashBalance: {
          ...state.cashBalance,
          salesBudgetImpact: action.payload,
        },
      };

    case "UPDATE_PRODUCT_BUDGET_IMPACT":
      return {
        ...state,
        cashBalance: {
          ...state.cashBalance,
          productBudgetImpact: action.payload,
        },
      };

    case "SET_SUBMITTING":
      return {
        ...state,
        isSubmitting: action.payload,
      };

    case "SET_ERRORS":
      return {
        ...state,
        errors: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.field]: action.payload.error,
        },
      };

    case "CLEAR_ERRORS":
      return {
        ...state,
        errors: {},
      };

    case "SET_DIRTY":
      return {
        ...state,
        isDirty: action.payload,
      };

    case "SET_STEP":
      return {
        ...state,
        currentStep: action.payload,
      };

    case "SET_TOTAL_STEPS":
      return {
        ...state,
        totalSteps: action.payload,
      };

    case "NEXT_STEP":
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.totalSteps),
      };

    case "PREV_STEP":
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1),
      };

    case "RESET_FORM":
      if (action.payload) {
        const defaultData = {
          finance: getDefaultFinanceData(),
          marketing: getDefaultMarketingData(),
          production: getDefaultProductionData(),
          hr: getDefaultHRData(),
          rd: getDefaultRDData(),
          sales: getDefaultSalesData(),
          product: [],
          company: getDefaultCompanyData(),
          simulation: getDefaultSimulationData(),
        };
        return {
          ...state,
          [action.payload]:
            defaultData[action.payload as keyof typeof defaultData] || {},
          isDirty: false,
          errors: {},
        };
      }
      return initialState;

    case "RESET_ALL":
      return initialState;

    case "SET_FORM_COMPLETED":
      return {
        ...state,
        completedSections: {
          ...state.completedSections,
          [action.payload.section]: action.payload.completed,
        },
      };

    case "BULK_UPDATE_FORMS":
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}

// Context interface

// Create context
const FormContext = createContext<FormContextType | undefined>(undefined);

// Provider component
export function FormProvider({
  children,
  initialValues,
}: {
  children: ReactNode;
  initialValues?: Partial<FormState>;
}) {
  const [state, dispatch] = useReducer(formReducer, {
    ...initialState,
    ...initialValues,
  });

  // Initialization function
  const initializeForms = useCallback((data: Partial<FormState>) => {
    dispatch({ type: "INITIALIZE_FORMS", payload: data });
  }, []);

  // Helper functions
  const updateFinance = useCallback((data: Partial<FinanceFormData>) => {
    dispatch({ type: "UPDATE_FINANCE", payload: data });
  }, []);

  const updateMarketing = useCallback((data: Partial<MarketingFormData>) => {
    dispatch({ type: "UPDATE_MARKETING", payload: data });
  }, []);

  const updateProduction = useCallback((data: Partial<ProductionFormData>) => {
    dispatch({ type: "UPDATE_PRODUCTION", payload: data });
  }, []);

  const updateHR = useCallback((data: Partial<HRFormData>) => {
    dispatch({ type: "UPDATE_HR", payload: data });
  }, []);

  const updateRD = useCallback((data: Partial<RDFormData>) => {
    dispatch({ type: "UPDATE_RD", payload: data });
  }, []);

  const updateSales = useCallback((data: ProductSalesData) => {
    dispatch({ type: "UPDATE_SALES", payload: data });
  }, []);

  const updateProduct = useCallback((data: Partial<ProductFormData>) => {
    dispatch({ type: "UPDATE_PRODUCT", payload: data });
  }, []);

  // New product array management functions
  const addProduct = useCallback((product: ProductFormData) => {
    dispatch({ type: "ADD_PRODUCT", payload: product });
  }, []);

  const updateProductByIndex = useCallback(
    (index: number, product: Partial<ProductFormData>) => {
      dispatch({
        type: "UPDATE_PRODUCT_BY_INDEX",
        payload: { index, product },
      });
    },
    []
  );

  const removeProduct = useCallback((index: number) => {
    dispatch({ type: "REMOVE_PRODUCT", payload: index });
  }, []);

  const setProducts = useCallback((products: ProductFormData[]) => {
    dispatch({ type: "SET_PRODUCTS", payload: products });
  }, []);

  const updateCompany = useCallback((data: Partial<CompanyFormData>) => {
    dispatch({ type: "UPDATE_COMPANY", payload: data });
  }, []);

  const updateSimulation = useCallback((data: Partial<SimulationFormData>) => {
    dispatch({ type: "UPDATE_SIMULATION", payload: data });
  }, []);

  // HR Role management functions
  const addExistingRole = useCallback((role: ExistingRole) => {
    dispatch({ type: "ADD_EXISTING_ROLE", payload: role });
  }, []);

  const updateExistingRole = useCallback(
    (index: number, role: Partial<ExistingRole>) => {
      dispatch({ type: "UPDATE_EXISTING_ROLE", payload: { index, role } });
    },
    []
  );

  const removeExistingRole = useCallback((index: number) => {
    dispatch({ type: "REMOVE_EXISTING_ROLE", payload: index });
  }, []);

  const addNewRole = useCallback((role: NewRole) => {
    dispatch({ type: "ADD_NEW_ROLE", payload: role });
  }, []);

  const updateNewRole = useCallback((index: number, role: Partial<NewRole>) => {
    dispatch({ type: "UPDATE_NEW_ROLE", payload: { index, role } });
  }, []);

  const removeNewRole = useCallback((index: number) => {
    dispatch({ type: "REMOVE_NEW_ROLE", payload: index });
  }, []);

  const clearAllRoles = useCallback(() => {
    dispatch({ type: "CLEAR_ALL_ROLES" });
  }, []);

  const setSubmitting = useCallback((submitting: boolean) => {
    dispatch({ type: "SET_SUBMITTING", payload: submitting });
  }, []);

  // Cash balance management functions
  const setOriginalCashBalance = useCallback((amount: number) => {
    dispatch({ type: "SET_ORIGINAL_CASH_BALANCE", payload: amount });
  }, []);

  const updateHRBudgetImpact = useCallback((impact: number) => {
    dispatch({ type: "UPDATE_HR_BUDGET_IMPACT", payload: impact });
  }, []);

  const updateFinanceBudgetImpact = useCallback((impact: number) => {
    dispatch({ type: "UPDATE_FINANCE_BUDGET_IMPACT", payload: impact });
  }, []);

  const updateMarketingBudgetImpact = useCallback((impact: number) => {
    dispatch({ type: "UPDATE_MARKETING_BUDGET_IMPACT", payload: impact });
  }, []);

  const updateProductionBudgetImpact = useCallback((impact: number) => {
    dispatch({ type: "UPDATE_PRODUCTION_BUDGET_IMPACT", payload: impact });
  }, []);

  const updateRDBudgetImpact = useCallback((impact: number) => {
    dispatch({ type: "UPDATE_RD_BUDGET_IMPACT", payload: impact });
  }, []);

  const updateSalesBudgetImpact = useCallback((impact: number) => {
    dispatch({ type: "UPDATE_SALES_BUDGET_IMPACT", payload: impact });
  }, []);

  const updateProductBudgetImpact = useCallback((impact: number) => {
    dispatch({ type: "UPDATE_PRODUCT_BUDGET_IMPACT", payload: impact });
  }, []);

  const getProjectedCashBalance = useCallback(() => {
    return (
      state.cashBalance.originalCashBalance +
      state.cashBalance.financeBudgetImpact +
      state.cashBalance.salesBudgetImpact - // Sales revenue adds to cash balance
      state.cashBalance.hrBudgetImpact -
      state.cashBalance.marketingBudgetImpact -
      state.cashBalance.productionBudgetImpact -
      state.cashBalance.rdBudgetImpact -
      state.cashBalance.productBudgetImpact
    );
  }, [
    state.cashBalance.originalCashBalance,
    state.cashBalance.financeBudgetImpact,
    state.cashBalance.hrBudgetImpact,
    state.cashBalance.marketingBudgetImpact,
    state.cashBalance.productionBudgetImpact,
    state.cashBalance.rdBudgetImpact,
    state.cashBalance.salesBudgetImpact,
    state.cashBalance.productBudgetImpact,
  ]);

  const setError = useCallback((field: string, error: string) => {
    dispatch({ type: "SET_ERROR", payload: { field, error } });
  }, []);

  const setErrors = useCallback((errors: Record<string, string>) => {
    dispatch({ type: "SET_ERRORS", payload: errors });
  }, []);

  const clearErrors = useCallback(() => {
    dispatch({ type: "CLEAR_ERRORS" });
  }, []);

  const nextStep = useCallback(() => {
    dispatch({ type: "NEXT_STEP" });
  }, []);

  const prevStep = useCallback(() => {
    dispatch({ type: "PREV_STEP" });
  }, []);

  const setStep = useCallback((step: number) => {
    dispatch({ type: "SET_STEP", payload: step });
  }, []);

  const setTotalSteps = useCallback((total: number) => {
    dispatch({ type: "SET_TOTAL_STEPS", payload: total });
  }, []);

  const resetForm = useCallback((formType?: keyof FormState) => {
    dispatch({ type: "RESET_FORM", payload: formType });
  }, []);

  const resetAll = useCallback(() => {
    dispatch({ type: "RESET_ALL" });
  }, []);

  // Validation helpers
  const hasErrors = useCallback(() => {
    return Object.keys(state.errors).length > 0;
  }, [state.errors]);

  const getError = useCallback(
    (field: string) => {
      return state.errors[field];
    },
    [state.errors]
  );

  const validateField = useCallback(
    (field: string, value: unknown): string | undefined => {
      // Basic validation logic matching Zod schema constraints
      if (value === null || value === undefined || value === "") {
        // Only validate required fields as required
        const requiredFields = ["name", "category"]; // Add other required fields as needed
        if (requiredFields.includes(field)) {
          return `${field} is required`;
        }
      }

      if (typeof value === "number") {
        if (value < 0) {
          return `${field} must be non-negative`;
        }

        // Special validation for defect_rate and automation_level based on Zod schema
        if (field === "defect_rate" && value > 1) {
          return `${field} cannot exceed 100%`;
        }

        if (field === "automation_level" && value > 10) {
          return `${field} cannot exceed 10`;
        }
      }

      return undefined;
    },
    []
  );

  // Comprehensive submission methods
  const setFormCompleted = useCallback(
    (section: string, completed: boolean) => {
      dispatch({ type: "SET_FORM_COMPLETED", payload: { section, completed } });
    },
    []
  );

  const bulkUpdateForms = useCallback((data: Partial<FormState>) => {
    dispatch({ type: "BULK_UPDATE_FORMS", payload: data });
  }, []);

  const getAllFormData = useCallback(() => {
    return { ...state };
  }, [state]);

  const validateAllForms = useCallback(() => {
    const errors: Record<string, string> = {};
    let valid = true;

    // Basic validation for each form section
    const sections = [
      "finance",
      "marketing",
      "production",
      "hr",
      "rd",
      "sales",
      "product",
    ] as const;

    sections.forEach((section) => {
      const sectionData = state[section];
      Object.entries(sectionData).forEach(([key, value]) => {
        const error = validateField(key, value);
        if (error) {
          errors[`${section}.${key}`] = error;
          valid = false;
        }
      });
    });

    return { valid, errors };
  }, [state, validateField]);

  const getCompletionStatus = useCallback(() => {
    const sections = [
      "finance",
      "marketing",
      "production",
      "hr",
      "rd",
      "sales",
      "product",
    ];
    const completed = sections.filter(
      (section) => state.completedSections[section]
    ).length;

    return {
      completed,
      total: sections.length,
      sections: sections.filter((section) => state.completedSections[section]),
    };
  }, [state.completedSections]);

  const contextValue: FormContextType = {
    state,
    dispatch,
    initializeForms,
    updateFinance,
    updateMarketing,
    updateProduction,
    updateHR,
    updateRD,
    updateSales,
    updateProduct,
    addProduct,
    updateProductByIndex,
    removeProduct,
    setProducts,
    updateCompany,
    updateSimulation,
    addExistingRole,
    updateExistingRole,
    removeExistingRole,
    addNewRole,
    updateNewRole,
    removeNewRole,
    clearAllRoles,
    setOriginalCashBalance,
    updateHRBudgetImpact,
    updateFinanceBudgetImpact,
    updateMarketingBudgetImpact,
    updateProductionBudgetImpact,
    updateRDBudgetImpact,
    updateSalesBudgetImpact,
    updateProductBudgetImpact,
    getProjectedCashBalance,
    setSubmitting,
    setError,
    setErrors,
    clearErrors,
    nextStep,
    prevStep,
    setStep,
    setTotalSteps,
    resetForm,
    resetAll,
    hasErrors,
    getError,
    validateField,
    setFormCompleted,
    bulkUpdateForms,
    getAllFormData,
    validateAllForms,
    getCompletionStatus,
  };

  return (
    <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
  );
}

// Custom hook to use the form context
export function useForm() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
}

// Updated specific form hooks with proper cash impact calculations
export function useFinanceForm() {
  const {
    state,
    updateFinance,
    setError,
    getError,
    updateFinanceBudgetImpact,
  } = useForm();

  // Simple update without automatic budget impact calculation
  const updateDataOnly = useCallback(
    (data: Partial<FinanceFormData>) => {
      updateFinance(data);
    },
    [updateFinance]
  );

  return {
    data: state.finance,
    updateData: updateDataOnly,
    setError,
    getError,
    updateFinanceBudgetImpact, // Expose this for manual budget impact updates
  };
}

export function useMarketingForm() {
  const {
    state,
    updateMarketing,
    setError,
    getError,
    updateMarketingBudgetImpact,
  } = useForm();

  const updateDataWithCashImpact = useCallback(
    (
      data: Partial<{
        budget: number;
        online: number;
        offline: number;
      }>
    ) => {
      const budget = data.budget ?? state.marketing.budget ?? 0;

      const budgetImpact = budget;

      updateMarketing(data);
      updateMarketingBudgetImpact(budgetImpact);
    },
    [updateMarketing, updateMarketingBudgetImpact, state.marketing]
  );

  return {
    data: state.marketing, // includes budget, online, offline, roi, conversion_rate
    updateData: updateDataWithCashImpact,
    setError,
    getError,
  };
}

export function useProductionForm() {
  const {
    state,
    updateProduction,
    setError,
    getError,
    updateProductionBudgetImpact,
  } = useForm();

  const updateDataWithCashImpact = useCallback(
    (data: Partial<ProductionFormData>) => {
      // Calculate budget impact based on total production cost across all products
      let totalCost = 0;

      if (data.products) {
        totalCost = data.products.reduce(
          (sum, prod) =>
            sum +
            (prod.total_cost ||
              prod.units_to_produce *
                prod.cost_per_unit *
                (1 + prod.defect_rate / 100)),
          0
        );
      } else if (state.production.products) {
        totalCost = state.production.products.reduce(
          (sum, prod) =>
            sum +
            (prod.total_cost ||
              prod.units_to_produce *
                prod.cost_per_unit *
                (1 + prod.defect_rate / 100)),
          0
        );
      }

      updateProduction(data);
      updateProductionBudgetImpact(totalCost);
    },
    [updateProduction, updateProductionBudgetImpact, state.production]
  );

  return {
    data: state.production,
    updateData: updateDataWithCashImpact,
    setError,
    getError,
  };
}

export function useHRForm() {
  const {
    state,
    updateHR,
    setError,
    getError,
    updateHRBudgetImpact,
    addExistingRole: contextAddExistingRole,
    updateExistingRole: contextUpdateExistingRole,
    removeExistingRole: contextRemoveExistingRole,
    addNewRole: contextAddNewRole,
    updateNewRole: contextUpdateNewRole,
    removeNewRole: contextRemoveNewRole,
    clearAllRoles: contextClearAllRoles,
  } = useForm();

  const updateDataWithCashImpact = useCallback(
    (data: Partial<HRFormData>) => {
      // Calculate budget impact from the new data being passed in
      const salary_budget = data.salary_budget ?? state.hr.salary_budget ?? 0;
      const training_budget =
        data.training_budget ?? state.hr.training_budget ?? 0;
      const total_budget = data.total_budget ?? state.hr.total_budget ?? 0;

      // Use total_budget if available, otherwise calculate from components
      const budgetImpact =
        total_budget > 0 ? total_budget : salary_budget + training_budget;

      updateHR(data);
      updateHRBudgetImpact(budgetImpact);
    },
    [updateHR, updateHRBudgetImpact, state.hr]
  );

  // Helper function to calculate total budget from roles
  const calculateBudgetFromRoles = useCallback(() => {
    let salary_budget = 0;

    // Calculate from existing roles
    state.hr.existingRoles.forEach((role) => {
      const newHeadCount = role.current_head_count + role.hires - role.fires;
      if (newHeadCount > 0) {
        salary_budget += newHeadCount * role.salary_per_head;
      }
    });

    // Calculate from new roles
    state.hr.newRoles.forEach((role) => {
      salary_budget += role.hires * role.salary_per_head;
      // New roles don't have firing costs
    });

    const total_budget = salary_budget + state.hr.training_budget;

    return {
      salary_budget,
      total_budget,
    };
  }, [state.hr]);

  // Enhanced role management functions with budget impact calculation
  const addExistingRole = useCallback(
    (role: ExistingRole) => {
      contextAddExistingRole(role);
      // Auto-calculate budget and total employee count after adding role
      setTimeout(() => {
        const budget = calculateBudgetFromRoles();
        const existingEmployees = [...state.hr.existingRoles, role].reduce(
          (total, r) => {
            return (
              total + Math.max(0, r.current_head_count + r.hires - r.fires)
            );
          },
          0
        );
        const newEmployees = state.hr.newRoles.reduce(
          (total, r) => total + r.hires,
          0
        );
        const total_employee_count = existingEmployees + newEmployees;

        updateDataWithCashImpact({
          salary_budget: budget.salary_budget,
          total_budget: budget.total_budget,
          total_employee_count,
        });
      }, 0);
    },
    [
      contextAddExistingRole,
      calculateBudgetFromRoles,
      updateDataWithCashImpact,
      state.hr,
    ]
  );

  const updateExistingRole = useCallback(
    (index: number, role: Partial<ExistingRole>) => {
      contextUpdateExistingRole(index, role);
      // Auto-calculate budget and total employee count after updating role
      setTimeout(() => {
        const budget = calculateBudgetFromRoles();
        const updatedRoles = state.hr.existingRoles.map((r, i) =>
          i === index ? { ...r, ...role } : r
        );
        const existingEmployees = updatedRoles.reduce((total, r) => {
          return total + Math.max(0, r.current_head_count + r.hires - r.fires);
        }, 0);
        const newEmployees = state.hr.newRoles.reduce(
          (total, r) => total + r.hires,
          0
        );
        const total_employee_count = existingEmployees + newEmployees;

        updateDataWithCashImpact({
          salary_budget: budget.salary_budget,
          total_budget: budget.total_budget,
          total_employee_count,
        });
      }, 0);
    },
    [
      contextUpdateExistingRole,
      calculateBudgetFromRoles,
      updateDataWithCashImpact,
      state.hr,
    ]
  );

  const removeExistingRole = useCallback(
    (index: number) => {
      contextRemoveExistingRole(index);
      // Auto-calculate budget and total employee count after removing role
      setTimeout(() => {
        const budget = calculateBudgetFromRoles();
        const remainingRoles = state.hr.existingRoles.filter(
          (_, i) => i !== index
        );
        const existingEmployees = remainingRoles.reduce((total, r) => {
          return total + Math.max(0, r.current_head_count + r.hires - r.fires);
        }, 0);
        const newEmployees = state.hr.newRoles.reduce(
          (total, r) => total + r.hires,
          0
        );
        const total_employee_count = existingEmployees + newEmployees;

        updateDataWithCashImpact({
          salary_budget: budget.salary_budget,
          total_budget: budget.total_budget,
          total_employee_count,
        });
      }, 0);
    },
    [
      contextRemoveExistingRole,
      calculateBudgetFromRoles,
      updateDataWithCashImpact,
      state.hr,
    ]
  );

  const addNewRole = useCallback(
    (role: NewRole) => {
      contextAddNewRole(role);
      // Auto-calculate budget and total employee count after adding role
      setTimeout(() => {
        const budget = calculateBudgetFromRoles();
        const existingEmployees = state.hr.existingRoles.reduce((total, r) => {
          return total + Math.max(0, r.current_head_count + r.hires - r.fires);
        }, 0);
        const newEmployees = [...state.hr.newRoles, role].reduce(
          (total, r) => total + r.hires,
          0
        );
        const total_employee_count = existingEmployees + newEmployees;

        updateDataWithCashImpact({
          salary_budget: budget.salary_budget,
          total_budget: budget.total_budget,
          total_employee_count,
        });
      }, 0);
    },
    [
      contextAddNewRole,
      calculateBudgetFromRoles,
      updateDataWithCashImpact,
      state.hr,
    ]
  );

  const updateNewRole = useCallback(
    (index: number, role: Partial<NewRole>) => {
      contextUpdateNewRole(index, role);
      // Auto-calculate budget and total employee count after updating role
      setTimeout(() => {
        const budget = calculateBudgetFromRoles();
        const existingEmployees = state.hr.existingRoles.reduce((total, r) => {
          return total + Math.max(0, r.current_head_count + r.hires - r.fires);
        }, 0);
        const updatedNewRoles = state.hr.newRoles.map((r, i) =>
          i === index ? { ...r, ...role } : r
        );
        const newEmployees = updatedNewRoles.reduce(
          (total, r) => total + r.hires,
          0
        );
        const total_employee_count = existingEmployees + newEmployees;

        updateDataWithCashImpact({
          salary_budget: budget.salary_budget,
          total_budget: budget.total_budget,
          total_employee_count,
        });
      }, 0);
    },
    [
      contextUpdateNewRole,
      calculateBudgetFromRoles,
      updateDataWithCashImpact,
      state.hr,
    ]
  );

  const removeNewRole = useCallback(
    (index: number) => {
      contextRemoveNewRole(index);
      // Auto-calculate budget and total employee count after removing role
      setTimeout(() => {
        const budget = calculateBudgetFromRoles();
        const existingEmployees = state.hr.existingRoles.reduce((total, r) => {
          return total + Math.max(0, r.current_head_count + r.hires - r.fires);
        }, 0);
        const remainingNewRoles = state.hr.newRoles.filter(
          (_, i) => i !== index
        );
        const newEmployees = remainingNewRoles.reduce(
          (total, r) => total + r.hires,
          0
        );
        const total_employee_count = existingEmployees + newEmployees;

        updateDataWithCashImpact({
          salary_budget: budget.salary_budget,
          total_budget: budget.total_budget,
          total_employee_count,
        });
      }, 0);
    },
    [
      contextRemoveNewRole,
      calculateBudgetFromRoles,
      updateDataWithCashImpact,
      state.hr,
    ]
  );

  const clearAllRoles = useCallback(() => {
    contextClearAllRoles();
    // Reset budget and total employee count when clearing all roles
    updateDataWithCashImpact({
      salary_budget: 0,
      total_budget: state.hr.training_budget, // Keep training budget
      total_employee_count: 0, // No employees after clearing all roles
    });
  }, [
    contextClearAllRoles,
    updateDataWithCashImpact,
    state.hr.training_budget,
  ]);

  // Helper function to convert form data to RoleInput format for submission
  const getRoleInputs = useCallback((): RoleInput[] => {
    const roleInputs: RoleInput[] = [];

    // Add existing roles
    state.hr.existingRoles.forEach((role) => {
      roleInputs.push({
        role_name: role.role_name,
        salary_per_head: role.salary_per_head,
        hires: role.hires,
        fires: role.fires,
      });
    });

    // Add new roles
    state.hr.newRoles.forEach((role) => {
      roleInputs.push({
        role_name: role.role_name,
        salary_per_head: role.salary_per_head,
        hires: role.hires,
        fires: 0, // New roles don't have fires
      });
    });

    return roleInputs;
  }, [state.hr.existingRoles, state.hr.newRoles]);

  return {
    data: state.hr,
    updateData: updateDataWithCashImpact,
    setError,
    getError,

    // Role management functions with auto budget calculation
    addExistingRole,
    updateExistingRole,
    removeExistingRole,
    addNewRole,
    updateNewRole,
    removeNewRole,
    clearAllRoles,

    // Calculation helpers
    calculateBudgetFromRoles,
    getRoleInputs,
  };
}

export function useRDForm() {
  const { state, updateRD, setError, getError, updateRDBudgetImpact } =
    useForm();

  const updateDataWithCashImpact = useCallback(
    (data: Partial<RDFormData>) => {
      // Calculate budget impact from the new data being passed in
      const budget = data.budget ?? state.rd.budget ?? 0;
      const total_development =
        data.total_development ?? state.rd.total_development ?? 0;

      const budgetImpact = budget + total_development;

      updateRD(data);
      updateRDBudgetImpact(budgetImpact);
    },
    [updateRD, updateRDBudgetImpact, state.rd]
  );

  return {
    data: state.rd,
    updateData: updateDataWithCashImpact,
    setError,
    getError,
  };
}

export function useSalesForm() {
  const { state, updateSales, setError, getError, updateSalesBudgetImpact } =
    useForm();

  const updateDataWithCashImpact = useCallback(
    (data: ProductSalesData) => {
      // Calculate budget impact from the new data being passed in
      // For sales, revenue should increase cash balance
      let totalRevenue = 0;
      Object.values(data).forEach((productSales) => {
        totalRevenue += productSales.revenue || 0;
      });

      updateSales(data);
      updateSalesBudgetImpact(totalRevenue);
    },
    [updateSales, updateSalesBudgetImpact]
  );

  // Helper function to get total aggregated sales metrics
  const getTotalSalesMetrics = useCallback(() => {
    let totalRevenue = 0;
    let totalCosts = 0;
    let totalProfit = 0;
    let totalVolume = 0;
    let averageMarketShare = 0;
    let averageCustomerSatisfaction = 0;
    let productCount = 0;

    Object.values(state.sales).forEach((productSales) => {
      totalRevenue += productSales.revenue || 0;
      totalCosts += productSales.costs || 0;
      totalProfit += productSales.profit || 0;
      totalVolume += productSales.sales_volume || 0;

      if (productSales.market_share && productSales.market_share > 0) {
        averageMarketShare += productSales.market_share;
        productCount++;
      }

      if (
        productSales.customer_satisfaction &&
        productSales.customer_satisfaction > 0
      ) {
        averageCustomerSatisfaction += productSales.customer_satisfaction;
      }
    });

    // Calculate averages
    averageMarketShare =
      productCount > 0 ? averageMarketShare / productCount : 0;
    averageCustomerSatisfaction =
      productCount > 0 ? averageCustomerSatisfaction / productCount : 0;

    return {
      totalRevenue,
      totalCosts,
      totalProfit,
      totalVolume,
      averageMarketShare,
      averageCustomerSatisfaction,
      productCount,
    };
  }, [state.sales]);

  return {
    data: state.sales,
    updateData: updateDataWithCashImpact,
    setError,
    getError,
    getTotalSalesMetrics,
  };
}

export function useProductForm() {
  const {
    state,
    updateProduct,
    addProduct,
    updateProductByIndex,
    removeProduct,
    setProducts,
    setError,
    getError,
    updateProductBudgetImpact,
  } = useForm();

  const updateDataWithCashImpact = useCallback(
    (data: Partial<ProductFormData>) => {
      // Calculate budget impact from the new data being passed in
      const development_cost = data.development_cost ?? 0;
      const marketing_budget = data.marketing_budget ?? 0;

      const budgetImpact = development_cost + marketing_budget;

      updateProduct(data);
      updateProductBudgetImpact(budgetImpact);
    },
    [updateProduct, updateProductBudgetImpact]
  );

  const addProductWithCashImpact = useCallback(
    (product: ProductFormData) => {
      const budgetImpact =
        (product.development_cost || 0) + (product.marketing_budget || 0);
      addProduct(product);
      updateProductBudgetImpact(budgetImpact);
    },
    [addProduct, updateProductBudgetImpact]
  );

  return {
    data: state.product, // This is now an array of products
    products: state.product, // Alias for clarity
    updateData: updateDataWithCashImpact,
    addProduct: addProductWithCashImpact,
    updateProductByIndex,
    removeProduct,
    setProducts,
    setError,
    getError,
  };
}

export function useCompanyForm() {
  const { state, updateCompany, setError, getError } = useForm();
  return {
    data: state.company,
    updateData: updateCompany,
    setError,
    getError,
  };
}

// Cash balance hook
export function useCashBalance() {
  const {
    state,
    setOriginalCashBalance,
    updateHRBudgetImpact,
    updateFinanceBudgetImpact,
    updateMarketingBudgetImpact,
    updateProductionBudgetImpact,
    updateRDBudgetImpact,
    updateSalesBudgetImpact,
    updateProductBudgetImpact,
    getProjectedCashBalance,
  } = useForm();

  const projectedCashBalance = useMemo(() => {
    return getProjectedCashBalance();
  }, [getProjectedCashBalance]);

  return {
    cashBalance: state.cashBalance,
    setOriginalCashBalance,
    updateHRBudgetImpact,
    updateFinanceBudgetImpact,
    updateMarketingBudgetImpact,
    updateProductionBudgetImpact,
    updateRDBudgetImpact,
    updateSalesBudgetImpact,
    updateProductBudgetImpact,
    getProjectedCashBalance,
    originalCashBalance: state.cashBalance.originalCashBalance,
    projectedCashBalance,
    budgetImpacts: {
      hr: state.cashBalance.hrBudgetImpact,
      finance: state.cashBalance.financeBudgetImpact,
      marketing: state.cashBalance.marketingBudgetImpact,
      production: state.cashBalance.productionBudgetImpact,
      rd: state.cashBalance.rdBudgetImpact,
      sales: state.cashBalance.salesBudgetImpact,
      product: state.cashBalance.productBudgetImpact,
    },
  };
}

// Comprehensive form submission hook

// HR-specific hooks for advanced functionality
export function useHRRoleManagement() {
  const {
    data: hrData,
    addExistingRole,
    updateExistingRole,
    removeExistingRole,
    addNewRole,
    updateNewRole,
    removeNewRole,
    calculateBudgetFromRoles,
    getRoleInputs,
    updateData: updateHRData,
  } = useHRForm();

  // Helper function to hire employees for an existing role
  const hireEmployeesForRole = useCallback(
    (roleIndex: number, hireCount: number) => {
      const role = hrData.existingRoles[roleIndex];
      if (role) {
        updateExistingRole(roleIndex, {
          ...role,
          hires: role.hires + hireCount,
        });
      }
    },
    [hrData.existingRoles, updateExistingRole]
  );

  // Helper function to fire employees for an existing role
  const fireEmployeesForRole = useCallback(
    (roleIndex: number, fireCount: number) => {
      const role = hrData.existingRoles[roleIndex];
      if (role && role.current_head_count >= fireCount) {
        updateExistingRole(roleIndex, {
          ...role,
          fires: role.fires + fireCount,
        });
      }
    },
    [hrData.existingRoles, updateExistingRole]
  );

  // Helper function to set exact hire count for a role
  const setHireCountForRole = useCallback(
    (roleIndex: number, hireCount: number) => {
      const role = hrData.existingRoles[roleIndex];
      if (role) {
        updateExistingRole(roleIndex, {
          ...role,
          hires: Math.max(0, hireCount),
        });
      }
    },
    [hrData.existingRoles, updateExistingRole]
  );

  // Helper function to set exact fire count for a role
  const setFireCountForRole = useCallback(
    (roleIndex: number, fireCount: number) => {
      const role = hrData.existingRoles[roleIndex];
      if (role) {
        updateExistingRole(roleIndex, {
          ...role,
          fires: Math.max(0, Math.min(fireCount, role.current_head_count)),
        });
      }
    },
    [hrData.existingRoles, updateExistingRole]
  );

  // Helper function to adjust hire count for new roles
  const setHireCountForNewRole = useCallback(
    (roleIndex: number, hireCount: number) => {
      const role = hrData.newRoles[roleIndex];
      if (role) {
        updateNewRole(roleIndex, {
          ...role,
          hires: Math.max(1, hireCount), // New roles must have at least 1 hire
        });
      }
    },
    [hrData.newRoles, updateNewRole]
  );

  // Get net employee changes per role
  const getNetEmployeeChanges = useCallback(() => {
    return hrData.existingRoles.map((role) => ({
      role_name: role.role_name,
      current_count: role.current_head_count,
      hires: role.hires,
      fires: role.fires,
      net_change: role.hires - role.fires,
      final_count: role.current_head_count + role.hires - role.fires,
    }));
  }, [hrData.existingRoles]);

  // Get total employee count
  const getTotalEmployees = useCallback(() => {
    const existingData = hrData.existingRoles || [];
    const existingEmployees = existingData.reduce((total, role) => {
      return (
        total + Math.max(0, role.current_head_count + role.hires - role.fires)
      );
    }, 0);

    const newEmployees = hrData.newRoles?.reduce((total, role) => {
      return total + role.hires;
    }, 0);

    return existingEmployees + newEmployees;
  }, [hrData.existingRoles, hrData.newRoles]);

  // Get hiring and firing statistics
  const getHiringFireStatistics = useCallback(() => {
    const totalHires =
      hrData.existingRoles?.reduce((total, role) => total + role.hires, 0) +
      hrData.newRoles?.reduce((total, role) => total + role.hires, 0);

    const totalFires = hrData.existingRoles.reduce(
      (total, role) => total + role.fires,
      0
    );

    const netEmployeeChange = totalHires - totalFires;

    return {
      totalHires,
      totalFires,
      netEmployeeChange,
    };
  }, [hrData.existingRoles, hrData.newRoles]);

  // Auto-calculate and update budget fields based on roles
  const autoCalculateBudget = useCallback(() => {
    const budget = calculateBudgetFromRoles();
    const totalEmployees = getTotalEmployees();
    updateHRData({
      salary_budget: budget.salary_budget,
      total_budget: budget.total_budget,
      total_employee_count: totalEmployees,
    });
  }, [calculateBudgetFromRoles, getTotalEmployees, updateHRData]);

  // Get roles summary for submission
  const getRolesSummary = useCallback(() => {
    const budget = calculateBudgetFromRoles();
    const statistics = getHiringFireStatistics();
    return {
      ...budget,
      ...statistics,
      totalEmployees: getTotalEmployees(),
      roleInputs: getRoleInputs(),
      employeeChanges: getNetEmployeeChanges(),
    };
  }, [
    calculateBudgetFromRoles,
    getHiringFireStatistics,
    getTotalEmployees,
    getRoleInputs,
    getNetEmployeeChanges,
  ]);

  // Validate HR form data
  const validateHRData = useCallback(() => {
    const errors: string[] = [];

    // Check if there are any roles
    if (hrData.existingRoles.length === 0 && hrData.newRoles.length === 0) {
      errors.push("At least one role must be defined");
    }

    // Validate existing roles
    hrData.existingRoles.forEach((role, index) => {
      if (!role.role_name.trim()) {
        errors.push(`Existing role ${index + 1}: Role name is required`);
      }
      if (role.salary_per_head <= 0) {
        errors.push(
          `Existing role ${index + 1}: Salary per head must be positive`
        );
      }
      if (role.current_head_count < 0) {
        errors.push(
          `Existing role ${index + 1}: Current head count cannot be negative`
        );
      }
      if (role.hires < 0) {
        errors.push(`Existing role ${index + 1}: Hires cannot be negative`);
      }
      if (role.fires < 0) {
        errors.push(`Existing role ${index + 1}: Fires cannot be negative`);
      }
      if (role.fires > role.current_head_count) {
        errors.push(
          `Existing role ${
            index + 1
          }: Cannot fire more employees than current count`
        );
      }
      if (role.current_head_count + role.hires - role.fires < 0) {
        errors.push(
          `Existing role ${index + 1}: Final employee count cannot be negative`
        );
      }
    });

    // Validate new roles
    hrData.newRoles.forEach((role, index) => {
      if (!role.role_name.trim()) {
        errors.push(`New role ${index + 1}: Role name is required`);
      }
      if (role.salary_per_head <= 0) {
        errors.push(`New role ${index + 1}: Salary per head must be positive`);
      }
      if (role.hires <= 0) {
        errors.push(`New role ${index + 1}: Must hire at least one employee`);
      }
    });

    // Check for duplicate role names
    const allRoleNames = [
      ...hrData.existingRoles.map((r) => r.role_name),
      ...hrData.newRoles.map((r) => r.role_name),
    ];
    const duplicates = allRoleNames.filter(
      (name, index) => allRoleNames.indexOf(name) !== index
    );
    if (duplicates.length > 0) {
      errors.push(
        `Duplicate role names found: ${[...new Set(duplicates)].join(", ")}`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [hrData.existingRoles, hrData.newRoles]);

  return {
    // Data
    existingRoles: hrData.existingRoles,
    newRoles: hrData.newRoles,

    // Role management
    addExistingRole,
    updateExistingRole,
    removeExistingRole,
    addNewRole,
    updateNewRole,
    removeNewRole,

    // Hiring and Firing specific functions
    hireEmployeesForRole,
    fireEmployeesForRole,
    setHireCountForRole,
    setFireCountForRole,
    setHireCountForNewRole,

    // Calculations and Analytics
    calculateBudgetFromRoles,
    getTotalEmployees,
    getNetEmployeeChanges,
    getHiringFireStatistics,
    getRolesSummary,
    getRoleInputs,
    autoCalculateBudget,

    // Validation
    validateHRData,
  };
}

// Specialized hook for hire and fire operations
