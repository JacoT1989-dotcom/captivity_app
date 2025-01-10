"use server";

import prisma from "@/lib/prisma";

interface ProductResponse<T> {
  success: boolean;
  data?: T[];
  error?: string;
}

// Siraaj
export async function fetchNewInApparel(): Promise<ProductResponse<any>> {
  try {
    const newApparelProducts = await prisma.product.findMany({
      where: {
        AND: [
          {
            isPublished: true,
            category: {
              hasSome: ["new-in-apparel"],
            },
          },
        ],
      },
      select: {
        id: true,
        productName: true,
        featuredImage: {
          select: {
            medium: true,
            large: true,
          },
        },
        variations: {
          select: {
            quantity: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const transformedProducts = newApparelProducts.map(product => ({
      id: product.id,
      name: product.productName,
      imageUrl: `${product.featuredImage?.medium || ""},${product.featuredImage?.large || ""}`,
      stock: product.variations.reduce(
        (total, variation) => total + variation.quantity,
        0
      ),
    }));

    return {
      success: true,
      data: transformedProducts,
    };
  } catch (error) {
    console.error("Error fetching New-In-Apparel:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Heini
export async function fetchNewInHeadwear(): Promise<ProductResponse<any>> {
  try {
    const newHeadwearProducts = await prisma.product.findMany({
      where: {
        AND: [
          {
            isPublished: true,
            category: {
              hasSome: ["new-in-headwear"],
            },
          },
        ],
      },
      select: {
        id: true,
        productName: true,
        featuredImage: {
          select: {
            medium: true,
            large: true,
          },
        },
        variations: {
          select: {
            quantity: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const transformedProducts = newHeadwearProducts.map(product => ({
      id: product.id,
      name: product.productName,
      imageUrl: `${product.featuredImage?.medium || ""},${product.featuredImage?.large || ""}`,
      stock: product.variations.reduce(
        (total, variation) => total + variation.quantity,
        0
      ),
    }));

    return {
      success: true,
      data: transformedProducts,
    };
  } catch (error) {
    console.error("Error fetching New-In-Headwear:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Matthew Booth
export async function fetchNewProducts(): Promise<ProductResponse<any>> {
  try {
    const newProducts = await prisma.product.findMany({
      where: {
        AND: [
          {
            isPublished: true,
            category: {
              hasSome: ["new-products"],
            },
          },
        ],
      },
      select: {
        id: true,
        productName: true,
        featuredImage: {
          select: {
            medium: true,
            large: true,
          },
        },
        variations: {
          select: {
            quantity: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const transformedProducts = newProducts.map(product => ({
      id: product.id,
      name: product.productName,
      imageUrl: `${product.featuredImage?.medium || ""},${product.featuredImage?.large || ""}`,
      stock: product.variations.reduce(
        (total, variation) => total + variation.quantity,
        0
      ),
    }));

    return {
      success: true,
      data: transformedProducts,
    };
  } catch (error) {
    console.error("Error fetching New-Products:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
