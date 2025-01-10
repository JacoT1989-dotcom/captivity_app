import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Cart } from "../_lib/types";

interface OrderSummaryProps {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  handleQuantityChange: (
    cartItemId: string,
    newQuantity: number
  ) => Promise<void>;
  handleRemoveItem: (cartItemId: string) => Promise<void>;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cart,
  isLoading,
  error,
  handleQuantityChange,
  handleRemoveItem,
}) => {
  const calculateSubtotal = (quantity: number, price: number) => {
    return quantity * price;
  };

  const calculateTotal = () => {
    if (!cart?.cartItems) return 0;
    return cart.cartItems.reduce((total, item) => {
      return (
        total +
        calculateSubtotal(item.quantity, item.variation.product.sellingPrice)
      );
    }, 0);
  };

  return (
    <div className="bg-white rounded-lg p-6 sticky top-6 shadow-2xl shadow-black">
      <h3 className="text-xl font-semibold mb-6">Order Summary</h3>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : cart?.cartItems && cart.cartItems.length > 0 ? (
        <div className="space-y-6">
          {cart.cartItems.map(item => (
            <div key={item.id} className="flex items-start border-b pb-4">
              <div className="relative h-16 w-16 rounded-md overflow-hidden">
                <Image
                  src={
                    item.variation.variationImageURL ||
                    item.variation.product.featuredImage?.medium ||
                    "/api/placeholder/100/100"
                  }
                  alt={item.variation.product.productName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-grow ml-4">
                <h4 className="font-semibold text-sm">
                  {item.variation.product.productName}
                </h4>
                <p className="text-xs text-gray-600">
                  Size: {item.variation.size}, Color: {item.variation.color}
                </p>
                <div className="flex items-center mt-2">
                  <select
                    value={item.quantity}
                    onChange={e =>
                      handleQuantityChange(item.id, Number(e.target.value))
                    }
                    disabled={isLoading}
                    className={`text-sm border rounded px-2 py-1 mr-4 ${
                      isLoading ? "opacity-50" : ""
                    }`}
                  >
                    {[...Array(item.variation.quantity)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={isLoading}
                    className={`text-red-500 hover:text-red-700 text-sm ${
                      isLoading ? "opacity-50" : ""
                    }`}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">
                  R{item.variation.product.sellingPrice.toFixed(2)} each
                </p>
                <p className="text-xs text-gray-600">
                  Subtotal: R
                  {calculateSubtotal(
                    item.quantity,
                    item.variation.product.sellingPrice
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          ))}

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-sm mb-2">
              <span>Subtotal:</span>
              <span>R{calculateTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm mb-2"></div>
            <div className="flex justify-between items-center font-semibold text-lg mt-4">
              <span>Total:</span>
              <span>R{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Button type="button" variant="outline" asChild>
            <Link href={"/customer/shopping/product_categories/summer"}>
              Continue Shopping
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
