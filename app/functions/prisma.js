"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
var client_1 = require("@prisma/client");
var globalForPrisma = global;
exports.prisma = globalForPrisma.prisma ||
    new client_1.PrismaClient({
        // Configure datasource
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
        // Add logging for debugging
        log: process.env.NODE_ENV === "development"
            ? [ "error", "warn"]
            : ["error"],
        // Increase error format verbosity
        errorFormat: "pretty",
    });
// Configure connection pool settings for better performance
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = exports.prisma;
}
exports.default = exports.prisma;
