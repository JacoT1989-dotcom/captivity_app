"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { OrderStatus, Prisma, UserRole } from "@prisma/client";
import {
  VendorFormValues,
  VendorOrderActionResult,
  VendorOrder,
} from "./_lib/types";

interface AuthUser {
  id: string;
  role: UserRole;
  storeSlug: string | null;
}

interface PrismaVendorOrder {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  vendorBranch: string;
  methodOfCollection: string;
  salesRep: string | null;
  referenceNumber: string | null;
  firstName: string;
  lastName: string;
  companyName: string;
  countryRegion: string;
  streetAddress: string;
  apartmentSuite: string | null;
  townCity: string;
  province: string;
  postcode: string;
  phone: string;
  email: string;
  orderNotes: string | null;
  agreeTerms: boolean;
  receiveEmailReviews: boolean | null;
  user?: {
    id: string;
    role: UserRole;
    storeSlug: string | null;
    username: string;
    email: string;
  };
  vendorOrderItems: Array<{
    id: string;
    quantity: number;
    price: number;
    vendorOrderId: string;
    vendorVariationId: string;
    vendorVariation: {
      id: string;
      name: string;
      color: string;
      size: string;
      sku: string;
      sku2: string;
      quantity: number;
      variationImageURL: string;
      vendorProductId: string;
      vendorProduct: {
        id: string;
        productName: string;
        description: string;
        sellingPrice: number;
        isPublished: boolean;
        category: string[];
        createdAt: Date;
        updatedAt: Date;
        userId: string;
      };
    };
  }>;
}

const transformOrder = (order: PrismaVendorOrder): VendorOrder => {
  return {
    id: order.id,
    userId: order.userId,
    status: order.status,
    totalAmount: order.totalAmount,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    vendorBranch: order.vendorBranch,
    methodOfCollection: order.methodOfCollection,
    salesRep: order.salesRep || "",
    referenceNumber: order.referenceNumber || "",
    firstName: order.firstName,
    lastName: order.lastName,
    companyName: order.companyName,
    countryRegion: order.countryRegion,
    streetAddress: order.streetAddress,
    apartmentSuite: order.apartmentSuite || "",
    townCity: order.townCity,
    province: order.province,
    postcode: order.postcode,
    phone: order.phone,
    email: order.email,
    orderNotes: order.orderNotes || "",
    agreeTerms: order.agreeTerms,
    receiveEmailReviews: order.receiveEmailReviews || false,
    vendorOrderItems: order.vendorOrderItems,
    user: order.user
      ? {
          id: order.user.id,
          role: order.user.role,
          storeSlug: order.user.storeSlug,
          username: order.user.username,
          email: order.user.email,
        }
      : undefined,
  };
};

