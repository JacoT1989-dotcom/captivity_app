"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { OrderStatus, UserRole } from "@prisma/client";
import { VendorOrderResponse } from "./types";

interface AuthUser {
  id: string;
  role: UserRole;
  storeSlug: string | null;
}

export async function getVendorOrderById(
  orderId: string
): Promise<VendorOrderResponse> {
  try {
    const { user } = (await validateRequest()) as { user: AuthUser | null };

    if (!user) {
      return {
        success: false,
        message: "Unauthorized",
        error: "Authentication required",
      };
    }

    const order = await prisma.vendorOrder.findUnique({
      where: {
        id: orderId,
      },
      include: {
        user: {
          select: {
            id: true,
            role: true,
            storeSlug: true,
            username: true,
            email: true,
          },
        },
        vendorOrderItems: {
          include: {
            vendorVariation: {
              include: {
                vendorProduct: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return {
        success: false,
        message: "Not found",
        error: "Order not found",
      };
    }

    const hasAccess =
      user.role === "VENDOR" ||
      order.userId === user.id ||
      (user.role === "VENDORCUSTOMER" &&
        order.user?.storeSlug?.startsWith(user.storeSlug ?? ""));

    if (!hasAccess) {
      return {
        success: false,
        message: "Unauthorized",
        error: "You don't have permission to view this order",
      };
    }

    return {
      success: true,
      message: "Order retrieved successfully",
      data: order,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error retrieving order",
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<VendorOrderResponse> {
  try {
    if (!orderId) {
      return {
        success: false,
        message: "Invalid request",
        error: "Order ID is required",
      };
    }

    const { user } = (await validateRequest()) as { user: AuthUser | null };

    if (!user || user.role !== "VENDOR") {
      return {
        success: false,
        message: "Unauthorized",
        error: "Only vendors can update order status",
      };
    }

    const existingOrder = await prisma.vendorOrder.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        vendorOrderItems: {
          include: {
            vendorVariation: true,
          },
        },
      },
    });

    if (!existingOrder) {
      return {
        success: false,
        message: "Not found",
        error: "Order not found",
      };
    }

    const hasPermission =
      existingOrder.user.storeSlug?.startsWith(user.storeSlug ?? "") ||
      existingOrder.userId === user.id;

    if (!hasPermission) {
      return {
        success: false,
        message: "Unauthorized",
        error: "You don't have permission to update this order",
      };
    }

    // Handle inventory restoration for canceled or refunded orders
    if (
      (newStatus === "CANCELLED" || newStatus === "REFUNDED") &&
      existingOrder.status !== "CANCELLED" &&
      existingOrder.status !== "REFUNDED"
    ) {
      // Use a transaction to ensure all inventory updates succeed or none do
      const updatedOrder = await prisma.$transaction(async tx => {
        // Restore inventory for each order item
        for (const item of existingOrder.vendorOrderItems) {
          await tx.vendorVariation.update({
            where: { id: item.vendorVariationId },
            data: {
              quantity: {
                increment: item.quantity,
              },
            },
          });
        }

        // Update the order status
        return tx.vendorOrder.update({
          where: { id: orderId },
          data: {
            status: newStatus,
            updatedAt: new Date(),
          },
          include: {
            user: {
              select: {
                id: true,
                role: true,
                storeSlug: true,
                username: true,
                email: true,
              },
            },
            vendorOrderItems: {
              include: {
                vendorVariation: {
                  include: {
                    vendorProduct: true,
                  },
                },
              },
            },
          },
        });
      });

      return {
        success: true,
        message: `Order ${newStatus.toLowerCase()} and inventory restored`,
        data: updatedOrder,
      };
    }

    // Handle reactivating a previously canceled or refunded order
    if (
      (existingOrder.status === "CANCELLED" ||
        existingOrder.status === "REFUNDED") &&
      newStatus !== "CANCELLED" &&
      newStatus !== "REFUNDED"
    ) {
      // First check if we have enough inventory
      for (const item of existingOrder.vendorOrderItems) {
        if (item.vendorVariation.quantity < item.quantity) {
          return {
            success: false,
            message: "Insufficient inventory",
            error: `Not enough stock available for product variation ${item.vendorVariationId}`,
          };
        }
      }

      // Use a transaction to ensure all inventory updates succeed or none do
      const updatedOrder = await prisma.$transaction(async tx => {
        // Deduct inventory for each order item
        for (const item of existingOrder.vendorOrderItems) {
          await tx.vendorVariation.update({
            where: { id: item.vendorVariationId },
            data: {
              quantity: {
                decrement: item.quantity,
              },
            },
          });
        }

        // Update the order status
        return tx.vendorOrder.update({
          where: { id: orderId },
          data: {
            status: newStatus,
            updatedAt: new Date(),
          },
          include: {
            user: {
              select: {
                id: true,
                role: true,
                storeSlug: true,
                username: true,
                email: true,
              },
            },
            vendorOrderItems: {
              include: {
                vendorVariation: {
                  include: {
                    vendorProduct: true,
                  },
                },
              },
            },
          },
        });
      });

      return {
        success: true,
        message: "Order reactivated and inventory updated",
        data: updatedOrder,
      };
    }

    // Handle regular status updates
    const updatedOrder = await prisma.vendorOrder.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            role: true,
            storeSlug: true,
            username: true,
            email: true,
          },
        },
        vendorOrderItems: {
          include: {
            vendorVariation: {
              include: {
                vendorProduct: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      message: "Status updated successfully",
      data: updatedOrder,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error updating status",
      error:
        error instanceof Error
          ? `Error updating order status: ${error.message}`
          : "An unexpected error occurred while updating the order status",
    };
  }
}
