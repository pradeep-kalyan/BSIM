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
  marketing_budget?: number;
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
  marketing_budget?: number;
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
<<<<<<< HEAD
<<<<<<< HEAD
            user: true,
=======
            user: true, 
>>>>>>> 0dc7c23ba99a1efd1dce62dac9803a653519ee16
=======
            user: true,
>>>>>>> 336ea2c (bug fixes in create company page)
          },
        },
        _count: {
          select: {
            products: true,
<<<<<<< HEAD
            // decisions: true,
=======
>>>>>>> 0dc7c23ba99a1efd1dce62dac9803a653519ee16
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

// Get first comapany
export async function getFirstCompany(simulationId: string) {
  const companies = await getCompaniesBySimulation(simulationId);
  return companies.length > 0 ? companies[0] : null;
}

// Create a new company
export async function createCompany(data: CreateCompanyInput) {
  // Adjust cash balance by subtracting marketing budget
  const initialCash = data.cash_balance ?? 0;
  const marketingBudget = data.marketing_budget ?? 0;
  const adjustedCashBalance = initialCash - marketingBudget;

  if (adjustedCashBalance < 0) {
    throw new Error("Marketing budget cannot be greater than cash balance.");
  }

  // 1. Create company with nested products in a single transaction
  const company = await prisma.company.create({
    data: {
      simulation_id: data.simulation_id,
      user_id: data.user_id,
      name: data.name,
      description: data.description,
      logo_url: data.logo_url,
      cash_balance: adjustedCashBalance,
      total_assets: data.total_assets ?? 0,
      total_liabilities: data.total_liabilities ?? 0,
      marketing_budget: marketingBudget,
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
              production_cost: p.production_cost,
              selling_price: p.selling_price,
              inventory_level: p.inventory_level,
              production_capacity: p.production_capacity,
              development_cost: p.development_cost,
              marketing_budget: p.marketing_budget,
              status: p.status,
              launch_period: p.launch_period,
              discontinue_period: p.discontinue_period,
            })),
          }
          : undefined,
    },
  });

  // 2. Ensure creator has simulation access (upsert)
  await prisma.simulation_access.upsert({
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

  // 3. Grant access to others by email
  const failedEmails: string[] = [];
  if (data.accessEmails?.length) {
    for (const rawEmail of data.accessEmails) {
      const email = rawEmail.trim().toLowerCase();
      if (!email) continue;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        console.warn(`User not found for email: ${email}`);
        failedEmails.push(email);
        continue;
      }

      if (user.id === data.user_id) {
        // Don't re-add creator
        continue;
      }

      // Grant company access
      await prisma.company_access.upsert({
        where: {
          company_id_user_id: {
            company_id: company.id,
            user_id: user.id,
          },
        },
        update: { access_level: "editor" },
        create: {
          company_id: company.id,
          user_id: user.id,
          access_level: "editor",
        },
      });

      // Ensure simulation access too
      await prisma.simulation_access.upsert({
        where: {
          simulation_id_user_id: {
            simulation_id: data.simulation_id,
            user_id: user.id,
          },
        },
        update: { access_level: "editor" },
        create: {
          simulation_id: data.simulation_id,
          user_id: user.id,
          access_level: "editor",
        },
      });

      console.info(`Granted editor access to ${email}`);
    }
  }

  // 4. Revalidate paths for fresh data
  revalidatePath("/companies");
  revalidatePath(`/simulations/${data.simulation_id}`);

  return {
    companyId: company.id,
    failedEmails,
  };
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
    marketing_budget?: number;
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
