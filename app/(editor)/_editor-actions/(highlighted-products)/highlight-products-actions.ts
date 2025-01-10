"use server";

import { put, del } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { cache } from "react";
import type {
  NewArrival,
  BestSeller,
  OnSaleProduct,
  UserSettings,
} from "@prisma/client";

interface HighlightProductActionResult {
  success: boolean;
  newArrivals?: NewArrival[];
  bestSellers?: BestSeller[];
  onSaleProducts?: OnSaleProduct[];
  error?: string;
}

const MAX_FILE_SIZE = 6 * 1024 * 1024; // 6MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Cache frequently accessed user settings
const getCachedUserSettings = cache(async (userId: string) => {
  return prisma.userSettings.findUnique({
    where: { userId },
    include: {
      NewArrival: true,
      BestSeller: true,
      OnSaleProduct: true,
    },
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
    throw new Error("File size must be less than 6MB");
  }
};

// Utility function to validate product data
const validateProductData = (
  title: string,
  price: number,
  position: number,
  rating?: number,
  salePrice?: number
) => {
  if (!title?.trim()) throw new Error("Product title is required");
  if (isNaN(price) || price <= 0) throw new Error("Invalid price value");
  if (isNaN(position)) throw new Error("Invalid position value");
  if (rating && (isNaN(rating) || rating < 0 || rating > 5)) {
    throw new Error("Rating must be between 0 and 5");
  }
  if (salePrice && (isNaN(salePrice) || salePrice >= price)) {
    throw new Error("Sale price must be less than regular price");
  }
};

export async function uploadNewArrival(
  formData: FormData
): Promise<HighlightProductActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (!["EDITOR", "ADMIN", "SUPERADMIN"].includes(user.role)) {
      throw new Error("Insufficient permissions");
    }

    const file = formData.get("image") as File;
    const title = formData.get("title") as string;
    const price = parseFloat(formData.get("price") as string);
    const position = parseInt(formData.get("position") as string) || 0;
    const rating = parseFloat(formData.get("rating") as string) || 0;

    // Validate inputs
    validateFileUpload(file);
    validateProductData(title, price, position, rating);

    // Get or create user settings
    const userSettings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });

    // Handle file upload
    const fileExt = file.name.split(".").pop() || "jpg";
    const path = `products/new-arrivals/${user.id}_${Date.now()}.${fileExt}`;

    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: false,
    });

    if (!blob.url) throw new Error("Failed to upload image");

    // Create new arrival
    const { NewArrival } = await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        NewArrival: {
          create: {
            title: title.trim(),
            price,
            image: blob.url,
            rating,
            position,
          },
        },
      },
      include: { NewArrival: true },
    });

    return {
      success: true,
      newArrivals: NewArrival,
    };
  } catch (error) {
    console.error("Error uploading new arrival:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Similar updates for uploadBestSeller and uploadOnSaleProduct...

export const getHighlightedProducts = cache(
  async (): Promise<HighlightProductActionResult> => {
    try {
      const [newArrivals, bestSellers, onSaleProducts] = await Promise.all([
        prisma.newArrival.findMany({
          orderBy: { position: "asc" },
        }),
        prisma.bestSeller.findMany({
          orderBy: { position: "asc" },
        }),
        prisma.onSaleProduct.findMany({
          orderBy: { position: "asc" },
        }),
      ]);

      return {
        success: true,
        newArrivals,
        bestSellers,
        onSaleProducts,
      };
    } catch (error) {
      console.error("Error getting highlighted products:", error);
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
