"use server";

import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Order, OrderItem, OrderVariation } from "./types";

interface OrderWithItems extends Order {
  orderItems: (OrderItem & {
    variation: OrderVariation;
  })[];
}

export async function getOrderDetails(
  orderId: string
): Promise<OrderWithItems> {
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
            variation: {
              select: {
                id: true,
                name: true,
                color: true,
                size: true,
                sku: true,
                sku2: true,
                variationImageURL: true,
                quantity: true,
                productId: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return notFound();
    }

    return order as OrderWithItems;
  } catch (error) {
    console.error("Error fetching order details:", error);
    // Log the actual error for debugging
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw new Error("Failed to fetch order details");
  }
}
