import React from "react";
import { cn } from "@/lib/utils";
import { ColorDisplay } from "./ColorBackground";

interface ProductVariation {
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
  variations: ProductVariation[];
}

interface ProductVariations {
  variations: ColorVariation[];
}

interface ProductSelectionControlsProps {
  productVariations: ProductVariations;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  currentVariation: ProductVariation | null;
}

const ProductSelectionControls: React.FC<ProductSelectionControlsProps> = ({
  productVariations,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  currentVariation,
}) => {
  const allColors = productVariations.variations.map(v => v.color);
  const selectedColorVariations =
    productVariations.variations.find(v => v.color === selectedColor)
      ?.variations || [];

  const sizeOrder: { [key: string]: number } = {
    XXS: 0,
    XS: 1,
    Small: 2,
    Medium: 3,
    Large: 4,
    XL: 5,
    "2XL": 6,
    "3XL": 7,
    "4XL": 8,
    "5XL": 9,
  };

  const sortSizes = (a: string, b: string) => {
    return (sizeOrder[a] ?? 999) - (sizeOrder[b] ?? 999);
  };

  const allSizes = Array.from(
    new Set(
      productVariations.variations.flatMap(colorVar =>
        colorVar.variations.map(v => v.size)
      )
    )
  ).sort(sortSizes);
  // const allSizes = Array.from(
  //   new Set(
  //     productVariations.variations.flatMap(colorVar =>
  //       colorVar.variations.map(v => v.size)
  //     )
  //   )
  // ).sort((a, b) => {
  //   const numA = parseFloat(a);
  //   const numB = parseFloat(b);
  //   if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
  //   return a.localeCompare(b);
  // });

  return (
    <div className="bg-white rounded-lg border p-4 space-y-6">
      <div>
        <label className="block text-sm text-gray-600 mb-2">Colour:</label>
        <div className="flex flex-wrap gap-2">
          {allColors.map(color => (
            <ColorDisplay
              key={color}
              color={color}
              isSelected={selectedColor === color}
              onClick={() => {
                setSelectedColor(color);
                const colorVariation = productVariations.variations.find(
                  v => v.color === color
                );
                const firstAvailableSize = colorVariation?.variations.find(
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

      <div>
        <label className="block text-sm text-gray-600 mb-2">Size:</label>
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

      <div>
        <label className="block text-sm text-gray-600 mb-2">Quantity:</label>
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
                    Math.min(currentVariation.quantity, Math.max(1, val))
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
                !currentVariation || quantity >= currentVariation.quantity
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
  );
};

export default ProductSelectionControls;
