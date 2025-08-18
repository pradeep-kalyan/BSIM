"use server";

import prisma from "../functions/prisma";
import { revalidatePath } from "next/cache";
import { updateCompany } from "./company";
import { redirect } from "next/navigation";

// Product operations
export async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        company: true,
        performances: {
          orderBy: { period: "asc" },
        },
      },
    });
    return product;
  } catch {
    throw new Error("Failed to fetch product");
  }
}

export async function createProduct(formData: FormData) {
  try {
    const marketing_budget =
      parseFloat(formData.get("marketing_budget") as string) || 0;
    const company = await prisma.company.findUnique({
      where: { id: formData.get("company_id") as string },
      select: { cash_balance: true },
    });
    const newCashBalance =
      (company?.cash_balance || 0) -
      (parseFloat(formData.get("development_cost") as string) +
        marketing_budget || 0);

    await updateCompany(formData.get("company_id") as string, {
      cash_balance: newCashBalance,
    });

    const product = await prisma.product.create({
      data: {
        company_id: formData.get("company_id") as string,
        name: formData.get("name") as string,
        description: (formData.get("description") as string) || null,
        category: formData.get("category") as string,
        quality_rating: formData.get("quality_rating")
          ? parseFloat(formData.get("quality_rating") as string)
          : 0,
        innovation_rating: formData.get("innovation_rating")
          ? parseFloat(formData.get("innovation_rating") as string)
          : 0,
        sustainability_rating: formData.get("sustainability_rating")
          ? parseFloat(formData.get("sustainability_rating") as string)
          : 0,
        status: (formData.get("status") as string) || "development",
        launch_period: formData.get("launch_period")
          ? parseInt(formData.get("launch_period") as string)
          : null,
        discontinue_period: formData.get("discontinue_period")
          ? parseInt(formData.get("discontinue_period") as string)
          : null,
      },
    });
    revalidatePath("/products");
    revalidatePath(`/companies/${formData.get("company_id")}`);
    redirect(`/products/catalog`);
  } catch {
    throw new Error("Failed to create product");
  }
}

export async function updateProduct(
  id: string,
  data: {
    name?: string;
    description?: string;
    category?: string;
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
) {
  try {
    await prisma.product.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });
    revalidatePath("/products");
    revalidatePath(`/products/${id}`);
  } catch {
    throw new Error("Failed to update product");
  }
}

// Product performance operations
export async function getProductPerformance(productId: string, period: number) {
  try {
    const performance = await prisma.product_performance.findUnique({
      where: {
        product_id_period: {
          product_id: productId,
          period,
        },
      },
      include: {
        product: true,
      },
    });
    return performance;
  } catch {
    throw new Error("Failed to fetch product performance");
  }
}

export async function getProductPerformanceHistory(productId: string) {
  try {
    const performance = await prisma.product_performance.findMany({
      where: { product_id: productId },
      orderBy: { period: "asc" },
      include: {
        product: true,
      },
    });
    return performance;
  } catch {
    throw new Error("Failed to fetch product performance history");
  }
}

export async function createProductPerformance(formData: FormData) {
  const product = await getProduct(formData.get("productID") as string);
  try {
    const sales_volume = parseInt(formData.get("sales") as string) || 0;
    const revenue = parseFloat(formData.get("revenue") as string) || 0;

    // Get production cost from the latest production decision
    const production = await prisma.production.findFirst({
      where: {
        product_id: product?.id,
        company_id: product?.company_id,
      },
      orderBy: { period: "desc" },
    });

    const costs = (production?.cost_per_unit ?? 0) * sales_volume || 0;
    const profit = revenue - costs;
    const cashBalance = product?.company?.cash_balance || 0;
    const NewCashBalance = cashBalance + profit;
    await updateCompany(product?.company_id as string, {
      cash_balance: NewCashBalance,
    });
    const performance = await prisma.product_performance.create({
      data: {
        product_id: product?.id as string,
        period: parseInt(formData.get("period") as string) || 1,
        sales_volume: sales_volume,
        revenue: parseFloat(formData.get("revenue") as string) || 0,
        costs: costs,
        profit: profit,
        market_share: parseFloat(formData.get("market_share") as string) || 0,
        customer_satisfaction:
          parseFloat(formData.get("customer_satisfaction") as string) || 0,
      },
    });
    revalidatePath(`/products/catalog?tab=performance`);
    return performance.id;
  } catch {
    throw new Error("Failed to create product performance");
  }
}
