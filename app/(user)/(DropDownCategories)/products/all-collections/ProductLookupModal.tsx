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

// PricingRanges component
const PricingRanges: React.FC<{
  dynamicPricing: Array<{
    from: string;
    to: string;
    amount: string;
  }>;
  sellingPrice: number;
  productId: string;
}> = ({ dynamicPricing, sellingPrice }) => {
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

    return parseFloat(bestPricing.amount);
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

// Main ProductLookupModal component
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

  // Initialize selections when modal opens
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
    }
  }, [selectedColor, selectedSize, productVariations]);

  if (!productId || !product || !productVariations) return null;

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
                        onClick={() => setSelectedColor(color)}
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
                          className={cn(
                            "min-w-[44px] px-3 py-1.5 text-sm border rounded-md transition-colors",
                            selectedSize === size
                              ? "bg-red-600 text-white border-red-600"
                              : isAvailable
                                ? "hover:bg-gray-50"
                                : "opacity-50 cursor-not-allowed bg-gray-50"
                          )}
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
