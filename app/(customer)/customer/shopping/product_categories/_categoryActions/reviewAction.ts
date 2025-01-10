"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { parseReviews } from "../_utils/reviewHelpers";
import type { ActionResponse, ReviewData } from "../types";
import { Prisma } from "@prisma/client";

export async function submitProductReview(
  productId: string,
  rating: number,
  comment: string
): Promise<ActionResponse> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    const purchaseVerification = await prisma.order.findFirst({
      where: {
        userId: user.id,
        status: {
          in: ["DELIVERED", "SHIPPED"],
        },
        orderItems: {
          some: {
            variation: {
              product: {
                id: productId,
              },
            },
          },
        },
      },
    });

    if (!purchaseVerification) {
      throw new Error("You can only review products you have purchased.");
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found.");
    }

    const currentReviews = parseReviews(product.reviews);

    if (currentReviews.some(review => review.userId === user.id)) {
      throw new Error("You have already reviewed this product.");
    }

    const newReview: ReviewData = {
      id: crypto.randomUUID(),
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      rating,
      comment,
      createdAt: new Date().toISOString(),
      orderId: purchaseVerification.id,
      verified: true,
    };

    const reviewsInput: Prisma.InputJsonValue[] = [
      ...currentReviews.map(review => ({
        ...review,
        rating: Number(review.rating),
      })),
      {
        ...newReview,
        rating: Number(rating),
      },
    ];

    await prisma.product.update({
      where: { id: productId },
      data: {
        reviews: reviewsInput,
      },
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
