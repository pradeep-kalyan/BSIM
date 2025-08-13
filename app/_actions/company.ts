"use server";

import prisma from "@/app/functions/prisma";
import { getCurrentUser } from "@/app/functions/jwt";
import { revalidatePath } from "next/cache";

interface ProductInput {
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
  status?: string;
  launch_period?: number;
  discontinue_period?: number;
}

interface CreateCompanyInput {
  simulation_id: string;
  user_id: string;
  name: string;
  description?: string;
  logo_url?: string;
  cash_balance?: number;
  total_assets?: number;
  total_liabilities?: number;
  brand_value?: number;
  products?: ProductInput[];
  accessEmails?: string[];
}

// Get companies accessible to current user
export async function getCompaniesBySimulation(simulationId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const companies = await prisma.company.findMany({
      where: {
        simulation_id: simulationId,
        OR: [
          { user_id: user.id },
          {
            company_access: {
              some: { user_id: user.id },
            },
          },
          {
            simulation: {
              simulation_access: {
                some: { user_id: user.id },
              },
            },
          },
        ],
      },
      include: {
        user: true,
        products: true,
        company_access: {
          include: {
            user: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        created_at: "asc",
      },
    });

    return companies.map((company) => {
      const isOwner = company.user_id === user.id;
      const accessEntry = company.company_access.find(
        (access) => access.user_id === user.id
      );

      return {
        ...company,
        canAccess: isOwner || !!accessEntry,
        canEdit: isOwner || accessEntry?.access_level === "editor",
      };
    });
  } catch (error) {
    console.error("Error fetching companies with access:", error);
    throw new Error("Failed to fetch companies");
  }
}

// Get first company
export async function getFirstCompany(simulationId: string) {
  const companies = await getCompaniesBySimulation(simulationId);
  return companies.length > 0 ? companies[0] : null;
}
interface CreateHRDecisionWithRolesInput {
  company_id: string;
  period: number;
  is_submitted: boolean;
  salary_budget: number;
  training_budget: number;
  total_budget: number;
  employee_satisfaction: number;
  roles: Array<{
    role_name: string;
    salary_per_head: number;
    head_count: number;
  }>;
}

interface CreateCompanyWithHRInput extends CreateCompanyInput {
  hrDecision: Omit<CreateHRDecisionWithRolesInput, "company_id">;
}

export async function createCompany(data: CreateCompanyWithHRInput) {
  return await prisma.$transaction(async (tx) => {
    // 1. Create company with products
    const company = await tx.company.create({
      data: {
        simulation_id: data.simulation_id,
        user_id: data.user_id,
        name: data.name,
        description: data.description,
        logo_url: data.logo_url,
        cash_balance: data.cash_balance ?? 0,
        total_assets: data.total_assets ?? 0,
        total_liabilities: data.total_liabilities ?? 0,
        brand_value: data.brand_value ?? 0,
        products:
          data.products && data.products.length > 0
            ? {
                create: data.products.map((p) => ({
                  name: p.name,
                  description: p.description,
                  category: p.category,
                  quality_rating: p.quality_rating,
                  innovation_rating: p.innovation_rating,
                  sustainability_rating: p.sustainability_rating,
                  status: p.status,
                  launch_period: p.launch_period,
                  discontinue_period: p.discontinue_period,
                })),
              }
            : undefined,
      },
    });

    // 2. Create HR decision
    const hrDecision = await tx.hr_decision.create({
      data: {
        company_id: company.id,
        period: data.hrDecision.period,
        is_submitted: data.hrDecision.is_submitted,
        salary_budget: data.hrDecision.salary_budget,
        training_budget: data.hrDecision.training_budget,
        total_budget: data.hrDecision.total_budget,
        employee_satisfaction: data.hrDecision.employee_satisfaction,
        roles: {
          create: data.hrDecision.roles.map((r) => ({
            role_name: r.role_name,
            salary_per_head: r.salary_per_head,
            head_count: r.head_count,
          })),
        },
      },
    });

    // 3. Upsert simulation access for creator
    await tx.simulation_access.upsert({
      where: {
        simulation_id_user_id: {
          simulation_id: data.simulation_id,
          user_id: data.user_id,
        },
      },
      update: {},
      create: {
        simulation_id: data.simulation_id,
        user_id: data.user_id,
        access_level: "editor",
      },
    });

    // Add other access grants here if needed

    return { company, hrDecision };
  });
}

// Update company details
export async function updateCompany(
  companyId: string,
  data: {
    name?: string;
    description?: string;
    logo_url?: string;
    cash_balance?: number;
    total_assets?: number;
    total_liabilities?: number;
    brand_value?: number;
  }
) {
  await prisma.company.update({
    where: { id: companyId },
    data: {
      ...data,
      updated_at: new Date(),
    },
  });

  revalidatePath("/companies");
  revalidatePath(`/companies/${companyId}`);
}

// Grant access to a user by email
export async function grantAccessByEmail(companyId: string, email: string) {
  const userToAdd = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
  const admin = await getCurrentUser();
  if (!admin) throw new Error("Unauthorized");

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { simulation: true },
  });

  if (!company) throw new Error("Company not found");

  if (!userToAdd) {
    console.error(`No user found for email: ${email}`);
    return;
  }

  await prisma.company_access.upsert({
    where: {
      company_id_user_id: {
        company_id: companyId,
        user_id: userToAdd.id,
      },
    },
    update: {
      access_level: "viewer",
    },
    create: {
      company_id: companyId,
      user_id: userToAdd.id,
      access_level: "viewer",
    },
  });
  await prisma.simulation_access.upsert({
    where: {
      simulation_id_user_id: {
        simulation_id: company.simulation_id,
        user_id: userToAdd.id,
      },
    },
    update: {}, // already has access
    create: {
      simulation_id: company.simulation_id,
      user_id: userToAdd.id,
      access_level: "viewer", // optional: can be "editor" too
    },
  });

  revalidatePath("/companies");
}
// Revoke access
export async function revokeAccessByEmail(companyId: string, email: string) {
  const owner = await getCurrentUser();
  if (!owner) throw new Error("Unauthorized");

  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company || company.user_id !== owner.id)
    throw new Error("Forbidden: not owner");

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) return;

  await prisma.company_access.deleteMany({
    where: {
      company_id: companyId,
      user_id: user.id,
    },
  });

  revalidatePath(`/companies/${companyId}`);
}

