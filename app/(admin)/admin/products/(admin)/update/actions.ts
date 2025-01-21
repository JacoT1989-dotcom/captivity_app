"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import {
  UpdateStockResult,
  ProductWithRelations,
  VariationStock,
  ProductsResponse,
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  AllowedImageType,
} from "./types";

function validateImage(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as AllowedImageType)) {
    throw new Error(
      `Invalid image type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(", ")}`
    );
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(
      `Image size must be less than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`
    );
  }
}

async function uploadImage(file: File, path: string): Promise<string> {
  try {
    validateImage(file);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: file,
      headers: {
        "x-path": path,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    if (!data.url) {
      throw new Error("Failed to get URL from blob storage");
    }

    return data.url;
  } catch (error) {
    throw error;
  }
}

// Fetch product with all its relations
export async function getProduct(
  productId: string
): Promise<ProductWithRelations> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized access");
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        userId: user.id,
      },
      include: {
        featuredImage: true,
        variations: true,
        dynamicPricing: true,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return {
      success: true,
      data: product,
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch product",
    };
  }
}

// Update stock levels
export async function updateStock(
  productId: string,
  variations: VariationStock[]
): Promise<UpdateStockResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized access");
    }

    // Verify product ownership
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        userId: user.id,
      },
    });

    if (!product) {
      throw new Error("Product not found or unauthorized");
    }

    // Update stock levels for each variation
    await Promise.all(
      variations.map(async variation => {
        await prisma.variation.update({
          where: {
            id: variation.id,
            productId: productId,
          },
          data: {
            quantity: variation.quantity,
          },
        });
      })
    );

    revalidatePath("/products");
    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Stock levels updated successfully",
    };
  } catch (error) {
    console.error("Error updating stock:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update stock",
    };
  }
}

// Add new variation image
export async function addVariationImage(
  productId: string,
  variationId: string,
  image: File
): Promise<UpdateStockResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized access");
    }

    // Verify product ownership and variation existence
    const variation = await prisma.variation.findFirst({
      where: {
        id: variationId,
        productId: productId,
        product: {
          userId: user.id,
        },
      },
    });

    if (!variation) {
      throw new Error("Variation not found or unauthorized");
    }

    // Delete old image if it exists
    if (variation.variationImageURL) {
      try {
        const oldUrl = new URL(variation.variationImageURL);
        const pathname = oldUrl.pathname;
        await del(pathname);
      } catch (deleteError) {
        console.error("Error deleting old image:", deleteError);
      }
    }

    // Upload new variation image
    const fileExt = image.name.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const path = `products/variations/variation_${timestamp}_${variationId}.${fileExt}`;

    const imageUrl = await uploadImage(image, path);

    // Update variation with new image URL
    await prisma.variation.update({
      where: {
        id: variationId,
      },
      data: {
        variationImageURL: imageUrl,
      },
    });

    revalidatePath("/products");
    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Variation image updated successfully",
    };
  } catch (error) {
    console.error("Error updating variation image:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update variation image",
    };
  }
}

// Fetch all products for admin with pagination
export async function getProducts(
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<ProductsResponse> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized access");
    }

    const skip = (page - 1) * limit;

    const whereClause: Prisma.ProductWhereInput = {
      userId: user.id,
      ...(search
        ? {
            OR: [
              {
                productName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                category: {
                  hasSome: [search],
                },
              },
            ],
          }
        : {}),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          featuredImage: true,
          variations: true,
          dynamicPricing: true,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.product.count({
        where: whereClause,
      }),
    ]);

    return {
      success: true,
      data: {
        products,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: page,
          perPage: limit,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch products",
    };
  }
}
