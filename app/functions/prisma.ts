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
    // Increase error format verbosity
    errorFormat: "pretty",
  });

// Configure connection pool settings for better performance
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
