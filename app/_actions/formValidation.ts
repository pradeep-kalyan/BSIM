export interface FormData {
  hr?: {
    total_budget?: number;
    salary_budget?: number;
    training_budget?: number;
  };
  marketing?: {
    budget?: number;
    offline?: number;
    online?: number;
  };
  rd?: {
    budget?: number;
  };
  production?: {
    units_to_produce?: number;
    cost_per_unit?: number;
    defect_rate?: number;
  };
  finance?: {
    investment_amount?: number;
    loan_amount?: number;
    repay_loan?: number;
    dividend_payout?: number;
    equity_issue?: number;
  };
  product?: {
    name?: string;
    production_cost?: number;
    selling_price?: number;
    development_cost?: number;
    marketing_budget?: number;
    quality_rating?: number;
    innovation_rating?: number;
    sustainability_rating?: number;
  };
  sales?: {
    sales_volume?: number;
    revenue?: number;
    costs?: number;
    profit?: number;
    market_share?: number;
    customer_satisfaction?: number;
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateFormData(formData: FormData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate HR data
  if (!formData.hr) {
    errors.push({ field: "hr", message: "HR data is required" });
  } else {
    if ((formData.hr.total_budget ?? 0) < 0) {
      errors.push({
        field: "hr.total_budget",
        message: "HR budget cannot be negative",
      });
    }
    if ((formData.hr.salary_budget ?? 0) < 0) {
      errors.push({
        field: "hr.salary_budget",
        message: "Salary budget cannot be negative",
      });
    }
    if ((formData.hr.training_budget ?? 0) < 0) {
      errors.push({
        field: "hr.training_budget",
        message: "Training budget cannot be negative",
      });
    }
  }

  // Validate Marketing data
  if (!formData.marketing) {
    errors.push({ field: "marketing", message: "Marketing data is required" });
  } else {
    if ((formData.marketing.budget ?? 0) < 0) {
      errors.push({
        field: "marketing.budget",
        message: "Marketing budget cannot be negative",
      });
    }
    if ((formData.marketing.offline ?? 0) < 0) {
      errors.push({
        field: "marketing.offline",
        message: "Offline marketing budget cannot be negative",
      });
    }
    if ((formData.marketing.online ?? 0) < 0) {
      errors.push({
        field: "marketing.online",
        message: "Online marketing budget cannot be negative",
      });
    }
    const offline = formData.marketing.offline ?? 0;
    const online = formData.marketing.online ?? 0;
    const budget = formData.marketing.budget ?? 0;
    if (offline + online !== budget) {
      errors.push({
        field: "marketing",
        message:
          "Online and offline budgets must sum to total marketing budget",
      });
    }
  }

  // Validate R&D data
  if (!formData.rd) {
    errors.push({ field: "rd", message: "R&D data is required" });
  } else {
    if ((formData.rd.budget ?? 0) < 0) {
      errors.push({
        field: "rd.budget",
        message: "R&D budget cannot be negative",
      });
    }
  }

  // Validate Production data
  if (!formData.production) {
    errors.push({
      field: "production",
      message: "Production data is required",
    });
  } else {
    if ((formData.production.units_to_produce ?? 0) < 0) {
      errors.push({
        field: "production.units_to_produce",
        message: "Units to produce cannot be negative",
      });
    }
    if ((formData.production.cost_per_unit ?? 0) < 0) {
      errors.push({
        field: "production.cost_per_unit",
        message: "Cost per unit cannot be negative",
      });
    }
    const defectRate = formData.production.defect_rate ?? 0;
    if (defectRate < 0 || defectRate > 100) {
      errors.push({
        field: "production.defect_rate",
        message: "Defect rate must be between 0 and 100",
      });
    }
  }

  // Validate Finance data
  if (!formData.finance) {
    errors.push({ field: "finance", message: "Finance data is required" });
  } else {
    if ((formData.finance.investment_amount ?? 0) < 0) {
      errors.push({
        field: "finance.investment_amount",
        message: "Investment amount cannot be negative",
      });
    }
    if ((formData.finance.loan_amount ?? 0) < 0) {
      errors.push({
        field: "finance.loan_amount",
        message: "Loan amount cannot be negative",
      });
    }
    if ((formData.finance.repay_loan ?? 0) < 0) {
      errors.push({
        field: "finance.repay_loan",
        message: "Loan repayment cannot be negative",
      });
    }
    if ((formData.finance.dividend_payout ?? 0) < 0) {
      errors.push({
        field: "finance.dividend_payout",
        message: "Dividend payout cannot be negative",
      });
    }
    if ((formData.finance.equity_issue ?? 0) < 0) {
      errors.push({
        field: "finance.equity_issue",
        message: "Equity issue cannot be negative",
      });
    }
  }

  // Validate Product data (optional but if provided should be valid)
  if (formData.product && formData.product.name) {
    if ((formData.product.production_cost ?? 0) < 0) {
      errors.push({
        field: "product.production_cost",
        message: "Production cost cannot be negative",
      });
    }
    if ((formData.product.selling_price ?? 0) < 0) {
      errors.push({
        field: "product.selling_price",
        message: "Selling price cannot be negative",
      });
    }
    if ((formData.product.development_cost ?? 0) < 0) {
      errors.push({
        field: "product.development_cost",
        message: "Development cost cannot be negative",
      });
    }
    if ((formData.product.marketing_budget ?? 0) < 0) {
      errors.push({
        field: "product.marketing_budget",
        message: "Product marketing budget cannot be negative",
      });
    }
    const qualityRating = formData.product.quality_rating ?? 0;
    if (qualityRating < 0 || qualityRating > 10) {
      errors.push({
        field: "product.quality_rating",
        message: "Quality rating must be between 0 and 10",
      });
    }
    const innovationRating = formData.product.innovation_rating ?? 0;
    if (innovationRating < 0 || innovationRating > 10) {
      errors.push({
        field: "product.innovation_rating",
        message: "Innovation rating must be between 0 and 10",
      });
    }
    const sustainabilityRating = formData.product.sustainability_rating ?? 0;
    if (sustainabilityRating < 0 || sustainabilityRating > 10) {
      errors.push({
        field: "product.sustainability_rating",
        message: "Sustainability rating must be between 0 and 10",
      });
    }
  }

  // Validate Sales data (optional but if provided should be valid)
  if (formData.sales) {
    if ((formData.sales.sales_volume ?? 0) < 0) {
      errors.push({
        field: "sales.sales_volume",
        message: "Sales volume cannot be negative",
      });
    }
    if ((formData.sales.revenue ?? 0) < 0) {
      errors.push({
        field: "sales.revenue",
        message: "Revenue cannot be negative",
      });
    }
    if ((formData.sales.costs ?? 0) < 0) {
      errors.push({
        field: "sales.costs",
        message: "Costs cannot be negative",
      });
    }
    const marketShare = formData.sales.market_share ?? 0;
    if (marketShare < 0 || marketShare > 100) {
      errors.push({
        field: "sales.market_share",
        message: "Market share must be between 0 and 100",
      });
    }
    const customerSatisfaction = formData.sales.customer_satisfaction ?? 0;
    if (customerSatisfaction < 1 || customerSatisfaction > 10) {
      errors.push({
        field: "sales.customer_satisfaction",
        message: "Customer satisfaction must be between 1 and 10",
      });
    }
  }

  return errors;
}

export function calculateTotalBudget(formData: FormData): number {
  return (
    (formData.hr?.total_budget || 0) +
    (formData.marketing?.budget || 0) +
    (formData.rd?.budget || 0) +
    (formData.production?.units_to_produce || 0) *
      (formData.production?.cost_per_unit || 0) +
    (formData.finance?.investment_amount || 0) +
    (formData.finance?.loan_amount || 0) +
    (formData.product?.development_cost || 0) +
    (formData.product?.marketing_budget || 0)
  );
}
