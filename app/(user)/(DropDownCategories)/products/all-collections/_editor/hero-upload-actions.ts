"use server";

import { put, del } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { cache } from "react";

interface CollectionBannerActionResult {
  success: boolean;
  banners?: Array<{
    id: string;
    imageUrl: string;
    collectionId: string;
    title: string;
    backgroundColor: string;
    opacity: number;
  }>;
  error?: string;
}

// Cache frequently used queries
const getCachedCollectionBanners = cache(async (userId: string) => {
  return prisma.userSettings.findUnique({
    where: { userId },
    include: {
      CollectionBanner: {
        include: {
          collection: true,
        },
      },
    },
  });
});

export async function uploadCollectionBanner(
  formData: FormData
): Promise<CollectionBannerActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (!["EDITOR", "ADMIN", "SUPERADMIN"].includes(user.role)) {
      throw new Error("Insufficient permissions");
    }

    const file = formData.get("image") as File;
    const title = formData.get("title") as string;
    const collectionId = formData.get("collectionId") as string;
    const backgroundColor = formData.get("backgroundColor") as string;
    const opacity = formData.get("opacity") as string;

    if (!file || !file.size) throw new Error("No file provided");
    if (!title || !collectionId) {
      throw new Error("Title and collection ID are required");
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

    // Create or find collection
    const collection = await prisma.collection.upsert({
      where: { id: collectionId },
      update: {},
      create: {
        id: collectionId,
        type: "apparel",
        title: title,
        image: "",
        href: `/products/all-collections/${collectionId}`,
        position: 0,
        userSettingsId: userSettings.id,
      },
    });

    // Check if collection banner already exists
    const existingBanner = await prisma.collectionBanner.findFirst({
      where: {
        userSettingsId: userSettings.id,
        collectionId: collectionId,
      },
    });

    if (existingBanner) {
      throw new Error(`Banner for this collection already exists`);
    }

    const fileExt = file.name.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const path = `collection-banners/banner_${user.id}_${timestamp}.${fileExt}`;

    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: false,
    });

    if (!blob.url) throw new Error("Failed to get URL from blob storage");

    const { CollectionBanner } = await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        CollectionBanner: {
          create: {
            imageUrl: blob.url,
            collectionId,
            title,
            backgroundColor: backgroundColor || "#000000",
            opacity: opacity ? parseFloat(opacity) : 0.4,
          },
        },
      },
      include: {
        CollectionBanner: true,
      },
    });

    return {
      success: true,
      banners: CollectionBanner.map(banner => ({
        id: banner.id,
        imageUrl: banner.imageUrl,
        collectionId: banner.collectionId,
        title: banner.title,
        backgroundColor: banner.backgroundColor,
        opacity: banner.opacity,
      })),
    };
  } catch (error) {
    console.error("Error uploading collection banner:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function removeCollectionBanner(
  id: string
): Promise<CollectionBannerActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (!["EDITOR", "ADMIN", "SUPERADMIN"].includes(user.role)) {
      throw new Error("Insufficient permissions");
    }

    const banner = await prisma.collectionBanner.findFirst({
      where: {
        id,
        userSettings: {
          userId: user.id,
        },
      },
    });

    if (!banner) {
      throw new Error("Collection banner not found");
    }

    const path = new URL(banner.imageUrl).pathname.slice(1);
    await del(path);

    const { CollectionBanner } = await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        CollectionBanner: {
          delete: { id: banner.id },
        },
      },
      include: {
        CollectionBanner: true,
      },
    });

    return {
      success: true,
      banners: CollectionBanner.map(banner => ({
        id: banner.id,
        imageUrl: banner.imageUrl,
        collectionId: banner.collectionId,
        title: banner.title,
        backgroundColor: banner.backgroundColor,
        opacity: banner.opacity,
      })),
    };
  } catch (error) {
    console.error("Error removing collection banner:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export const getCollectionBanners = cache(
  async (): Promise<CollectionBannerActionResult> => {
    try {
      const banners = await prisma.collectionBanner.findMany({
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
        banners: banners.map(banner => ({
          id: banner.id,
          imageUrl: banner.imageUrl,
          collectionId: banner.collectionId,
          title: banner.title,
          backgroundColor: banner.backgroundColor,
          opacity: banner.opacity,
        })),
      };
    } catch (error) {
      console.error("Error getting collection banners:", error);
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

export async function updateCollectionBanner(
  id: string,
  data: {
    title: string;
    collectionId: string;
    backgroundColor?: string;
    opacity?: number;
  }
): Promise<CollectionBannerActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (!["EDITOR", "ADMIN", "SUPERADMIN"].includes(user.role)) {
      throw new Error("Insufficient permissions");
    }

    const banner = await prisma.collectionBanner.findFirst({
      where: {
        id,
        userSettings: {
          userId: user.id,
        },
      },
    });

    if (!banner) {
      throw new Error("Collection banner not found");
    }

    // Create or update collection
    const collection = await prisma.collection.upsert({
      where: { id: data.collectionId },
      update: {},
      create: {
        id: data.collectionId,
        type: "apparel",
        title: data.title,
        image: "",
        href: `/products/all-collections/${data.collectionId}`,
        position: 0,
        userSettingsId: banner.userSettingsId,
      },
    });

    const { CollectionBanner } = await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        CollectionBanner: {
          update: {
            where: { id },
            data: {
              title: data.title,
              collectionId: data.collectionId,
              backgroundColor: data.backgroundColor,
              opacity: data.opacity,
            },
          },
        },
      },
      include: {
        CollectionBanner: true,
      },
    });

    return {
      success: true,
      banners: CollectionBanner.map(banner => ({
        id: banner.id,
        imageUrl: banner.imageUrl,
        collectionId: banner.collectionId,
        title: banner.title,
        backgroundColor: banner.backgroundColor,
        opacity: banner.opacity,
      })),
    };
  } catch (error) {
    console.error("Error updating collection banner:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function updateCollectionBannerWithImage(
  id: string,
  formData: FormData
): Promise<CollectionBannerActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (!["EDITOR", "ADMIN", "SUPERADMIN"].includes(user.role)) {
      throw new Error("Insufficient permissions");
    }

    const banner = await prisma.collectionBanner.findFirst({
      where: {
        id,
        userSettings: {
          userId: user.id,
        },
      },
    });

    if (!banner) {
      throw new Error("Collection banner not found");
    }

    // If there's a new image, upload it
    let imageUrl = banner.imageUrl;
    const newImage = formData.get("image") as File;
    if (newImage?.size) {
      try {
        // Delete old image first
        try {
          const oldPath = new URL(banner.imageUrl).pathname.slice(1);
          await del(oldPath);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }

        // Upload new image
        const fileExt = newImage.name.split(".").pop() || "jpg";
        const timestamp = Date.now();
        const path = `collection-banners/banner_${user.id}_${timestamp}.${fileExt}`;
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
    const title = (formData.get("title") as string) || banner.title;
    const collectionId =
      (formData.get("collectionId") as string) || banner.collectionId;
    const opacity = formData.get("opacity")
      ? parseFloat(formData.get("opacity") as string)
      : banner.opacity;

    // Create or update collection
    const collection = await prisma.collection.upsert({
      where: { id: collectionId },
      update: {},
      create: {
        id: collectionId,
        type: "apparel",
        title: title,
        image: "",
        href: `/products/all-collections/${collectionId}`,
        position: 0,
        userSettingsId: banner.userSettingsId,
      },
    });

    // Always ensure backgroundColor has a value
    const backgroundColor =
      (formData.get("backgroundColor") as string) ||
      banner.backgroundColor ||
      "#000000";

    const { CollectionBanner } = await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        CollectionBanner: {
          update: {
            where: { id },
            data: {
              imageUrl,
              title,
              collectionId,
              backgroundColor,
              opacity,
            },
          },
        },
      },
      include: {
        CollectionBanner: true,
      },
    });

    return {
      success: true,
      banners: CollectionBanner.map(banner => ({
        id: banner.id,
        imageUrl: banner.imageUrl,
        collectionId: banner.collectionId,
        title: banner.title,
        backgroundColor: banner.backgroundColor,
        opacity: banner.opacity,
      })),
    };
  } catch (error) {
    console.error("Error updating collection banner:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
