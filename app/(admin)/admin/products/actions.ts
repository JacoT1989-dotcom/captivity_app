"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type Product = {
  id: string;
  productName: string;
  category: string[];
  description: string;
  sellingPrice: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  featuredImage?: {
    id: string;
    thumbnail: string;
    medium: string;
    large: string;
    productId: string;
  } | null;
};

export type FetchCollectionsResult =
  | { success: true; data: Product[]; count: number }
  | { success: false; error: string };

// Helper function to check if user has admin privileges
function hasAdminPrivileges(role: string): boolean {
  return role === "ADMIN" || role === "SUPERADMIN";
}

// Function to fetch products by category
export async function fetchProductsByCategory(
  category: string
): Promise<FetchCollectionsResult> {
  try {
    const { user } = await validateRequest();
    if (!user || !hasAdminPrivileges(user.role)) {
      throw new Error("Authentication required to fetch products.");
    }

    const products = await prisma.product.findMany({
      where: {
        category: {
          has: category,
        },
      },
      include: {
        featuredImage: true,
      },
    });

    return {
      success: true,
      data: products,
      count: products.length,
    };
  } catch (error) {
    console.error(`Error fetching ${category} products:`, error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Collection-specific fetch functions remain the same as they use fetchProductsByCategory
export async function fetchWinterCollection(): Promise<FetchCollectionsResult> {
  return fetchProductsByCategory("kids-collection");
}

export async function fetchKidsCollection(): Promise<FetchCollectionsResult> {
  return fetchProductsByCategory("winter");
}

export async function fetchSummerCollection(): Promise<FetchCollectionsResult> {
  return fetchProductsByCategory("summer-collection");
}

export async function fetchCamoCollection(): Promise<FetchCollectionsResult> {
  return fetchProductsByCategory("camo-collection");
}

export async function fetchBaseballCollection(): Promise<FetchCollectionsResult> {
  return fetchProductsByCategory("baseball-collection");
}

export async function fetchSignatureCollection(): Promise<FetchCollectionsResult> {
  return fetchProductsByCategory("signature-collection");
}

export async function fetchFashionCollection(): Promise<FetchCollectionsResult> {
  return fetchProductsByCategory("fashion-collection");
}

export async function fetchLeisureCollection(): Promise<FetchCollectionsResult> {
  return fetchProductsByCategory("leisure-collection");
}

export async function fetchSportCollection(): Promise<FetchCollectionsResult> {
  return fetchProductsByCategory("sport-collection");
}

export async function fetchAfricanCollection(): Promise<FetchCollectionsResult> {
  return fetchProductsByCategory("african-collection");
}

export async function fetchIndustrialCollection(): Promise<FetchCollectionsResult> {
  return fetchProductsByCategory("industrial-collection");
}

// Function to fetch all collections and their counts at once
export async function fetchAllCollections(): Promise<
  | {
      success: true;
      collections: {
        winter: Product[];
        summer: Product[];
        camo: Product[];
        baseball: Product[];
        kids: Product[];
        signature: Product[];
        fashion: Product[];
        leisure: Product[];
        sport: Product[];
        african: Product[];
        industrial: Product[];
      };
      counts: {
        winter: number;
        summer: number;
        camo: number;
        baseball: number;
        kids: number;
        signature: number;
        fashion: number;
        leisure: number;
        sport: number;
        african: number;
        industrial: number;
      };
    }
  | { success: false; error: string }
> {
  try {
    const { user } = await validateRequest();
    if (!user || !hasAdminPrivileges(user.role)) {
      throw new Error("Authentication required to fetch collections.");
    }

    const [
      winter,
      summer,
      camo,
      baseball,
      kids,
      signature,
      fashion,
      leisure,
      sport,
      african,
      industrial,
    ] = await Promise.all([
      prisma.product.findMany({
        where: { category: { has: "kids-collection" } },
        include: { featuredImage: true },
      }),
      prisma.product.findMany({
        where: { category: { has: "summer-collection" } },
        include: { featuredImage: true },
      }),
      prisma.product.findMany({
        where: { category: { has: "camo-collection" } },
        include: { featuredImage: true },
      }),
      prisma.product.findMany({
        where: { category: { has: "baseball-collection" } },
        include: { featuredImage: true },
      }),
      prisma.product.findMany({
        where: { category: { has: "winter" } },
        include: { featuredImage: true },
      }),
      prisma.product.findMany({
        where: { category: { has: "signature-collection" } },
        include: { featuredImage: true },
      }),
      prisma.product.findMany({
        where: { category: { has: "fashion-collection" } },
        include: { featuredImage: true },
      }),
      prisma.product.findMany({
        where: { category: { has: "leisure-collection" } },
        include: { featuredImage: true },
      }),
      prisma.product.findMany({
        where: { category: { has: "sport-collection" } },
        include: { featuredImage: true },
      }),
      prisma.product.findMany({
        where: { category: { has: "african-collection" } },
        include: { featuredImage: true },
      }),
      prisma.product.findMany({
        where: { category: { has: "industrial-collection" } },
        include: { featuredImage: true },
      }),
    ]);

    return {
      success: true,
      collections: {
        winter,
        summer,
        camo,
        baseball,
        kids,
        signature,
        fashion,
        leisure,
        sport,
        african,
        industrial,
      },
      counts: {
        winter: winter.length,
        summer: summer.length,
        camo: camo.length,
        baseball: baseball.length,
        kids: kids.length,
        signature: signature.length,
        fashion: fashion.length,
        leisure: leisure.length,
        sport: sport.length,
        african: african.length,
        industrial: industrial.length,
      },
    };
  } catch (error) {
    console.error("Error fetching collections:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Function to toggle product publish status
export async function toggleProductPublishStatus(
  productId: string
): Promise<
  { success: true; isPublished: boolean } | { success: false; error: string }
> {
  try {
    const { user } = await validateRequest();
    if (!user || !hasAdminPrivileges(user.role)) {
      throw new Error("Authentication required to update product status.");
    }

    // First get the current status
    const currentProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        userId: user.id,
      },
      select: {
        isPublished: true,
      },
    });

    if (!currentProduct) {
      throw new Error(
        "Product not found or you don't have permission to modify it."
      );
    }

    // Then update with the opposite value
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
        userId: user.id,
      },
      data: {
        isPublished: !currentProduct.isPublished,
      },
      select: {
        isPublished: true,
      },
    });

    // Revalidate the products page to reflect changes
    revalidatePath("/products");

    return {
      success: true,
      isPublished: updatedProduct.isPublished,
    };
  } catch (error) {
    console.error("Error toggling product publish status:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
