import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Product as StoreProduct } from "./_store/types";
import { SOLID_COLORS } from "./_sidebar/_components/solidColors";
import { PATTERN_COLORS } from "./_sidebar/_components/patternColors";

interface ProductDetailsDialogProps {
  product: StoreProduct | null;
  onClose: () => void;
}

const normalizeColorName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[\s_-]/g, "")
    .replace(/\//g, "")
    .replace(/[()0-9]/g, "")
    .replace(/flag/i, "")
    .trim();
};

const getColorValue = (colorName: string): string | string[] => {
  const normalizedSearchName = normalizeColorName(colorName);

  const solidColor = SOLID_COLORS.find(
    color => normalizeColorName(color.name) === normalizedSearchName
  );
  if (solidColor) return solidColor.hex;

  const patternColor = PATTERN_COLORS.find(
    color => normalizeColorName(color.name) === normalizedSearchName
  );
  if (patternColor) return patternColor.colors;

  return "#808080"; // Default color
};

const createColorBackground = (
  colorValue: string | string[],
  optionLabel?: string
): string => {
  if (Array.isArray(colorValue)) {
    if (
      colorValue.length === 6 &&
      optionLabel &&
      normalizeColorName(optionLabel).includes("southafrica")
    ) {
      return `linear-gradient(to bottom,
        ${colorValue[2]} 0%, ${colorValue[2]} 16.66%,
        ${colorValue[0]} 16.66%, ${colorValue[0]} 33.32%,
        ${colorValue[1]} 33.32%, ${colorValue[1]} 49.98%,
        ${colorValue[4]} 49.98%, ${colorValue[4]} 66.64%,
        ${colorValue[3]} 66.64%, ${colorValue[3]} 83.3%,
        ${colorValue[5]} 83.3%, ${colorValue[5]} 100%
      )`;
    } else if (colorValue.length === 2) {
      return `linear-gradient(45deg, ${colorValue[0]} 50%, ${colorValue[1]} 50%)`;
    } else if (colorValue.length === 3) {
      return `linear-gradient(45deg, 
        ${colorValue[0]} 0%, ${colorValue[0]} 33%,
        ${colorValue[1]} 33%, ${colorValue[1]} 66%,
        ${colorValue[2]} 66%, ${colorValue[2]} 100%
      )`;
    } else {
      const stripeWidth = 100 / colorValue.length;
      return `linear-gradient(45deg, ${colorValue
        .map(
          (color, index) =>
            `${color} ${index * stripeWidth}%, ${color} ${
              (index + 1) * stripeWidth
            }%`
        )
        .join(", ")})`;
    }
  }
  return colorValue;
};

const ColorSwatch: React.FC<{
  color: string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ color, isSelected, onClick }) => {
  const colorValue = getColorValue(color);
  const isWhite =
    typeof colorValue === "string" &&
    (colorValue.toLowerCase() === "#ffffff" ||
      colorValue.toLowerCase() === "#fcfcfc");
  const backgroundValue = createColorBackground(colorValue, color);

  return (
    <button
      onClick={onClick}
      className={`relative w-8 h-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform ${
        isSelected
          ? "ring-2 ring-blue-500 ring-offset-2 scale-110"
          : "hover:scale-105"
      }`}
      title={color}
    >
      <div
        className={`absolute inset-0 rounded-md ${
          isWhite ? "border border-gray-200" : ""
        }`}
        style={{ background: backgroundValue }}
      />
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className={`w-4 h-4 ${isWhite ? "text-black" : "text-white"}`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
};

const ProductDetailsDialog = ({
  product,
  onClose,
}: ProductDetailsDialogProps) => {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [currentImage, setCurrentImage] = useState<string>("");

  useEffect(() => {
    if (product) {
      const firstColor = product.variations[0]?.color;
      setSelectedColor(firstColor || "");
    }
  }, [product]);

  useEffect(() => {
    if (product && selectedColor) {
      const variation = product.variations.find(v => v.color === selectedColor);
      if (variation?.variationImageURL) {
        setCurrentImage(variation.variationImageURL);
      } else if (product.featuredImage?.large) {
        setCurrentImage(product.featuredImage.large);
      }
    }
  }, [product, selectedColor]);

  if (!product) return null;

  // const formatPrice = (price: number) => {
  //   return new Intl.NumberFormat("en-ZA", {
  //     style: "currency",
  //     currency: "ZAR",
  //   }).format(price);
  // };

  const getTotalStock = (variations: StoreProduct["variations"]) => {
    return variations.reduce(
      (total, variation) => total + variation.quantity,
      0
    );
  };

  const availableColors = Array.from(
    new Set(product.variations.map(v => v.color))
  );

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product.productName}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image section */}
          <div className="aspect-square relative rounded-lg overflow-hidden">
            {currentImage ? (
              <Image
                src={currentImage}
                alt={product.productName}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                <span className="text-6xl font-bold text-muted-foreground/50">
                  {product.productName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* <p className="text-2xl font-bold">
              {formatPrice(product.sellingPrice)}
            </p> */}

            <div className="space-y-2">
              <h4 className="font-semibold mb-2">Colors:</h4>
              <div className="flex flex-wrap gap-3">
                {availableColors.map(color => (
                  <ColorSwatch
                    key={color}
                    color={color}
                    isSelected={selectedColor === color}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>

            <div dangerouslySetInnerHTML={{ __html: product.description }} />

            {/* <div>
              <h4 className="font-semibold mb-2">Stock Status:</h4>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  getTotalStock(product.variations) > 0
                    ? "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-100"
                    : "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-100"
                }`}
              >
                {getTotalStock(product.variations) > 0
                  ? `In Stock (${getTotalStock(product.variations)} units)`
                  : "Out of Stock"}
              </span>
            </div> */}

            <Button className="w-full" asChild>
              <a href={`/products/${product.id}`}>View Full Details</a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;
