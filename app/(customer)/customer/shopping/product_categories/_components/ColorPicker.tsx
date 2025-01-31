import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { COLOR_MAPPINGS } from "./ColorMapping";
//*this color filter is used in the detail page layout
interface ColorValue {
  colors: string[];
  pattern: string;
}

interface ColorPickerProps {
  colors: string[];
  selectedColor: string | null;
  onColorChange: (color: string | null) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  selectedColor,
  onColorChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const isValidColor = (strColor: string): boolean => {
    // Create a temporary element to test if the color is valid
    const elem = document.createElement("div");
    elem.style.color = strColor;
    return elem.style.color !== "";
  };

  const normalizeColorName = (colorName: string): string => {
    return colorName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");
  };

  const getColorValue = (colorName: string): string | ColorValue => {
    const normalizedName = normalizeColorName(colorName);

    // First check if it's in our COLOR_MAPPINGS
    if (COLOR_MAPPINGS[normalizedName]) {
      return COLOR_MAPPINGS[normalizedName];
    }

    // Try direct color name (for standard CSS colors)
    if (isValidColor(colorName)) {
      return colorName;
    }

    // Try with spaces replaced by dashes
    const dashColor = colorName.replace(/_/g, "-");
    if (isValidColor(dashColor)) {
      return dashColor;
    }

    // Try as a hex color
    if (colorName.match(/^#[0-9A-Fa-f]{6}$/)) {
      return colorName;
    }

    // If nothing else works, return the original color name
    return colorName;
  };

  const createMultiColorGradient = (colors: string[]): React.CSSProperties => {
    if (colors.length === 1) {
      return { backgroundColor: colors[0] };
    }

    // Create conic gradient segments
    const segmentSize = 360 / colors.length;
    const gradientStops = colors.map((color, index) => {
      const startAngle = index * segmentSize;
      const endAngle = (index + 1) * segmentSize;
      return `${color} ${startAngle}deg ${endAngle}deg`;
    });

    return {
      background: `conic-gradient(${gradientStops.join(", ")})`,
      border: "2px solid #e5e7eb",
    };
  };

  const getSwatchStyle = (colorName: string): React.CSSProperties => {
    const colorValue = getColorValue(colorName);

    if (typeof colorValue === "string") {
      return { backgroundColor: colorValue };
    }

    if (typeof colorValue === "object") {
      return createMultiColorGradient(colorValue.colors);
    }

    return { backgroundColor: colorName };
  };

  const ColorSwatch: React.FC<{ colorName: string; isSelected: boolean }> = ({
    colorName,
    isSelected,
  }) => {
    const style = getSwatchStyle(colorName);

    return (
      <div
        className={`h-6 w-6 rounded-full transition-all duration-200 hover:scale-110
          ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
        style={style}
      />
    );
  };

  const formatColorName = (colorName: string): string => {
    return colorName
      .split(/[_\/-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const getColorDisplayName = (colorName: string | null): string => {
    if (!colorName) return "Filter by color";
    return `Filter by color: ${formatColorName(colorName)}`;
  };

  // Sort colors to put multi-colored options at the end
  const sortedColors = [...colors].sort((a, b) => {
    const aValue = getColorValue(a);
    const bValue = getColorValue(b);
    const aIsMultiColor = typeof aValue === "object";
    const bIsMultiColor = typeof bValue === "object";

    if (aIsMultiColor && !bIsMultiColor) return 1;
    if (!aIsMultiColor && bIsMultiColor) return -1;
    return 0;
  });

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="mb-4 flex w-full items-center justify-between bg-white px-4 py-2  "
        onClick={toggleDropdown}
      >
        <div className="flex items-center gap-2">
          {selectedColor && (
            <ColorSwatch colorName={selectedColor} isSelected={true} />
          )}
          <span className="text-sm font-medium">
            {getColorDisplayName(selectedColor)}
          </span>
        </div>
      </Button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full rounded-lg bg-white p-2 shadow-2xl min-w-[300px] max-h-[300px] overflow-y-scroll">
          <div className="mb-4 flex flex-wrap gap-3">
            <button
              key="deselect"
              onClick={() => {
                onColorChange(null);
                setIsOpen(false);
              }}
              className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-sm font-bold text-gray-600 hover:bg-gray-50"
              title="Clear selection"
            >
              ×
            </button>
            {sortedColors.map(color => (
              <button
                key={color}
                onClick={() => {
                  onColorChange(color);
                  setIsOpen(false);
                }}
                className="group relative h-6 w-6"
                title={formatColorName(color)}
              >
                <ColorSwatch
                  colorName={color}
                  isSelected={selectedColor === color}
                />
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Colors shown are approximations. Actual colors may vary.
          </p>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
