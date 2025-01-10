"use server";

import { put, del } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { cache } from "react";

interface CollectionActionResult {
  success: boolean;
  collections?: Array<{
    id: string;
    type: string;
    title: string;
    image: string;
    href: string;
    position: number;
    backgroundColor?: string | null;
  }>;
  error?: string;
}

const MAX_FILE_SIZE = 6 * 1024 * 1024; // 6MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Cache frequently accessed user settings
const getCachedUserSettings = cache(async (userId: string) => {
  return prisma.userSettings.findUnique({
    where: { userId },
    include: { Collection: true },
  });
});

// Utility function to validate file uploads
const validateFileUpload = (file: File) => {
  if (!file || !file.size) {
    throw new Error("No file provided");
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      "Invalid file type. Please upload a JPEG, PNG, or WebP image"
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size must be less than 5MB");
  }
};

// Utility function to validate collection data
const validateCollectionData = (
  type: string,
  title: string,
  href: string,
  position: number
) => {
  if (!type?.trim()) throw new Error("Collection type is required");
  if (!title?.trim()) throw new Error("Collection title is required");
  if (!href?.trim()) throw new Error("Collection link is required");
  if (isNaN(position)) throw new Error("Invalid position value");
};

export async function uploadCollection(
  formData: FormData
): Promise<CollectionActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (!["EDITOR", "ADMIN", "SUPERADMIN"].includes(user.role)) {
      throw new Error("Insufficient permissions");
    }

    const file = formData.get("image") as File;
    const type = formData.get("type") as string;
    const title = formData.get("title") as string;
    const href = formData.get("href") as string;
    const position = parseInt(formData.get("position") as string) || 0;
    const backgroundColor =
      (formData.get("backgroundColor") as string) || "#FFFFFF";

    // Validate inputs
    validateFileUpload(file);
    validateCollectionData(type, title, href, position);

    // Get or create user settings
    const userSettings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });

    // Check for existing collection at the same position
    const existingCollection = await prisma.collection.findFirst({
      where: {
        userSettingsId: userSettings.id,
        type,
        position,
      },
    });

    if (existingCollection) {
      throw new Error(
        `A collection already exists at position ${position} for type ${type}`
      );
    }

    // Handle file upload
    const fileExt = file.name.split(".").pop() || "jpg";
    const path = `collections/${type}_${user.id}_${Date.now()}.${fileExt}`;

    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: false,
    });

    if (!blob.url) throw new Error("Failed to upload image");

    // Create collection
    const { Collection } = await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        Collection: {
          create: {
            type,
            title: title.trim(),
            image: blob.url,
            href: href.trim(),
            position,
            backgroundColor,
          },
        },
      },
      include: { Collection: true },
    });

    return {
      success: true,
      collections: Collection,
    };
  } catch (error) {
    console.error("Error uploading collection:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function updateCollection(
  id: string,
  formData: FormData
): Promise<CollectionActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (!["EDITOR", "ADMIN", "SUPERADMIN"].includes(user.role)) {
      throw new Error("Insufficient permissions");
    }

    const collection = await prisma.collection.findFirst({
      where: {
        id,
        userSettings: { userId: user.id },
      },
    });

    if (!collection) throw new Error("Collection not found");

    // Process image update if provided
    let imageUrl = collection.image;
    const newImage = formData.get("image") as File;

    if (newImage?.size) {
      validateFileUpload(newImage);

      // Delete old image
      const oldPath = new URL(collection.image).pathname.slice(1);
      await del(oldPath);

      // Upload new image
      const fileExt = newImage.name.split(".").pop() || "jpg";
      const path = `collections/${collection.type}_${user.id}_${Date.now()}.${fileExt}`;
      const blob = await put(path, newImage, {
        access: "public",
        addRandomSuffix: false,
      });

      if (!blob.url) throw new Error("Failed to upload new image");
      imageUrl = blob.url;
    }

    const title = formData.get("title") as string;
    const href = formData.get("href") as string;
    const position =
      parseInt(formData.get("position") as string) || collection.position;
    const backgroundColor =
      (formData.get("backgroundColor") as string) || collection.backgroundColor;

    validateCollectionData(collection.type, title, href, position);

    // Update collection
    const { Collection } = await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        Collection: {
          update: {
            where: { id },
            data: {
              title: title.trim(),
              href: href.trim(),
              image: imageUrl,
              position,
              backgroundColor,
            },
          },
        },
      },
      include: { Collection: true },
    });

    return {
      success: true,
      collections: Collection,
    };
  } catch (error) {
    console.error("Error updating collection:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function removeCollection(
  id: string
): Promise<CollectionActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (!["EDITOR", "ADMIN", "SUPERADMIN"].includes(user.role)) {
      throw new Error("Insufficient permissions");
    }

    const collection = await prisma.collection.findFirst({
      where: {
        id,
        userSettings: { userId: user.id },
      },
    });

    if (!collection) throw new Error("Collection not found");

    // Delete image from storage
    const path = new URL(collection.image).pathname.slice(1);
    await del(path);

    // Delete collection from database
    const { Collection } = await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        Collection: {
          delete: { id },
        },
      },
      include: { Collection: true },
    });

    return {
      success: true,
      collections: Collection,
    };
  } catch (error) {
    console.error("Error removing collection:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export const getCollections = cache(
  async (): Promise<CollectionActionResult> => {
    try {
      const collections = await prisma.collection.findMany({
        orderBy: [{ type: "asc" }, { position: "asc" }],
        include: {
          userSettings: {
            select: {
              user: {
                select: { role: true },
              },
            },
          },
        },
      });

      return {
        success: true,
        collections,
      };
    } catch (error) {
      console.error("Error getting collections:", error);
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
