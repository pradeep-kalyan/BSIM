"use server";

import prisma from "@/app/functions/prisma";
import { getCurrentUser } from "@/app/functions/jwt";
import { revalidatePath } from "next/cache";

export async function getSimulations() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const simulations = await prisma.simulation.findMany({
    orderBy: { created_at: "desc" },
    include: {
      simulation_access: {
        include: {
          user: true,
        },
      },
    },
    where: {
      OR: [
        { created_by: user.id },
        {
          simulation_access: {
            some: {
              user_id: user.id,
            },
          },
        },
      ],
    },
  });

  return simulations.map(
    (sim: {
      config: string | Record<string, unknown>;
      created_by: string;
      simulation_access: Array<{ user_id: string; access_level: string }>;
    }) => {
      let parsedConfig: Record<string, unknown> = {};
      try {
        parsedConfig =
          typeof sim.config === "string"
            ? JSON.parse(sim.config)
            : sim.config || {};
      } catch (err) {
        console.error("Failed to parse simulation.config", err);
      }

      const isOwner = sim.created_by === user.id;
      const accessEntry = sim.simulation_access.find(
        (a: { user_id: string; access_level: string }) => a.user_id === user.id
      );
      const hasAccess = isOwner || !!accessEntry;
      const canEdit = accessEntry?.access_level === "editor" || isOwner;

      return {
        ...sim,
        config: parsedConfig,
        canEdit,
        canAccess: hasAccess,
        simulation_access: sim.simulation_access,
        created_by: sim.created_by,
      };
    }
  );
}

export async function getSimulationscompare() {
  try {
    const simulations = await prisma.simulation.findMany({
      orderBy: { created_at: "desc" },
      include: {
        companies: true, // ✅ Include full company objects with name
        simulation_access: {
          include: {
            user: true,
          },
        },
        creator: true, // Optional if used in your frontend
      },
    });
    return simulations;
  } catch (error) {
    console.error("Error fetching simulations:", error);
    throw new Error("Failed to fetch simulations");
  }
}

export default async function createSim(formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const accessEmailsRaw = formData.get("accessEmails")?.toString() || "";

  if (!name) throw new Error("Simulation name is required");

  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  // Handle config key-values
  const config: Record<string, string | number | boolean> = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("config_key_")) {
      const index = key.split("_")[2];
      const rawKey = value?.toString().trim();
      const rawVal = formData.get(`config_value_${index}`)?.toString().trim();

      if (rawKey && rawVal) {
        let val: string | number | boolean = rawVal;
        if (rawVal === "true" || rawVal === "false") val = rawVal === "true";
        else if (!isNaN(Number(rawVal)) && /^\d+(\.\d+)?$/.test(rawVal))
          val = Number(rawVal);
        config[rawKey] = val;
      }
    }
  }

  const configString = JSON.stringify(config);

  // Create simulation
  const simulation = await prisma.simulation.create({
    data: {
      name,
      description,
      config: configString,
      created_by: user.id,
    },
  });

  // Parse access emails
  const accessEmails = accessEmailsRaw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email && email !== user.email); // avoid granting self again

  for (const email of accessEmails) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      await prisma.simulation_access.upsert({
        where: {
          simulation_id_user_id: {
            simulation_id: simulation.id,
            user_id: existingUser.id,
          },
        },
        update: { access_level: "editor" },
        create: {
          simulation_id: simulation.id,
          user_id: existingUser.id,
          access_level: "editor",
        },
      });
    }
  }

  return simulation;
}
// in _actions/createSim.ts
export async function grantAccessByEmail(simulationId: string, email: string) {
  const admin = await getCurrentUser();
  if (!admin) throw new Error("Unauthorized");

  const simulation = await prisma.simulation.findUnique({
    where: { id: simulationId },
  });
  if (!simulation || simulation.created_by !== admin.id)
    throw new Error("Forbidden");

  const userToAdd = await prisma.user.findUnique({ where: { email } });
  if (!userToAdd) throw new Error("User not found");

  // Grant access
  await prisma.simulation_access.upsert({
    where: {
      simulation_id_user_id: {
        simulation_id: simulationId,
        user_id: userToAdd.id,
      },
    },
    update: { access_level: "editor" },
    create: {
      simulation_id: simulationId,
      user_id: userToAdd.id,
      access_level: "editor",
    },
  });

  revalidatePath(`/simulations/${simulationId}`);
}
export async function deleteSimulation(simulationId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const sim = await prisma.simulation.findUnique({
    where: { id: simulationId },
  });

  if (!sim || sim.created_by !== user.id) {
    throw new Error("Forbidden");
  }

  await prisma.simulation.delete({
    where: { id: simulationId },
  });

  revalidatePath("/simulations");
}
export async function updateSimulation(
  simulationId: string,
  data: {
    name?: string;
    description?: string;
    config?: Record<string, unknown>;
  }
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const existing = await prisma.simulation.findUnique({
    where: { id: simulationId },
  });

  if (!existing || existing.created_by !== user.id) {
    throw new Error("Forbidden");
  }

  const updatePayload: Record<string, string> = {};

  if (data.name) updatePayload.name = data.name;
  if (data.description !== undefined)
    updatePayload.description = data.description;
  if (data.config !== undefined)
    updatePayload.config = JSON.stringify(data.config); // ✅ Fix here

  const updated = await prisma.simulation.update({
    where: { id: simulationId },
    data: updatePayload,
  });

  revalidatePath("/simulations"); // optional in server actions (Next.js App Router)
  return updated;
}

export async function revokeAccessByEmail(simulationId: string, email: string) {
  const admin = await getCurrentUser();
  if (!admin) throw new Error("Unauthorized");

  const userToRemove = await prisma.user.findUnique({ where: { email } });
  if (!userToRemove) throw new Error("User not found");

  await prisma.simulation_access.deleteMany({
    where: {
      simulation_id: simulationId,
      user_id: userToRemove.id,
    },
  });

  revalidatePath(`/simulations/${simulationId}`);
}
// in _actions/simulation.ts
export async function getSimulationWithOwnership(simulationId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const sim = await prisma.simulation.findUnique({
    where: { id: simulationId },
    select: {
      id: true,
      name: true,
      created_by: true,
    },
  });

  if (!sim) throw new Error("Simulation not found");

  const isOwner = sim.created_by === user.id;
  return { ...sim, isOwner };
}
