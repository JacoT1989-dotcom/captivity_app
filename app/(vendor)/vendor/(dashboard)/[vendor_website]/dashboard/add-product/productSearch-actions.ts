"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { VendorApiResponse } from "./types";

interface ProductSearchResult {
  id: string;
  productName: string;
  category: string[];
  description: string;
  sellingPrice: number;
  isPublished: boolean;
  dynamicPricing: Array<{
    from: string;
    to: string;
    type: string;
    amount: string;
  }>;
  featuredImage?: {
    thumbnail: string;
    medium: string;
    large: string;
  } | null;
  variations?: Array<{
    name: string;
    color: string;
    size: string;
    sku: string;
    sku2: string;
    quantity: number;
    variationImageURL: string;
  }>;
}

export async function searchProducts(
  search: string
): Promise<VendorApiResponse<ProductSearchResult[]>> {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "VENDOR") {
      throw new Error("Unauthorized: Only vendors can search products");
    }

    const products = await prisma.product.findMany({
      where: {
        productName: {
          contains: search,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        productName: true,
        category: true,
        description: true,
        sellingPrice: true,
        isPublished: true,
        dynamicPricing: {
          select: {
            from: true,
            to: true,
            type: true,
            amount: true,
          },
        },
        featuredImage: true,
        variations: {
          select: {
            name: true,
            color: true,
            size: true,
            sku: true,
            sku2: true,
            quantity: true,
            variationImageURL: true,
          },
        },
      },
    });

    return {
      success: true,
      data: products.map(product => ({
        ...product,
        dynamicPricing: product.dynamicPricing.map(pricing => ({
          from: pricing.from,
          to: pricing.to,
          // Ensure type is either "fixed_price" or "percentage"
          type: pricing.type === "percentage" ? "percentage" : "fixed_price",
          amount: pricing.amount,
        })),
      })),
    };
  } catch (error) {
    console.error("Error searching products:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to search products",
    };
  }
}
