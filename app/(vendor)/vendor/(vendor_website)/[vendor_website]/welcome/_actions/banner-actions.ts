"use server";

import { put, del } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { cache } from "react";

interface BannerActionResult {
  success: boolean;
  urls?: string[];
  url?: string;
  error?: string;
}

// Cache the fetch functions
const getCachedUserSettings = cache(async (userId: string) => {
  return prisma.userSettings.findUnique({
    where: { userId },
    include: {
      BannerImage: {
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
      BannerImage: {
        orderBy: { order: "asc" },
      },
    },
  });
});

export async function uploadBanner(
  formData: FormData
): Promise<BannerActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can manage banners");

    const file = formData.get("banner") as File;
    if (!file || !file.size) throw new Error("No file provided");
    if (!file.type.startsWith("image/"))
      throw new Error("File must be an image");
    if (file.size > 5 * 1024 * 1024)
      throw new Error("File size must be less than 5MB");

    const userSettings = await getCachedUserSettings(user.id);
    const bannerCount = userSettings?.BannerImage.length || 0;

    if (bannerCount >= 5) {
      throw new Error("Maximum of 5 banner images allowed");
    }

    const fileExt = file.name.split(".").pop() || "png";
    const timestamp = Date.now();
    const path = `banners/banner_${user.id}_${timestamp}.${fileExt}`;

    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: false,
    });

    if (!blob.url) throw new Error("Failed to get URL from blob storage");

    const updatedSettings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {
        BannerImage: {
          create: {
            url: blob.url,
            order: bannerCount,
          },
        },
      },
      create: {
        userId: user.id,
        BannerImage: {
          create: {
            url: blob.url,
            order: 0,
          },
        },
      },
      include: {
        BannerImage: {
          orderBy: { order: "asc" },
        },
      },
    });

    return {
      success: true,
      url: blob.url,
      urls: updatedSettings.BannerImage.map(banner => banner.url),
    };
  } catch (error) {
    console.error("Error uploading banner:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function removeBanner(url: string): Promise<BannerActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can manage banners");

    const banner = await prisma.bannerImage.findFirst({
      where: {
        url: url,
        userSettings: {
          userId: user.id,
        },
      },
    });

    if (!banner) {
      throw new Error("Banner not found");
    }

    const path = new URL(url).pathname.slice(1);
    await del(path);

    const { BannerImage } = await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        BannerImage: {
          delete: { id: banner.id },
          updateMany: {
            where: { order: { gt: banner.order } },
            data: { order: { decrement: 1 } },
          },
        },
      },
      include: {
        BannerImage: {
          orderBy: { order: "asc" },
        },
      },
    });

    return {
      success: true,
      urls: BannerImage.map(banner => banner.url),
    };
  } catch (error) {
    console.error("Error removing banner:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export const getBanners = cache(async (): Promise<BannerActionResult> => {
  try {
    const { user } = await validateRequest();
    if (!user) return { success: false, error: "Unauthorized access" };

    if (user.role === "VENDOR") {
      const userSettings = await getCachedUserSettings(user.id);
      return {
        success: true,
        urls: userSettings?.BannerImage.map(banner => banner.url) || [],
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
          BannerImage: {
            orderBy: { order: "asc" },
          },
        },
      });

      return {
        success: true,
        urls: userSettings?.BannerImage.map(banner => banner.url) || [],
      };
    }

    return { success: true, urls: [] };
  } catch (error) {
    console.error("Error getting banners:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
});

export const getVendorBannersBySlug = cache(
  async (storeSlug: string): Promise<BannerActionResult> => {
    try {
      const userSettings = await getCachedVendorSettings(storeSlug);
      return {
        success: true,
        urls: userSettings?.BannerImage.map(banner => banner.url) || [],
      };
    } catch (error) {
      console.error("Error getting vendor banners:", error);
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
