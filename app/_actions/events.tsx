"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// Event operations
export async function getEvents(simulationId: string, period?: number) {
  try {
    const events = await prisma.event.findMany({
      where: {
        simulation_id: simulationId,
        ...(period !== undefined && { period }),
      },
      orderBy: { created_at: "desc" },
      include: {
        simulation: true,
      },
    });
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error("Failed to fetch events");
  }
}

export async function createEvent(data: {
  simulation_id: string;
  period: number;
  type: string;
  name: string;
  description?: string;
  impact_area: string;
  impact_strength: number;
  affected_companies: string;
}) {
  try {
    const event = await prisma.event.create({
      data: {
        simulation_id: data.simulation_id,
        period: data.period,
        type: data.type,
        name: data.name,
        description: data.description,
        impact_area: data.impact_area,
        impact_strength: data.impact_strength,
        affected_companies: data.affected_companies,
      },
    });
    revalidatePath(`/simulations/${data.simulation_id}`);
    return event.id;
  } catch (error) {
    console.error("Error creating event:", error);
    throw new Error("Failed to create event");
  }
}