// Optional: delete company (by owner only)
export async function deleteCompany(companyId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company || company.user_id !== user.id)
    throw new Error("Forbidden: not owner");

  // Delete hr_role_decision records related to hr_decisions of this company
  await prisma.hr_role_decision.deleteMany({
    where: {
      hr_decision: {
        company_id: companyId,
      },
    },
  });

  // Delete hr_decision records related to this company
  await prisma.hr_decision.deleteMany({
    where: {
      company_id: companyId,
    },
  });

  // Delete product_performance records (depends on product)
  // Prisma should cascade delete product_performance on product delete if set,
  // but being explicit in code for safety:
  await prisma.product_performance.deleteMany({
    where: {
      product: {
        company_id: companyId,
      },
    },
  });

  // Delete products
  await prisma.product.deleteMany({
    where: {
      company_id: companyId,
    },
  });

  // Delete finance decisions related to company
  await prisma.finance.deleteMany({
    where: {
      company_id: companyId,
    },
  });

  // Delete production decisions
  await prisma.production.deleteMany({
    where: {
      company_id: companyId,
    },
  });

  // Delete R&D decisions
  await prisma.rd.deleteMany({
    where: {
      company_id: companyId,
    },
  });

  // Delete marketing decisions
  await prisma.marketing.deleteMany({
    where: {
      company_id: companyId,
    },
  });

  // Delete company_access records for this company
  await prisma.company_access.deleteMany({
    where: {
      company_id: companyId,
    },
  });

  // Now finally delete the company
  await prisma.company.delete({
    where: { id: companyId },
  });

  revalidatePath("/companies");
}
export async function getCompanyComparisonData(
  simulationId: string,
  companyIds: string[]
) {
  const companies = await prisma.company.findMany({
    where: {
      simulation_id: simulationId,
      id: { in: companyIds },
    },
    include: {
      finance_decisions: {
        orderBy: { period: "desc" },
        take: 1,
      },
      hr_decisions: {
        orderBy: { period: "desc" },
        take: 1,
      },
      rd_decisions: {
        orderBy: { period: "desc" },
        take: 1,
      },
      production_decisions: {
        orderBy: { period: "desc" },
        take: 1,
      },
      products: {
        orderBy: { name: "asc" }, // You can sort by 'created_at' or 'id' if needed
        take: 3,
        include: {
          performances: {
            orderBy: { period: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  return companies.map((company) => {
    const finance = company.finance_decisions[0];
    const hr = company.hr_decisions[0];
    const rd = company.rd_decisions[0];
    const production = company.production_decisions[0];

    return {
      id: company.id,
      name: company.name,
      cash_balance: company.cash_balance ?? 0,
      total_assets: company.total_assets ?? 0,
      total_liabilities: company.total_liabilities ?? 0,
      brand_value: company.brand_value ?? 0,
      current_period: company.current_period ?? 0,
      finance: {
        total_revenue: finance?.total_revenue ?? 0,
        net_profit: finance?.net_profit ?? 0,
        roi: finance?.roi ?? 0,
        burn_rate: finance?.burn_rate ?? 0,
      },
      hr: {
        total_budget: hr?.total_budget ?? 0,
        employee_satisfaction: hr?.employee_satisfaction ?? 0,
      },
      rd: {
        budget: rd?.budget ?? 0,
        patented: rd?.patented ?? 0,
        quality_changes: rd?.quality_changes ?? 0,
      },
      production: {
        production_capacity: production?.production_capacity ?? 0,
        defect_rate: production?.defect_rate ?? 0,
      },
      products: company.products.map((product) => {
        const performance = product.performances[0];
        return {
          name: product.name,
          market_share: performance?.market_share ?? 0,
          customer_satisfaction: performance?.customer_satisfaction ?? 0,
        };
      }),
    };
  });
}