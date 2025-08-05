"use server";

import { revalidatePath } from "next/cache";
import prisma from "../functions/prisma";

// Simulation operations
export async function getSimulation(id: string) {
  try {
    const simulation = await prisma.simulation.findUnique({
      where: { id },
      include: {
        creator: true,
        companies: true,
        // events: true, // TODO: Add events table to schema
        // market_conditions: true, // TODO: Add market_conditions table to schema
      },
    });
    return simulation;
  } catch (error) {
    console.error("Error fetching simulation:", error);
    throw new Error("Failed to fetch simulation");
  }
}

export async function createSimulation(data: {
  name: string;
  description?: string;
  id: string;
}) {
  try {
    // Validate that the user ID is provided
    if (!data.id) {
      throw new Error("User ID is required to create a simulation");
    }

    const simulation = await prisma.simulation.create({
      data: {
        name: data.name,
        description: data.description,
        creator: {
          connect: {
            id: data.id,
          },
        },
      },
    });
    revalidatePath("/simulations");
    return simulation.id;
  } catch (error) {
    console.error("Error creating simulation:", error);
    throw new Error("Failed to create simulation");
  }
}

export async function updateSimulation(
  id: string,
  data: {
    name?: string;
    description?: string;
    config?: string;
    current_period?: number;
    status?: string;
  }
) {
  try {
    await prisma.simulation.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });
    revalidatePath("/simulations");
    revalidatePath(`/simulations/${id}`);
  } catch (error) {
    console.error("Error updating simulation:", error);
    throw new Error("Failed to update simulation");
  }
}

export async function getSimulationsByUser(userId: string) {
  try {
    const simulations = await prisma.simulation.findMany({
      where: { created_by: userId },
      orderBy: { created_at: "desc" },
      include: {
        companies: true,
        _count: {
          select: {
            companies: true,
            // events: true, // TODO: Add events table to schema
          },
        },
      },
    });
    return simulations;
  } catch (error) {
    console.error("Error fetching simulations by user:", error);
    throw new Error("Failed to fetch simulations");
  }
}
