import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Product, ColorFilterProps } from "../_store/types";

interface DynamicColorFilterProps extends ColorFilterProps {
  products: Product[];
}

interface ColorCount {
  color: string;
  count: number;
}

const ColorButton: React.FC<{
  colorData: ColorCount;
  isSelected: boolean;
  onChange: () => void;
  showCount?: boolean;
}> = ({ colorData, isSelected, onChange, showCount }) => {
  const isWhite = colorData.color.toLowerCase() === "white";

  return (
    <div className="relative group">
      <button
        onClick={onChange}
        className={cn(
          "relative w-6 h-6 sm:w-5 sm:h-5 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1",
          isSelected && "ring-1 ring-blue-500 ring-offset-1"
        )}
        aria-label={`Select ${colorData.color} color`}
        title={colorData.color}
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            isWhite && "border border-gray-200"
          )}
          style={{ backgroundColor: isWhite ? "#FFFFFF" : colorData.color }}
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
      // Check if product belongs to current collection
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
            const color = variation.color;
            colorMap.set(color, (colorMap.get(color) || 0) + 1);
          }
        });
      }
    });

    // Convert map to array and sort by count descending, then alphabetically
    const sortedColors = Array.from(colorMap.entries())
      .map(([color, count]) => ({ color, count }))
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.color.localeCompare(b.color);
      });

    setColorCounts(sortedColors);
  }, [products, pathname]);

  const initialColors = colorCounts.slice(0, 3);
  const remainingCount = Math.max(0, colorCounts.length - 3);

  return (
    <>
      <div className="flex items-center gap-4">
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
