"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Cart, CartItem, Variation, Product } from "@prisma/client";

// Merging the models(Data Modeling)
type CartWithItems = Cart & {
  cartItems: (CartItem & {
    variation: Variation & {
      product: Product;
    };
  })[];
};

type CartActionResult =
  | { success: true; data: CartWithItems }
  | { success: false; error: string };

//Helper function
async function getOrCreateCart(userId: string): Promise<Cart> {
  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
    });
  }

  return cart;
}

export async function addToCart(
  variationId: string,
  quantity: number
): Promise<CartActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const cart = await getOrCreateCart(user.id);

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        variationId,
      },
    });

    if (existingCartItem) {
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variationId,
          quantity,
        },
      });
    }

    return await fetchCart();
  } catch (error) {
    console.error("Error adding to cart:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
): Promise<CartActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return await fetchCart();
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function removeFromCart(
  cartItemId: string
): Promise<CartActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return await fetchCart();
  } catch (error) {
    console.error("Error removing from cart:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function fetchCart(): Promise<CartActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        cartItems: {
          include: {
            variation: {
              include: {
                product: true,
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
    console.error("Error fetching cart:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function clearCart(): Promise<CartActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    await prisma.cartItem.deleteMany({
      where: { cart: { userId: user.id } },
    });

    return await fetchCart();
  } catch (error) {
    console.error("Error clearing cart:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
