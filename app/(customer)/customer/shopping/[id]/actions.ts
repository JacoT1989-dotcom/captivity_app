"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import {
  Product,
  DynamicPricing,
  Variation,
  FeaturedImage,
} from "@prisma/client";

type ProductWithRelations = Product & {
  dynamicPricing: DynamicPricing[];
  variations: Variation[];
  featuredImage: FeaturedImage | null;
};

type FetchProductResult =
  | { success: true; data: ProductWithRelations }
  | { success: false; error: string };

export async function fetchProductById(
  productId: string
): Promise<FetchProductResult> {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    // Fetch the product with all relations
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        dynamicPricing: true,
        variations: true,
        featuredImage: true,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return { success: true, data: product };
  } catch (error) {
    console.error("Error fetching product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
