"use server";
import prisma from "../../../../lib/prisma";

import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getPendingOrders(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  try {
    const [orders, totalOrders] = await Promise.all([
      prisma.order.findMany({
        where: {
          status: OrderStatus.PENDING,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.order.count({
        where: {
          status: OrderStatus.PENDING,
        },
      }),
    ]);

    return {
      orders,
      totalPages: Math.ceil(totalOrders / limit),
    };
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    throw new Error("Failed to fetch pending orders");
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    revalidatePath("/orders");
    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
}
