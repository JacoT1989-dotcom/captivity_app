import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SOLID_COLORS } from "../headwear/_sidebar/_components/solidColors";
import { PATTERN_COLORS } from "../headwear/_sidebar/_components/patternColors";

const normalizeColorName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[\s_-]/g, "")
    .replace(/\//g, "")
    .replace(/[()0-9]/g, "")
    .replace(/flag/i, "")
    .trim();
};

const findColor = (colorName: string) => {
  const normalizedName = normalizeColorName(colorName);

  // First check solid colors
  const solidColor = SOLID_COLORS.find(
    color => normalizeColorName(color.name) === normalizedName
  );
  if (solidColor) return { type: "solid", value: solidColor.hex };

  // Then check pattern colors
  const patternColor = PATTERN_COLORS.find(
    color => normalizeColorName(color.name) === normalizedName
  );
  if (patternColor) return { type: "pattern", value: patternColor.colors };

  // Fallback to the original color name as hex
  return { type: "solid", value: colorName };
};

const createColorBackground = (
  colorInfo: { type: string; value: string | string[] },
  colorName: string
): string => {
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
  const colorInfo = findColor(color);
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

interface ColorPaletteProps {
  colors: string[];
  selectedColor?: string;
  onColorSelect: (color: string) => void;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({
  colors,
  selectedColor,
  onColorSelect,
  size = "md",
  showTooltip = true,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map(color => (
        <ColorDisplay
          key={color}
          color={color}
          isSelected={selectedColor === color}
          onClick={() => onColorSelect(color)}
          size={size}
          showTooltip={showTooltip}
        />
      ))}
    </div>
  );
};

export {
  ColorDisplay,
  ColorPalette,
  normalizeColorName,
  findColor,
  createColorBackground,
};
