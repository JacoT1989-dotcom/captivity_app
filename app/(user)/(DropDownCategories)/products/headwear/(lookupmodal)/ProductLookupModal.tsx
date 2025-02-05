// ProductLookupModal.tsx
import React, { useState, useEffect } from "react";
import ColorSwatch from "./ColorSwatch";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PricingRanges from "./PricingRanges";
import type { ProductLookupModalProps, Variation } from "./types";

const ProductLookupModal: React.FC<ProductLookupModalProps> = ({
  isOpen,
  onClose,
  productId,
  product,
  productVariations,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [currentVariation, setCurrentVariation] = useState<Variation | null>(
    null
  );

  useEffect(() => {
    if (isOpen && productId && productVariations) {
      const firstAvailableVariation =
        productVariations.variations[0]?.variations.find(v => v.quantity > 0);
      if (firstAvailableVariation) {
        setSelectedColor(productVariations.variations[0].color);
        setSelectedSize(firstAvailableVariation.size);
        setQuantity(1);
        setCurrentVariation(firstAvailableVariation);
      }
    }
  }, [isOpen, productId, productVariations]);

  useEffect(() => {
    if (selectedColor && selectedSize && productVariations) {
      const colorVariation = productVariations.variations.find(
        v => v.color === selectedColor
      );
      const variation = colorVariation?.variations.find(
        v => v.size === selectedSize
      );
      setCurrentVariation(variation || null);
    }
  }, [selectedColor, selectedSize, productVariations]);

  if (!productId || !product || !productVariations) {
    return null;
  }

  const allColors = productVariations.variations.map(v => v.color);
  const allSizes = Array.from(
    new Set(
      productVariations.variations.flatMap(colorVar =>
        colorVar.variations.map(v => v.size)
      )
    )
  ).sort();

  const selectedColorVariations =
    productVariations.variations.find(v => v.color === selectedColor)
      ?.variations || [];

  const getCurrentImage = () => {
    if (selectedColor && selectedSize) {
      const colorVariation = productVariations.variations.find(
        v => v.color === selectedColor
      );
      const sizeVariation = colorVariation?.variations.find(
        v => v.size === selectedSize
      );
      if (sizeVariation?.variationImageURL)
        return sizeVariation.variationImageURL;
    }

    if (selectedSize) {
      const variationWithSize = productVariations.variations.find(colorVar =>
        colorVar.variations.some(v => v.size === selectedSize)
      );
      const sizeVariation = variationWithSize?.variations.find(
        v => v.size === selectedSize
      );
      if (sizeVariation?.variationImageURL)
        return sizeVariation.variationImageURL;
    }

    if (selectedColor) {
      const colorVariation = productVariations.variations.find(
        v => v.color === selectedColor
      );
      if (colorVariation?.variations[0]?.variationImageURL) {
        return colorVariation.variations[0].variationImageURL;
      }
    }

    return (
      productVariations.variations[0]?.variations[0]?.variationImageURL || ""
    );
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="p-0 mx-auto w-[95%] sm:w-[70%] max-w-7xl max-h-[90vh] md:h-auto overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b rounded-md bg-white sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-red-600">
            {product.productName}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Main Content */}
        <div className="overflow-y-auto md:overflow-hidden h-[calc(100%-3.5rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-4">
            {/* Left Column - Image */}
            <div className="lg:col-span-2">
              <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-50 border">
                <Image
                  src={getCurrentImage()}
                  alt={product.productName}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
              </div>
            </div>

            {/* Middle Column - Product Options */}
            <div className="lg:col-span-2 space-y-8">
              {/* Product Options Card */}
              <div className="bg-white rounded-lg border p-2 space-y-6">
                {/* Color Selection */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    Colour:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allColors.map(color => (
                      <ColorSwatch
                        key={color}
                        color={color}
                        isSelected={selectedColor === color}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    Size:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {allSizes.map(size => {
                      const isAvailable = selectedColor
                        ? selectedColorVariations.some(
                            v => v.size === size && v.quantity > 0
                          )
                        : productVariations.variations.some(colorVar =>
                            colorVar.variations.some(
                              v => v.size === size && v.quantity > 0
                            )
                          );

                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[44px] px-3 py-1.5 text-sm border rounded-md transition-colors ${
                            selectedSize === size
                              ? "bg-red-600 text-white border-red-600"
                              : isAvailable
                                ? "hover:bg-gray-50"
                                : "opacity-50 cursor-not-allowed bg-gray-50"
                          }`}
                          disabled={!isAvailable}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity Selection */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    Quantity:
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex border rounded-md shadow-sm">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1.5 hover:bg-gray-50 transition-colors border-r"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={quantity}
                        onChange={e => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && currentVariation) {
                            setQuantity(
                              Math.min(
                                currentVariation.quantity,
                                Math.max(1, val)
                              )
                            );
                          }
                        }}
                        className="w-14 text-center"
                      />
                      <button
                        onClick={() => {
                          if (currentVariation) {
                            setQuantity(
                              Math.min(currentVariation.quantity, quantity + 1)
                            );
                          }
                        }}
                        className="px-3 py-1.5 hover:bg-gray-50 transition-colors border-l"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-sm text-yellow-600">
                      {currentVariation ? ` in stock` : ""}
                    </div>
                  </div>
                </div>
              </div>

              {/* Login Button */}
              <Button
                className="w-full py-2.5 bg-red-600 text-white rounded-md
                hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 
                disabled:cursor-not-allowed"
                disabled={!currentVariation || currentVariation.quantity === 0}
                asChild
              >
                <Link href={"/login"}>Login</Link>
              </Button>
            </div>

            {/* Right Column - Pricing */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border p-3">
                <PricingRanges
                  dynamicPricing={product.dynamicPricing}
                  sellingPrice={product.sellingPrice}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductLookupModal;
