"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";

type UserStats = {
  totalCustomers: number;
  pendingRegistrations: number;
  activeUserSessions: number;
  newlyUpgradedCustomers: number;
};

export type FetchUserStatsResult =
  | { success: true; data: UserStats }
  | { success: false; error: string };

// Helper function to check if user has admin privileges
function hasAdminPrivileges(role: string): boolean {
  return role === UserRole.ADMIN || role === UserRole.SUPERADMIN;
}

export async function fetchUserStatistics(): Promise<FetchUserStatsResult> {
  try {
    const { user } = await validateRequest();
    if (!user || !hasAdminPrivileges(user.role)) {
      throw new Error("Unauthorized. Only admins can fetch user statistics.");
    }

    // Get current timestamp for session checking
    const now = new Date();

    // Get timestamp for "newly upgraded" (e.g., last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate());

    // Run all queries in parallel for better performance
    const [
      totalCustomers,
      pendingRegistrations,
      activeUserSessions,
      newlyUpgradedCustomers,
    ] = await Promise.all([
      // Count total customers
      prisma.user.count({
        where: {
          role: UserRole.CUSTOMER,
        },
      }),

      // Count pending registrations (users with USER role)
      prisma.user.count({
        where: {
          role: UserRole.USER,
        },
      }),

      // Count active sessions (not expired)
      prisma.session.count({
        where: {
          expiresAt: {
            gt: now,
          },
        },
      }),

      // Count newly upgraded customers (changed to CUSTOMER role in last 30 days)
      prisma.user.count({
        where: {
          role: UserRole.CUSTOMER,
          updatedAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),
    ]);

    return {
      success: true,
      data: {
        totalCustomers,
        pendingRegistrations,
        activeUserSessions,
        newlyUpgradedCustomers,
      },
    };
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Optional: Function to get detailed stats for newly upgraded customers
export async function fetchNewlyUpgradedCustomerDetails(
  days: number = 30
): Promise<
  | {
      success: true;
      data: Array<{
        id: string;
        username: string;
        email: string;
        companyName: string;
        upgradeDate: Date;
      }>;
    }
  | { success: false; error: string }
> {
  try {
    const { user } = await validateRequest();
    if (!user || !hasAdminPrivileges(user.role)) {
      throw new Error("Unauthorized. Only admins can fetch customer details.");
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const newCustomers = await prisma.user.findMany({
      where: {
        role: UserRole.CUSTOMER,
        updatedAt: {
          gte: cutoffDate,
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        companyName: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return {
      success: true,
      data: newCustomers.map(customer => ({
        id: customer.id,
        username: customer.username,
        email: customer.email,
        companyName: customer.companyName,
        upgradeDate: customer.updatedAt,
      })),
    };
  } catch (error) {
    console.error("Error fetching newly upgraded customer details:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
