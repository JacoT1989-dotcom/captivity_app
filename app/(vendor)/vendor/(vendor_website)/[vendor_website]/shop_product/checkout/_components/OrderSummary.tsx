import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { VendorCart } from "../_lib/types";

interface VendorOrderSummaryProps {
  cart: VendorCart | null;
  isLoading: boolean;
  error: string | null;
  handleQuantityChange: (
    cartItemId: string,
    newQuantity: number
  ) => Promise<void>;
  handleRemoveItem: (cartItemId: string) => Promise<void>;
}

const VendorOrderSummary: React.FC<VendorOrderSummaryProps> = ({
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
    if (!cart?.vendorCartItems) return 0;
    return cart.vendorCartItems.reduce((total, item) => {
      return (
        total +
        calculateSubtotal(
          item.quantity,
          item.vendorVariation.vendorProduct.sellingPrice
        )
      );
    }, 0);
  };

  return (
    <div className="bg-background border rounded-lg p-4 md:p-6 sticky top-6 transition-colors shadow-2xl shadow-black">
      <h3 className="text-xl font-semibold mb-6 text-foreground">
        Order Summary
      </h3>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="text-destructive text-center py-4">{error}</div>
      ) : cart?.vendorCartItems && cart.vendorCartItems.length > 0 ? (
        <div className="space-y-6">
          {cart.vendorCartItems.map(item => (
            <div
              key={item.id}
              className="flex items-start border-b border-input pb-4"
            >
              <div className="relative h-16 w-16 rounded-md overflow-hidden">
                <Image
                  src={
                    item.vendorVariation.variationImageURL ||
                    item.vendorVariation.vendorProduct.featuredImage?.medium ||
                    "/api/placeholder/100/100"
                  }
                  alt={item.vendorVariation.vendorProduct.productName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-grow ml-4">
                <h4 className="font-semibold text-sm text-foreground">
                  {item.vendorVariation.vendorProduct.productName}
                </h4>
                <p className="text-xs text-muted-foreground">
                  Size: {item.vendorVariation.size}, Color:{" "}
                  {item.vendorVariation.color}
                </p>
                <div className="flex items-center mt-2">
                  <select
                    value={item.quantity}
                    onChange={e =>
                      handleQuantityChange(item.id, Number(e.target.value))
                    }
                    disabled={isLoading}
                    className="text-sm border rounded px-2 py-1 mr-4 bg-background text-foreground border-input disabled:opacity-50"
                  >
                    {[...Array(item.vendorVariation.quantity)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={isLoading}
                    className="text-destructive hover:text-destructive/90 text-sm disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm text-foreground">
                  R{item.vendorVariation.vendorProduct.sellingPrice.toFixed(2)}{" "}
                  each
                </p>
                <p className="text-xs text-muted-foreground">
                  Subtotal: R
                  {calculateSubtotal(
                    item.quantity,
                    item.vendorVariation.vendorProduct.sellingPrice
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          ))}

          <div className="border-t border-input pt-4">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-foreground">Subtotal:</span>
              <span className="text-foreground">
                R{calculateTotal().toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-foreground">Shipping:</span>
              <span className="text-muted-foreground">
                Calculated at next step
              </span>
            </div>
            <div className="flex justify-between items-center font-semibold text-lg mt-4">
              <span className="text-foreground">Total:</span>
              <span className="text-foreground">
                R{calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Button variant="outline" asChild>
            <Link href="/vendor/shopping/products">Continue Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default VendorOrderSummary;
