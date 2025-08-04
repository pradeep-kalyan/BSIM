import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Configure datasource
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Add logging for debugging
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    // Increase error format verbosity
    errorFormat: "pretty",
  });

// Optimize Prisma for high-concurrency scenarios
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
