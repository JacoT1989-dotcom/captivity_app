import { cn } from "@/lib/utils";
import { PATTERN_COLORS } from "./_sidebar/_components/patternColors";
import { SOLID_COLORS } from "./_sidebar/_components/solidColors";

type ColorNameNormalizer = (name: string) => string;

// Create an interface if you need to use this as part of a larger type system.
interface ColorNormalization {
  normalizeColorName: ColorNameNormalizer;
}

// The function implementation with the type
export const normalizeColorName: ColorNameNormalizer = name => {
  return name
    .toLowerCase() //Converts the entire string to lowercase
    .replace(/[\s_-]/g, "") // Removes all spaces, underscores, and hyphens
    .replace(/\//g, "") // Removes any forward slashes
    .replace(/[()0-9]/g, "") // Removes any parentheses and numbers
    .replace(/flag/i, "") // Removes the word "flag" (case insensitive)
    .trim(); // Removes any leading or trailing whitespace
};

export const getColorValue = (colorName: string): string | string[] => {
  const normalizedSearchName = normalizeColorName(colorName);

  const solidColor = SOLID_COLORS.find(
    color => normalizeColorName(color.name) === normalizedSearchName
  );
  if (solidColor) return solidColor.hex;

  const patternColor = PATTERN_COLORS.find(
    color => normalizeColorName(color.name) === normalizedSearchName
  );
  if (patternColor) return patternColor.colors;

  return "#808080";
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

export const ColorDisplay = ({
  color,
  isSelected,
  onClick,
}: {
  color: string;
  isSelected?: boolean;
  onClick?: () => void;
}) => {
  const colorValue = getColorValue(color);
  const backgroundValue = createColorBackground(colorValue, color);

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={cn(
          "w-8 h-8 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500",
          isSelected && "ring-2 ring-red-500 ring-offset-2"
        )}
        title={color}
      >
        <div
          className={cn(
            "w-full h-full rounded-md border",
            typeof colorValue === "string" &&
              colorValue.toLowerCase() === "#ffffff" &&
              "border-gray-200"
          )}
          style={{ background: backgroundValue }}
        />
      </button>
      <div className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-900 text-white rounded-md whitespace-nowrap">
        {color}
      </div>
    </div>
  );
};
