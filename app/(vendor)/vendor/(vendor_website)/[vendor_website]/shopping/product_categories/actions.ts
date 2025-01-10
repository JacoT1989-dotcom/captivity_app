"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

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
    vendorProductId: string;
  } | null;
};

export type FetchVendorCollectionsResult =
  | {
      success: true;
      collections: {
        african: Product[];
        baseball: Product[];
        camo: Product[];
        fashion: Product[];
        industrial: Product[];
        kids: Product[];
        leisure: Product[];
        signature: Product[];
        sport: Product[];
        summer: Product[];
        winter: Product[];
      };
      counts: {
        african: number;
        baseball: number;
        camo: number;
        fashion: number;
        industrial: number;
        kids: number;
        leisure: number;
        signature: number;
        sport: number;
        summer: number;
        winter: number;
      };
    }
  | { success: false; error: string };

async function getVendorIdByWebsite(websiteAddress: string) {
  const vendorUser = await prisma.user.findFirst({
    where: {
      OR: [{ website: websiteAddress }, { storeSlug: websiteAddress }],
      role: "VENDOR",
    },
    select: { id: true },
  });
  return vendorUser?.id;
}

export async function fetchVendorCollections(
  vendorWebsite?: string
): Promise<FetchVendorCollectionsResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Authentication required");
    }

    // Determine which userId to use for the query
    let queryUserId: string;

    if (user.role === "VENDOR") {
      queryUserId = user.id;
    } else if (user.role === "VENDORCUSTOMER" && vendorWebsite) {
      const vendorId = await getVendorIdByWebsite(vendorWebsite);
      if (!vendorId) {
        throw new Error("Vendor not found");
      }
      queryUserId = vendorId;
    } else {
      throw new Error("Unauthorized access");
    }

    const [
      african,
      baseball,
      camo,
      fashion,
      industrial,
      kids,
      leisure,
      signature,
      sport,
      summer,
      winter,
    ] = await Promise.all([
      prisma.vendorProduct.findMany({
        where: {
          userId: queryUserId,
          category: { has: "african-collection" },
          isPublished: true, // Only show published products to customers
        },
        include: { featuredImage: true },
      }),
      prisma.vendorProduct.findMany({
        where: {
          userId: queryUserId,
          category: { has: "baseball-collection" },
          isPublished: true,
        },
        include: { featuredImage: true },
      }),
      prisma.vendorProduct.findMany({
        where: {
          userId: queryUserId,
          category: { has: "camo-collection" },
          isPublished: true,
        },
        include: { featuredImage: true },
      }),
      prisma.vendorProduct.findMany({
        where: {
          userId: queryUserId,
          category: { has: "fashion-collection" },
          isPublished: true,
        },
        include: { featuredImage: true },
      }),
      prisma.vendorProduct.findMany({
        where: {
          userId: queryUserId,
          category: { has: "industrial-collection" },
          isPublished: true,
        },
        include: { featuredImage: true },
      }),
      prisma.vendorProduct.findMany({
        where: {
          userId: queryUserId,
          category: { has: "kids-collection" },
          isPublished: true,
        },
        include: { featuredImage: true },
      }),
      prisma.vendorProduct.findMany({
        where: {
          userId: queryUserId,
          category: { has: "leisure-collection" },
          isPublished: true,
        },
        include: { featuredImage: true },
      }),
      prisma.vendorProduct.findMany({
        where: {
          userId: queryUserId,
          category: { has: "signature-collection" },
          isPublished: true,
        },
        include: { featuredImage: true },
      }),
      prisma.vendorProduct.findMany({
        where: {
          userId: queryUserId,
          category: { has: "sport-collection" },
          isPublished: true,
        },
        include: { featuredImage: true },
      }),
      prisma.vendorProduct.findMany({
        where: {
          userId: queryUserId,
          category: { has: "summer-collection" },
          isPublished: true,
        },
        include: { featuredImage: true },
      }),
      prisma.vendorProduct.findMany({
        where: {
          userId: queryUserId,
          category: { has: "winter-collection" },
          isPublished: true,
        },
        include: { featuredImage: true },
      }),
    ]);

    return {
      success: true,
      collections: {
        african,
        baseball,
        camo,
        fashion,
        industrial,
        kids,
        leisure,
        signature,
        sport,
        summer,
        winter,
      },
      counts: {
        african: african.length,
        baseball: baseball.length,
        camo: camo.length,
        fashion: fashion.length,
        industrial: industrial.length,
        kids: kids.length,
        leisure: leisure.length,
        signature: signature.length,
        sport: sport.length,
        summer: summer.length,
        winter: winter.length,
      },
    };
  } catch (error) {
    console.error("Error fetching vendor collections:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
