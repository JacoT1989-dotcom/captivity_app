"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { PrismaProduct, SearchParams, SearchResult } from "./types";

export async function searchProducts(
  params: SearchParams
): Promise<SearchResult> {
  try {
    // Build the where clause based on search parameters
    const where: Prisma.ProductWhereInput = {};

    // Full-text search across multiple fields
    if (params.query) {
      where.OR = [
        { productName: { contains: params.query, mode: "insensitive" } },
        { description: { contains: params.query, mode: "insensitive" } },
        {
          variations: {
            some: {
              OR: [
                { name: { contains: params.query, mode: "insensitive" } },
                { color: { contains: params.query, mode: "insensitive" } },
                { sku: { contains: params.query, mode: "insensitive" } },
                { sku2: { contains: params.query, mode: "insensitive" } },
              ],
            },
          },
        },
      ];
    }

    // Category filter
    if (params.categories && params.categories.length > 0) {
      where.category = {
        hasSome: params.categories,
      };
    }

    // Price range filter
    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      where.sellingPrice = {};
      if (params.minPrice !== undefined) {
        where.sellingPrice.gte = params.minPrice;
      }
      if (params.maxPrice !== undefined) {
        where.sellingPrice.lte = params.maxPrice;
      }
    }

    // Published status filter
    if (params.isPublished !== undefined) {
      where.isPublished = params.isPublished;
    }

    // Build the orderBy clause
    let orderBy: Prisma.ProductOrderByWithRelationInput = {};
    switch (params.sortBy) {
      case "price_asc":
        orderBy = { sellingPrice: "asc" };
        break;
      case "price_desc":
        orderBy = { sellingPrice: "desc" };
        break;
      case "name_asc":
        orderBy = { productName: "asc" };
        break;
      case "name_desc":
        orderBy = { productName: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      default:
        orderBy = { createdAt: "desc" }; // Default sorting
    }

    // Execute count query for pagination
    const total = await prisma.product.count({ where });

    // Execute search query
    const products = await prisma.product.findMany({
      where,
      orderBy,
      take: params.limit || 10,
      skip: params.offset || 0,
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
        total,
      },
    };
  } catch (error) {
    console.error("Error searching products:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Helper function to search products by SKU
export async function searchProductsBySKU(sku: string): Promise<SearchResult> {
  return searchProducts({
    query: sku,
    limit: 1, // Typically we only expect one product per SKU
  });
}

// Helper function to search products by category
export async function searchProductsByCategory(
  category: string
): Promise<SearchResult> {
  return searchProducts({
    categories: [category],
  });
}

// Helper function to search products by price range
export async function searchProductsByPriceRange(
  minPrice: number,
  maxPrice: number
): Promise<SearchResult> {
  return searchProducts({
    minPrice,
    maxPrice,
  });
}
