"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import {
  FetchVariationResult,
  FetchProductAndVariationResult,
  FetchVariationsResult,
  ProductAndVariation,
  VariationWithRelations,
} from "./_types/types";

export async function fetchVariationById(
  variationId: string
): Promise<FetchVariationResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return {
        success: false,
        error: "Unauthorized. Please log in.",
      };
    }

    const variation = await prisma.variation.findUnique({
      where: {
        id: variationId,
      },
      include: {
        product: {
          include: {
            dynamicPricing: {
              orderBy: {
                id: "desc",
              },
              take: 1,
            },
            variations: true,
            featuredImage: true,
          },
        },
      },
    });

    if (!variation) {
      return {
        success: false,
        error: "Variation not found",
      };
    }

    return {
      success: true,
      data: variation as VariationWithRelations,
    };
  } catch (error) {
    console.error("Error fetching variation:", error);
    return {
      success: false,
      error:
        error instanceof Prisma.PrismaClientKnownRequestError
          ? `Database error: ${error.message}`
          : "An unexpected error occurred",
    };
  }
}

export async function fetchProductAndVariation(
  productId: string,
  variationId: string
): Promise<FetchProductAndVariationResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return {
        success: false,
        error: "Unauthorized. Please log in.",
      };
    }

    const [product, variation] = await Promise.all([
      prisma.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          dynamicPricing: {
            orderBy: {
              id: "desc",
            },
            take: 1,
          },
          variations: true,
          featuredImage: true,
        },
      }),
      prisma.variation.findUnique({
        where: {
          id: variationId,
        },
      }),
    ]);

    if (!product || !variation) {
      return {
        success: false,
        error: !product ? "Product not found" : "Variation not found",
      };
    }

    if (variation.productId !== product.id) {
      return {
        success: false,
        error: "Variation does not belong to this product",
      };
    }

    return {
      success: true,
      data: { product, variation } as ProductAndVariation,
    };
  } catch (error) {
    console.error("Error fetching product and variation:", error);
    return {
      success: false,
      error:
        error instanceof Prisma.PrismaClientKnownRequestError
          ? `Database error: ${error.message}`
          : "An unexpected error occurred",
    };
  }
}

export async function fetchVariationsForProduct(
  productId: string
): Promise<FetchVariationsResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return {
        success: false,
        error: "Unauthorized. Please log in.",
      };
    }

    const variations = await prisma.variation.findMany({
      where: {
        productId: productId,
      },
      orderBy: {
        id: "asc",
      },
      include: {
        product: {
          include: {
            dynamicPricing: {
              orderBy: {
                id: "desc",
              },
              take: 1,
            },
          },
        },
      },
    });

    if (!variations.length) {
      return {
        success: false,
        error: "No variations found for this product",
      };
    }

    return {
      success: true,
      data: variations,
    };
  } catch (error) {
    console.error("Error fetching variations:", error);
    return {
      success: false,
      error:
        error instanceof Prisma.PrismaClientKnownRequestError
          ? `Database error: ${error.message}`
          : "An unexpected error occurred",
    };
  }
}

export async function validateVariationBelongsToProduct(
  productId: string,
  variationId: string
): Promise<boolean> {
  try {
    const variation = await prisma.variation.findFirst({
      where: {
        AND: [{ id: variationId }, { productId: productId }],
      },
    });

    return !!variation;
  } catch {
    return false;
  }
}
