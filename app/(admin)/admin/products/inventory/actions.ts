"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export type InventoryItem = {
  id: string;
  productName: string;
  category: string[];
  sellingPrice: number;
  totalStock: number;
  variations: {
    id: string;
    name: string;
    color: string;
    size: string;
    sku: string;
    quantity: number;
  }[];
};

export async function getInventoryItems(
  page: number = 1,
  pageSize: number = 10,
  search?: string
) {
  try {
    const skip = (page - 1) * pageSize;

    // Build the where clause based on search
    const where: Prisma.ProductWhereInput = search
      ? {
          OR: [
            { productName: { contains: search, mode: "insensitive" as const } },
            {
              variations: {
                some: {
                  sku: { contains: search, mode: "insensitive" as const },
                },
              },
            },
          ],
        }
      : {};

    // Get total count for pagination
    const totalItems = await prisma.product.count({ where });

    // Fetch products with their variations
    const products = await prisma.product.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        variations: {
          select: {
            id: true,
            name: true,
            color: true,
            size: true,
            sku: true,
            quantity: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return {
      items: products,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw new Error("Failed to fetch inventory items");
  }
}

export async function updateInventoryQuantity(
  variationId: string,
  quantity: number
) {
  try {
    await prisma.variation.update({
      where: { id: variationId },
      data: { quantity },
    });

    revalidatePath("/admin/inventory");
    return { success: true };
  } catch (error) {
    console.error("Error updating quantity:", error);
    throw new Error("Failed to update inventory quantity");
  }
}
