import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface ProductLookup {
  id: string;
  productName: string;
  sellingPrice: number;
  dynamicPricing: {
    id: string;
    from: string;
    to: string;
    type: string;
    amount: string;
    productId: string;
  }[];
}

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

interface ProductVariations {
  variations: ColorVariation[];
}

interface ProductLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
  product: ProductLookup | undefined;
  productVariations: ProductVariations | undefined;
}

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
        productVariations.variations[0].variations.find(v => v.quantity > 0);
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
    // If both color and size are selected
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

    // If only size is selected
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

    // If only color is selected
    if (selectedColor) {
      const colorVariation = productVariations.variations.find(
        v => v.color === selectedColor
      );
      if (colorVariation?.variations[0]?.variationImageURL) {
        return colorVariation.variations[0].variationImageURL;
      }
    }

    // Default image
    return (
      productVariations.variations[0]?.variations[0]?.variationImageURL || ""
    );
  };

  const formatPrice = (price: number) => {
    return `R${price.toFixed(2)}`;
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="p-0 mx-auto w-[95%] sm:w-[90%] max-w-7xl h-[90vh] md:h-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b bg-white sticky top-0 z-10">
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
            <div className="lg:col-span-2 space-y-7">
              {/* Product Options Card */}
              <div className="bg-white rounded-lg border p-3 space-y-4">
                {/* Color Selection */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    Colour:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allColors.map(color => (
                      <button
                        key={color}
                        onClick={() => {
                          setSelectedColor(color);
                        }}
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
                          if (!isNaN(val)) {
                            setQuantity(Math.max(1, val));
                          }
                        }}
                        className="w-14 text-center"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-1.5 hover:bg-gray-50 transition-colors border-l"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-sm text-yellow-600">
                      {(() => {
                        // If both color and size are selected
                        if (selectedColor && selectedSize) {
                          return productVariations.variations
                            .find(v => v.color === selectedColor)
                            ?.variations.find(v => v.size === selectedSize)
                            ?.quantity;
                        }
                        // If only color is selected
                        if (selectedColor) {
                          const colorVariation =
                            productVariations.variations.find(
                              v => v.color === selectedColor
                            );
                          return colorVariation?.variations[0]?.quantity;
                        }
                        // If only size is selected
                        if (selectedSize) {
                          const firstVariationWithSize =
                            productVariations.variations
                              .find(colorVar =>
                                colorVar.variations.some(
                                  v => v.size === selectedSize
                                )
                              )
                              ?.variations.find(v => v.size === selectedSize);
                          return firstVariationWithSize?.quantity;
                        }
                        // Default to first variation
                        return productVariations.variations[0].variations[0]
                          .quantity;
                      })()}{" "}
                      in stock
                    </div>
                  </div>
                </div>
              </div>

              {/* Login Link */}
              <a
                href="/login"
                className="block w-full py-2.5 bg-red-600 text-white rounded-md
                hover:bg-red-700 transition-colors shadow-sm text-center"
              >
                Login to Add to Cart
              </a>
            </div>

            {/* Right Column - Pricing */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border p-3">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Price List
                </h3>
                <div className="grid grid-cols-2 gap-y-3.5 text-sm gap-x-2 ">
                  <div className="font-medium text-gray-700">Quantity</div>
                  <div className="font-medium text-gray-700">Price</div>
                  {product.dynamicPricing?.length > 0 ? (
                    [...product.dynamicPricing]
                      .sort((a, b) => parseInt(a.from) - parseInt(b.from))
                      .map(pricing => (
                        <React.Fragment key={`${pricing.from}-${pricing.to}`}>
                          <div className="text-gray-600">{`${pricing.from} - ${pricing.to}`}</div>
                          <div className="text-gray-600">
                            {formatPrice(parseFloat(pricing.amount))}
                          </div>
                        </React.Fragment>
                      ))
                  ) : (
                    <>
                      <div className="text-gray-600">1+</div>
                      <div className="text-gray-600">
                        {formatPrice(product.sellingPrice)}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductLookupModal;
