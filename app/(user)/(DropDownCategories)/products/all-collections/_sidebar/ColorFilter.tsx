import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { FilterOption } from "../_store/types";
import { Check, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
  "Army Brown": "#8B4513",
  "Army Green": "#4B5320",
  "Black/Grey": "#333333",
  "Black/Orange": "#FF4500",
  Bottle: "#006B3C",
  "Bottle/Khaki": "#4A5D23",
  "Burgundy/White": "#800020",
  "Burnt Orange": "#CC5500",
  "Camo Black": "#1A1A1A",
  "Camo Blue": "#1B4B7D",
};

const ColorButton: React.FC<{
  option: FilterOption;
  isSelected: boolean;
  onChange: () => void;
  showLabel?: boolean;
}> = ({ option, isSelected, onChange, showLabel }) => {
  const bgColor = colorMap[option.value] || "#000000";
  const isWhite = option.value === "White";

  return (
    <div className={cn("relative group", showLabel && "mb-2")}>
      <button
        onClick={onChange}
        className={cn(
          "relative w-6 h-6 sm:w-5 sm:h-5 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1",
          isSelected && "ring-1 ring-blue-500 ring-offset-1"
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
                "w-4 h-4 sm:w-3 sm:h-3",
                isWhite ? "text-black" : "text-white"
              )}
            />
          </div>
        )}
      </button>

      {/* Tooltip for compact view */}
      {!showLabel && (
        <span
          className="absolute pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          role="tooltip"
        >
          {option.label}
        </span>
      )}

      {/* Label for modal view */}
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
  const initialColors = options.slice(0, 3);
  const remainingCount = options.length - 3;

  return (
    <>
      <div className="flex items-center gap-4">
        {initialColors.map(option => (
          <ColorButton
            key={option.value}
            option={option}
            isSelected={selectedValue.includes(option.value)}
            onChange={() => onChange(option.value)}
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
                    onChange={() => {
                      onChange(option.value);
                    }}
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
