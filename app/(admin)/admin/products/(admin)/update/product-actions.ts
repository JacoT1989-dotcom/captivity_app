"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import {
  UpdateStockResult,
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  AllowedImageType,
  ImageUploadResponse,
  ProductResponse,
  ProductsResponse,
  Product,
} from "./types";

function validateImage(file: File): true | never {
  if (!file) throw new Error("No file provided");

  if (!ALLOWED_IMAGE_TYPES.includes(file.type as AllowedImageType)) {
    throw new Error(
      `Invalid file type: ${file.type}. Allowed types: ${ALLOWED_IMAGE_TYPES.join(", ")}`
    );
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(
      `File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds limit of ${
        MAX_IMAGE_SIZE / (1024 * 1024)
      }MB`
    );
  }

  return true;
}

async function uploadImage(
  file: File,
  path: string
): Promise<ImageUploadResponse> {
  try {
    validateImage(file);
    const sanitizedPath = path.startsWith("/") ? path.slice(1) : path;

    const blob = await put(sanitizedPath, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type,
    });

    if (!blob?.url) {
      return { success: false, error: "Failed to get URL from blob storage" };
    }

    return { success: true, imageUrl: blob.url };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload image",
    };
  }
}

async function deleteOldImage(imageUrl: string): Promise<boolean> {
  try {
    if (!imageUrl) return true;
    const url = new URL(imageUrl);
    const pathname = url.pathname.slice(1);
    await del(pathname);
    return true;
  } catch (error) {
    console.error("Error deleting old image:", error);
    return false;
  }
}

export async function getProduct(productId: string): Promise<ProductResponse> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");

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

    if (!product) throw new Error("Product not found");

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

export async function getProducts(
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<ProductsResponse> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");

    const whereClause: Prisma.ProductWhereInput = {
      userId: user.id,
      ...(search
        ? {
            OR: [
              {
                productName: {
                  contains: search,
                  mode: "insensitive" as Prisma.QueryMode,
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
        skip: (page - 1) * limit,
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
        products: products as unknown as Product[],
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

export async function updateStock(
  productId: string,
  variations: { id: string; quantity: number }[]
): Promise<UpdateStockResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        userId: user.id,
      },
    });

    if (!product) throw new Error("Product not found or unauthorized");

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

export async function updateDynamicPricing(
  productId: string,
  pricing: { id: string; from: string; to: string; amount: number }[]
): Promise<UpdateStockResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        userId: user.id,
      },
    });

    if (!product) throw new Error("Product not found or unauthorized");

    await Promise.all(
      pricing.map(async price => {
        await prisma.dynamicPricing.update({
          where: {
            id: price.id,
            productId: productId,
          },
          data: {
            amount: price.amount.toString(),
          },
        });
      })
    );

    revalidatePath("/products");
    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Dynamic pricing updated successfully",
    };
  } catch (error) {
    console.error("Error updating dynamic pricing:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update dynamic pricing",
    };
  }
}

export async function addVariationImage(
  productId: string,
  variationId: string,
  base64: string,
  contentType: string
): Promise<UpdateStockResult> {
  try {
    const { user } = await validateRequest();
    if (!user) return { success: false, error: "Unauthorized access" };

    const buffer = Buffer.from(base64.split(",")[1], "base64");
    const fileName = `${Date.now()}.${contentType.split("/")[1]}`;
    const path = `products/${user.id}/variations/${productId}/${variationId}_${fileName}`;

    const blob = await put(path, buffer, {
      access: "public",
      contentType,
    });

    await prisma.variation.update({
      where: { id: variationId },
      data: { variationImageURL: blob.url },
    });

    revalidatePath("/products");
    revalidatePath("/admin/products");

    return { success: true, message: "Image updated", imageUrl: blob.url };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update",
    };
  }
}

export async function deleteProduct(
  productId: string
): Promise<UpdateStockResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");

    await prisma.product.delete({
      where: {
        id: productId,
        userId: user.id,
      },
    });

    revalidatePath("/products");
    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete product",
    };
  }
}

// Add to product-actions.ts
// In product-actions.ts
export async function updateVariationImagesForColor(
  productId: string,
  variations: { id: string }[],
  base64: string,
  contentType: string
): Promise<UpdateStockResult> {
  try {
    const { user } = await validateRequest();
    if (!user) return { success: false, error: "Unauthorized access" };

    const buffer = Buffer.from(base64.split(",")[1], "base64");
    const fileName = `${Date.now()}.${contentType.split("/")[1]}`;
    const path = `products/${user.id}/variations/${productId}/color_${fileName}`;

    const blob = await put(path, buffer, {
      access: "public",
      contentType,
    });

    // Update all variations with the same image URL
    await Promise.all(
      variations.map(variation =>
        prisma.variation.update({
          where: { id: variation.id },
          data: { variationImageURL: blob.url },
        })
      )
    );

    return {
      success: true,
      message: "Images updated successfully",
      imageUrl: blob.url, // Return the new image URL
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update",
    };
  }
}

export { validateImage, uploadImage };
