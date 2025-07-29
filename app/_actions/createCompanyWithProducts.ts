"use server";

import prisma from "../functions/prisma";

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

interface Input {
    name: string;
    description?: string;
    simulationId: string;
    userId: string;
    products: ProductInput[];
}

export async function createCompanyWithProducts(data: Input) {
    const company = await prisma.company.create({
        data: {
            name: data.name,
            description: data.description,
            simulation: { connect: { id: data.simulationId } },
            user: { connect: { id: data.userId } },
        },
    });

    if (data.products.length > 0) {
        await prisma.product.createMany({
            data: data.products.map((p) => ({
                ...p,
                company_id: company.id,
            })),
        });
    }

    return company;
}
