import React, { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { useFilterStore } from "../../_store/useFilterStore";

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
  const [isMounted, setIsMounted] = useState(false);
  const getColorValue = useFilterStore(state => state.getColorValue);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    useFilterStore.getState().setPageSource("detail");
    return () => {
      useFilterStore.getState().setPageSource(null);
    };
  }, []);

  const getSwatchStyle = (colorName: string): React.CSSProperties => {
    const colorValue = getColorValue(colorName);

    if (typeof colorValue === "string") {
      return { backgroundColor: colorValue };
    }

    if (typeof colorValue === "object" && colorValue.colors) {
      if (colorValue.colors.length === 1) {
        return { backgroundColor: colorValue.colors[0] };
      }

      const segmentSize = 360 / colorValue.colors.length;
      const gradientStops = colorValue.colors.map((color, index) => {
        const startAngle = index * segmentSize;
        const endAngle = (index + 1) * segmentSize;
        return `${color} ${startAngle}deg ${endAngle}deg`;
      });

      return {
        background: `conic-gradient(${gradientStops.join(", ")})`,
        border: "1px solid #e5e7eb",
      };
    }

    // Fallback
    return { backgroundColor: "#e5e7eb" };
  };

  // Sort colors: put multi-colors at the end
  const sortedColors = [...colors].sort((a, b) => {
    const aValue = getColorValue(a);
    const bValue = getColorValue(b);
    const aIsMulti = typeof aValue === "object";
    const bIsMulti = typeof bValue === "object";

    if (aIsMulti !== bIsMulti) {
      return aIsMulti ? 1 : -1;
    }
    return a.localeCompare(b);
  });

  if (!isMounted) {
    return <div className="h-12 bg-muted animate-pulse rounded-md" />;
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Color</label>
      <div className="grid grid-cols-8 gap-1">
        {sortedColors.map(color => {
          const isSelected = color === selectedColor;
          const colorValue = getColorValue(color);
          const isMultiColor = typeof colorValue === "object";

          return (
            <button
              key={color}
              onClick={() => onColorChange(color)}
              className={cn(
                "relative w-8 h-8 rounded-full transition-all duration-200",
                "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary",
                isSelected ? "ring-2 ring-primary ring-offset-2" : ""
              )}
              title={color
                .split("_")
                .map(
                  word =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ")}
              style={getSwatchStyle(color)}
            >
              {isSelected && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorPicker;
