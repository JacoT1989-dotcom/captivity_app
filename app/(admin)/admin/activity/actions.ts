"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getRecentActivities(page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Get recent users with pagination
    const recentUsers = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: twentyFourHoursAgo,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        username: true,
        companyName: true,
        createdAt: true,
        role: true,
      },
    });

    // Get recent orders with pagination
    const recentOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: twentyFourHoursAgo,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            username: true,
            companyName: true,
          },
        },
        orderItems: true,
      },
    });

    // Transform to activities
    const activities = [
      ...recentUsers.map(user => ({
        id: `user-${user.id}`,
        title: "New User Registration",
        description: `${user.companyName} (${user.username}) joined as ${user.role.toLowerCase()}`,
        type: "USER",
        createdAt: user.createdAt,
        metadata: {
          userId: user.id,
          role: user.role,
        },
      })),
      ...recentOrders.map(order => ({
        id: `order-${order.id}`,
        title: "New Order Placed",
        description: `${order.user.companyName} placed order #${order.id.slice(0, 8)}`,
        type: "ORDER",
        createdAt: order.createdAt,
        metadata: {
          orderId: order.id,
          items: order.orderItems.length,
          totalAmount: order.totalAmount,
        },
      })),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Calculate pagination info
    const total = activities.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedActivities = activities.slice(skip, skip + limit);

    return {
      activities: paginatedActivities,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        hasMore: page < totalPages,
      },
    };
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    throw new Error("Failed to fetch activities");
  }
}
