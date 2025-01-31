import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FilterOption } from "../_store/types";
import { SOLID_COLORS } from "../../headwear/_sidebar/_components/solidColors";
import { PATTERN_COLORS } from "../../headwear/_sidebar/_components/patternColors";

interface ColorFilterProps {
  options: FilterOption[];
  selectedValue: string[];
  onChange: (value: string) => void;
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

const ColorButton: React.FC<{
  option: FilterOption;
  isSelected: boolean;
  onChange: () => void;
  showLabel?: boolean;
}> = ({ option, isSelected, onChange, showLabel }) => {
  const colorValue = getColorValue(option.value);
  const isWhite =
    typeof colorValue === "string" &&
    (colorValue.toLowerCase() === "#ffffff" ||
      colorValue.toLowerCase() === "#fcfcfc");
  const backgroundValue = createColorBackground(colorValue, option.label);

  return (
    <div className={cn("relative group", showLabel && "mb-2")}>
      <button
        onClick={onChange}
        className={cn(
          "relative w-8 h-8 sm:w-7 sm:h-7 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1",
          isSelected && "ring-1 ring-blue-500 ring-offset-1"
        )}
        aria-label={`Select ${option.label} color`}
        title={option.label}
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

      {!showLabel && (
        <span
          className="absolute pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          role="tooltip"
        >
          {option.label}
        </span>
      )}

      {showLabel && (
        <span className="block text-xs text-center mt-1 text-muted-foreground">
          {option.label}
        </span>
      )}
    </div>
  );
};

export const ColorFilter: React.FC<ColorFilterProps> = ({
  options,
  selectedValue,
  onChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Show first 3 colors in sidebar
  const initialColors = options.slice(0, 3);
  const remainingCount = Math.max(0, options.length - 3);

  const handleColorChange = (value: string) => {
    const newSelection = selectedValue.includes(value)
      ? selectedValue.filter(color => color !== value)
      : [...selectedValue, value];

    onChange(value);
  };

  return (
    <>
      <div className="flex items-center gap-4">
        {initialColors.map(option => (
          <ColorButton
            key={option.value}
            option={option}
            isSelected={selectedValue.includes(option.value)}
            onChange={() => handleColorChange(option.value)}
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
            <DialogTitle className="text-base sm:text-lg font-semibold">
              Select Colors
            </DialogTitle>
            {selectedValue.length > 0 && (
              <div className="mt-2 max-w-full overflow-hidden">
                <div className="flex flex-wrap gap-2 max-w-full">
                  {selectedValue.map(color => {
                    const option = options.find(opt => opt.value === color);
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
                              option.label
                            ),
                          }}
                        />
                        <span className="max-w-[120px] truncate">
                          {option.label}
                        </span>
                        <button
                          onClick={() => handleColorChange(color)}
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
              {options.map(option => (
                <div key={option.value} className="flex items-center gap-3">
                  <ColorButton
                    option={option}
                    isSelected={selectedValue.includes(option.value)}
                    onChange={() => handleColorChange(option.value)}
                  />
                  <span className="text-sm text-muted-foreground">
                    {option.label}
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

export default ColorFilter;

//
