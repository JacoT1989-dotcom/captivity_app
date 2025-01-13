// app/(admin)/admin/orders/_components/actions.ts
"use server";

import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getOrdersByStatus(
  status?: OrderStatus | OrderStatus[],
  page: number = 1,
  limit: number = 10,
  searchQuery?: string
) {
  const skip = (page - 1) * limit;

  try {
    const where = {
      ...(status && {
        status: Array.isArray(status) ? { in: status } : status,
      }),
      ...(searchQuery && {
        OR: [
          {
            referenceNumber: {
              contains: searchQuery,
              mode: "insensitive" as const,
            },
          },
          {
            firstName: { contains: searchQuery, mode: "insensitive" as const },
          },
          {
            companyName: {
              contains: searchQuery,
              mode: "insensitive" as const,
            },
          },

          { lastName: { contains: searchQuery, mode: "insensitive" as const } },
          { email: { contains: searchQuery, mode: "insensitive" as const } },
        ],
      }),
    };

    const [orders, totalOrders] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          orderItems: {
            include: {
              variation: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/admin/orders");
    return { success: true, order: updatedOrder };
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
}

export async function getOrderDetails(orderId: string) {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        orderItems: {
          include: {
            variation: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw new Error("Failed to fetch order details");
  }
}
