"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import {
  UpdateStockResult,
  ProductWithRelations,
  VariationStock,
  ProductsResponse,
} from "./types";

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

export async function updateStock(
  productId: string,
  variations: VariationStock[]
): Promise<UpdateStockResult> {
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
    });

    if (!product) {
      throw new Error("Product not found or unauthorized");
    }

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
    if (!user) {
      throw new Error("Unauthorized access");
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        userId: user.id,
      },
    });

    if (!product) {
      throw new Error("Product not found or unauthorized");
    }

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

export async function deleteProduct(
  productId: string
): Promise<UpdateStockResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized access");
    }

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
