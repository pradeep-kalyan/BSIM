"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

// Types for different form states
export interface FinanceFormData {
  investment_amount: number;
  loan_amount: number;
  repay_loan: number;
  dividend_payout: number;
  equity_issue: number;
}

export interface MarketingFormData {
  advertising_budget: number;
  promotion_budget: number;
  market_research_budget: number;
  brand_investment: number;
  digital_marketing_budget: number;
}

export interface ProductionFormData {
  production_capacity: number;
  quality_investment: number;
  efficiency_investment: number;
  automation_investment: number;
  maintenance_budget: number;
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

export interface HRFormData {
  existingRoles: ExistingRole[];
  newRoles: NewRole[];
  trainingBudget: number;
  employeeSatisfaction: number;
}

export interface RoleInput {
  role_name: string;
  salary_per_head: number;
  hires: number;
  fires: number;
}

export interface RDFormData {
  rd_budget: number;
  innovation_projects: number;
  product_development: number;
  technology_upgrade: number;
  patent_applications: number;
}

export interface ProductFormData {
  product_name: string;
  target_market: string;
  price_point: number;
  development_cost: number;
  launch_budget: number;
}

export interface CompanyFormData {
  name: string;
  industry: string;
  initial_capital: number;
  company_type: string;
  description?: string;
}

export interface SimulationFormData {
  name: string;
  description?: string;
  duration_periods: number;
  max_companies: number;
  start_date: string;
  configuration: Record<string, unknown>;
}

// Union type for all possible form data
export type FormData =
  | FinanceFormData
  | MarketingFormData
  | ProductionFormData
  | HRFormData
  | RDFormData
  | ProductFormData
  | CompanyFormData
  | SimulationFormData;

// Cash balance tracking interface
export interface CashBalanceState {
  originalCashBalance: number;
  hrBudgetImpact: number;
  financeBudgetImpact: number;
  marketingBudgetImpact: number;
  productionBudgetImpact: number;
  rdBudgetImpact: number;
  productBudgetImpact: number;
}

// Form state interface
export interface FormState {
  finance: Partial<FinanceFormData>;
  marketing: Partial<MarketingFormData>;
  production: Partial<ProductionFormData>;
  hr: Partial<HRFormData>;
  rd: Partial<RDFormData>;
  product: Partial<ProductFormData>;
  company: Partial<CompanyFormData>;
  simulation: Partial<SimulationFormData>;
  cashBalance: CashBalanceState;
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
}

// Action types
export type FormAction =
  | { type: "UPDATE_FINANCE"; payload: Partial<FinanceFormData> }
  | { type: "UPDATE_MARKETING"; payload: Partial<MarketingFormData> }
  | { type: "UPDATE_PRODUCTION"; payload: Partial<ProductionFormData> }
  | { type: "UPDATE_HR"; payload: Partial<HRFormData> }
  | { type: "UPDATE_RD"; payload: Partial<RDFormData> }
  | { type: "UPDATE_PRODUCT"; payload: Partial<ProductFormData> }
  | { type: "UPDATE_COMPANY"; payload: Partial<CompanyFormData> }
  | { type: "UPDATE_SIMULATION"; payload: Partial<SimulationFormData> }
  | { type: "SET_ORIGINAL_CASH_BALANCE"; payload: number }
  | { type: "UPDATE_HR_BUDGET_IMPACT"; payload: number }
  | { type: "UPDATE_FINANCE_BUDGET_IMPACT"; payload: number }
  | { type: "UPDATE_MARKETING_BUDGET_IMPACT"; payload: number }
  | { type: "UPDATE_PRODUCTION_BUDGET_IMPACT"; payload: number }
  | { type: "UPDATE_RD_BUDGET_IMPACT"; payload: number }
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
  | { type: "BULK_UPDATE_FORMS"; payload: Partial<FormState> };

// Initial state
const initialState: FormState = {
  finance: {},
  marketing: {},
  production: {},
  hr: {},
  rd: {},
  product: {},
  company: {},
  simulation: {},
  cashBalance: {
    originalCashBalance: 0,
    hrBudgetImpact: 0,
    financeBudgetImpact: 0,
    marketingBudgetImpact: 0,
    productionBudgetImpact: 0,
    rdBudgetImpact: 0,
    productBudgetImpact: 0,
  },
  isSubmitting: false,
  errors: {},
  isDirty: false,
  currentStep: 1,
  totalSteps: 1,
  completedSections: {},
  submissionStatus: "idle",
  submissionResults: {},
};

// Reducer function
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
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
    case "UPDATE_RD":
      return {
        ...state,
        rd: { ...state.rd, ...action.payload },
        isDirty: true,
      };
    case "UPDATE_PRODUCT":
      return {
        ...state,
        product: { ...state.product, ...action.payload },
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
        return {
          ...state,
          [action.payload]: {},
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
interface FormContextType {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;

  // Helper functions
  updateFinance: (data: Partial<FinanceFormData>) => void;
  updateMarketing: (data: Partial<MarketingFormData>) => void;
  updateProduction: (data: Partial<ProductionFormData>) => void;
  updateHR: (data: Partial<HRFormData>) => void;
  updateRD: (data: Partial<RDFormData>) => void;
  updateProduct: (data: Partial<ProductFormData>) => void;
  updateCompany: (data: Partial<CompanyFormData>) => void;
  updateSimulation: (data: Partial<SimulationFormData>) => void;

  // Cash balance management
  setOriginalCashBalance: (amount: number) => void;
  updateHRBudgetImpact: (impact: number) => void;
  updateFinanceBudgetImpact: (impact: number) => void;
  updateMarketingBudgetImpact: (impact: number) => void;
  updateProductionBudgetImpact: (impact: number) => void;
  updateRDBudgetImpact: (impact: number) => void;
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

  // New methods for comprehensive submission
  setFormCompleted: (section: string, completed: boolean) => void;
  submitAllForms: (companyId: string, period: number) => Promise<boolean>;
  bulkUpdateForms: (data: Partial<FormState>) => void;
  getAllFormData: () => FormState;
  validateAllForms: () => { valid: boolean; errors: Record<string, string> };
  getCompletionStatus: () => {
    completed: number;
    total: number;
    sections: string[];
  };
}

// Create context
const FormContext = createContext<FormContextType | undefined>(undefined);

// Provider component
export function FormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, initialState);

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

  const updateProduct = useCallback((data: Partial<ProductFormData>) => {
    dispatch({ type: "UPDATE_PRODUCT", payload: data });
  }, []);

  const updateCompany = useCallback((data: Partial<CompanyFormData>) => {
    dispatch({ type: "UPDATE_COMPANY", payload: data });
  }, []);

  const updateSimulation = useCallback((data: Partial<SimulationFormData>) => {
    dispatch({ type: "UPDATE_SIMULATION", payload: data });
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

  const updateProductBudgetImpact = useCallback((impact: number) => {
    dispatch({ type: "UPDATE_PRODUCT_BUDGET_IMPACT", payload: impact });
  }, []);

  const getProjectedCashBalance = useCallback(() => {
    return (
      state.cashBalance.originalCashBalance +
      state.cashBalance.financeBudgetImpact -
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

  const setStep = (step: number) => {
    dispatch({ type: "SET_STEP", payload: step });
  };

  const setTotalSteps = (total: number) => {
    dispatch({ type: "SET_TOTAL_STEPS", payload: total });
  };

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
      // Basic validation logic - extend as needed
      if (value === null || value === undefined || value === "") {
        return `${field} is required`;
      }

      if (typeof value === "number" && value < 0) {
        return `${field} must be a positive number`;
      }

      return undefined;
    },
    []
  );

  // New methods for comprehensive submission
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

  const validateAllForms = useCallback((): {
    valid: boolean;
    errors: Record<string, string>;
  } => {
    const errors: Record<string, string> = {};
    let valid = true;

    // Validate each section
    const sections = [
      "finance",
      "marketing",
      "production",
      "hr",
      "rd",
      "product",
    ] as const;

    sections.forEach((section) => {
      const data = state[section];

      // Check if section has required fields filled
      if (Object.keys(data).length === 0) {
        errors[section] = `${section} section is incomplete`;
        valid = false;
      }

      // Additional validation can be added here
      for (const [key, value] of Object.entries(data)) {
        const fieldError = validateField(`${section}.${key}`, value);
        if (fieldError) {
          errors[`${section}.${key}`] = fieldError;
          valid = false;
        }
      }
    });

    // Check cash balance
    const projectedBalance = getProjectedCashBalance();
    if (projectedBalance < 0) {
      errors.cashBalance = "Insufficient cash balance for all decisions";
      valid = false;
    }

    return { valid, errors };
  }, [state, validateField, getProjectedCashBalance]);

  const getCompletionStatus = useCallback(() => {
    const sections = [
      "finance",
      "marketing",
      "production",
      "hr",
      "rd",
      "product",
    ];
    const completed = sections.filter(
      (section) =>
        state.completedSections[section] ||
        Object.keys(state[section as keyof FormState]).length > 0
    ).length;

    return {
      completed,
      total: sections.length,
      sections: sections.filter(
        (section) =>
          state.completedSections[section] ||
          Object.keys(state[section as keyof FormState]).length > 0
      ),
    };
  }, [state]);

  const submitAllForms = useCallback(
    async (companyId: string, period: number): Promise<boolean> => {
      try {
        setSubmitting(true);
        clearErrors();

        // Validate all forms first
        const validation = validateAllForms();
        if (!validation.valid) {
          setErrors(validation.errors);
          return false;
        }

        const results: Record<
          string,
          { success: boolean; error?: string; id?: string }
        > = {};

        // Submit each section that has data
        const submissionPromises: Promise<void>[] = [];

        // Finance submission
        if (Object.keys(state.finance).length > 0) {
          submissionPromises.push(
            (async () => {
              try {
                // Import and call finance submission action
                const { submitFinanceDecisionForPeriod } = await import(
                  "../_actions/finance"
                );
                const financeData = state.finance as FinanceFormData;
                const id = await submitFinanceDecisionForPeriod({
                  company_id: companyId,
                  period,
                  ...financeData,
                  notes: "",
                });
                results.finance = { success: true, id };
              } catch (error) {
                results.finance = {
                  success: false,
                  error:
                    error instanceof Error
                      ? error.message
                      : "Finance submission failed",
                };
              }
            })()
          );
        }

        // HR submission
        if (Object.keys(state.hr).length > 0) {
          submissionPromises.push(
            (async () => {
              try {
                const { submitHRDecisionForPeriod } = await import("../_actions/submitHRDecisionForPeriod");
                const hrData = state.hr as HRFormData;
        
                // Your role conversion code here:
                const existingRoles = hrData.existingRoles ?? [];
                const newRoles = hrData.newRoles ?? [];
        
                const existingRolesForSubmit: RoleInput[] = existingRoles.map(role => ({
                  role_name: role.role_name,
                  salary_per_head: role.salary_per_head,
                  hires: role.hires,
                  fires: role.fires,
                }));
        
                const newRolesForSubmit: RoleInput[] = newRoles.map(role => ({
                  role_name: role.role_name,
                  salary_per_head: role.salary_per_head,
                  hires: role.hires,
                  fires: 0,
                }));
        
                const rolesForSubmit: RoleInput[] = [...existingRolesForSubmit, ...newRolesForSubmit];
        
                const id = await submitHRDecisionForPeriod({
                  company_id: companyId,
                  period,
                  training_budget: hrData.trainingBudget || 0,
                  employee_satisfaction: hrData.employeeSatisfaction || 50,
                  roles: rolesForSubmit,
                });
        
                results.hr = { success: true, id };
              } catch (error) {
                results.hr = {
                  success: false,
                  error: error instanceof Error ? error.message : "HR submission failed",
                };
              }
            })()
          );
        }

        // Marketing submission
        if (Object.keys(state.marketing).length > 0) {
          submissionPromises.push(
            (async () => {
              try {
                // Marketing submission logic would go here
                // You'll need to create the marketing submission action
                results.marketing = { success: true };
              } catch (error) {
                results.marketing = {
                  success: false,
                  error:
                    error instanceof Error
                      ? error.message
                      : "Marketing submission failed",
                };
              }
            })()
          );
        }

        // Production submission
        if (Object.keys(state.production).length > 0) {
          submissionPromises.push(
            (async () => {
              try {
                // Production submission logic would go here
                results.production = { success: true };
              } catch (error) {
                results.production = {
                  success: false,
                  error:
                    error instanceof Error
                      ? error.message
                      : "Production submission failed",
                };
              }
            })()
          );
        }

        // R&D submission
        if (Object.keys(state.rd).length > 0) {
          submissionPromises.push(
            (async () => {
              try {
                // R&D submission logic would go here
                results.rd = { success: true };
              } catch (error) {
                results.rd = {
                  success: false,
                  error:
                    error instanceof Error
                      ? error.message
                      : "R&D submission failed",
                };
              }
            })()
          );
        }

        // Product submission
        if (Object.keys(state.product).length > 0) {
          submissionPromises.push(
            (async () => {
              try {
                // Product submission logic would go here
                results.product = { success: true };
              } catch (error) {
                results.product = {
                  success: false,
                  error:
                    error instanceof Error
                      ? error.message
                      : "Product submission failed",
                };
              }
            })()
          );
        }

        // Wait for all submissions to complete
        await Promise.all(submissionPromises);

        // Update submission results in state
        dispatch({
          type: "BULK_UPDATE_FORMS",
          payload: {
            submissionResults: results,
            submissionStatus: Object.values(results).every((r) => r.success)
              ? "success"
              : "error",
          },
        });

        const allSuccessful = Object.values(results).every(
          (result) => result.success
        );

        if (allSuccessful) {
          // Reset form after successful submission
          resetAll();
        } else {
          // Set errors for failed submissions
          const submissionErrors: Record<string, string> = {};
          Object.entries(results).forEach(([section, result]) => {
            if (!result.success && result.error) {
              submissionErrors[section] = result.error;
            }
          });
          setErrors(submissionErrors);
        }

        return allSuccessful;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Submission failed";
        setError("general", errorMessage);
        dispatch({
          type: "BULK_UPDATE_FORMS",
          payload: { submissionStatus: "error" },
        });
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [
      state,
      setSubmitting,
      clearErrors,
      validateAllForms,
      setErrors,
      setError,
      resetAll,
    ]
  );

  const contextValue: FormContextType = {
    state,
    dispatch,
    updateFinance,
    updateMarketing,
    updateProduction,
    updateHR,
    updateRD,
    updateProduct,
    updateCompany,
    updateSimulation,
    setOriginalCashBalance,
    updateHRBudgetImpact,
    updateFinanceBudgetImpact,
    updateMarketingBudgetImpact,
    updateProductionBudgetImpact,
    updateRDBudgetImpact,
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
    submitAllForms,
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

// Export specific form hooks for convenience
export function useFinanceForm() {
  const {
    state,
    updateFinance,
    setError,
    getError,
    updateFinanceBudgetImpact,
  } = useForm();

  const updateDataWithCashImpact = useCallback(
    (data: Partial<FinanceFormData>) => {
      // Calculate budget impact from the new data being passed in
      const investment_amount = data.investment_amount ?? state.finance.investment_amount ?? 0;
      const loan_amount = data.loan_amount ?? state.finance.loan_amount ?? 0;
      const repay_loan = data.repay_loan ?? state.finance.repay_loan ?? 0;
      const dividend_payout = data.dividend_payout ?? state.finance.dividend_payout ?? 0;
      const equity_issue = data.equity_issue ?? state.finance.equity_issue ?? 0;

      // Positive impact = cash inflow, Negative impact = cash outflow
      const cashInflow = loan_amount + equity_issue;
      const cashOutflow = investment_amount + repay_loan + dividend_payout;
      const budgetImpact = cashInflow - cashOutflow;

      updateFinance(data);
      updateFinanceBudgetImpact(budgetImpact);
    },
    [updateFinance, updateFinanceBudgetImpact, state.finance]
  );

  return {
    data: state.finance,
    updateData: updateDataWithCashImpact,
    setError,
    getError,
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
    (data: Partial<MarketingFormData>) => {
      // Calculate budget impact from the new data being passed in
      const advertising_budget = data.advertising_budget ?? state.marketing.advertising_budget ?? 0;
      const promotion_budget = data.promotion_budget ?? state.marketing.promotion_budget ?? 0;
      const market_research_budget = data.market_research_budget ?? state.marketing.market_research_budget ?? 0;
      const brand_investment = data.brand_investment ?? state.marketing.brand_investment ?? 0;
      const digital_marketing_budget = data.digital_marketing_budget ?? state.marketing.digital_marketing_budget ?? 0;

      const budgetImpact = advertising_budget + promotion_budget + market_research_budget + brand_investment + digital_marketing_budget;

      updateMarketing(data);
      updateMarketingBudgetImpact(budgetImpact);
    },
    [updateMarketing, updateMarketingBudgetImpact, state.marketing]
  );

  return {
    data: state.marketing,
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
      // Calculate budget impact from the new data being passed in
      const quality_investment = data.quality_investment ?? state.production.quality_investment ?? 0;
      const efficiency_investment = data.efficiency_investment ?? state.production.efficiency_investment ?? 0;
      const automation_investment = data.automation_investment ?? state.production.automation_investment ?? 0;
      const maintenance_budget = data.maintenance_budget ?? state.production.maintenance_budget ?? 0;

      const budgetImpact = quality_investment + efficiency_investment + automation_investment + maintenance_budget;

      updateProduction(data);
      updateProductionBudgetImpact(budgetImpact);
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
  const { state, updateHR, setError, getError, updateHRBudgetImpact } =
    useForm();

    const updateDataWithCashImpact = useCallback(
      (data: Partial<HRFormData>) => {
        const existingRoles = data.existingRoles ?? state.hr.existingRoles ?? [];
        const newRoles = data.newRoles ?? state.hr.newRoles ?? [];
        const trainingBudget = data.trainingBudget ?? state.hr.trainingBudget ?? 0;
    
        // Calculate cost impact from existing roles: net hires minus fires times salary
        const existingRolesCost = existingRoles.reduce((sum, role) => {
          const hires = role.hires ?? 0;
          const fires = role.fires ?? 0;
          const netChange = hires - fires;
          // Defensive fallback on salary_per_head
          const salary = role.salary_per_head ?? 0;
          return sum + netChange * salary;
        }, 0);
    
        // Calculate cost from new roles: hires times salary, fires assumed zero for new roles
        const newRolesCost = newRoles.reduce((sum, role) => {
          const hires = role.hires ?? 0;
          const salary = role.salary_per_head ?? 0;
          return sum + hires * salary;
        }, 0);
    
        // Total budget impact includes training budget
        const budgetImpact = existingRolesCost + newRolesCost + trainingBudget;
    
        updateHR(data);
        updateHRBudgetImpact(budgetImpact);
      },
      [updateHR, updateHRBudgetImpact, state.hr]
    );    

  return {
    data: state.hr,
    updateData: updateDataWithCashImpact,
    setError,
    getError,
  };
}

export function useRDForm() {
  const { state, updateRD, setError, getError, updateRDBudgetImpact } =
    useForm();

  const updateDataWithCashImpact = useCallback(
    (data: Partial<RDFormData>) => {
      // Calculate budget impact from the new data being passed in
      const rd_budget = data.rd_budget ?? state.rd.rd_budget ?? 0;
      const product_development = data.product_development ?? state.rd.product_development ?? 0;
      const technology_upgrade = data.technology_upgrade ?? state.rd.technology_upgrade ?? 0;

      const budgetImpact = rd_budget + product_development + technology_upgrade;

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

export function useProductForm() {
  const {
    state,
    updateProduct,
    setError,
    getError,
    updateProductBudgetImpact,
  } = useForm();

  const updateDataWithCashImpact = useCallback(
    (data: Partial<ProductFormData>) => {
      // Calculate budget impact from the new data being passed in
      const development_cost = data.development_cost ?? state.product.development_cost ?? 0;
      const launch_budget = data.launch_budget ?? state.product.launch_budget ?? 0;

      const budgetImpact = development_cost + launch_budget;

      updateProduct(data);
      updateProductBudgetImpact(budgetImpact);
    },
    [updateProduct, updateProductBudgetImpact, state.product]
  );

  return {
    data: state.product,
    updateData: updateDataWithCashImpact,
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

export function useSimulationForm() {
  const { state, updateSimulation, setError, getError } = useForm();
  return {
    data: state.simulation,
    updateData: updateSimulation,
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
    updateProductBudgetImpact,
    getProjectedCashBalance,
    originalCashBalance: state.cashBalance.originalCashBalance,
    projectedCashBalance,
  };
}

// Comprehensive form submission hook
export function useFormSubmission() {
  const {
    state,
    submitAllForms,
    validateAllForms,
    getCompletionStatus,
    getAllFormData,
    setFormCompleted,
    resetAll,
    clearErrors,
  } = useForm();

  const submitAllSections = useCallback(
    async (companyId: string, period: number) => {
      return await submitAllForms(companyId, period);
    },
    [submitAllForms]
  );

  const validateAll = useCallback(() => {
    return validateAllForms();
  }, [validateAllForms]);

  const getProgress = useCallback(() => {
    return getCompletionStatus();
  }, [getCompletionStatus]);

  const exportFormData = useCallback(() => {
    return getAllFormData();
  }, [getAllFormData]);

  const markSectionComplete = useCallback(
    (section: string, completed: boolean = true) => {
      setFormCompleted(section, completed);
    },
    [setFormCompleted]
  );

  return {
    // State
    isSubmitting: state.isSubmitting,
    submissionStatus: state.submissionStatus,
    submissionResults: state.submissionResults,
    completedSections: state.completedSections,

    // Actions
    submitAllSections,
    validateAll,
    getProgress,
    exportFormData,
    markSectionComplete,
    resetAll,
    clearErrors,

    // Computed values
    hasData: Object.values(state).some(
      (section) =>
        typeof section === "object" &&
        section !== null &&
        !(section instanceof Array) &&
        Object.keys(section).length > 0
    ),
    canSubmit: validateAllForms().valid,
  };
}
