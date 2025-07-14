"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

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

export async function createProduct(data: {
  company_id: string;
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
}) {
  try {
    const product = await prisma.product.create({
      data: {
        company_id: data.company_id,
        name: data.name,
        description: data.description,
        category: data.category,
        quality_rating: data.quality_rating || 0,
        innovation_rating: data.innovation_rating || 0,
        sustainability_rating: data.sustainability_rating || 0,
        production_cost: data.production_cost || 0,
        selling_price: data.selling_price || 0,
        inventory_level: data.inventory_level || 0,
        production_capacity: data.production_capacity || 2000,
        development_cost: data.development_cost || 0,
        marketing_budget: data.marketing_budget || 0,
        status: data.status || "development",
        launch_period: data.launch_period,
        discontinue_period: data.discontinue_period,
      },
    });
    revalidatePath("/products");
    revalidatePath(`/companies/${data.company_id}`);
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

export async function createProductPerformance(data: {
  product_id: string;
  period: number;
  sales_volume?: number;
  revenue?: number;
  costs?: number;
  profit?: number;
  market_share?: number;
  customer_satisfaction?: number;
}) {
  try {
    const performance = await prisma.product_performance.create({
      data: {
        product_id: data.product_id,
        period: data.period,
        sales_volume: data.sales_volume || 0,
        revenue: data.revenue || 0,
        costs: data.costs || 0,
        profit: data.profit || 0,
        market_share: data.market_share || 0,
        customer_satisfaction: data.customer_satisfaction || 0,
      },
    });
    revalidatePath(`/products/${data.product_id}`);
    return performance.id;
  } catch (error) {
    console.error("Error creating product performance:", error);
    throw new Error("Failed to create product performance");
  }
}
