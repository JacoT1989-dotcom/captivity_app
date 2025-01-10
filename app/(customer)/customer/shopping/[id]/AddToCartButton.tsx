"use client";

import React, { useState } from "react";
import useCartStore from "../../_store/useCartStore";
import { AddToCartButtonProps } from "./types";

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  selectedVariation,
  quantity,
  disabled,
}) => {
  const addToCart = useCartStore(state => state.addToCart);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (selectedVariation) {
      setIsAddingToCart(true);
      await addToCart(selectedVariation.id, quantity);
      setIsAddingToCart(false);
    }
  };

  return (
    <button
      className="w-full bg-red-500 text-white py-3 rounded-md font-medium transition-colors hover:bg-blue-700 disabled:bg-gray-400"
      disabled={disabled || isAddingToCart}
      onClick={handleAddToCart}
    >
      {isAddingToCart ? "Adding to Cart..." : "Add to Cart"}
    </button>
  );
};

export default AddToCartButton;
