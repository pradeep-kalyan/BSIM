"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// Market conditions operations
export async function getMarketConditions(
  simulationId: string,
  period: number
) {
  try {
    const marketConditions = await prisma.market_condition.findUnique({
      where: {
        simulation_id_period: {
          simulation_id: simulationId,
          period,
        },
      },
      include: {
        simulation: true,
      },
    });
    return marketConditions;
  } catch (error) {
    console.error("Error fetching market conditions:", error);
    throw new Error("Failed to fetch market conditions");
  }
}

export async function createMarketConditions(data: {
  simulation_id: string;
  period: number;
  total_market_size: number;
  segment_distribution: string;
  economic_indicators: string;
  consumer_preferences: string;
  technology_trends: string;
  sustainability_importance: number;
}) {
  try {
    const marketConditions = await prisma.market_condition.create({
      data: {
        simulation_id: data.simulation_id,
        period: data.period,
        total_market_size: data.total_market_size,
        segment_distribution: data.segment_distribution,
        economic_indicators: data.economic_indicators,
        consumer_preferences: data.consumer_preferences,
        technology_trends: data.technology_trends,
        sustainability_importance: data.sustainability_importance,
      },
    });
    revalidatePath(`/simulations/${data.simulation_id}`);
    return marketConditions.id;
  } catch (error) {
    console.error("Error creating market conditions:", error);
    throw new Error("Failed to create market conditions");
  }
}
