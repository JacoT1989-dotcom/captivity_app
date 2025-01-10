import React from "react";
import { cn } from "@/lib/utils";
import { FilterOption } from "../_store/types";
import { Check } from "lucide-react";

interface ColorFilterProps {
  options: FilterOption[];
  selectedValue: string[];
  onChange: (value: string) => void;
}

const colorMap: { [key: string]: string } = {
  Black: "#000000",
  White: "#FFFFFF",
  Navy: "#000080",
  Grey: "#808080",
  Red: "#FF0000",
  Green: "#008000",
  Blue: "#0000FF",
  Yellow: "#FFFF00",
  Purple: "#800080",
  Orange: "#FFA500",
};

export const ColorFilter: React.FC<ColorFilterProps> = ({
  options,
  selectedValue,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-5">
      {options.map(option => {
        const isSelected = selectedValue.includes(option.value);
        const bgColor = colorMap[option.value] || "#000000";
        const isWhite = option.value === "White";

        return (
          <div key={option.value} className="relative group">
            <button
              onClick={() => onChange(option.value)}
              className={cn(
                "relative w-6 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                isSelected && "ring-2 ring-blue-500 ring-offset-2"
              )}
              aria-label={`Select ${option.label} color`}
              title={option.label}
            >
              <div
                className={cn(
                  "absolute inset-0 rounded-full",
                  isWhite && "border border-gray-200"
                )}
                style={{ backgroundColor: bgColor }}
              />
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check
                    className={cn(
                      "w-4 h-4",
                      isWhite ? "text-black" : "text-white"
                    )}
                  />
                </div>
              )}
            </button>

            {/* Tooltip */}
            <span
              className="absolute pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              role="tooltip"
            >
              {option.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ColorFilter;
