"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { OrderSearchParams, ActionResponse, VendorOrder } from "./types";

export async function getVendorOrders(
  userId: string,
  params: OrderSearchParams = {}
): Promise<ActionResponse<VendorOrder[]>> {
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
    vendorBranch,
    customerType = "all",
    minAmount,
    maxAmount,
  } = params;

  try {
    // Build where clause with type safety
    const where: Prisma.VendorOrderWhereInput = {
      userId,
      ...(status && { status }),
      ...(vendorBranch && { vendorBranch }),
      ...(startDate &&
        endDate && {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
      ...(minAmount &&
        maxAmount && {
          totalAmount: {
            gte: minAmount,
            lte: maxAmount,
          },
        }),
      ...(customerType !== "all" && {
        user: {
          role: customerType === "vendor" ? "VENDORCUSTOMER" : "CUSTOMER",
        },
      }),
      OR: query
        ? [
            { firstName: { contains: query, mode: "insensitive" } },
            { lastName: { contains: query, mode: "insensitive" } },
            { companyName: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { id: { contains: query, mode: "insensitive" } },
            { referenceNumber: { contains: query, mode: "insensitive" } },
          ]
        : undefined,
    };

    // Get total count and amount for pagination and statistics
    const [totalOrders, totalAmount] = await Promise.all([
      prisma.vendorOrder.count({ where }),
      prisma.vendorOrder.aggregate({
        where,
        _sum: {
          totalAmount: true,
        },
      }),
    ]);

    // Get paginated orders with related data
    const orders = await prisma.vendorOrder.findMany({
      where,
      include: {
        vendorOrderItems: {
          include: {
            vendorVariation: {
              select: {
                id: true,
                name: true,
                color: true,
                size: true,
                sku: true,
                sku2: true,
                variationImageURL: true,
                quantity: true,
                vendorProductId: true,
                vendorProduct: {
                  select: {
                    id: true,
                    productName: true,
                    description: true,
                    sellingPrice: true,
                    isPublished: true,
                    category: true,
                    createdAt: true,
                    updatedAt: true,
                    userId: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            role: true,
            storeSlug: true,
            username: true,
            email: true,
            companyName: true,
            displayName: true,
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
      data: orders as VendorOrder[],
      meta: {
        currentPage: page,
        totalPages,
        totalOrders,
        totalAmount: totalAmount._sum.totalAmount || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching vendor orders:", error);
    return {
      success: false,
      error: "Failed to fetch vendor orders",
    };
  }
}
