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
        product_performances: {
          orderBy: { period: "asc" },
        },
      },
    });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
}

export async function getProductsByCompany(companyId: string) {
  try {
    const products = await prisma.product.findMany({
      where: { company_id: companyId },
      include: {
        product_performances: {
          orderBy: { period: "desc" },
          take: 1,
        },
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products by company:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function createProduct(formData: FormData) {
  try {
    const inventory_level =
      parseInt(formData.get("inventory_level") as string) || 0;
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
        production_cost: formData.get("production_cost")
          ? parseFloat(formData.get("production_cost") as string)
          : 0,
        selling_price: formData.get("selling_price")
          ? parseFloat(formData.get("selling_price") as string)
          : 0,
        inventory_level: inventory_level,
        production_capacity: formData.get("production_capacity")
          ? parseInt(formData.get("production_capacity") as string)
          : 2000,
        development_cost: formData.get("development_cost")
          ? parseFloat(formData.get("development_cost") as string)
          : 0,
        marketing_budget: formData.get("marketing_budget")
          ? parseFloat(formData.get("marketing_budget") as string)
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
    return product.id;
  } catch (error) {
    console.error("Error creating product:", error);
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
  } catch (error) {
    console.error("Error updating product:", error);
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
  } catch (error) {
    console.error("Error fetching product performance:", error);
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
  } catch (error) {
    console.error("Error fetching product performance history:", error);
    throw new Error("Failed to fetch product performance history");
  }
}

export async function createProductPerformance(formData: FormData) {
  const product = await getProduct(formData.get("productID") as string);
  try {
    const sales_volume = parseInt(formData.get("sales") as string) || 0;
    const revenue = parseFloat(formData.get("revenue") as string) || 0;
    const costs = (product?.production_cost ?? 0) * sales_volume || 0;
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
  } catch (error) {
    console.error("Error creating product performance:", error);
    throw new Error("Failed to create product performance");
  }
}

export async function CreateProductionDecision(formData: FormData) {
  try {
    // This function would create a production decision
    // For now, I'll create a placeholder implementation
    const companyId = formData.get("company_id") as string;
    const period = parseInt(formData.get("period") as string);
    const decisionData = {
      inventory_level: parseInt(formData.get("inventory_level") as string) || 0,
      production_capacity:
        parseInt(formData.get("production_capacity") as string) || 0,
    };

    const decision = await prisma.decision.create({
      data: {
        company_id: companyId,
        period,
        type: "production",
        decision_data: JSON.stringify(decisionData),
      },
    });

    revalidatePath("/management/production");
    return decision.id;
  } catch (error) {
    console.error("Error creating production decision:", error);
    throw new Error("Failed to create production decision");
  }
}

export async function getProductionDecisions(companyId: string) {
  try {
    const decisions = await prisma.decision.findMany({
      where: {
        company_id: companyId,
        type: "production",
      },
      orderBy: {
        period: "desc",
      },
    });
    return decisions;
  } catch (error) {
    console.error("Error fetching production decisions:", error);
    throw new Error("Failed to fetch production decisions");
  }
}
