import { ShoppingBag, X, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { VendorCartItem } from "../vendor/(vendor_website)/[vendor_website]/shop_product/checkout/_lib/types";
import useVendorCartStore from "../vendor/(vendor_website)/[vendor_website]/shop_product/cart/useCartStore";

// Import custom types

interface VendorCartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  vendorWebsite: string;
}

const calculateItemPrice = (item: VendorCartItem): number => {
  const basePrice = item.vendorVariation.vendorProduct.sellingPrice;
  const dynamicPricing = item.vendorVariation.vendorProduct.dynamicPricing;

  if (!dynamicPricing?.length) return basePrice * item.quantity;

  const applicableRule = dynamicPricing.find(rule => {
    const from = parseInt(rule.from);
    const to = parseInt(rule.to);
    return item.quantity >= from && item.quantity <= to;
  });

  if (!applicableRule) return basePrice * item.quantity;

  if (applicableRule.type === "fixed_price") {
    return parseFloat(applicableRule.amount) * item.quantity;
  } else {
    const discount = parseFloat(applicableRule.amount) / 100;
    return basePrice * item.quantity * (1 - discount);
  }
};

const VendorCartSidebar = ({
  isOpen,
  onClose,
  vendorWebsite,
}: VendorCartSidebarProps) => {
  const { cart, updateQuantity, removeItem } = useVendorCartStore();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [updateSuccess, setUpdateSuccess] = useState<Set<string>>(new Set());

  const cartItems = cart?.vendorCartItems || [];
  const subtotal =
    cartItems.reduce((sum, item) => sum + calculateItemPrice(item), 0) || 0;

  const handleUpdateQuantity = async (
    cartItemId: string,
    newQuantity: number
  ) => {
    setUpdatingItems(prev => new Set(prev).add(cartItemId));
    await updateQuantity(cartItemId, newQuantity); // Correct method name
    setUpdatingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(cartItemId);
      return newSet;
    });

    setUpdateSuccess(prev => new Set(prev).add(cartItemId));
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
    await removeItem(cartItemId); // Correct method name
    setRemovingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(cartItemId);
      return newSet;
    });
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 transition-opacity duration-300 z-50",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full bg-background shadow-xl transform transition-transform duration-300 ease-in-out z-50",
          "w-[300px] sm:w-[350px] md:w-[450px]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            <h2 className="text-lg sm:text-xl font-semibold">Shopping Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-accent rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Cart content */}
        <div className="flex flex-col h-[calc(100%-140px)] sm:h-[calc(100%-180px)] overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4" />
              <p className="text-base sm:text-lg">Your cart is empty</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {cartItems.map(item => {
                const itemTotal = calculateItemPrice(item);
                const basePrice =
                  item.vendorVariation.vendorProduct.sellingPrice;
                const hasDiscount = itemTotal < basePrice * item.quantity;

                return (
                  <div key={item.id} className="flex gap-4 border-b pb-4">
                    <div className="relative w-20 h-20">
                      <Image
                        src={
                          item.vendorVariation.variationImageURL ||
                          "/api/placeholder/100/100"
                        }
                        alt={item.vendorVariation.vendorProduct.productName}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">
                        {item.vendorVariation.vendorProduct.productName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.vendorVariation.color} /{" "}
                        {item.vendorVariation.size}
                      </p>
                      <div className="flex items-center mt-2 gap-2">
                        <select
                          value={item.quantity}
                          onChange={e =>
                            handleUpdateQuantity(
                              item.id,
                              Number(e.target.value)
                            )
                          }
                          disabled={updatingItems.has(item.id)}
                          className="text-sm border rounded px-2 py-1"
                        >
                          {[...Array(item.vendorVariation.quantity)].map(
                            (_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            )
                          )}
                        </select>

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

                        <div className="ml-auto text-right">
                          <p className="font-medium">R{itemTotal.toFixed(2)}</p>
                          {hasDiscount && (
                            <p className="text-sm text-muted-foreground line-through">
                              R{(basePrice * item.quantity).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      className="text-destructive hover:text-destructive/90 disabled:opacity-50"
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
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-3 sm:p-4 space-y-3 sm:space-y-4">
          <div className="flex justify-between text-base sm:text-lg font-semibold">
            <span>Total</span>
            <span>R{subtotal.toFixed(2)}</span>
          </div>
          <div className="space-y-2">
            <Link
              href={`/vendor/${vendorWebsite}/shop_product/checkout`}
              className={cn(
                "block w-full bg-primary text-primary-foreground text-center py-2.5 sm:py-3 rounded-md",
                "hover:bg-primary/90 transition-colors",
                "text-sm sm:text-base font-medium"
              )}
              onClick={onClose}
            >
              Checkout
            </Link>
            <Link
              href={`/vendor/${vendorWebsite}/shop_product/cart`}
              className={cn(
                "block w-full bg-accent text-accent-foreground text-center py-2.5 sm:py-3 rounded-md",
                "hover:bg-accent/90 transition-colors",
                "text-sm sm:text-base font-medium"
              )}
              onClick={onClose}
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorCartSidebar;
