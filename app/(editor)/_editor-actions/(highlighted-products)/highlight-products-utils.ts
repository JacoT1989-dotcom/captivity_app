"use server";

import type { NewArrival, BestSeller, OnSaleProduct } from "@prisma/client";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";

export interface HighlightProductActionResult {
  success: boolean;
  newArrivals?: NewArrival[];
  bestSellers?: BestSeller[];
  onSaleProducts?: OnSaleProduct[];
  error?: string;
}

const MAX_FILE_SIZE = 6 * 1024 * 1024; // 6MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Utility function to validate file uploads
async function validateFileUpload(file: File) {
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
}

// Utility function to validate product data
async function validateProductData(
  title: string,
  price: number,
  position: number,
  rating?: number,
  salePrice?: number
) {
  if (!title?.trim()) throw new Error("Product title is required");
  if (isNaN(price) || price <= 0) throw new Error("Invalid price value");
  if (isNaN(position)) throw new Error("Invalid position value");

  if (rating && (isNaN(rating) || rating < 0 || rating > 5)) {
    throw new Error("Rating must be between 0 and 5");
  }

  if (salePrice && (isNaN(salePrice) || salePrice >= price)) {
    throw new Error("Sale price must be less than regular price");
  }
}

// Function to get all highlighted products - now allows public access
async function getHighlightedProducts(): Promise<HighlightProductActionResult> {
  try {
    let user;
    try {
      const auth = await validateRequest();
      user = auth.user;
    } catch (error) {
      // Continue without user authentication for public access
      user = null;
    }

    // For editors, show their specific products
    if (user && ["EDITOR", "ADMIN", "SUPERADMIN"].includes(user.role)) {
      const userSettings = await prisma.userSettings.findUnique({
        where: { userId: user.id },
        include: {
          NewArrival: {
            orderBy: { position: "asc" },
          },
          BestSeller: {
            orderBy: { position: "asc" },
          },
          OnSaleProduct: {
            orderBy: { position: "asc" },
          },
        },
      });

      if (!userSettings) {
        return {
          success: true,
          newArrivals: [],
          bestSellers: [],
          onSaleProducts: [],
        };
      }

      return {
        success: true,
        newArrivals: userSettings.NewArrival,
        bestSellers: userSettings.BestSeller,
        onSaleProducts: userSettings.OnSaleProduct,
      };
    }

    // For public access, show all published products
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
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export { validateFileUpload, validateProductData, getHighlightedProducts };
