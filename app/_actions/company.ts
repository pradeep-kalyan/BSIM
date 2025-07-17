"use server";

import prisma from "@/app/functions/prisma";
import { getCurrentUser } from "@/app/functions/jwt";
import { revalidatePath } from "next/cache";

// Get companies accessible to current user
export async function getCompaniesBySimulation(simulationId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const companies = await prisma.company.findMany({
      where: {
        simulation_id: simulationId,
        OR: [
          { user_id: user.id }, // Owned companies
          {
            company_access: {
              some: {
                user_id: user.id, // Shared access
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
            user: true, // Include user info for debugging
          },
        },
        _count: {
          select: {
            products: true,
            decisions: true,
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

// Create a new company
export async function createCompany(data: {
  simulation_id: string;
  user_id: string;
  name: string;
  description?: string;
  logo_url?: string;
  cash_balance?: number;
  total_assets?: number;
  total_liabilities?: number;
  credit_rating?: string;
  brand_value?: number;
  accessEmails?: string[]; // Optional sharing emails
}) {
  const company = await prisma.company.create({
    data: {
      simulation_id: data.simulation_id,
      user_id: data.user_id,
      name: data.name,
      description: data.description,
      logo_url: data.logo_url,
      cash_balance: data.cash_balance ?? 0,
      total_assets: data.total_assets ?? 0,
      total_liabilities: data.total_liabilities ?? 0,
      credit_rating: data.credit_rating,
      brand_value: data.brand_value ?? 0,
    },
  });

  // Grant access to additional emails
  const failedEmails: string[] = [];

  if (data.accessEmails?.length) {
    for (const rawEmail of data.accessEmails) {
      const email = rawEmail.trim().toLowerCase();
      if (!email) continue;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        console.warn(` User not found for email: ${email}`);
        failedEmails.push(email);
        continue;
      }

      if (user.id === data.user_id) {
        console.info(` Skipping owner email: ${email}`);
        continue;
      }

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

      console.info(`Granted editor access to ${email}`);
    }
  }

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
    credit_rating?: string;
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
export async function grantAccessByEmail(email: string, companyId: string) {
  const userToAdd = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

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

  await prisma.company.delete({
    where: { id: companyId },
  });

  revalidatePath("/companies");
}
