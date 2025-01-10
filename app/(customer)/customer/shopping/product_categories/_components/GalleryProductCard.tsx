"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

import { ProductPrice } from "./ProductCardComponents";

import { Variation } from "@prisma/client";
import ViewMore from "@/app/(customer)/_components/ViewMore";

import { QuantitySelector, SizeSelector } from "../../[id]/ProductSelectors";
import AddToCartButton from "../../[id]/AddToCartButton";
import { ProductWithRelations } from "../types";
import { useColorStore } from "../../../_store/useColorStore";

interface GalleryProductCardProps {
  product: ProductWithRelations;
  selectedColors: string[];
  selectedSizes: string[];
  onColorChange?: (color: string | null) => void;
}

const GalleryProductCard: React.FC<GalleryProductCardProps> = ({
  product,
  selectedColors,
  selectedSizes,
  onColorChange,
}) => {
  const setGlobalSelectedColor = useColorStore(state => state.setSelectedColor);
  const defaultVariation = product.variations[0];

  // Find first matching variation based on selected filters
  const initialVariation =
    product.variations.find(
      v =>
        selectedColors.some(
          color => v.color.toLowerCase() === color.toLowerCase()
        ) &&
        (!selectedSizes.length || selectedSizes.includes(v.size))
    ) ?? defaultVariation;

  const [selectedVariation, setSelectedVariation] =
    useState<Variation>(initialVariation);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>(
    initialVariation?.variationImageURL || product.featuredImage?.large || ""
  );

  // Get all unique images with their associated variations
  const imageVariationMap = React.useMemo(() => {
    const map = new Map<string, Variation>();
    product.variations.forEach(variation => {
      if (variation.variationImageURL) {
        map.set(variation.variationImageURL, variation);
      }
    });
    if (product.featuredImage?.large) {
      map.set(product.featuredImage.large, product.variations[0]);
    }
    return map;
  }, [product]);

  // Get available sizes for the selected color
  const availableSizes = React.useMemo(() => {
    if (!selectedVariation?.color) return [];
    return product.variations
      .filter(v => v.color === selectedVariation.color)
      .map(v => v.size);
  }, [product.variations, selectedVariation?.color]);

  const handleColorChange = useCallback(
    (newColor: string | null) => {
      if (!newColor) {
        setSelectedVariation(defaultVariation);
        setSelectedImage(defaultVariation.variationImageURL);
        onColorChange?.(null);
        return;
      }

      const variation =
        product.variations.find(
          v =>
            v.color.toLowerCase() === newColor.toLowerCase() &&
            (!selectedSizes.length || selectedSizes.includes(v.size))
        ) ?? defaultVariation;

      setSelectedVariation(variation);
      setSelectedImage(variation.variationImageURL);
      setQuantity(1);
      onColorChange?.(newColor);
      setGlobalSelectedColor(product.id, newColor);
    },
    [
      product.id,
      product.variations,
      selectedSizes,
      defaultVariation,
      onColorChange,
      setGlobalSelectedColor,
    ]
  );

  useEffect(() => {
    const currentColor = selectedColors[0] || null;
    handleColorChange(currentColor);
  }, [selectedColors, handleColorChange]);

  const handleThumbnailClick = (image: string) => {
    setSelectedImage(image);
    const variation = imageVariationMap.get(image);
    if (variation) {
      setSelectedVariation(variation);
      onColorChange?.(variation.color);
      setGlobalSelectedColor(product.id, variation.color);
    }
  };

  const handleSizeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value;
    const newVariation = product.variations.find(
      v => v.size === size && v.color === selectedVariation?.color
    );
    if (newVariation) {
      setSelectedVariation(newVariation);
      setQuantity(1);
    }
  };

  const totalStock = product.variations.reduce(
    (sum, variation) => sum + variation.quantity,
    0
  );

  const allImages = Array.from(imageVariationMap.keys());

  return (
    <Card className="p-3 shadow-2xl shadow-black transition-transform duration-300 hover:scale-95">
      <div className="flex flex-col md:flex-row gap-6 p-3">
        {/* Left Column - Images */}
        <div className="w-full md:w-1/3 space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <Image
              src={selectedImage || "/placeholder.jpg"}
              alt={product.productName}
              fill
              sizes="300"
              className="object-cover"
              priority
            />
          </div>

          <div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-auto">
            {allImages.map((image, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(image)}
                className={`relative aspect-square rounded-md overflow-hidden border-2
                    ${selectedImage === image ? "border-primary" : "border-transparent"}
                    hover:border-primary/50 transition-colors`}
              >
                <Image
                  src={image}
                  alt={`${product.productName} view ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 60vw, 40vw"
                  className="object-cover rounded-lg"
                  priority={false}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              {product.productName}
            </h2>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm space-y-1">
                {selectedVariation && (
                  <div className="text-muted-foreground">
                    Selected Color: {selectedVariation.color}
                    <div>Color Stock: {selectedVariation.quantity}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <ProductPrice
            dynamicPricing={product.dynamicPricing}
            sellingPrice={product.sellingPrice}
          />

          <div className="space-y-4">
            {/* <ColorPicker
              colors={Array.from(new Set(product.variations.map(v => v.color)))}
              selectedColor={selectedVariation?.color || null}
              onColorChange={handleColorChange}
            /> */}

            <SizeSelector
              sizes={availableSizes}
              selectedSize={selectedVariation?.size}
              onSizeSelect={handleSizeSelect}
              productId={product.id}
            />

            <QuantitySelector
              quantity={quantity}
              maxQuantity={selectedVariation?.quantity || 1}
              onQuantityChange={e => setQuantity(parseInt(e.target.value))}
              productId={product.id}
            />

            <div className="space-y-2">
              <AddToCartButton
                selectedVariation={selectedVariation}
                quantity={quantity}
                disabled={!selectedVariation || selectedVariation.quantity < 1}
              />

              <ViewMore
                href={`/customer/shopping/${product.id}/${selectedVariation?.id || ""}`}
                variant="default"
                size="md"
              >
                View More Details
              </ViewMore>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GalleryProductCard;
