import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Product, ColorFilterProps } from "../_store/types";
import { SOLID_COLORS } from "../../headwear/_sidebar/_components/solidColors";
import { PATTERN_COLORS } from "../../headwear/_sidebar/_components/patternColors";

interface DynamicColorFilterProps extends ColorFilterProps {
  products: Product[];
}

interface ColorCount {
  color: string;
  count: number;
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

  return colorName; // Return the original color name if no mapping found
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

const ColorButton: React.FC<{
  colorData: ColorCount;
  isSelected: boolean;
  onChange: () => void;
  showCount?: boolean;
}> = ({ colorData, isSelected, onChange, showCount }) => {
  const colorValue = getColorValue(colorData.color);
  const isWhite =
    typeof colorValue === "string" &&
    (colorValue.toLowerCase() === "#ffffff" ||
      colorValue.toLowerCase() === "#fcfcfc");
  const backgroundValue = createColorBackground(colorValue, colorData.color);

  return (
    <div className="relative group">
      <button
        onClick={onChange}
        className={cn(
          "relative w-8 h-8 sm:w-7 sm:h-7 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1",
          isSelected && "ring-1 ring-blue-500 ring-offset-1"
        )}
        aria-label={`Select ${colorData.color} color`}
        title={colorData.color}
      >
        <div
          className={cn(
            "absolute inset-0 rounded",
            isWhite && "border border-gray-200"
          )}
          style={{ background: backgroundValue }}
        />
        {isSelected && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Check
              className={cn(
                "w-5 h-5 sm:w-4 sm:h-4",
                isWhite ? "text-black" : "text-white"
              )}
            />
          </div>
        )}
      </button>

      {!showCount && (
        <span
          className="absolute pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          role="tooltip"
        >
          {colorData.color} ({colorData.count})
        </span>
      )}
    </div>
  );
};

const DynamicColorFilter: React.FC<DynamicColorFilterProps> = ({
  selectedValue,
  onChange,
  products,
}) => {
  const pathname = usePathname() ?? "";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [colorCounts, setColorCounts] = useState<ColorCount[]>([]);

  useEffect(() => {
    const colorMap = new Map<string, number>();

    products.forEach(product => {
      const pathParts = pathname.split("/");
      const currentCollection = pathParts[pathParts.length - 1];
      const isInCurrentCollection =
        currentCollection === "all-in-apparel" ||
        product.category.some(
          cat =>
            cat.toLowerCase() === currentCollection.toLowerCase() ||
            cat.toLowerCase().includes(currentCollection.toLowerCase())
        );

      if (isInCurrentCollection) {
        product.variations.forEach(variation => {
          if (variation.color) {
            const normalizedColor = normalizeColorName(variation.color);
            colorMap.set(
              variation.color,
              (colorMap.get(variation.color) || 0) + 1
            );
          }
        });
      }
    });

    const sortedColors = Array.from(colorMap.entries())
      .map(([color, count]) => ({ color, count }))
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.color.localeCompare(b.color);
      });

    setColorCounts(sortedColors);
  }, [products, pathname]);

  // Show first 3 colors in sidebar
  const initialColors = colorCounts.slice(0, 20);
  const remainingCount = Math.max(0, colorCounts.length - 3);

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {initialColors.map(colorData => (
          <ColorButton
            key={colorData.color}
            colorData={colorData}
            isSelected={selectedValue.includes(colorData.color)}
            onChange={() => onChange(colorData.color)}
          />
        ))}
        {remainingCount > 0 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            +{remainingCount} more
          </button>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-11/12 max-w-lg mx-auto h-auto max-h-[85vh] p-0">
          <div className="relative border-b px-4 sm:px-6 py-4">
            <h2 className="text-base sm:text-lg font-semibold">Select Color</h2>
            {selectedValue.length > 0 && (
              <div className="mt-2 max-w-full overflow-hidden">
                <div className="grid grid-cols-4 gap-2 max-w-[200]">
                  {selectedValue.map(color => {
                    const option = colorCounts.find(c => c.color === color);
                    if (!option) return null;
                    return (
                      <div
                        key={color}
                        className="inline-flex items-center gap-1 bg-gray-100 rounded-md px-2 py-1 text-xs"
                      >
                        <div
                          className="w-3 h-3 rounded"
                          style={{
                            background: createColorBackground(
                              getColorValue(color),
                              color
                            ),
                          }}
                        />
                        <span className="max-w-[120px] truncate">{color}</span>
                        <button
                          onClick={() => onChange(color)}
                          className="ml-1 text-gray-500 hover:text-gray-700 flex-shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 hover:text-muted-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-y-auto max-h-[60vh] sm:max-h-[400px] p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-12 sm:gap-y-6">
              {colorCounts.map(colorData => (
                <div key={colorData.color} className="flex items-center gap-3">
                  <ColorButton
                    colorData={colorData}
                    isSelected={selectedValue.includes(colorData.color)}
                    onChange={() => onChange(colorData.color)}
                    showCount={true}
                  />
                  <span className="text-sm text-muted-foreground">
                    {colorData.color} ({colorData.count})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DynamicColorFilter;
