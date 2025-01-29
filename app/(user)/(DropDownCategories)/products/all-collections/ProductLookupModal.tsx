import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "./_store/types";
import { ColorDisplay } from "./ColorBackground";

interface ProductLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
  product: Product | undefined;
  productVariations:
    | {
        variations: Array<{
          color: string;
          variations: Array<{
            id: string;
            name: string;
            color: string;
            size: string;
            sku: string;
            sku2: string;
            variationImageURL: string;
            quantity: number;
            productId: string;
          }>;
        }>;
      }
    | undefined;
}

interface PricingRangesProps {
  dynamicPricing: Array<{
    from: string;
    to: string;
    amount: string;
    type: string;
  }>;
  sellingPrice: number;
  productId: string;
}

const PricingRanges: React.FC<PricingRangesProps> = ({
  dynamicPricing,
  sellingPrice,
}) => {
  const desiredRanges = [
    { from: "1", to: "24" },
    { from: "25", to: "100" },
    { from: "101", to: "600" },
    { from: "601", to: "20000" },
  ];

  const getPriceForRange = (from: string, to: string) => {
    if (!dynamicPricing?.length) return sellingPrice;

    const applicablePricing = dynamicPricing.filter(pricing => {
      const pricingStart = parseInt(pricing.from);
      const pricingEnd = parseInt(pricing.to);
      const rangeStart = parseInt(from);
      const rangeEnd = parseInt(to);
      return pricingStart <= rangeEnd && pricingEnd >= rangeStart;
    });

    if (!applicablePricing.length) return sellingPrice;

    const bestPricing = applicablePricing.reduce((best, current) => {
      const currentRange = parseInt(current.to) - parseInt(current.from);
      const bestRange = parseInt(best.to) - parseInt(best.from);
      return currentRange < bestRange ? current : best;
    });

    if (bestPricing.type === "percentage") {
      return sellingPrice * (1 - parseFloat(bestPricing.amount) / 100);
    } else if (bestPricing.type === "fixed") {
      return sellingPrice - parseFloat(bestPricing.amount);
    }

    return sellingPrice;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="grid grid-cols-2 gap-y-5 gap-x-2 text-sm">
      <div className="font-medium text-gray-700">Quantity</div>
      <div className="font-medium text-gray-700">Price</div>
      {desiredRanges.map(range => (
        <React.Fragment key={`${range.from}-${range.to}`}>
          <div className="text-gray-600">{`${range.from} - ${range.to}`}</div>
          <div className="text-gray-600">
            {formatPrice(getPriceForRange(range.from, range.to))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

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
  const [currentVariation, setCurrentVariation] = useState<
    Product["variations"][0] | null
  >(null);

  // Reset state when modal opens with new product
  useEffect(() => {
    if (isOpen && productId && productVariations) {
      // Find first color with available stock
      const firstColorWithStock = productVariations.variations.find(colorVar =>
        colorVar.variations.some(v => v.quantity > 0)
      );

      if (firstColorWithStock) {
        setSelectedColor(firstColorWithStock.color);

        // Find first size with stock in this color
        const firstSizeWithStock = firstColorWithStock.variations.find(
          v => v.quantity > 0
        );
        if (firstSizeWithStock) {
          setSelectedSize(firstSizeWithStock.size);
          setCurrentVariation(firstSizeWithStock);
        }
      } else {
        // If no stock, just select first color and size
        setSelectedColor(productVariations.variations[0]?.color || "");
        setSelectedSize(
          productVariations.variations[0]?.variations[0]?.size || ""
        );
        setCurrentVariation(
          productVariations.variations[0]?.variations[0] || null
        );
      }
      setQuantity(1);
    }
  }, [isOpen, productId, productVariations]);

  // Update current variation when selections change
  useEffect(() => {
    if (selectedColor && selectedSize && productVariations) {
      const colorVariation = productVariations.variations.find(
        v => v.color === selectedColor
      );
      const variation = colorVariation?.variations.find(
        v => v.size === selectedSize
      );
      setCurrentVariation(variation || null);

      // Reset quantity if current variation has less stock than selected quantity
      if (variation && variation.quantity < quantity) {
        setQuantity(Math.max(1, variation.quantity));
      }
    }
  }, [selectedColor, selectedSize, productVariations, quantity]);

  if (!productId || !product || !productVariations) return null;

  const allColors = productVariations.variations.map(v => v.color);

  // Get all sizes for the current color
  const selectedColorVariations =
    productVariations.variations.find(v => v.color === selectedColor)
      ?.variations || [];

  // Get all unique sizes across all colors
  const allSizes = Array.from(
    new Set(
      productVariations.variations.flatMap(colorVar =>
        colorVar.variations.map(v => v.size)
      )
    )
  ).sort((a, b) => {
    // Convert to numbers if possible for natural sorting
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.localeCompare(b);
  });

  const getCurrentImage = () => {
    if (currentVariation?.variationImageURL) {
      return currentVariation.variationImageURL;
    }
    return product.featuredImage?.large || "";
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="p-0 mx-auto w-[95%] sm:w-[90%] max-w-7xl h-[90vh] md:h-auto">
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

        {/* Content */}
        <div className="overflow-y-auto md:overflow-hidden h-[calc(100%-3.5rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-4">
            {/* Product Image */}
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

            {/* Product Options */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-lg border p-4 space-y-6">
                {/* Color Selection */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Colour:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allColors.map(color => (
                      <ColorDisplay
                        key={color}
                        color={color}
                        isSelected={selectedColor === color}
                        onClick={() => {
                          setSelectedColor(color);
                          // Reset size when changing color
                          const colorVariation =
                            productVariations.variations.find(
                              v => v.color === color
                            );
                          const firstAvailableSize =
                            colorVariation?.variations.find(
                              v => v.quantity > 0
                            )?.size;
                          setSelectedSize(
                            firstAvailableSize ||
                              colorVariation?.variations[0]?.size ||
                              ""
                          );
                        }}
                        size="md"
                      />
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Size:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {allSizes.map(size => {
                      const isAvailable = selectedColorVariations.some(
                        v => v.size === size && v.quantity > 0
                      );

                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          disabled={!isAvailable}
                          className={cn(
                            "min-w-[44px] px-3 py-1.5 text-sm border rounded-md transition-colors",
                            selectedSize === size
                              ? "bg-red-600 text-white border-red-600"
                              : isAvailable
                                ? "hover:bg-gray-50"
                                : "opacity-50 cursor-not-allowed bg-gray-50"
                          )}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity Selection */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
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
                        disabled={
                          !currentVariation ||
                          quantity >= currentVariation.quantity
                        }
                      >
                        +
                      </button>
                    </div>
                    {currentVariation && (
                      <div className="text-sm text-yellow-600">
                        {currentVariation.quantity} in stock
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                className="w-full py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 
                          transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!currentVariation || currentVariation.quantity === 0}
                asChild
              >
                <Link href={"/login"}>Login & Add to Cart</Link>
              </Button>
            </div>

            {/* Pricing Table */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border p-3">
                <PricingRanges
                  dynamicPricing={product.dynamicPricing}
                  sellingPrice={product.sellingPrice}
                  productId={product.id}
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
