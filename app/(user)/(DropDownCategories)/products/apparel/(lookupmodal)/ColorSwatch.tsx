// ColorSwatch.tsx
import React from "react";
import { Check } from "lucide-react";
import { SOLID_COLORS } from "../../headwear/_sidebar/_components/solidColors";
import { PATTERN_COLORS } from "../../headwear/_sidebar/_components/patternColors";

interface ColorSwatchProps {
  color: string;
  isSelected: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  showCheckmark?: boolean;
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

const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color,
  isSelected,
  onClick,
  showCheckmark = true,
}) => {
  const colorValue = getColorValue(color);
  const isWhite =
    typeof colorValue === "string" &&
    (colorValue.toLowerCase() === "#ffffff" ||
      colorValue.toLowerCase() === "#fcfcfc");
  const backgroundValue = createColorBackground(colorValue, color);

  return (
    <button
      onClick={onClick}
      className={`relative w-8 h-8 rounded-md focus:outline-none focus:ring-2 
        focus:ring-blue-500 focus:ring-offset-1 transition-all ${
          isSelected ? "ring-2 ring-red-600 ring-offset-1" : "hover:opacity-80"
        }`}
      title={color}
    >
      <div
        className={`absolute inset-0 rounded-md ${
          isWhite ? "border border-gray-200" : ""
        }`}
        style={{ background: backgroundValue }}
      />
      {isSelected && showCheckmark && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Check
            className={`w-4 h-4 ${isWhite ? "text-black" : "text-white"}`}
          />
        </div>
      )}
    </button>
  );
};

export default ColorSwatch;
