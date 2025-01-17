"use server";

import prisma from "@/lib/prisma";

export async function getProductDetails(id: string) {
  try {
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

    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }

    return product;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
}
