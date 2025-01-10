// lib/db-utils.ts
import { PrismaClient } from "@prisma/client";

export async function checkDatabaseConnection() {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    await prisma.user.findFirst();
    console.log("Database connection successful");
    return true;
  } catch (error) {
    console.error("Database connection error:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown database error",
      details: error,
    };
  } finally {
    await prisma.$disconnect();
  }
}
