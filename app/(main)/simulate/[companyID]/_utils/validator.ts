import { z } from "zod";

/* ---------------------- Product ---------------------- */
export const productSchema = z.object({
  id: z.string(),
  company_id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  category: z.string(),
  quality_rating: z.number().default(0),
  innovation_rating: z.number().default(0),
  sustainability_rating: z.number().default(0),
  production_cost: z.number().default(0),
  selling_price: z.number().default(0),
  inventory_level: z.number().default(0),
  production_capacity: z.number().default(2000),
  development_cost: z.number().default(0),
  marketing_budget: z.number().default(0),
  status: z.string().default("development"),
  launch_period: z.number().optional(),
  discontinue_period: z.number().optional(),
  created_at: z.date().default(new Date()),
  updated_at: z.date().default(new Date()),
});

export const createProductSchema = productSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

/* ---------------------- Finance ---------------------- */
export const financeSchema = z.object({
  id: z.string(),
  company_id: z.string(),
  user_id: z.string().nullable().optional(),
  period: z.number(),
  total_revenue: z.number().default(0),
  net_profit: z.number().default(0),
  cash_balance: z.number().default(0),
  operating_costs: z.number().default(0),
  roi: z.number().default(0),
  burn_rate: z.number().default(0),
  finalised: z.boolean().default(false),
  investment_amount: z.number().default(0),
  loan_amount: z.number().default(0),
  repay_loan: z.number().default(0),
  dividend_payout: z.number().default(0),
  equity_issue: z.number().default(0),
  notes: z.string().optional(),
  processed: z.boolean().default(false),
  submitted_at: z.date().default(new Date()),
  processed_at: z.date().optional(),
  created_at: z.date().default(new Date()),
  updated_at: z.date().default(new Date()),
});

export const createFinanceSchema = financeSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  submitted_at: true,
  processed_at: true,
});

/* ---------------------- Production ---------------------- */
export const productionSchema = z
  .object({
    id: z.string(),
    company_id: z.string(),
    period: z.number(),
    production_capacity: z.number(),
    inventory_value: z.number(),
    storage_capacity: z.number(),
    cash_balance: z.number(),
    defect_rate: z.number(),
    units_to_produce: z.number(),
    cost_per_unit: z.number(),
    production_cost: z.number(),
    finalised: z.boolean().default(false),
    created_at: z.date().default(new Date()),
    updated_at: z.date().default(new Date()),
  })
  .superRefine((data, ctx) => {
    console.log("Validator superRefine called with:", {
      units_to_produce: data.units_to_produce,
      production_capacity: data.production_capacity,
      comparison: data.units_to_produce > data.production_capacity,
      types: {
        units: typeof data.units_to_produce,
        capacity: typeof data.production_capacity,
      },
    });

    // Ensure units to produce doesn't exceed production capacity
    if (data.units_to_produce > data.production_capacity) {
      console.log("Adding validation error for units exceeding capacity");
      ctx.addIssue({
        code: "custom",
        message: `Units to produce (${data.units_to_produce}) cannot exceed production capacity (${data.production_capacity})`,
        path: ["units_to_produce"],
      });
    }

    // Warning for low capacity utilization (optional business rule)
    if (data.production_capacity > 0 && data.units_to_produce > 0) {
      const utilizationRate =
        (data.units_to_produce / data.production_capacity) * 100;
      if (utilizationRate < 50) {
        ctx.addIssue({
          code: "custom",
          message: `Low capacity utilization (${utilizationRate.toFixed(
            1
          )}%). Consider reducing production capacity or increasing production units.`,
          path: ["production_capacity"],
        });
      }
    }

    // Ensure sufficient cash balance for production cost
    if (data.production_cost > data.cash_balance) {
      ctx.addIssue({
        code: "custom",
        message: "Production cost cannot exceed cash balance",
        path: ["production_cost"],
      });
      ctx.addIssue({
        code: "custom",
        message: "Insufficient cash balance for production cost",
        path: ["cash_balance"],
      });
    }
  });