export async function createVendorOrder(
  formData: VendorFormValues
): Promise<VendorOrderActionResult> {
  try {
    const { user } = (await validateRequest()) as { user: AuthUser | null };
    if (!user || (user.role !== "VENDOR" && user.role !== "VENDORCUSTOMER")) {
      return {
        success: false,
        message: "Authentication required",
        error: "Please login to place an order",
      };
    }

    const existingCart = await prisma.vendorCart.findUnique({
      where: { userId: user.id },
      include: {
        vendorCartItems: {
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

    if (!existingCart?.vendorCartItems?.length) {
      return {
        success: false,
        message: "Cart is empty",
        error: "Cannot create order with empty cart",
      };
    }

    for (const item of existingCart.vendorCartItems) {
      const variation = await prisma.vendorVariation.findUnique({
        where: { id: item.vendorVariationId },
      });

      if (!variation || variation.quantity < item.quantity) {
        return {
          success: false,
          message: "Insufficient stock",
          error: `Insufficient stock for product variation ${item.vendorVariationId}`,
        };
      }
    }

    const totalAmount = existingCart.vendorCartItems.reduce(
      (total, item) =>
        total + item.vendorVariation.vendorProduct.sellingPrice * item.quantity,
      0
    );

    const order = await prisma.$transaction(
      async tx => {
        const newOrder = await tx.vendorOrder.create({
          data: {
            userId: user.id,
            status: OrderStatus.PENDING,
            totalAmount,
            vendorBranch: formData.vendorBranch,
            methodOfCollection: formData.methodOfCollection,
            salesRep: formData.salesRep || "",
            referenceNumber: formData.referenceNumber || "",
            firstName: formData.firstName,
            lastName: formData.lastName,
            companyName: formData.companyName,
            countryRegion: formData.countryRegion,
            streetAddress: formData.streetAddress,
            apartmentSuite: formData.apartmentSuite || "",
            townCity: formData.townCity,
            province: formData.province,
            postcode: formData.postcode,
            phone: formData.phone,
            email: formData.email,
            orderNotes: formData.orderNotes || "",
            agreeTerms: formData.agreeTerms,
            receiveEmailReviews: formData.receiveEmailReviews,
          },
        });

        await Promise.all(
          existingCart.vendorCartItems.map(item =>
            tx.vendorOrderItem.create({
              data: {
                vendorOrderId: newOrder.id,
                vendorVariationId: item.vendorVariationId,
                quantity: item.quantity,
                price: item.vendorVariation.vendorProduct.sellingPrice,
              },
            })
          )
        );

        await Promise.all(
          existingCart.vendorCartItems.map(item =>
            tx.vendorVariation.update({
              where: { id: item.vendorVariationId },
              data: {
                quantity: {
                  decrement: item.quantity,
                },
              },
            })
          )
        );

        await tx.vendorCartItem.deleteMany({
          where: { vendorCartId: existingCart.id },
        });

        return newOrder;
      },
      {
        maxWait: 10000,
        timeout: 20000,
        isolationLevel: "Serializable",
      }
    );

    const completeOrder = await prisma.vendorOrder.findUnique({
      where: { id: order.id },
      include: {
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

    if (!completeOrder) {
      return {
        success: false,
        message: "Failed to create order",
        error: "Order creation failed",
      };
    }

    return {
      success: true,
      message: "Order created successfully",
      data: transformOrder(completeOrder),
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2028") {
        return {
          success: false,
          message: "Transaction error",
          error: "Failed to process order. Please try again.",
        };
      }
    }

    return {
      success: false,
      message: "Failed to create order",
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getVendorOrder(
  orderId?: string
): Promise<VendorOrderActionResult> {
  try {
    const { user } = (await validateRequest()) as { user: AuthUser | null };

    if (!user || (user.role !== "VENDOR" && user.role !== "VENDORCUSTOMER")) {
      return {
        success: false,
        message: "Authentication required",
        error: "Please login to view orders",
      };
    }

    if (user.role === "VENDOR") {
      const vendorDetails = await prisma.user.findUnique({
        where: { id: user.id },
        select: { storeSlug: true },
      });

      if (!vendorDetails?.storeSlug) {
        return {
          success: false,
          message: "Vendor store not found",
          error: "Invalid vendor configuration",
        };
      }

      const allOrders = await prisma.vendorOrder.findMany({
        where: {
          OR: [
            { userId: user.id },
            {
              user: {
                storeSlug: {
                  startsWith: `${vendorDetails.storeSlug}-customer-`,
                },
              },
            },
          ],
          ...(orderId ? { id: orderId } : {}),
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
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!allOrders.length) {
        return {
          success: false,
          message: "No orders found",
          error: "No orders available",
        };
      }

      const transformedOrders = allOrders.map(transformOrder);

      return {
        success: true,
        message: "Orders retrieved successfully",
        data: transformedOrders,
      };
    } else {
      const customerOrders = await prisma.vendorOrder.findMany({
        where: {
          userId: user.id,
          ...(orderId ? { id: orderId } : {}),
        },
        orderBy: {
          createdAt: "desc",
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
        message: "Orders retrieved successfully",
        data: customerOrders.map(transformOrder),
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to retrieve order",
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
