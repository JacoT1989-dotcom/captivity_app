import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Variation {
  id: string;
  name: string;
  color: string;
  size: string;
  sku: string;
  sku2: string;
  variationImageURL: string;
  quantity: number;
  productId: string;
}

interface ColorVariation {
  color: string;
  variations: Variation[];
}

interface DynamicPricing {
  id: string;
  from: string;
  to: string;
  type: string;
  amount: string;
  productId: string;
}

interface Product {
  id: string;
  productName: string;
  sellingPrice: number;
  dynamicPricing: DynamicPricing[];
}

interface ProductVariations {
  [productId: string]: {
    variations: ColorVariation[];
    product?: Product;
  };
}

interface ColorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct: string | null;
  groupedVariations: ProductVariations;
}

// Pricing Ranges Component
const PricingRanges: React.FC<{
  dynamicPricing: DynamicPricing[] | undefined;
  sellingPrice: number;
}> = ({ dynamicPricing, sellingPrice }) => {
  // Define our desired ranges
  const desiredRanges = [
    { from: "1", to: "24" },
    { from: "25", to: "100" },
    { from: "101", to: "600" },
    { from: "601", to: "2000" },
  ];

  // Function to find the price for a given range
  const getPriceForRange = (from: string, to: string) => {
    if (!dynamicPricing?.length) {
      return sellingPrice;
    }

    const pricing = dynamicPricing.find(
      p => parseInt(p.from) <= parseInt(from) && parseInt(p.to) >= parseInt(to)
    );

    return pricing ? parseFloat(pricing.amount) : sellingPrice;
  };

  const formatPrice = (price: number) => {
    return `R${price.toFixed(2)}`;
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

const ColorDialog: React.FC<ColorDialogProps> = ({
  isOpen,
  onClose,
  selectedProduct,
  groupedVariations,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [currentVariation, setCurrentVariation] = useState<Variation | null>(
    null
  );

  useEffect(() => {
    if (isOpen && selectedProduct && groupedVariations[selectedProduct]) {
      const variations = groupedVariations[selectedProduct].variations;
      const firstAvailableVariation = variations[0]?.variations.find(
        v => v.quantity > 0
      );
      if (firstAvailableVariation) {
        setSelectedColor(variations[0].color);
        setSelectedSize(firstAvailableVariation.size);
        setQuantity(1);
        setCurrentVariation(firstAvailableVariation);
      }
    }
  }, [isOpen, selectedProduct, groupedVariations]);

  useEffect(() => {
    if (
      selectedColor &&
      selectedSize &&
      selectedProduct &&
      groupedVariations[selectedProduct]
    ) {
      const colorVariation = groupedVariations[selectedProduct].variations.find(
        v => v.color === selectedColor
      );
      const variation = colorVariation?.variations.find(
        v => v.size === selectedSize
      );
      setCurrentVariation(variation || null);
    }
  }, [selectedColor, selectedSize, selectedProduct, groupedVariations]);

  if (!selectedProduct || !groupedVariations[selectedProduct]) {
    return null;
  }

  const productData = groupedVariations[selectedProduct];
  const allColors = productData.variations.map(v => v.color);
  const allSizes = Array.from(
    new Set(
      productData.variations.flatMap(colorVar =>
        colorVar.variations.map(v => v.size)
      )
    )
  ).sort();

  const selectedColorVariations =
    productData.variations.find(v => v.color === selectedColor)?.variations ||
    [];

  const getCurrentImage = () => {
    if (selectedColor && selectedSize) {
      const colorVariation = productData.variations.find(
        v => v.color === selectedColor
      );
      const sizeVariation = colorVariation?.variations.find(
        v => v.size === selectedSize
      );
      if (sizeVariation?.variationImageURL)
        return sizeVariation.variationImageURL;
    }

    if (selectedSize) {
      const variationWithSize = productData.variations.find(colorVar =>
        colorVar.variations.some(v => v.size === selectedSize)
      );
      const sizeVariation = variationWithSize?.variations.find(
        v => v.size === selectedSize
      );
      if (sizeVariation?.variationImageURL)
        return sizeVariation.variationImageURL;
    }

    if (selectedColor) {
      const colorVariation = productData.variations.find(
        v => v.color === selectedColor
      );
      if (colorVariation?.variations[0]?.variationImageURL) {
        return colorVariation.variations[0].variationImageURL;
      }
    }

    return productData.variations[0]?.variations[0]?.variationImageURL || "";
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="p-0 mx-auto w-[95%] sm:w-[90%] max-w-7xl h-[95vh] md:h-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b bg-white rounded-md sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-red-600">
            {productData.product?.productName}
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
                  alt={productData.product?.productName || "Product"}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
              </div>
            </div>

            {/* Middle Column - Product Options */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Options Card */}
              <div className="bg-white rounded-lg border p-3 space-y-6">
                {/* Color Selection */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    Colour:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allColors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-md border transition-all ${
                          selectedColor === color
                            ? "ring-2 ring-red-600 ring-offset-1"
                            : "hover:opacity-80"
                        }`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
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
                        : productData.variations.some(colorVar =>
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
                      {currentVariation
                        ? `${currentVariation.quantity} in stock`
                        : ""}
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
                <Link href={"/login"}>Login & Add to Cart</Link>
              </Button>
            </div>

            {/* Right Column - Pricing */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border p-3">
                <PricingRanges
                  dynamicPricing={productData.product?.dynamicPricing}
                  sellingPrice={productData.product?.sellingPrice || 0}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ColorDialog;
