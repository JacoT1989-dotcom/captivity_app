import React from "react";
import {
  VendorColorSelectorProps,
  VendorQuantitySelectorProps,
  VendorSizeSelectorProps,
} from "./types";

export const VendorColorSelector: React.FC<VendorColorSelectorProps> = ({
  colors,
  selectedColor,
  onColorSelect,
}) => (
  <div className="mb-2">
    <p className="font-bold text-card-foreground mb-2">Color</p>
    <div className="flex flex-wrap -mx-1">
      {colors.map(color => (
        <button
          key={color}
          className={`px-4 py-2 m-1 border rounded-md text-sm font-medium transition-colors
            ${
              selectedColor === color
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-card-foreground border-border hover:bg-accent hover:text-accent-foreground"
            }`}
          onClick={() => onColorSelect(color)}
          title={`Select ${color} color variant`}
        >
          {color}
        </button>
      ))}
    </div>
  </div>
);

export const VendorSizeSelector: React.FC<VendorSizeSelectorProps> = ({
  sizes,
  selectedSize,
  onSizeSelect,
}) => (
  <div className="mb-4">
    <label
      htmlFor="size-select"
      className="font-bold text-card-foreground block mb-2"
    >
      Size
    </label>
    <select
      id="size-select"
      value={selectedSize || ""}
      onChange={onSizeSelect}
      className="w-full p-2 bg-background text-foreground border border-input rounded-md focus:ring-2 focus:ring-ring"
      aria-label="Select product size"
    >
      <option value="">Select a size</option>
      {sizes.map(size => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </select>
  </div>
);

export const VendorQuantitySelector: React.FC<VendorQuantitySelectorProps> = ({
  quantity,
  maxQuantity,
  onQuantityChange,
}) => (
  <div className="mb-4">
    <label
      htmlFor="quantity-input"
      className="font-bold text-card-foreground block mb-2"
    >
      Stock Quantity
    </label>
    <div className="flex items-center space-x-2">
      <input
        id="quantity-input"
        type="number"
        value={quantity}
        onChange={onQuantityChange}
        min={1}
        max={maxQuantity}
        className="w-full p-2 bg-background text-foreground border border-input rounded-md focus:ring-2 focus:ring-ring"
        aria-label="Set product quantity"
      />
      <span className="text-sm text-muted-foreground">Max: {maxQuantity}</span>
    </div>
    {maxQuantity < 10 && (
      <p className="text-sm text-destructive mt-1">
        Low stock warning: {maxQuantity} items remaining
      </p>
    )}
  </div>
);
