"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { SearchProduct } from "./types";

interface CreateProductResult {
  success: boolean;
  data?: { id: string };
  message?: string;
  error?: string;
}

interface ImageUrls {
  thumbnail: string;
  medium: string;
  large: string;
}

// Define allowed image types
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

// Validate image file
function validateImage(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      `Invalid image type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(", ")}`
    );
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(
      `Image size must be less than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`
    );
  }
}

async function uploadImage(file: File, path: string): Promise<string> {
  try {
    validateImage(file);

    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: false,
    });

    if (!blob.url) {
      throw new Error("Failed to get URL from blob storage");
    }

    return blob.url;
  } catch (error) {
    throw error;
  }
}

async function uploadFeaturedImages(file: File): Promise<ImageUrls> {
  const fileExt = file.name.split(".").pop() || "jpg";
  const timestamp = Date.now();

  try {
    const [thumbnail, medium, large] = await Promise.all([
      uploadImage(file, `products/featured/thumbnail_${timestamp}.${fileExt}`),
      uploadImage(file, `products/featured/medium_${timestamp}.${fileExt}`),
      uploadImage(file, `products/featured/large_${timestamp}.${fileExt}`),
    ]);

    return { thumbnail, medium, large };
  } catch (error) {
    throw new Error(
      `Failed to upload featured images: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function createProduct(
  formData: FormData
): Promise<CreateProductResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized access");
    }

    // Handle featured image upload
    let featuredImageUrls: ImageUrls | undefined;
    const featuredImageFile = formData.get("featuredImage") as File;

    if (featuredImageFile instanceof File && featuredImageFile.size > 0) {
      featuredImageUrls = await uploadFeaturedImages(featuredImageFile);
    } else {
      const thumbnailUrl = formData.get("featuredImage.thumbnail") as string;
      const mediumUrl = formData.get("featuredImage.medium") as string;
      const largeUrl = formData.get("featuredImage.large") as string;

      if (thumbnailUrl) {
        featuredImageUrls = {
          thumbnail: thumbnailUrl,
          medium: mediumUrl,
          large: largeUrl,
        };
      }
    }

    // Process variations with image uploads
    const variations: Array<Omit<Prisma.VariationCreateInput, "product">> = [];
    const variationEntries = Array.from(formData.entries())
      .filter(([key]) => key.startsWith("variations"))
      .reduce(
        (acc, [key, value]) => {
          const [base, index, ...rest] = key.split(".");
          if (!acc[index]) acc[index] = {};
          if (rest.length === 1) {
            acc[index][rest[0]] = value;
          } else if (rest.length === 3 && rest[0] === "sizes") {
            if (!acc[index].sizes) acc[index].sizes = {};
            if (!acc[index].sizes[rest[1]]) acc[index].sizes[rest[1]] = {};
            acc[index].sizes[rest[1]][rest[2]] = value;
          }
          return acc;
        },
        {} as Record<string, any>
      );

    // Process each variation and handle image uploads
    for (const [index, variation] of Object.entries(variationEntries)) {
      const variationImage = formData.get(
        `variations.${index}.variationImage`
      ) as File;
      let variationImageURL = variation.variationImageURL || "";

      // Upload variation image if provided
      if (variationImage instanceof File && variationImage.size > 0) {
        const fileExt = variationImage.name.split(".").pop() || "jpg";
        const timestamp = Date.now();
        const path = `products/variations/variation_${timestamp}_${index}.${fileExt}`;

        try {
          variationImageURL = await uploadImage(variationImage, path);
        } catch (error) {
          console.error(
            `Failed to upload variation image for index ${index}:`,
            error
          );
        }
      }

      if (variation.sizes) {
        Object.values(variation.sizes).forEach((size: any) => {
          variations.push({
            name: variation.name,
            color: variation.color || "",
            variationImageURL,
            size: size.size?.trim() || "",
            quantity: Number(size.quantity) || 0,
            sku: size.sku?.trim() || "",
            sku2: size.sku2?.trim() || "",
          });
        });
      }
    }

    // Process dynamic pricing
    const dynamicPricingEntries = Array.from(formData.entries())
      .filter(([key]) => key.startsWith("dynamicPricing"))
      .reduce(
        (acc, [key, value]) => {
          const [, index, field] =
            key.match(/dynamicPricing\.(\d+)\.(.+)/) || [];
          if (index && field) {
            if (!acc[index]) acc[index] = {};
            acc[index][field] = value;
          }
          return acc;
        },
        {} as Record<string, any>
      );

    // Create the product with all its relations
    const createData: Prisma.ProductCreateInput = {
      user: {
        connect: {
          id: user.id,
        },
      },
      productName: formData.get("productName") as string,
      category: formData.getAll("category[]").map(cat => cat.toString()),
      description: formData.get("description") as string,
      sellingPrice: Number(formData.get("sellingPrice")),
      isPublished: formData.get("isPublished") === "true",
      featuredImage: featuredImageUrls
        ? {
            create: featuredImageUrls,
          }
        : undefined,
      variations: {
        create: variations,
      },
      dynamicPricing: {
        create: Object.values(dynamicPricingEntries).map((pricing: any) => ({
          from: pricing.from,
          to: pricing.to,
          type: pricing.type as "fixed_price" | "percentage",
          amount: pricing.amount,
        })),
      },
    };

    console.log(
      "Creating product with data:",
      JSON.stringify(createData, null, 2)
    );

    const product = await prisma.product.create({
      data: createData,
      include: {
        featuredImage: true,
        variations: true,
        dynamicPricing: true,
      },
    });

    revalidatePath("/products");
    revalidatePath("/admin/products");

    return {
      success: true,
      data: { id: product.id },
      message: "Product created successfully",
    };
  } catch (error) {
    console.error("Full error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      error,
    });

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while creating the product",
    };
  }
}

interface SearchProductsResult {
  success: boolean;
  data?: SearchProduct[];
  error?: string;
}

export async function searchProducts(query: string) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized access");
    }

    const products = await prisma.product.findMany({
      where: {
        userId: user.id,
        productName: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: {
        featuredImage: true,
        variations: true,
        dynamicPricing: true,
      },
      take: 5,
    });

    return {
      success: true,
      data: products,
    };
  } catch (error) {
    console.error("Error searching products:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
