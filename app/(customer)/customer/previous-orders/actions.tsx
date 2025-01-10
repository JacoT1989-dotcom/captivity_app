"use server";

import prisma from "@/lib/prisma";
import { Order, ActionResponse, OrderSearchParams } from "./types";
import { Prisma } from "@prisma/client";

export async function getUserOrders(
  userId: string,
  params: OrderSearchParams = {}
): Promise<ActionResponse<Order[]>> {
  if (!userId) {
    return {
      success: false,
      error: "User ID is required",
    };
  }

  const {
    page = 1,
    limit = 10,
    status,
    query = "",
    startDate,
    endDate,
  } = params;

  try {
    // Build where clause
    const where: Prisma.OrderWhereInput = {
      userId,
      ...(status && { status }),
      ...(startDate &&
        endDate && {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
      OR: query
        ? [
            {
              firstName: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              lastName: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              companyName: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              id: {
                contains: query,
                mode: "insensitive",
              },
            },
          ]
        : undefined,
    };

    // Get total count for pagination
    const totalOrders = await prisma.order.count({
      where,
    });

    // Get paginated orders
    const orders = await prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            variation: {
              select: {
                id: true,
                name: true,
                color: true,
                size: true,
                sku: true,
                sku2: true,
                variationImageURL: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(totalOrders / limit);

    return {
      success: true,
      data: orders as Order[],
      meta: {
        currentPage: page,
        totalPages,
        totalOrders,
      },
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      success: false,
      error: "Failed to fetch orders",
    };
  }
}
