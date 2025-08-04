"use server";

import prisma from "../functions/prisma";

export async function getCompanyData(companyId: string) {
  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        current_period: true,
        cash_balance: true,
      },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    return company;
  } catch (error) {
    console.error("Error fetching company data:", error);
    throw new Error("Failed to fetch company data");
  }
}

export async function getCompanyProducts(companyId: string) {
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

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      quality_rating: product.quality_rating,
      innovation_rating: product.innovation_rating,
      sustainability_rating: product.sustainability_rating,
      production_cost: product.production_cost,
      selling_price: product.selling_price,
      inventory_level: product.inventory_level,
      production_capacity: product.production_capacity,
      development_cost: product.development_cost,
      marketing_budget: product.marketing_budget,
      status: product.status,
      launch_period: product.launch_period,
      discontinue_period: product.discontinue_period,
      latest_performance: product.product_performances[0] || null,
    }));
  } catch (error) {
    console.error("Error fetching company products:", error);
    throw new Error("Failed to fetch company products");
  }
}

export async function createProduct({
  company_id,
  name,
  description,
  category,
  quality_rating,
  innovation_rating,
  sustainability_rating,
  production_cost,
  selling_price,
  production_capacity,
  development_cost,
  marketing_budget,
}: {
  company_id: string;
  name: string;
  description?: string | null;
  category: string;
  quality_rating: number;
  innovation_rating: number;
  sustainability_rating: number;
  production_cost: number;
  selling_price: number;
  production_capacity: number;
  development_cost: number;
  marketing_budget: number;
}) {
  try {
    return await prisma.$transaction(async (tx) => {
      const company = await tx.company.findUnique({
        where: { id: company_id },
        select: { cash_balance: true, marketing_budget: true },
      });

      if (!company) {
        throw new Error("Company not found");
      }

      if (company.cash_balance < development_cost) {
        throw new Error("Insufficient cash balance");
      }

      if ((company.marketing_budget ?? 0) < marketing_budget) {
        throw new Error("Insufficient marketing budget");
      }

      await tx.company.update({
        where: { id: company_id },
        data: {
          cash_balance: { decrement: development_cost },
          marketing_budget: { decrement: marketing_budget },
        },
      });

      const product = await tx.product.create({
        data: {
          company_id,
          name,
          description,
          category,
          quality_rating,
          innovation_rating,
          sustainability_rating,
          production_cost,
          selling_price,
          production_capacity,
          development_cost,
          marketing_budget,
          status: "development",
        },
      });

      return product;
    });
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
}

export async function updateProduct({
  product_id,
  name,
  description,
  category,
  quality_rating,
  innovation_rating,
  sustainability_rating,
  production_cost,
  selling_price,
  production_capacity,
  development_cost,
  marketing_budget,
  status,
}: {
  product_id: string;
  name?: string;
  description?: string;
  category?: string;
  quality_rating?: number;
  innovation_rating?: number;
  sustainability_rating?: number;
  production_cost?: number;
  selling_price?: number;
  production_capacity?: number;
  development_cost?: number;
  marketing_budget?: number;
  status?: string;
}) {
  try {
    return await prisma.$transaction(async (tx) => {
      // Fetch existing product with its costs and company_id
      const existingProduct = await tx.product.findUnique({
        where: { id: product_id },
        select: {
          production_cost: true,
          development_cost: true,
          marketing_budget: true,
          company_id: true,
        },
      });

      if (!existingProduct) {
        throw new Error("Product not found");
      }

      // Fetch company budget info
      const company = await tx.company.findUnique({
        where: { id: existingProduct.company_id },
        select: { cash_balance: true, marketing_budget: true },
      });

      if (!company) {
        throw new Error("Company not found");
      }

      // Calculate differences in costs (treat undefined as no change)
      const devCostDiff =
        development_cost !== undefined
          ? development_cost - existingProduct.development_cost
          : 0;

      const marketingBudgetDiff =
        marketing_budget !== undefined
          ? marketing_budget - existingProduct.marketing_budget
          : 0;

      // Sum of cash deductions needed (for production_cost and development_cost)
      // Assuming only development_cost affects cash_balance like in creation
      const totalCashDiff = devCostDiff;

      // Check if company has enough cash_balance for any increased cost
      if (totalCashDiff > 0 && company.cash_balance < totalCashDiff) {
        throw new Error(
          "Insufficient cash balance for updated development cost"
        );
      }

      // Check marketing budget sufficiency if marketing_budget increased
      if (
        marketingBudgetDiff > 0 &&
        (company.marketing_budget ?? 0) < marketingBudgetDiff
      ) {
        throw new Error(
          "Insufficient marketing budget for updated marketing spend"
        );
      }

      // Prepare company update data
      interface CompanyUpdateData {
        cash_balance?: { decrement: number } | { increment: number };
        marketing_budget?: { decrement: number } | { increment: number };
      }

      const companyUpdateData: CompanyUpdateData = {};
      if (totalCashDiff !== 0) {
        companyUpdateData.cash_balance =
          totalCashDiff > 0
            ? { decrement: totalCashDiff }
            : { increment: -totalCashDiff };
      }
      if (marketingBudgetDiff !== 0) {
        companyUpdateData.marketing_budget =
          marketingBudgetDiff > 0
            ? { decrement: marketingBudgetDiff }
            : { increment: -marketingBudgetDiff };
      }

      // Update company budgets if any changes
      if (Object.keys(companyUpdateData).length > 0) {
        await tx.company.update({
          where: { id: existingProduct.company_id },
          data: companyUpdateData,
        });
      }

      // Prepare product update data
      const productUpdateData = {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(quality_rating !== undefined && { quality_rating }),
        ...(innovation_rating !== undefined && { innovation_rating }),
        ...(sustainability_rating !== undefined && { sustainability_rating }),
        ...(production_cost !== undefined && { production_cost }),
        ...(selling_price !== undefined && { selling_price }),
        ...(production_capacity !== undefined && { production_capacity }),
        ...(development_cost !== undefined && { development_cost }),
        ...(marketing_budget !== undefined && { marketing_budget }),
        ...(status !== undefined && { status }),
      };

      // Update the product
      const updatedProduct = await tx.product.update({
        where: { id: product_id },
        data: productUpdateData,
      });

      return updatedProduct;
    });
  } catch (error) {
    console.error("Error updating product with budget adjustment:", error);
    throw new Error("Failed to update product");
  }
}

export async function launchProduct(product_id: string, launch_period: number) {
  try {
    const product = await prisma.product.update({
      where: { id: product_id },
      data: {
        status: "active",
        launch_period,
      },
    });

    return product;
  } catch (error) {
    console.error("Error launching product:", error);
    throw new Error("Failed to launch product");
  }
}

export async function discontinueProduct(
  product_id: string,
  discontinue_period: number
) {
  try {
    const product = await prisma.product.update({
      where: { id: product_id },
      data: {
        status: "discontinued",
        discontinue_period,
      },
    });

    return product;
  } catch (error) {
    console.error("Error discontinuing product:", error);
    throw new Error("Failed to discontinue product");
  }
}

export async function getCurrentProductDecision(
  companyId: string,
  productId?: string
) {
  try {
    const whereClause = productId
      ? { id: productId, company_id: companyId }
      : { company_id: companyId };

    const product = await prisma.product.findFirst({
      where: whereClause,
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        company_id: true,
        name: true,
        description: true,
        category: true,
        quality_rating: true,
        innovation_rating: true,
        sustainability_rating: true,
        production_cost: true,
        selling_price: true,
        inventory_level: true,
        production_capacity: true,
        development_cost: true,
        marketing_budget: true,
        status: true,
        launch_period: true,
        discontinue_period: true,
        created_at: true,
        updated_at: true,
        product_performances: {
          orderBy: { period: "desc" },
          take: 1,
          select: {
            id: true,
            period: true,
            sales_volume: true,
            revenue: true,
            costs: true,
            profit: true,
            market_share: true,
            customer_satisfaction: true,
          },
        },
      },
    });

    return product;
  } catch (error) {
    console.error("Error fetching current product decision:", error);
    return null;
  }
}

export async function getCurrentProductPerformance(
  productId: string,
  period: number
) {
  try {
    const performance = await prisma.product_performance.findFirst({
      where: {
        product_id: productId,
        period: period,
      },
      select: {
        id: true,
        product_id: true,
        period: true,
        data: true,
        sales_volume: true,
        revenue: true,
        costs: true,
        profit: true,
        market_share: true,
        customer_satisfaction: true,
        created_at: true,
        product: {
          select: {
            name: true,
            company_id: true,
          },
        },
      },
    });

    return performance;
  } catch (error) {
    console.error("Error fetching current product performance:", error);
    return null;
  }
}
