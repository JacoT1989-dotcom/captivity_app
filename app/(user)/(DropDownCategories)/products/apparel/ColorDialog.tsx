import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

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

const ColorDialog: React.FC<ColorDialogProps> = ({
  isOpen,
  onClose,
  selectedProduct,
  groupedVariations,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

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

  const selectedVariation = selectedColorVariations.find(
    v => v.size === selectedSize
  );

  const getCurrentImage = () => {
    if (selectedColor) {
      // Get first variation of selected color
      const colorVariation = productData.variations.find(
        v => v.color === selectedColor
      );
      // If we have a specific size selected, show that variation
      if (selectedSize) {
        const sizeVariation = colorVariation?.variations.find(
          v => v.size === selectedSize
        );
        if (sizeVariation) {
          return sizeVariation.variationImageURL;
        }
      }
      // Otherwise show the first variation of the selected color
      if (colorVariation?.variations[0]) {
        return colorVariation.variations[0].variationImageURL;
      }
    }
    // Fallback to first available image
    return productData.variations[0]?.variations[0]?.variationImageURL || "";
  };

  const formatPrice = (price: number) => {
    return `R${price.toFixed(2)}`;
  };

  const getCurrentPriceTier = () => {
    if (!productData.product?.dynamicPricing || quantity <= 0) return null;

    return productData.product.dynamicPricing
      .filter(
        pricing =>
          quantity >= parseInt(pricing.from) && quantity <= parseInt(pricing.to)
      )
      .sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount))[0];
  };

  const getCurrentPrice = () => {
    const currentTier = getCurrentPriceTier();
    return currentTier
      ? parseFloat(currentTier.amount)
      : productData.product?.sellingPrice || 0;
  };

  const handleAddToBasket = () => {
    if (!selectedVariation || !productData.product) return;

    const currentPrice = getCurrentPrice();

    // Add to basket logic here
    console.log({
      productId: selectedProduct,
      variationId: selectedVariation.id,
      quantity,
      price: currentPrice,
      color: selectedColor,
      size: selectedSize,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[900px] p-0">
        <div className="flex justify-end p-2">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 pt-0">
          {/* Left Column - Image */}
          <div>
            <div className="aspect-square relative rounded-md overflow-hidden bg-gray-100">
              <Image
                src={getCurrentImage()}
                alt={productData.product?.productName || "Product"}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-red-600">
              {productData.product?.productName}
            </h2>

            {/* Pricing Table */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-gray-600">
                <div>Quantity</div>
                <div>Price</div>
              </div>
              <div className="space-y-2">
                {productData.product?.dynamicPricing
                  ?.sort((a, b) => parseInt(a.from) - parseInt(b.from))
                  .map(pricing => (
                    <div
                      key={`${pricing.from}-${pricing.to}`}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>{`${pricing.from} - ${pricing.to}`}</div>
                      <div>{formatPrice(parseFloat(pricing.amount))}</div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-4 border rounded-md p-4">
              {/* Color Selection */}
              <div>
                <label className="block text-sm mb-2">Colour:</label>
                <div className="flex gap-2">
                  {allColors.map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        setSelectedSize("");
                      }}
                      className={`w-8 h-8 rounded-sm border transition-all ${
                        selectedColor === color
                          ? "ring-2 ring-black ring-offset-2"
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
                <label className="block text-sm mb-2">Size:</label>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map(size => {
                    const isAvailable = selectedColor
                      ? selectedColorVariations.some(
                          v => v.size === size && v.quantity > 0
                        )
                      : true;

                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[48px] px-3 py-1.5 text-sm border transition-colors ${
                          selectedSize === size
                            ? "bg-black text-white"
                            : isAvailable
                              ? "hover:bg-gray-100"
                              : "opacity-50 cursor-not-allowed"
                        }`}
                        disabled={!isAvailable}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <div className="flex border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 hover:bg-gray-100 transition-colors"
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
                    className="w-12 text-center border-x"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>

                {selectedVariation && (
                  <div className="text-sm text-yellow-600">
                    {selectedVariation.quantity} in stock
                  </div>
                )}
              </div>
            </div>

            {/* Add to Basket */}
            <button
              onClick={handleAddToBasket}
              className="w-full py-3 bg-red-600 text-white rounded-md 
                hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors"
              disabled={!selectedColor || !selectedSize}
            >
              ADD TO BASKET
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ColorDialog;
