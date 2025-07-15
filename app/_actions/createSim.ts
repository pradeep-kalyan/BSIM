"use server";

import prisma from "@/app/functions/prisma";
import { getCurrentUser } from "@/app/functions/jwt";

export async function getSimulations() {
  const simulations = await prisma.simulation.findMany({
    orderBy: { created_at: "desc" },
  });
  return simulations.map((sim) => ({
    ...sim,
    config: typeof sim.config === "string" ? JSON.parse(sim.config) : sim.config,
  }));
}

export default async function createSim(formData: FormData) {
  try {
    const name = formData.get("name")?.toString().trim();
    const description = formData.get("description")?.toString().trim() || null;

    if (!name) throw new Error("Simulation name is required");

    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const config: Record<string, string | number | boolean> = {};

    for (const [key, value] of formData.entries()) {
      if (key.startsWith("config_key_")) {
        const index = key.split("_")[2];
        const rawKey = value?.toString().trim();
        const rawVal = formData.get(`config_value_${index}`)?.toString().trim();

        if (rawKey && rawVal) {
          let val: string | number | boolean = rawVal;

          if (rawVal === "true" || rawVal === "false") {
            val = rawVal === "true";
          } else if (!isNaN(Number(rawVal)) && /^\d+(\.\d+)?$/.test(rawVal)) {
            val = Number(rawVal);
          }

          config[rawKey] = val;
        }
      }
    }

    const configString = JSON.stringify(config);

    await prisma.simulation.create({
      data: {
        name,
        description,
        config: configString,
        created_by: user.id,
      },
    });
  } catch (error) {
    console.error("CreateSim failed:", error);
    throw error;
  }
}
