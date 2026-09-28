import { PrismaClient } from "@prisma/client";

const defaultDbUrl = "mysql://u697568943_crm:Antenaina23@localhost:3306/u697568943_crm";

// Fallback automatique sur les identifiants Hostinger si .env n'est pas chargé
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = defaultDbUrl;
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || defaultDbUrl,
      },
    },
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
