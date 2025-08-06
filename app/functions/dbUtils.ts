import { Prisma } from "@prisma/client";
import prisma from "./prisma";

/**
 * Retry utility for database operations that may fail due to timeouts or connection issues
 */
export async function retryDbOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Check if it's a retryable error
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error.code === "P1008" || // Operations timeout
          error.code === "P2024" || // Timed out fetching a new connection from the connection pool
          error.code === "P1001" || // Can't reach database server
          error.message.includes("timeout"))
      ) {
        console.warn(
          `Database operation failed (attempt ${attempt}/${maxRetries}):`,
          error.message
        );

        if (attempt < maxRetries) {
          // Wait before retrying with exponential backoff
          await new Promise((resolve) =>
            setTimeout(resolve, delayMs * attempt)
          );
          continue;
        }
      }

      // If it's not a retryable error or we've exhausted retries, throw the error
      throw error;
    }
  }

  throw lastError;
}

/**
 * Check if an error is related to database timeout or connection issues
 */
export function isDbTimeoutError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return (
      error.code === "P1008" || // Operations timeout
      error.code === "P2024" || // Timed out fetching a new connection from the connection pool
      error.code === "P1001" || // Can't reach database server
      error.message.includes("timeout") ||
      error.message.includes("connection")
    );
  }

  if (error instanceof Error) {
    return (
      error.message.includes("timeout") ||
      error.message.includes("connection") ||
      error.message.includes("ETIMEDOUT")
    );
  }

  return false;
}

/**
 * Create a transaction with optimized settings for high-concurrency scenarios
 */
export function createOptimizedTransaction<T>(
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
  options?: {
    timeout?: number;
    maxWait?: number;
    isolationLevel?: Prisma.TransactionIsolationLevel;
  }
) {
  const defaultOptions = {
    timeout: 30000, // 30 seconds
    maxWait: 10000, // 10 seconds to wait for connection
    isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
    ...options,
  };

  return retryDbOperation(
    () => prisma.$transaction(operation, defaultOptions),
    2, // Only retry once for transactions
    2000 // 2 second delay
  );
}
