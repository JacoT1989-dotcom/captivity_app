"use client";

// *add related product section

import React, { useState, useEffect } from "react";
import { Variation } from "@prisma/client";
import {
  ProductDetailsProps,
  ProductWithRelations,
  ProductImageProps,
} from "./types";
import { SizeSelector, QuantitySelector } from "./ProductSelectors";
import { useFilterStore } from "../../_store/useFilterStore";
import ProductImage from "./ProductImage";
import AddToCartButton from "./AddToCartButton";
import Link from "next/link";
import ViewMore from "@/app/(customer)/_components/ViewMore";
import { useColorStore } from "../../_store/useColorStore";
import ColorPicker from "./DetailPageColorPicker";

// Keep the existing transformProductForImage helper function
const transformProductForImage = (
  product: ProductWithRelations
): ProductImageProps["product"] => ({
  id: product.id,
  productName: product.productName,
  featuredImage: product.featuredImage
    ? {
        thumbnail: product.featuredImage.medium,
        medium: product.featuredImage.medium,
        large: product.featuredImage.medium,
      }
    : null,
  variations: product.variations.map(variation => ({
    id: variation.id,
    color: variation.color,
    variationImageURL: variation.variationImageURL,
  })),
});

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  // Get filter store state and actions
  const selectedColors = useFilterStore(state => state.selectedColors);
  const selectedSizes = useFilterStore(state => state.selectedSizes);
  const toggleColor = useFilterStore(state => state.toggleColor);
  const toggleSize = useFilterStore(state => state.toggleSize);

  const [recommendedBranding, setRecommendedBranding] = useState<string | null>(
    null
  );
  const getSelectedColor = useColorStore(state => state.getSelectedColor);
  const setSelectedColor = useColorStore(state => state.setSelectedColor);
  const clearSelectedColor = useColorStore(state => state.clearSelectedColor);

  // Initialize selected variation based on filter store state
  const getInitialVariation = () => {
    let variation = null;

    // Try to find a variation that matches both color and size filters
    if (selectedColors.length > 0 && selectedSizes.length > 0) {
      variation = product.variations.find(
        v => selectedColors.includes(v.color) && selectedSizes.includes(v.size)
      );
    }

    // If no match, try to match just color
    if (!variation && selectedColors.length > 0) {
      variation = product.variations.find(v =>
        selectedColors.includes(v.color)
      );
    }

    // If no match, try to match just size
    if (!variation && selectedSizes.length > 0) {
      variation = product.variations.find(v => selectedSizes.includes(v.size));
    }

    // Fallback to first variation or saved color
    const savedColor = getSelectedColor(product.id);
    return (
      variation ||
      (savedColor
        ? product.variations.find(v => v.color === savedColor)
        : null) ||
      product.variations[0]
    );
  };

  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(
    getInitialVariation()
  );
  const [quantity, setQuantity] = useState(1);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearSelectedColor(product.id);
    };
  }, [clearSelectedColor, product.id]);

  useEffect(() => {
    const match = product.description.match(
      /<strong><em>(.*?)<\/em><\/strong>/
    );
    if (match && match[1]) {
      setRecommendedBranding(match[1]);
    }
  }, [product.description]);

  const uniqueColors = Array.from(
    new Set(product.variations.map(v => v.color))
  );
  const uniqueSizes = Array.from(new Set(product.variations.map(v => v.size)));

  const handleColorSelect = (color: string | null) => {
    if (!color) {
      setSelectedVariation(null);
      setSelectedColor(product.id, "");
      return;
    }

    // Find a variation that matches both the new color and current size (if any)
    const newVariation = product.variations.find(
      v =>
        v.color === color &&
        (!selectedVariation?.size || v.size === selectedVariation.size)
    );

    if (newVariation) {
      setSelectedVariation(newVariation);
      setSelectedColor(product.id, color);
      setQuantity(1);

      // Update filter store if the color isn't already selected
      if (!selectedColors.includes(color)) {
        toggleColor(color);
      }
    }
  };

  const handleSizeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value;
    const newVariation = product.variations.find(
      v =>
        v.size === size &&
        (!selectedVariation?.color || v.color === selectedVariation.color)
    );

    if (newVariation) {
      setSelectedVariation(newVariation);
      setQuantity(1);

      // Update filter store if the size isn't already selected
      if (!selectedSizes.includes(size)) {
        toggleSize(size);
      }
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    setQuantity(Math.min(newQuantity, selectedVariation?.quantity || 1));
  };

  const viewMoreUrl = selectedVariation
    ? `/customer/shopping/${product.id}/${selectedVariation.id}`
    : `/customer/shopping/product/${product.id}`;

  const transformedProduct = transformProductForImage(product);

  return (
    <div className="max-w-4xl mx-auto p-3 bg-card my-8 shadow-lg rounded-lg border border-border mb-20">
      <div className="flex flex-col md:flex-row mb-4">
        <ProductImage
          selectedVariation={selectedVariation}
          product={transformedProduct}
          uniqueColors={uniqueColors}
          onColorSelect={handleColorSelect}
        />

        <div className="w-full md:w-1/2">
          <h1 className="text-2xl font-bold mb-1 text-card-foreground">
            {product.productName}
          </h1>
          <div
            dangerouslySetInnerHTML={{ __html: product.description }}
            className="mb-4 text-muted-foreground"
          />
          <p className="text-2xl font-bold mb-2 text-card-foreground">
            R{product.sellingPrice.toFixed(2)}
          </p>

          <ColorPicker
            colors={uniqueColors}
            selectedColor={selectedVariation?.color || null}
            onColorChange={handleColorSelect}
          />

          <SizeSelector
            sizes={uniqueSizes}
            selectedSize={selectedVariation?.size}
            onSizeSelect={handleSizeSelect}
            productId={product.id}
          />

          <QuantitySelector
            quantity={quantity}
            maxQuantity={selectedVariation?.quantity || 1}
            onQuantityChange={handleQuantityChange}
            productId={product.id}
          />

          <p className="mb-4 text-muted-foreground">
            {selectedVariation?.quantity || 0} in stock
          </p>

          <div className="space-y-2">
            <AddToCartButton
              selectedVariation={selectedVariation}
              quantity={quantity}
              disabled={!selectedVariation || selectedVariation.quantity < 1}
            />
            <Link
              href="/customer/shopping/checkout"
              className="block w-full bg-destructive text-destructive-foreground text-center py-3 rounded-md font-medium hover:bg-destructive/90 transition-colors"
            >
              Proceed to Checkout
            </Link>

            <ViewMore href={viewMoreUrl} variant="default" size="md">
              View More Details
            </ViewMore>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
