"use server";

import { revalidatePath } from "next/cache";
import prisma from "../functions/prisma";

// Company operations
export async function getCompany(id: string) {
  try {
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        simulation: true,
        user: true,
        products: true,
        decisions: true,
        performance_results: {
          orderBy: { period: "asc" },
        },
      },
    });
    return company;
  } catch (error) {
    console.error("Error fetching company:", error);
    throw new Error("Failed to fetch company");
  }
}

export async function getCompaniesBySimulation(simulationId: string) {
  try {
    const companies = await prisma.company.findMany({
      where: { simulation_id: simulationId },
      include: {
        user: true,
        products: true,
        _count: {
          select: {
            products: true,
            decisions: true,
          },
        },
      },
    });
    return companies;
  } catch (error) {
    console.error("Error fetching companies by simulation:", error);
    throw new Error("Failed to fetch companies");
  }
}

interface HRRole {
  role_name: string;
  salary_per_head: number;
  head_count: number;
}

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
  hr_decision?: {
    period: number;
    roles: HRRole[];
  };
}) {
  try {
    const company = await prisma.company.create({
      data: {
        simulation_id: data.simulation_id,
        user_id: data.user_id,
        name: data.name,
        description: data.description,
        logo_url: data.logo_url,
        cash_balance: data.cash_balance || 0,
        total_assets: data.total_assets || 0,
        total_liabilities: data.total_liabilities || 0,
        credit_rating: data.credit_rating,
        brand_value: data.brand_value || 0,
        hr_decisions: data.hr_decision
          ? {
              create: {
                period: data.hr_decision.period,
                is_submitted: false,
                hr_role_decisions: {
                  createMany: {
                    data: data.hr_decision.roles.map(role => ({
                      role_name: role.role_name,
                      salary_per_head: role.salary_per_head,
                      head_count: role.head_count,
                    })),
                  },
                },
              },
            }
          : undefined,
      },
    });

    revalidatePath("/companies");
    revalidatePath(`/simulations/${data.simulation_id}`);
    return company.id;
  } catch (error) {
    console.error("Error creating company:", error);
    throw new Error("Failed to create company");
  }
}

export async function updateCompany(
  id: string,
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
  try {
    await prisma.company.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });
    revalidatePath("/companies");
    revalidatePath(`/companies/${id}`);
  } catch (error) {
    console.error("Error updating company:", error);
    throw new Error("Failed to update company");
  }
}
