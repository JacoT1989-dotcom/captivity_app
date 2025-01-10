"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useCartStore from "../../_store/useCartStore";
import { useSession } from "@/app/(customer)/SessionProvider";
import BackToCustomerPage from "../../_components/BackToCustomerButton";

const ViewCart = () => {
  const { cart, updateCartItemQuantity, removeFromCart } = useCartStore();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const { user } = useSession();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold mb-4">
          Please login to view your cart
        </h1>
        <Link
          href="/auth/login"
          className="inline-block bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700"
        >
          Login
        </Link>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold mb-4">Your Cart is Empty</h1>
        <Link
          href="/customer/shopping"
          className="inline-block bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const cartItems = cart.cartItems || [];
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.variation.product.sellingPrice * item.quantity,
    0
  );
  const shipping = 0; // Fixed shipping cost
  const total = subtotal + shipping;

  const handleUpdateQuantity = async (
    cartItemId: string,
    newQuantity: number
  ) => {
    setUpdatingItems(prev => new Set(prev).add(cartItemId));
    await updateCartItemQuantity(cartItemId, newQuantity);
    setUpdatingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(cartItemId);
      return newSet;
    });
  };

  const handleRemoveItem = async (cartItemId: string) => {
    setRemovingItems(prev => new Set(prev).add(cartItemId));
    await removeFromCart(cartItemId);
    setRemovingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(cartItemId);
      return newSet;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold mb-8">
          {user?.username
            ? `${user.displayName}'s Shopping Cart`
            : "Shopping Cart"}
        </h1>
        <span>
          <BackToCustomerPage />
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Section */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div
              key={item.id}
              className="flex gap-4 bg-white p-6 rounded-lg shadow"
            >
              <div className="relative w-32 h-32">
                <Image
                  src={
                    item.variation.variationImageURL ||
                    "/api/placeholder/100/100"
                  }
                  alt={item.variation.product.productName}
                  fill
                  className="object-cover rounded"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-medium text-gray-800">
                  {item.variation.product.productName}
                </h3>
                <p className="text-gray-600 mb-2">
                  {item.variation.color} / {item.variation.size}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-4">
                    <select
                      value={item.quantity}
                      onChange={e =>
                        handleUpdateQuantity(item.id, Number(e.target.value))
                      }
                      disabled={updatingItems.has(item.id)}
                      className="border rounded-md px-3 py-2 bg-white"
                    >
                      {[...Array(item.variation.quantity)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>

                    <button
                      className="text-red-500 hover:text-red-700 disabled:opacity-50 flex items-center gap-2"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={
                        removingItems.has(item.id) || updatingItems.has(item.id)
                      }
                    >
                      {removingItems.has(item.id) ? (
                        <span className="text-sm">Removing...</span>
                      ) : (
                        <>
                          <Trash2 size={20} />
                          <span>Remove</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xl font-semibold">
                    R
                    {(
                      item.variation.product.sellingPrice * item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>R{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>R{shipping.toFixed(2)}</span>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>R{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/customer/shopping/checkout"
                className="block w-full bg-red-600 text-white text-center py-3 rounded-md font-medium hover:bg-red-700"
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/customer/shopping/express"
                className="block w-full bg-gray-800 text-white text-center py-3 rounded-md font-medium hover:bg-gray-900"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCart;
