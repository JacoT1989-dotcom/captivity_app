"use server";

import prisma from "@/lib/prisma";

export async function getProductDetails(id: string) {
  try {
    console.log("Fetching product with ID:", id); // Debug log

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variations: {
          select: {
            id: true,
            name: true,
            color: true,
            size: true,
            sku: true,
            quantity: true,
          },
        },
      },
    });

    console.log("Found product:", product); // Debug log

    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }

    return product;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
}
