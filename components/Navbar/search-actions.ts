"use server";

import prisma from "@/lib/prisma";
import { PrismaProduct, SearchResult } from "./types";

export async function getProducts(limit: number = 100): Promise<SearchResult> {
  try {
    const products = await prisma.product.findMany({
      where: {
        isPublished: true,
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        userId: true,
        productName: true,
        category: true,
        description: true,
        sellingPrice: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        reviews: true,
        dynamicPricing: {
          select: {
            id: true,
            from: true,
            to: true,
            type: true,
            amount: true,
            productId: true,
          },
          orderBy: {
            from: "asc",
          },
        },
        featuredImage: true,
        variations: {
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
    });

    return {
      success: true,
      data: {
        products: products as PrismaProduct[],
        total: products.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
