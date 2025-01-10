// app/(customer)/_actions/favoriteActions.ts
"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";

import { ActionResponse, ProductWithRelations, ReviewData } from "./types";

export async function toggleFavorite(
  productId: string
): Promise<ActionResponse> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });
    } else {
      await prisma.favorite.create({
        data: {
          userId: user.id,
          productId,
        },
      });
    }

    revalidatePath("/customer/favorites");
    revalidatePath("/customer/shopping");
    return { success: true };
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return { success: false, error: "Failed to toggle favorite" };
  }
}

export async function getFavorites(): Promise<
  ActionResponse<ProductWithRelations[]>
> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: user.id,
      },
      include: {
        product: {
          include: {
            dynamicPricing: true,
            variations: true,
            featuredImage: true,
          },
        },
      },
    });

    const products = favorites.map(f => ({
      ...f.product,
      reviews: (f.product.reviews as any[]).map(review => ({
        ...review,
        createdAt: review.createdAt.toString(),
      })) as ReviewData[],
      canReview: false,
    })) as ProductWithRelations[];

    return {
      success: true,
      data: products,
    };
  } catch (error) {
    console.error("Error getting favorites:", error);
    return { success: false, error: "Failed to get favorites" };
  }
}
