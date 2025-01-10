"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import {
  VendorProduct,
  VendorDynamicPricing,
  VendorVariation,
  VendorFeaturedImage,
} from "@prisma/client";

type VendorProductWithRelations = VendorProduct & {
  dynamicPricing: VendorDynamicPricing[];
  variations: VendorVariation[];
  featuredImage: VendorFeaturedImage | null;
};

async function getVendorByWebsite(websiteAddress: string) {
  const vendor = await prisma.user.findFirst({
    where: {
      OR: [{ website: websiteAddress }, { storeSlug: websiteAddress }],
      role: "VENDOR",
    },
    select: { id: true },
  });
  return vendor;
}

export async function fetchVendorProductById(
  productId: string,
  vendorWebsite?: string
): Promise<
  | { success: true; data: VendorProductWithRelations }
  | { success: false; error: string }
> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    let queryUserId: string;

    // Determine which user's products to query
    if (user.role === "VENDOR") {
      queryUserId = user.id;
    } else if (user.role === "VENDORCUSTOMER" && vendorWebsite) {
      const vendor = await getVendorByWebsite(vendorWebsite);
      if (!vendor) {
        throw new Error("Vendor not found");
      }
      queryUserId = vendor.id;
    } else {
      throw new Error("Unauthorized access");
    }

    // Fetch the vendor product with all relations
    const product = await prisma.vendorProduct.findUnique({
      where: {
        id: productId,
      },
      include: {
        dynamicPricing: true,
        variations: true,
        featuredImage: true,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // For vendors, verify ownership
    if (user.role === "VENDOR" && product.userId !== user.id) {
      throw new Error("Unauthorized. This product belongs to another vendor.");
    }

    // For vendor customers, verify the product belongs to the correct vendor
    if (user.role === "VENDORCUSTOMER" && product.userId !== queryUserId) {
      throw new Error("Product not found in vendor's catalog.");
    }

    // For vendor customers, only return published products
    if (user.role === "VENDORCUSTOMER" && !product.isPublished) {
      throw new Error("This product is currently unavailable.");
    }

    return { success: true, data: product };
  } catch (error) {
    console.error("Error fetching vendor product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
