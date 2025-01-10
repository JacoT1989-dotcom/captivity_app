"use server";

import { put, del } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { cache } from "react";

interface CategoryHeroActionResult {
  success: boolean;
  heroes?: Array<{
    id: string;
    imageUrl: string;
    categoryName: string;
    title: string;
    backgroundColor: string;
    opacity: number;
  }>;
  error?: string;
}

// Cache frequently used queries
const getCachedCategoryHeroes = cache(async (userId: string) => {
  return prisma.userSettings.findUnique({
    where: { userId },
    include: {
      CategoryHero: true,
    },
  });
});

export async function uploadCategoryHero(
  formData: FormData
): Promise<CategoryHeroActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (!["EDITOR", "ADMIN", "SUPERADMIN"].includes(user.role)) {
      throw new Error("Insufficient permissions");
    }

    const file = formData.get("image") as File;
    const title = formData.get("title") as string;
    const categoryName = formData.get("categoryName") as string;
    const backgroundColor = formData.get("backgroundColor") as string;
    const opacity = formData.get("opacity") as string;

    if (!file || !file.size) throw new Error("No file provided");
    if (!title || !categoryName) {
      throw new Error("Title and category name are required");
    }
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }
    if (file.size > 6 * 1024 * 1024) {
      throw new Error("File size must be less than 5MB");
    }

    // Get or create user settings
    const userSettings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });

    // Check if category hero already exists
    const existingHero = await prisma.categoryHero.findFirst({
      where: {
        userSettingsId: userSettings.id,
        categoryName: categoryName,
      },
    });

    if (existingHero) {
      throw new Error(`Hero for category ${categoryName} already exists`);
    }

    const fileExt = file.name.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const path = `category-heroes/hero_${user.id}_${timestamp}.${fileExt}`;

    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: false,
    });

    if (!blob.url) throw new Error("Failed to get URL from blob storage");

    const { CategoryHero } = await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        CategoryHero: {
          create: {
            imageUrl: blob.url,
            categoryName,
            title,
            backgroundColor: backgroundColor || "#000000",
            opacity: opacity ? parseFloat(opacity) : 0.4,
          },
        },
      },
      include: {
        CategoryHero: true,
      },
    });

    return {
      success: true,
      heroes: CategoryHero.map(hero => ({
        id: hero.id,
        imageUrl: hero.imageUrl,
        categoryName: hero.categoryName,
        title: hero.title,
        backgroundColor: hero.backgroundColor,
        opacity: hero.opacity,
      })),
    };
  } catch (error) {
    console.error("Error uploading category hero:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function removeCategoryHero(
  id: string
): Promise<CategoryHeroActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (!["EDITOR", "ADMIN", "SUPERADMIN"].includes(user.role)) {
      throw new Error("Insufficient permissions");
    }

    const hero = await prisma.categoryHero.findFirst({
      where: {
        id,
        userSettings: {
          userId: user.id,
        },
      },
    });

    if (!hero) {
      throw new Error("Category hero not found");
    }

    const path = new URL(hero.imageUrl).pathname.slice(1);
    await del(path);

    const { CategoryHero } = await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        CategoryHero: {
          delete: { id: hero.id },
        },
      },
      include: {
        CategoryHero: true,
      },
    });

    return {
      success: true,
      heroes: CategoryHero.map(hero => ({
        id: hero.id,
        imageUrl: hero.imageUrl,
        categoryName: hero.categoryName,
        title: hero.title,
        backgroundColor: hero.backgroundColor,
        opacity: hero.opacity,
      })),
    };
  } catch (error) {
    console.error("Error removing category hero:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export const getCategoryHeroes = cache(
  async (): Promise<CategoryHeroActionResult> => {
    try {
      const heroes = await prisma.categoryHero.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          userSettings: {
            select: {
              user: {
                select: {
                  role: true,
                },
              },
            },
          },
        },
      });

      return {
        success: true,
        heroes: heroes.map(hero => ({
          id: hero.id,
          imageUrl: hero.imageUrl,
          categoryName: hero.categoryName,
          title: hero.title,
          backgroundColor: hero.backgroundColor,
          opacity: hero.opacity,
        })),
      };
    } catch (error) {
      console.error("Error getting category heroes:", error);
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

export async function updateCategoryHero(
  id: string,
  data: {
    title: string;
    categoryName: string;
    backgroundColor?: string;
    opacity?: number;
  }
): Promise<CategoryHeroActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (!["EDITOR", "ADMIN", "SUPERADMIN"].includes(user.role)) {
      throw new Error("Insufficient permissions");
    }

    const hero = await prisma.categoryHero.findFirst({
      where: {
        id,
        userSettings: {
          userId: user.id,
        },
      },
    });

    if (!hero) {
      throw new Error("Category hero not found");
    }

    const { CategoryHero } = await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        CategoryHero: {
          update: {
            where: { id },
            data: {
              title: data.title,
              categoryName: data.categoryName,
              backgroundColor: data.backgroundColor,
              opacity: data.opacity,
            },
          },
        },
      },
      include: {
        CategoryHero: true,
      },
    });

    return {
      success: true,
      heroes: CategoryHero.map(hero => ({
        id: hero.id,
        imageUrl: hero.imageUrl,
        categoryName: hero.categoryName,
        title: hero.title,
        backgroundColor: hero.backgroundColor,
        opacity: hero.opacity,
      })),
    };
  } catch (error) {
    console.error("Error updating category hero:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function updateCategoryHeroWithImage(
  id: string,
  formData: FormData
): Promise<CategoryHeroActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (!["EDITOR", "ADMIN", "SUPERADMIN"].includes(user.role)) {
      throw new Error("Insufficient permissions");
    }

    const hero = await prisma.categoryHero.findFirst({
      where: {
        id,
        userSettings: {
          userId: user.id,
        },
      },
    });

    if (!hero) {
      throw new Error("Category hero not found");
    }

    // If there's a new image, upload it
    let imageUrl = hero.imageUrl;
    const newImage = formData.get("image") as File;
    if (newImage?.size) {
      try {
        // Delete old image first
        try {
          const oldPath = new URL(hero.imageUrl).pathname.slice(1);
          await del(oldPath);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }

        // Upload new image
        const fileExt = newImage.name.split(".").pop() || "jpg";
        const timestamp = Date.now();
        const path = `category-heroes/hero_${user.id}_${timestamp}.${fileExt}`;
        const blob = await put(path, newImage, {
          access: "public",
          addRandomSuffix: false,
        });

        if (!blob?.url) {
          throw new Error("Failed to upload new image");
        }
        imageUrl = blob.url;
      } catch (error) {
        console.error("Error handling image:", error);
        throw new Error("Failed to process image");
      }
    }

    // Ensure we have all required fields with fallbacks
    const title = (formData.get("title") as string) || hero.title;
    const categoryName =
      (formData.get("categoryName") as string) || hero.categoryName;
    const opacity = formData.get("opacity")
      ? parseFloat(formData.get("opacity") as string)
      : hero.opacity;

    // Always ensure backgroundColor has a value
    const backgroundColor =
      (formData.get("backgroundColor") as string) ||
      hero.backgroundColor ||
      "#000000";

    const { CategoryHero } = await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        CategoryHero: {
          update: {
            where: { id },
            data: {
              imageUrl,
              title,
              categoryName,
              backgroundColor,
              opacity,
            },
          },
        },
      },
      include: {
        CategoryHero: true,
      },
    });

    return {
      success: true,
      heroes: CategoryHero.map(hero => ({
        id: hero.id,
        imageUrl: hero.imageUrl,
        categoryName: hero.categoryName,
        title: hero.title,
        backgroundColor: hero.backgroundColor,
        opacity: hero.opacity,
      })),
    };
  } catch (error) {
    console.error("Error updating category hero:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function fetchNewHeadwear() {
  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          category: {
            hasSome: ["new-in-headwear"],
          },
          isPublished: true,
        },
        include: {
          featuredImage: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.product.count({
        where: {
          category: {
            hasSome: ["new-in-headwear"],
          },
          isPublished: true,
        },
      }),
    ]);

    return {
      success: true,
      data: {
        products,
        total,
      },
    };
  } catch (error) {
    console.error("Error fetching new headwear:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
