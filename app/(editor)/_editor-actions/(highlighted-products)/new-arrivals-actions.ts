"use server";

import { put, del } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import {
  validateFileUpload,
  validateProductData,
  type HighlightProductActionResult,
} from "./highlight-products-utils";

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

    validateFileUpload(file);
    validateProductData(title, price, position, rating);

    const fileExt = file.name.split(".").pop() || "jpg";
    const path = `products/new-arrivals/${user.id}_${Date.now()}.${fileExt}`;

    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: false,
    });

    if (!blob.url) throw new Error("Failed to upload image");

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

export async function updateNewArrival(
  id: string,
  formData: FormData
): Promise<HighlightProductActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (!["EDITOR", "ADMIN", "SUPERADMIN"].includes(user.role)) {
      throw new Error("Insufficient permissions");
    }

    const product = await prisma.newArrival.findFirst({
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

      // Delete old image
      const oldPath = new URL(product.image).pathname.slice(1);
      await del(oldPath);

      // Upload new image
      const fileExt = newImage.name.split(".").pop() || "jpg";
      const path = `products/new-arrivals/${user.id}_${Date.now()}.${fileExt}`;
      const blob = await put(path, newImage, {
        access: "public",
        addRandomSuffix: false,
      });

      if (!blob.url) throw new Error("Failed to upload new image");
      imageUrl = blob.url;
    }

    const title = formData.get("title") as string;
    const price = parseFloat(formData.get("price") as string);
    const position =
      parseInt(formData.get("position") as string) || product.position;
    const rating =
      parseFloat(formData.get("rating") as string) || product.rating;

    validateProductData(title, price, position, rating);

    const { NewArrival } = await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        NewArrival: {
          update: {
            where: { id },
            data: {
              title: title.trim(),
              price,
              image: imageUrl,
              rating,
              position,
            },
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
    console.error("Error updating new arrival:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function removeNewArrival(
  id: string
): Promise<HighlightProductActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (!["EDITOR", "ADMIN", "SUPERADMIN"].includes(user.role)) {
      throw new Error("Insufficient permissions");
    }

    const product = await prisma.newArrival.findFirst({
      where: {
        id,
        userSettings: { userId: user.id },
      },
    });

    if (!product) throw new Error("Product not found");

    // Delete image from storage
    const path = new URL(product.image).pathname.slice(1);
    await del(path);

    const { NewArrival } = await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        NewArrival: {
          delete: { id },
        },
      },
      include: { NewArrival: true },
    });

    return {
      success: true,
      newArrivals: NewArrival,
    };
  } catch (error) {
    console.error("Error removing new arrival:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