export const createProductionSchema = productionSchema
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
    finalised: true,
  })
  .refine((data) => data.units_to_produce <= data.production_capacity, {
    message: "Units to produce cannot exceed production capacity",
    path: ["units_to_produce"],
  });

/* ---------------------- Production Form ---------------------- */

/* ---------------------- HR Decision ---------------------- */
export const hrDecisionSchema = z.object({
  id: z.string(),
  company_id: z.string(),
  period: z.number(),
  is_submitted: z.boolean().default(false),
  submitted_at: z.date().default(new Date()),
  salary_budget: z.number().default(0),
  training_budget: z.number().default(0),
  total_budget: z.number().default(0),
  employee_satisfaction: z.number().default(0),
  recruitment_cost: z.number().default(0),
  firing_cost: z.number().default(0),
});

export const createHrDecisionSchema = hrDecisionSchema.omit({
  id: true,
  submitted_at: true,
});

/* ---------------------- HR Role Decision ---------------------- */
export const hrRoleDecisionSchema = z.object({
  id: z.string(),
  hr_decision_id: z.string(),
  role_name: z.string(),
  salary_per_head: z.number(),
  head_count: z.number(),
});

export const createHrRoleDecisionSchema = hrRoleDecisionSchema.omit({
  id: true,
});

/* ---------------------- R&D ---------------------- */
export const rdSchema = z.object({
  id: z.string(),
  company_id: z.string(),
  period: z.number(),
  budget: z.number(),
  pip: z.number(),
  time_to_market: z.number(),
  total_development: z.number(),
  patented: z.number(),
  quality_changes: z.number(),
  finalised: z.boolean().default(false),
  created_at: z.date().default(new Date()),
  updated_at: z.date().default(new Date()),
});

export const createRdSchema = rdSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

/* ---------------------- Marketing ---------------------- */
export const marketingSchema = z.object({
  id: z.string(),
  company_id: z.string(),
  period: z.number(),
  budget: z.number(),
  offline: z.number(),
  online: z.number(),
  roi: z.number(),
  conversion_rate: z.number(),
  finalised: z.boolean().default(false),
  created_at: z.date().default(new Date()),
  updated_at: z.date().default(new Date()),
});

export const createMarketingSchema = marketingSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

/* ---------------------- Product Performance ---------------------- */
export const productPerformanceSchema = z.object({
  id: z.string(),
  product_id: z.string(),
  period: z.number(),
  data: z.string().default("{}"),
  sales_volume: z.number().default(0),
  revenue: z.number().default(0),
  costs: z.number().default(0),
  profit: z.number().default(0),
  market_share: z.number().default(0),
  customer_satisfaction: z.number().default(0),
  created_at: z.date().default(new Date()),
});

export const createProductPerformanceSchema = productPerformanceSchema.omit({
  id: true,
  created_at: true,
});

/* ---------------------- Inferred Types ---------------------- */
export type Product = z.infer<typeof productSchema>;
export type Finance = z.infer<typeof financeSchema>;
export type Production = z.infer<typeof productionSchema>;
export type HrDecision = z.infer<typeof hrDecisionSchema>;
export type HrRoleDecision = z.infer<typeof hrRoleDecisionSchema>;
export type RD = z.infer<typeof rdSchema>;
export type Marketing = z.infer<typeof marketingSchema>;
export type ProductPerformance = z.infer<typeof productPerformanceSchema>;
export type CreateProduct = z.infer<typeof createProductSchema>;
export type CreateFinance = z.infer<typeof createFinanceSchema>;
export type CreateProduction = z.infer<typeof createProductionSchema>;
export type CreateHrDecision = z.infer<typeof createHrDecisionSchema>;
export type CreateHrRoleDecision = z.infer<typeof createHrRoleDecisionSchema>;
export type CreateRD = z.infer<typeof createRdSchema>;
export type CreateMarketing = z.infer<typeof createMarketingSchema>;
export type CreateProductPerformance = z.infer<
  typeof createProductPerformanceSchema
>;
