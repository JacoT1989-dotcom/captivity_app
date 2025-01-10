"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { parseReviews } from "../_utils/reviewHelpers";
import type {
  CategorizedProducts,
  CategoryType,
  SubCategory,
  ActionResponse,
} from "../types";

export async function fetchCategoryProducts(
  category: CategoryType
): Promise<ActionResponse<CategorizedProducts>> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    const products = await prisma.product.findMany({
      where: {
        category: {
          has: `${category}-collection`,
        },
        isPublished: true,
      },
      include: {
        dynamicPricing: true,
        variations: true,
        featuredImage: true,
      },
    });

    const userOrders = await prisma.order.findMany({
      where: {
        userId: user.id,
        status: {
          in: ["DELIVERED", "SHIPPED"],
        },
      },
      include: {
        orderItems: {
          include: {
            variation: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    const purchasedProductIds = new Set(
      userOrders.flatMap(order =>
        order.orderItems.map(item => item.variation.product.id)
      )
    );

    const productsWithReviews = products.map(product => {
      const reviews = parseReviews(product.reviews);

      return {
        ...product,
        reviews,
        canReview:
          purchasedProductIds.has(product.id) &&
          !reviews.some(review => review.userId === user.id),
      };
    });

    const categorizedProducts: CategorizedProducts = {
      men: [],
      women: [],
      kids: [],
      hats: [],
      golfers: [],
      bottoms: [],
      caps: [],
      uncategorised: [],
    };

    productsWithReviews.forEach(product => {
      const categories = product.category as string[];
      const primaryCategory =
        (categories.find(cat =>
          Object.keys(categorizedProducts).includes(cat)
        ) as SubCategory) || "uncategorised";
      categorizedProducts[primaryCategory].push(product);
    });

    revalidatePath(`/customer/shopping/${category}`);
    return { success: true, data: categorizedProducts };
  } catch (error) {
    console.error(`Error fetching ${category} collection:`, error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
