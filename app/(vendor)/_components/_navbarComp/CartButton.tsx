import React from "react";
import { ShoppingCart, Loader2 } from "lucide-react";

interface CartButtonProps {
  onClick: () => void;
  cartItemCount: number;
  isCartInitialized: boolean;
}

export const CartButton = React.memo(
  ({ onClick, cartItemCount, isCartInitialized }: CartButtonProps) => (
    <button
      onClick={onClick}
      className="relative p-2 hover:bg-gray-800 rounded-full transition-colors"
      disabled={!isCartInitialized}
    >
      <ShoppingCart className="w-6 h-6" />
      {!isCartInitialized ? (
        <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        </span>
      ) : (
        cartItemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartItemCount}
          </span>
        )
      )}
    </button>
  )
);

CartButton.displayName = "CartButton";
