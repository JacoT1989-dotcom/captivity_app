"use server";

import { put, del } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { cache } from "react";

interface CategoryActionResult {
  success: boolean;
  categories?: Array<{ url: string; categoryName: string }>;
  url?: string;
  error?: string;
}

// Cache frequently used queries
const getCachedUserSettings = cache(async (userId: string) => {
  return prisma.userSettings.findUnique({
    where: { userId },
    include: {
      CategoryImage: {
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
      CategoryImage: {
        orderBy: { order: "asc" },
      },
    },
  });
});

export async function uploadCategory(
  formData: FormData
): Promise<CategoryActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can manage categories");

    const file = formData.get("category") as File;
    const categoryName = formData.get("categoryName") as string;

    if (!file || !file.size) throw new Error("No file provided");
    if (!categoryName) throw new Error("Category name is required");
    if (!file.type.startsWith("image/"))
      throw new Error("File must be an image");
    if (file.size > 5 * 1024 * 1024)
      throw new Error("File size must be less than 5MB");

    const userSettings = await getCachedUserSettings(user.id);
    const categoryCount = userSettings?.CategoryImage.length || 0;

    if (categoryCount >= 8) {
      throw new Error("Maximum of 8 category images allowed");
    }

    const fileExt = file.name.split(".").pop() || "png";
    const timestamp = Date.now();
    const path = `categories/category_${user.id}_${timestamp}.${fileExt}`;

    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: false,
    });

    if (!blob.url) throw new Error("Failed to get URL from blob storage");

    const updatedSettings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {
        CategoryImage: {
          create: {
            url: blob.url,
            categoryName,
            order: categoryCount,
          },
        },
      },
      create: {
        userId: user.id,
        CategoryImage: {
          create: {
            url: blob.url,
            categoryName,
            order: 0,
          },
        },
      },
      include: {
        CategoryImage: {
          orderBy: { order: "asc" },
        },
      },
    });

    return {
      success: true,
      url: blob.url,
      categories: updatedSettings.CategoryImage.map(item => ({
        url: item.url,
        categoryName: item.categoryName,
      })),
    };
  } catch (error) {
    console.error("Error uploading category:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function removeCategory(
  url: string
): Promise<CategoryActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can manage categories");

    const category = await prisma.categoryImage.findFirst({
      where: {
        url: url,
        userSettings: {
          userId: user.id,
        },
      },
    });

    if (!category) {
      throw new Error("Category image not found");
    }

    const path = new URL(url).pathname.slice(1);
    await del(path);

    const { CategoryImage } = await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        CategoryImage: {
          delete: { id: category.id },
          updateMany: {
            where: { order: { gt: category.order } },
            data: { order: { decrement: 1 } },
          },
        },
      },
      include: {
        CategoryImage: {
          orderBy: { order: "asc" },
        },
      },
    });

    return {
      success: true,
      categories: CategoryImage.map(item => ({
        url: item.url,
        categoryName: item.categoryName,
      })),
    };
  } catch (error) {
    console.error("Error removing category:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export const getCategories = cache(async (): Promise<CategoryActionResult> => {
  try {
    const { user } = await validateRequest();
    if (!user) return { success: false, error: "Unauthorized access" };

    if (user.role === "VENDOR") {
      const userSettings = await getCachedUserSettings(user.id);
      return {
        success: true,
        categories:
          userSettings?.CategoryImage.map(item => ({
            url: item.url,
            categoryName: item.categoryName,
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
          CategoryImage: {
            orderBy: { order: "asc" },
          },
        },
      });

      return {
        success: true,
        categories:
          userSettings?.CategoryImage.map(item => ({
            url: item.url,
            categoryName: item.categoryName,
          })) || [],
      };
    }

    return { success: true, categories: [] };
  } catch (error) {
    console.error("Error getting categories:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
});

export const getVendorCategoriesBySlug = cache(
  async (storeSlug: string): Promise<CategoryActionResult> => {
    try {
      const userSettings = await getCachedVendorSettings(storeSlug);
      return {
        success: true,
        categories:
          userSettings?.CategoryImage.map(item => ({
            url: item.url,
            categoryName: item.categoryName,
          })) || [],
      };
    } catch (error) {
      console.error("Error getting vendor categories:", error);
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
