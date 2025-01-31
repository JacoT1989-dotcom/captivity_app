import React from "react";
import { Variation } from "@prisma/client";
import type {
  ColorSelectorProps,
  QuantitySelectorProps,
  SizeSelectorProps,
  ProductWithRelations,
} from "./types";

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedColor,
  variations,
  onColorSelect,
  productName,
}) => (
  <div className="mb-2">
    <p className="font-bold text-card-foreground mb-2">Color</p>
    <div className="flex flex-wrap -mx-1">
      {colors.map(color => (
        <button
          key={`${productName}-color-${color}`}
          className={`px-4 py-2 m-1 border rounded-md text-sm font-medium transition-colors
            ${
              selectedColor === color
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-card-foreground border-border hover:bg-accent hover:text-accent-foreground"
            }`}
          onClick={() => onColorSelect(color)}
          aria-label={`Select ${color} color`}
        >
          {color}
        </button>
      ))}
    </div>
  </div>
);

export const SizeSelector: React.FC<
  SizeSelectorProps & { productId: string }
> = ({ sizes, selectedSize, onSizeSelect, productId }) => {
  const getSizeOrder = (size: string): number => {
    // Normalize size to lowercase and remove extra spaces
    const normalizedSize = size.toLowerCase().trim();

    // Define exact size order mapping
    const sizeOrder: { [key: string]: number } = {
      xs: 10,
      small: 20,
      s: 20,
      medium: 30,
      m: 30,
      large: 40,
      l: 40,
      xl: 50,
      xxl: 60,
      "2xl": 60,
      xxxl: 70,
      "3xl": 70,
      xxxxl: 80,
      "4xl": 80,
      xxxxxl: 90,
      "5xl": 90,
    };

    // Check direct match first
    if (sizeOrder.hasOwnProperty(normalizedSize)) {
      return sizeOrder[normalizedSize];
    }

    // Check for numeric sizes (e.g., "32", "34")
    const numericSize = parseInt(normalizedSize);
    if (!isNaN(numericSize)) {
      return numericSize + 200; // Put numeric sizes after letter sizes
    }

    // Handle any remaining xl variants
    if (normalizedSize.endsWith("xl")) {
      const prefix = normalizedSize.replace("xl", "");
      const multiplier =
        prefix === "" ? 1 : prefix === "x" ? 2 : parseInt(prefix);
      return !isNaN(multiplier) ? 50 + (multiplier - 1) * 10 : 999;
    }

    return 999; // Unknown sizes go to the end
  };

  // Create an array of unique size objects with IDs, now sorted
  const uniqueSizes = Array.from(new Set(sizes))
    .sort((a, b) => {
      const orderA = getSizeOrder(a);
      const orderB = getSizeOrder(b);
      return orderA - orderB;
    })
    .map(size => ({
      id: `${productId}-${size}`,
      value: size,
    }));

  return (
    <div className="mb-4">
      <label
        htmlFor={`size-select-${productId}`}
        className="font-bold text-card-foreground block mb-2"
      >
        Size
      </label>
      <select
        id={`size-select-${productId}`}
        value={selectedSize || ""}
        onChange={onSizeSelect}
        className="w-full p-2 pl-4 bg-background hover:bg-muted text-foreground border border-input rounded-md focus:ring-2 focus:ring-ring"
      >
        <option value="">Select a size</option>
        {uniqueSizes.map(({ id, value }) => (
          <option key={id} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
};

export const QuantitySelector: React.FC<
  QuantitySelectorProps & { productId: string }
> = ({ quantity, maxQuantity, onQuantityChange, productId }) => (
  <div className="mb-4">
    <label
      htmlFor={`quantity-input-${productId}`}
      className="font-bold text-card-foreground block mb-2"
    >
      Quantity
    </label>
    <input
      id={`quantity-input-${productId}`}
      type="number"
      value={quantity}
      onChange={onQuantityChange}
      min={1}
      max={maxQuantity}
      className="w-full p-2 bg-background text-foreground border border-input rounded-md focus:ring-2 focus:ring-ring"
    />
  </div>
);

interface ProductSelectorsProps {
  product: ProductWithRelations;
  selectedColor?: string;
  selectedSize?: string;
  quantity: number;
  maxQuantity: number;
  onColorSelect: (color: string) => void;
  onSizeSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const ProductSelectors: React.FC<ProductSelectorsProps> = ({
  product,
  selectedColor,
  selectedSize,
  quantity,
  maxQuantity,
  onColorSelect,
  onSizeSelect,
  onQuantityChange,
  className = "",
}) => {
  // Extract unique colors and sizes from variations
  const colors = Array.from(
    new Set(product.variations.map(v => v.color))
  ).filter(Boolean) as string[];

  const sizes = Array.from(new Set(product.variations.map(v => v.size))).filter(
    Boolean
  ) as string[];

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <ColorSelector
        colors={colors}
        selectedColor={selectedColor}
        variations={product.variations}
        onColorSelect={onColorSelect}
        productName={product.productName}
      />
      <SizeSelector
        sizes={sizes}
        selectedSize={selectedSize}
        onSizeSelect={onSizeSelect}
        productId={product.id}
      />
      <QuantitySelector
        quantity={quantity}
        maxQuantity={maxQuantity}
        onQuantityChange={onQuantityChange}
        productId={product.id}
      />
    </div>
  );
};

export default ProductSelectors;
