"use server";

import { put, del } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { cache } from "react";

interface BestSellerActionResult {
  success: boolean;
  urls?: Array<{ url: string; productName: string }>;
  url?: string;
  error?: string;
}

// Cache frequently used queries
const getCachedUserSettings = cache(async (userId: string) => {
  return prisma.userSettings.findUnique({
    where: { userId },
    include: {
      BestSellerImage: {
        orderBy: { order: "asc" },
      },
    },
  });
});

const getCachedVendorSettings = cache(async (storeSlug: string) => {
  return prisma.userSettings.findFirst({
    where: {
      user: {
        storeSlug: storeSlug,
        role: "VENDOR",
      },
    },
    include: {
      BestSellerImage: {
        orderBy: { order: "asc" },
      },
    },
  });
});

export async function uploadBestSeller(
  formData: FormData
): Promise<BestSellerActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can manage best sellers");

    const file = formData.get("bestSeller") as File;
    const productName = formData.get("productName") as string;

    if (!file || !file.size) throw new Error("No file provided");
    if (!productName) throw new Error("Product name is required");
    if (!file.type.startsWith("image/"))
      throw new Error("File must be an image");
    if (file.size > 5 * 1024 * 1024)
      throw new Error("File size must be less than 5MB");

    const userSettings = await getCachedUserSettings(user.id);
    const bestSellerCount = userSettings?.BestSellerImage.length || 0;

    if (bestSellerCount >= 4) {
      throw new Error("Maximum of 4 best seller images allowed");
    }

    const fileExt = file.name.split(".").pop() || "png";
    const timestamp = Date.now();
    const path = `bestsellers/bestseller_${user.id}_${timestamp}.${fileExt}`;

    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: false,
    });

    if (!blob.url) throw new Error("Failed to get URL from blob storage");

    const updatedSettings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {
        BestSellerImage: {
          create: {
            url: blob.url,
            productName,
            order: bestSellerCount,
          },
        },
      },
      create: {
        userId: user.id,
        BestSellerImage: {
          create: {
            url: blob.url,
            productName,
            order: 0,
          },
        },
      },
      include: {
        BestSellerImage: {
          orderBy: { order: "asc" },
        },
      },
    });

    return {
      success: true,
      url: blob.url,
      urls: updatedSettings.BestSellerImage.map(item => ({
        url: item.url,
        productName: item.productName,
      })),
    };
  } catch (error) {
    console.error("Error uploading best seller:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function removeBestSeller(
  url: string
): Promise<BestSellerActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can manage best sellers");

    const bestSeller = await prisma.bestSellerImage.findFirst({
      where: {
        url: url,
        userSettings: {
          userId: user.id,
        },
      },
    });

    if (!bestSeller) {
      throw new Error("Best seller image not found");
    }

    const path = new URL(url).pathname.slice(1);
    await del(path);

    // Combine delete and reorder in a single transaction
    const { BestSellerImage } = await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        BestSellerImage: {
          delete: { id: bestSeller.id },
          updateMany: {
            where: { order: { gt: bestSeller.order } },
            data: { order: { decrement: 1 } },
          },
        },
      },
      include: {
        BestSellerImage: {
          orderBy: { order: "asc" },
        },
      },
    });

    return {
      success: true,
      urls: BestSellerImage.map(item => ({
        url: item.url,
        productName: item.productName,
      })),
    };
  } catch (error) {
    console.error("Error removing best seller:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export const getBestSellers = cache(
  async (): Promise<BestSellerActionResult> => {
    try {
      const { user } = await validateRequest();
      if (!user) return { success: false, error: "Unauthorized access" };

      if (user.role === "VENDOR") {
        const userSettings = await getCachedUserSettings(user.id);
        return {
          success: true,
          urls:
            userSettings?.BestSellerImage.map(item => ({
              url: item.url,
              productName: item.productName,
            })) || [],
        };
      }

      if (user.role === "VENDORCUSTOMER") {
        const currentUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { companyName: true },
        });

        if (!currentUser) return { success: false, error: "User not found" };

        const userSettings = await prisma.userSettings.findFirst({
          where: {
            user: {
              role: "VENDOR",
              storeName: currentUser.companyName,
            },
          },
          include: {
            BestSellerImage: {
              orderBy: { order: "asc" },
            },
          },
        });

        return {
          success: true,
          urls:
            userSettings?.BestSellerImage.map(item => ({
              url: item.url,
              productName: item.productName,
            })) || [],
        };
      }

      return { success: true, urls: [] };
    } catch (error) {
      console.error("Error getting best sellers:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  }
);

export const getVendorBestSellersBySlug = cache(
  async (storeSlug: string): Promise<BestSellerActionResult> => {
    try {
      const userSettings = await getCachedVendorSettings(storeSlug);
      return {
        success: true,
        urls:
          userSettings?.BestSellerImage.map(item => ({
            url: item.url,
            productName: item.productName,
          })) || [],
      };
    } catch (error) {
      console.error("Error getting vendor best sellers:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  }
);
