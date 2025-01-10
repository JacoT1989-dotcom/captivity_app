"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

type VendorCartActionResult = {
  success: boolean;
  data?: any;
  error?: string;
};

// Helper function to get or create vendor cart
async function getOrCreateVendorCart(userId: string) {
  let cart = await prisma.vendorCart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.vendorCart.create({
      data: { userId },
    });
  }

  return cart;
}

export async function addToVendorCart(
  variationId: string,
  quantity: number
): Promise<VendorCartActionResult> {
  try {
    const { user } = await validateRequest();
    if (
      !user ||
      !["VENDOR", "VENDORCUSTOMER", "APPROVEDVENDORCUSTOMER"].includes(
        user.role
      )
    ) {
      return {
        success: false,
        error: "Unauthorized. Please login as a vendor customer.",
      };
    }

    const cart = await getOrCreateVendorCart(user.id);

    // Check if variation exists and is in stock
    const variation = await prisma.vendorVariation.findUnique({
      where: { id: variationId },
      include: {
        vendorProduct: {
          include: {
            dynamicPricing: true,
            featuredImage: true,
          },
        },
      },
    });

    if (!variation) {
      return { success: false, error: "Product variation not found" };
    }

    if (variation.quantity < quantity) {
      return { success: false, error: "Insufficient stock available" };
    }

    const existingCartItem = await prisma.vendorCartItem.findFirst({
      where: {
        vendorCartId: cart.id,
        vendorVariationId: variationId,
      },
    });

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;
      if (newQuantity > variation.quantity) {
        return {
          success: false,
          error: "Cannot add more than available stock",
        };
      }

      await prisma.vendorCartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.vendorCartItem.create({
        data: {
          vendorCartId: cart.id,
          vendorVariationId: variationId,
          quantity,
        },
      });
    }

    return await fetchVendorCart();
  } catch (error) {
    console.error("Error adding to vendor cart:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function updateVendorCartItemQuantity(
  cartItemId: string,
  quantity: number
): Promise<VendorCartActionResult> {
  try {
    const { user } = await validateRequest();
    if (
      !user ||
      !["VENDOR", "VENDORCUSTOMER", "APPROVEDVENDORCUSTOMER"].includes(
        user.role
      )
    ) {
      return {
        success: false,
        error: "Unauthorized. Please login as a vendor customer.",
      };
    }

    const cartItem = await prisma.vendorCartItem.findUnique({
      where: { id: cartItemId },
      include: {
        vendorVariation: true,
      },
    });

    if (!cartItem) {
      return { success: false, error: "Cart item not found" };
    }

    if (quantity > cartItem.vendorVariation.quantity) {
      return { success: false, error: "Cannot add more than available stock" };
    }

    await prisma.vendorCartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return await fetchVendorCart();
  } catch (error) {
    console.error("Error updating vendor cart item quantity:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function removeFromVendorCart(
  cartItemId: string
): Promise<VendorCartActionResult> {
  try {
    const { user } = await validateRequest();
    if (
      !user ||
      !["VENDOR", "VENDORCUSTOMER", "APPROVEDVENDORCUSTOMER"].includes(
        user.role
      )
    ) {
      return {
        success: false,
        error: "Unauthorized. Please login as a vendor customer.",
      };
    }

    await prisma.vendorCartItem.delete({
      where: { id: cartItemId },
    });

    return await fetchVendorCart();
  } catch (error) {
    console.error("Error removing from vendor cart:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function fetchVendorCart(): Promise<VendorCartActionResult> {
  try {
    const { user } = await validateRequest();
    if (
      !user ||
      !["VENDOR", "VENDORCUSTOMER", "APPROVEDVENDORCUSTOMER"].includes(
        user.role
      )
    ) {
      return {
        success: false,
        error: "Unauthorized. Please login as a vendor customer.",
      };
    }

    const cart = await prisma.vendorCart.findUnique({
      where: { userId: user.id },
      include: {
        vendorCartItems: {
          include: {
            vendorVariation: {
              include: {
                vendorProduct: {
                  include: {
                    featuredImage: true,
                    dynamicPricing: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return { success: false, error: "Cart not found" };
    }

    return { success: true, data: cart };
  } catch (error) {
    console.error("Error fetching vendor cart:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function clearVendorCart(): Promise<VendorCartActionResult> {
  try {
    const { user } = await validateRequest();
    if (
      !user ||
      !["VENDOR", "VENDORCUSTOMER", "APPROVEDVENDORCUSTOMER"].includes(
        user.role
      )
    ) {
      return {
        success: false,
        error: "Unauthorized. Please login as a vendor customer.",
      };
    }

    await prisma.vendorCartItem.deleteMany({
      where: { vendorCart: { userId: user.id } },
    });

    return await fetchVendorCart();
  } catch (error) {
    console.error("Error clearing vendor cart:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
