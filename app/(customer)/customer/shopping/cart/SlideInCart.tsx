import React, { useState, useEffect } from "react";
import { X, Trash2, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useCartStore from "../../_store/useCartStore";

type SlideInCartProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SlideInCart: React.FC<SlideInCartProps> = ({ isOpen, onClose }) => {
  const { cart, updateCartItemQuantity, removeFromCart } = useCartStore();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [updateSuccess, setUpdateSuccess] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!cart) {
    return null;
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

    // Show success message
    setUpdateSuccess(prev => new Set(prev).add(cartItemId));

    // Clear success message after 2 seconds
    setTimeout(() => {
      setUpdateSuccess(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }, 1000);
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
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Slide-in Cart */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center text-black">
            <p className="text-3xl font-semibold">Shopping Cart</p>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.map(item => (
              <div
                key={item.id}
                className="flex gap-4 border-b border-gray-200 py-4"
              >
                <div className="relative w-20 h-20">
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
                  <h3 className="font-medium text-gray-800">
                    {item.variation.product.productName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.variation.color} / {item.variation.size}
                  </p>
                  <div className="flex items-center mt-2 gap-2">
                    <select
                      value={item.quantity}
                      onChange={e =>
                        handleUpdateQuantity(item.id, Number(e.target.value))
                      }
                      disabled={updatingItems.has(item.id)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      {[...Array(item.variation.quantity)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>

                    {/* Loading and Success States */}
                    {updatingItems.has(item.id) && (
                      <span className="text-sm text-blue-500 animate-pulse">
                        Updating...
                      </span>
                    )}
                    {updateSuccess.has(item.id) &&
                      !updatingItems.has(item.id) && (
                        <span className="text-sm text-green-500 flex items-center gap-1">
                          <Check size={16} />
                          Updated
                        </span>
                      )}

                    <p className="font-medium ml-auto">
                      R{item.variation.product.sellingPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
                <button
                  className="text-red-500 hover:text-red-700 disabled:opacity-50"
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={
                    removingItems.has(item.id) || updatingItems.has(item.id)
                  }
                >
                  {removingItems.has(item.id) ? (
                    <span className="text-sm">Removing...</span>
                  ) : (
                    <Trash2 size={20} />
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="border-t p-4 bg-gray-50">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>R{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>R{shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>R{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <Link
                href="/customer/shopping/checkout"
                className="block w-full bg-red-600 text-white text-center py-3 rounded-md font-medium hover:bg-red-700"
              >
                Checkout Now
              </Link>
              <Link
                href="/customer/shopping/cart"
                className="block w-full bg-gray-800 text-white text-center py-3 rounded-md font-medium hover:bg-gray-900"
              >
                View Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SlideInCart;
