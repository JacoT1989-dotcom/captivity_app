import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "./_store/types";
import { SOLID_COLORS } from "../headwear/_sidebar/_components/solidColors";
import { PATTERN_COLORS } from "../headwear/_sidebar/_components/patternColors";

// Utility functions
const normalizeColorName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[\s_-]/g, "")
    .replace(/\//g, "")
    .replace(/[()0-9]/g, "")
    .replace(/flag/i, "")
    .trim();
};

const getColorValue = (colorName: string) => {
  const normalizedName = normalizeColorName(colorName);

  const solidColor = SOLID_COLORS.find(
    color => normalizeColorName(color.name) === normalizedName
  );
  if (solidColor) return { type: "solid", value: solidColor.hex };

  const patternColor = PATTERN_COLORS.find(
    color => normalizeColorName(color.name) === normalizedName
  );
  if (patternColor) return { type: "pattern", value: patternColor.colors };

  return { type: "solid", value: colorName };
};

const createColorBackground = (
  colorInfo: { type: string; value: string | string[] },
  colorName: string
) => {
  if (colorInfo.type === "solid") {
    return colorInfo.value as string;
  }

  const colors = colorInfo.value as string[];
  const normalizedName = normalizeColorName(colorName);

  if (colors.length === 6 && normalizedName.includes("southafrica")) {
    return `linear-gradient(to bottom,
      ${colors[2]} 0%, ${colors[2]} 16.66%,
      ${colors[0]} 16.66%, ${colors[0]} 33.32%,
      ${colors[1]} 33.32%, ${colors[1]} 49.98%,
      ${colors[4]} 49.98%, ${colors[4]} 66.64%,
      ${colors[3]} 66.64%, ${colors[3]} 83.3%,
      ${colors[5]} 83.3%, ${colors[5]} 100%
    )`;
  }

  if (colors.length === 2) {
    return `linear-gradient(45deg, ${colors[0]} 50%, ${colors[1]} 50%)`;
  }

  if (colors.length === 3) {
    return `linear-gradient(45deg, 
      ${colors[0]} 0%, ${colors[0]} 33%,
      ${colors[1]} 33%, ${colors[1]} 66%,
      ${colors[2]} 66%, ${colors[2]} 100%
    )`;
  }

  const stripeWidth = 100 / colors.length;
  return `linear-gradient(45deg, ${colors
    .map(
      (color, index) =>
        `${color} ${index * stripeWidth}%, ${color} ${(index + 1) * stripeWidth}%`
    )
    .join(", ")})`;
};

// ColorDisplay Component
interface ColorDisplayProps {
  color: string;
  isSelected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
}

const ColorDisplay: React.FC<ColorDisplayProps> = ({
  color,
  isSelected = false,
  onClick,
  size = "md",
  showTooltip = true,
}) => {
  const colorInfo = getColorValue(color);
  const backgroundValue = createColorBackground(colorInfo, color);

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={cn(
          sizeClasses[size],
          "rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200",
          isSelected && "ring-2 ring-red-500 ring-offset-2"
        )}
        title={color}
      >
        <div
          className={cn(
            "w-full h-full rounded-md border",
            colorInfo.type === "solid" &&
              (colorInfo.value as string).toLowerCase() === "#ffffff" &&
              "border-gray-200"
          )}
          style={{ background: backgroundValue }}
        />
      </button>
      {showTooltip && (
        <div className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-900 text-white rounded-md whitespace-nowrap z-50">
          {color}
        </div>
      )}
    </div>
  );
};

// Product Details Dialog
interface ProductDetailsDialogProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailsDialog: React.FC<ProductDetailsDialogProps> = ({
  product,
  onClose,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [currentImage, setCurrentImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  useEffect(() => {
    if (product) {
      const firstVariation = product.variations[0];
      if (firstVariation) {
        setSelectedColor(firstVariation.color);
        setSelectedSize(firstVariation.size);
      }
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

  const availableColors = Array.from(
    new Set(product.variations.map(v => v.color))
  );
  // const availableSizes = Array.from(
  //   new Set(product.variations.map(v => v.size))
  // ).sort();

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {product.productName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            {/* <div>
              <p className="text-2xl font-bold">
                {formatPrice(product.sellingPrice)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {product.category.join(" / ")}
              </p>
            </div> */}

            <div className="space-y-2">
              <h4 className="font-semibold">Colors:</h4>
              <div className="flex flex-wrap gap-2">
                {availableColors.map(color => (
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

            <div dangerouslySetInnerHTML={{ __html: product.description }} />
            {/* 
            <div className="space-y-2">
              <h4 className="font-semibold">Sizes:</h4>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "px-3 py-1.5 rounded-md border transition-colors",
                      selectedSize === size
                        ? "bg-red-600 text-white border-red-600"
                        : "hover:bg-gray-50"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div> */}

            <div className="pt-4">
              <Button asChild className="w-full">
                <Link href={`/products/${product.id}`}>View Full Details</Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
