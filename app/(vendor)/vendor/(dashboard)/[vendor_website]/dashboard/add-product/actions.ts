"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

interface ImageUrls {
  thumbnail: string;
  medium: string;
  large: string;
}

interface VariationFormData {
  name: string;
  color: string;
  variationImageURL?: string;
  sizes: Array<{
    size: string;
    quantity: number;
    sku: string;
    sku2?: string;
  }>;
}

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

function isWordPressUrl(url: string | null | undefined): boolean {
  return !!url && url.includes("wp-content/uploads");
}

async function uploadImage(file: File, path: string): Promise<string> {
  try {
    validateImage(file);
    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: false,
    });
    if (!blob.url) throw new Error("Failed to get URL from blob storage");
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
      uploadImage(
        file,
        `vendor-products/featured/thumbnail_${timestamp}.${fileExt}`
      ),
      uploadImage(
        file,
        `vendor-products/featured/medium_${timestamp}.${fileExt}`
      ),
      uploadImage(
        file,
        `vendor-products/featured/large_${timestamp}.${fileExt}`
      ),
    ]);

    return { thumbnail, medium, large };
  } catch (error) {
    throw new Error(
      `Failed to upload featured images: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function createVendorProduct(formData: FormData) {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "VENDOR") {
      throw new Error("Unauthorized: Only vendors can create products");
    }

    // Handle featured image
    let featuredImageUrls: ImageUrls | null = null;

    // Check for WordPress URLs first
    const wordPressThumbnail = formData
      .get("featuredImage.thumbnail")
      ?.toString();
    const wordPressMedium = formData.get("featuredImage.medium")?.toString();
    const wordPressLarge = formData.get("featuredImage.large")?.toString();

    if (isWordPressUrl(wordPressThumbnail)) {
      featuredImageUrls = {
        thumbnail: wordPressThumbnail!,
        medium: wordPressMedium!,
        large: wordPressLarge!,
      };
    } else {
      // Handle new file upload
      const featuredImageFile = formData.get("featuredImage");
      if (featuredImageFile instanceof File && featuredImageFile.size > 0) {
        featuredImageUrls = await uploadFeaturedImages(featuredImageFile);
      }
    }

    // Create the main product
    const product = await prisma.vendorProduct.create({
      data: {
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
              create: {
                thumbnail: featuredImageUrls.thumbnail,
                medium: featuredImageUrls.medium,
                large: featuredImageUrls.large,
              },
            }
          : undefined,
      },
    });

    // Process dynamic pricing
    const dynamicPricingCount = Array.from(formData.entries())
      .filter(([key]) => key.startsWith("dynamicPricing"))
      .reduce((max, [key]) => {
        const match = key.match(/dynamicPricing\.(\d+)\./);
        return match ? Math.max(max, parseInt(match[1]) + 1) : max;
      }, 0);

    // Create dynamic pricing entries
    await Promise.all(
      Array.from({ length: dynamicPricingCount }, async (_, i) => {
        const from = formData.get(`dynamicPricing.${i}.from`);
        const to = formData.get(`dynamicPricing.${i}.to`);
        const type = formData.get(`dynamicPricing.${i}.type`);
        const amount = formData.get(`dynamicPricing.${i}.amount`);

        if (from && to && type && amount) {
          return prisma.vendorDynamicPricing.create({
            data: {
              from: from.toString(),
              to: to.toString(),
              type: type.toString(),
              amount: amount.toString(),
              vendorProduct: {
                connect: {
                  id: product.id,
                },
              },
            },
          });
        }
      })
    );

    // Process variations
    const variationsData: VariationFormData[] = [];
    let currentVariation: Partial<VariationFormData> = {};

    // Extract variations data
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("variations.")) {
        const matches = key.match(/variations\.(\d+)\.(.+)/);
        if (matches) {
          const [, index, field] = matches;
          const i = parseInt(index);

          if (!variationsData[i]) {
            variationsData[i] = {
              name: "",
              color: "",
              variationImageURL: "",
              sizes: [],
            };
          }

          if (field === "name") {
            variationsData[i].name = value.toString();
          } else if (field === "color") {
            variationsData[i].color = value.toString();
          } else if (field === "variationImageURL") {
            variationsData[i].variationImageURL = value.toString();
          }
        }
      }
    }

    // Create variations
    await Promise.all(
      variationsData.map(async (variation, index) => {
        let imageUrl = variation.variationImageURL || "";

        // Only upload new image if it's not a WordPress URL
        if (!isWordPressUrl(imageUrl)) {
          const variationImage = formData.get(
            `variations.${index}.image`
          ) as File;
          if (variationImage?.size > 0) {
            const fileExt = variationImage.name.split(".").pop() || "jpg";
            imageUrl = await uploadImage(
              variationImage,
              `vendor-products/variations/variation_${index}_${Date.now()}.${fileExt}`
            );
          }
        }

        // Get sizes for this variation
        const sizesEntries = Array.from(formData.entries()).filter(([key]) =>
          key.startsWith(`variations.${index}.sizes.`)
        );

        const sizePromises = sizesEntries
          .reduce((acc: any[], [key, value]) => {
            const sizeMatch = key.match(/variations\.\d+\.sizes\.(\d+)\.(.+)/);
            if (sizeMatch) {
              const [, sizeIndex, field] = sizeMatch;
              if (!acc[parseInt(sizeIndex)]) {
                acc[parseInt(sizeIndex)] = {};
              }
              acc[parseInt(sizeIndex)][field] = value;
            }
            return acc;
          }, [])
          .map(size =>
            prisma.vendorVariation.create({
              data: {
                name: variation.name,
                color: variation.color,
                variationImageURL: imageUrl,
                size: size.size?.toString() || "",
                quantity: parseInt(size.quantity) || 0,
                sku: size.sku?.toString() || "",
                sku2: size.sku2?.toString() || "",
                vendorProduct: {
                  connect: {
                    id: product.id,
                  },
                },
              },
            })
          );

        return Promise.all(sizePromises);
      })
    );

    revalidatePath("/vendor");

    return {
      success: true,
      data: { id: product.id },
      message: "Product created successfully",
    };
  } catch (error) {
    console.error("Error creating vendor product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
