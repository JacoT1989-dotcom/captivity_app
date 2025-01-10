"use server";

import { put, del } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import {
  validateFileUpload,
  validateProductData,
  type HighlightProductActionResult,
} from "./highlight-products-utils";

export async function uploadOnSaleProduct(
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
    const salePrice = parseFloat(formData.get("salePrice") as string);
    const position = parseInt(formData.get("position") as string) || 0;
    const rating = parseFloat(formData.get("rating") as string) || 0;

    validateFileUpload(file);
    validateProductData(title, price, position, rating, salePrice);

    // Additional sale price validation
    if (!salePrice || salePrice >= price) {
      throw new Error("Sale price must be less than regular price");
    }

    const userSettings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });

    const fileExt = file.name.split(".").pop() || "jpg";
    const path = `products/on-sale/${user.id}_${Date.now()}.${fileExt}`;

    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: false,
    });

    if (!blob.url) throw new Error("Failed to upload image");

    const { OnSaleProduct } = await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        OnSaleProduct: {
          create: {
            title: title.trim(),
            price,
            salePrice,
            image: blob.url,
            rating,
            position,
          },
        },
      },
      include: { OnSaleProduct: true },
    });

    return {
      success: true,
      onSaleProducts: OnSaleProduct,
    };
  } catch (error) {
    console.error("Error uploading on-sale product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function updateOnSaleProduct(
  id: string,
  formData: FormData
): Promise<HighlightProductActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (!["EDITOR", "ADMIN", "SUPERADMIN"].includes(user.role)) {
      throw new Error("Insufficient permissions");
    }

    const product = await prisma.onSaleProduct.findFirst({
      where: {
        id,
        userSettings: { userId: user.id },
      },
    });

    if (!product) throw new Error("Product not found");

    let imageUrl = product.image;
    const newImage = formData.get("image") as File;

    if (newImage?.size) {
      validateFileUpload(newImage);

      // Delete old image if it exists
      if (product.image) {
        const oldPath = new URL(product.image).pathname.slice(1);
        await del(oldPath);
      }

      // Upload new image
      const fileExt = newImage.name.split(".").pop() || "jpg";
      const path = `products/on-sale/${user.id}_${Date.now()}.${fileExt}`;
      const blob = await put(path, newImage, {
        access: "public",
        addRandomSuffix: false,
      });

      if (!blob.url) throw new Error("Failed to upload new image");
      imageUrl = blob.url;
    }

    const title = formData.get("title") as string;
    const price = parseFloat(formData.get("price") as string);
    const salePrice = parseFloat(formData.get("salePrice") as string);
    const position =
      parseInt(formData.get("position") as string) || product.position;
    const rating =
      parseFloat(formData.get("rating") as string) || product.rating;

    validateProductData(title, price, position, rating, salePrice);

    // Additional sale price validation
    if (!salePrice || salePrice >= price) {
      throw new Error("Sale price must be less than regular price");
    }

    const { OnSaleProduct } = await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        OnSaleProduct: {
          update: {
            where: { id },
            data: {
              title: title.trim(),
              price,
              salePrice,
              image: imageUrl,
              rating,
              position,
            },
          },
        },
      },
      include: { OnSaleProduct: true },
    });

    return {
      success: true,
      onSaleProducts: OnSaleProduct,
    };
  } catch (error) {
    console.error("Error updating on-sale product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function removeOnSaleProduct(
  id: string
): Promise<HighlightProductActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (!["EDITOR", "ADMIN", "SUPERADMIN"].includes(user.role)) {
      throw new Error("Insufficient permissions");
    }

    const product = await prisma.onSaleProduct.findFirst({
      where: {
        id,
        userSettings: { userId: user.id },
      },
    });

    if (!product) throw new Error("Product not found");

    // Delete image from storage
    if (product.image) {
      const path = new URL(product.image).pathname.slice(1);
      await del(path);
    }

    const { OnSaleProduct } = await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        OnSaleProduct: {
          delete: { id },
        },
      },
      include: { OnSaleProduct: true },
    });

    return {
      success: true,
      onSaleProducts: OnSaleProduct,
    };
  } catch (error) {
    console.error("Error removing on-sale product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Get all on-sale products for a user
export async function getOnSaleProducts(
  userId: string
): Promise<HighlightProductActionResult> {
  try {
    const onSaleProducts = await prisma.onSaleProduct.findMany({
      where: {
        userSettings: {
          userId,
        },
      },
      orderBy: {
        position: "asc",
      },
    });

    return {
      success: true,
      onSaleProducts,
    };
  } catch (error) {
    console.error("Error getting on-sale products:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
