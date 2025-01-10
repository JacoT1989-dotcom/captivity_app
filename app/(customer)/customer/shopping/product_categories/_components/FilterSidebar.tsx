"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useFilterStore } from "../../../_store/useFilterStore";
import { COLOR_MAPPINGS } from "./ColorMapping";
import { ProductWithRelations } from "../types";
import { Variation } from "@prisma/client";

const COLLECTIONS = [
  "Winter",
  "Summer",
  "African",
  "Baseball",
  "Camo",
  "Fashion",
  "Industrial",
  "Kids",
  "Leisure",
  "Signature",
  "Sport",
] as const;

type Collection = (typeof COLLECTIONS)[number];

interface FilterSidebarProps {
  products?: ProductWithRelations[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ products = [] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const categoryRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);

  const { selectedColors, selectedSizes, toggleColor, toggleSize } =
    useFilterStore();

  // Get all available colors and sizes without filtering based on selection
  const { availableColors, availableSizes } = React.useMemo(() => {
    const colors = new Set<string>();
    const sizes = new Set<string>();
    const multiColorSet = new Set<string>();

    if (Array.isArray(products)) {
      products.forEach(product => {
        if (product.variations) {
          product.variations.forEach((variation: Variation) => {
            // Add all colors and sizes regardless of other selections
            if (variation.color) {
              colors.add(variation.color);
              const colorValue =
                COLOR_MAPPINGS[
                  variation.color.toLowerCase().replace(/[^a-z0-9]/g, "_")
                ];
              if (
                typeof colorValue === "object" &&
                colorValue.colors &&
                colorValue.colors.length > 1
              ) {
                multiColorSet.add(variation.color);
              }
            }
            if (variation.size) {
              sizes.add(variation.size);
            }
          });
        }
      });
    }

    const sortedColors = Array.from(colors).sort((a, b) => {
      const aIsMulti = multiColorSet.has(a);
      const bIsMulti = multiColorSet.has(b);
      if (aIsMulti !== bIsMulti) return aIsMulti ? 1 : -1;
      return a.localeCompare(b);
    });

    return {
      availableColors: sortedColors,
      availableSizes: Array.from(sizes).sort(),
    };
  }, [products]);

  // Function to check if a color has available sizes
  const hasAvailableSizesForColor = (color: string): boolean => {
    return products.some(product =>
      product.variations?.some(
        variation =>
          variation.color === color &&
          (!selectedSizes.length ||
            selectedSizes.includes(variation.size || ""))
      )
    );
  };

  // Function to check if a size has available colors
  const hasAvailableColorsForSize = (size: string): boolean => {
    return products.some(product =>
      product.variations?.some(
        variation =>
          variation.size === size &&
          (!selectedColors.length ||
            selectedColors.includes(variation.color || ""))
      )
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setCategoryOpen(false);
      }
      if (
        colorRef.current &&
        !colorRef.current.contains(event.target as Node)
      ) {
        setIsColorOpen(false);
      }
      if (sizeRef.current && !sizeRef.current.contains(event.target as Node)) {
        setIsSizeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getCurrentCollection = useCallback((): Collection | null => {
    if (!pathname) return null;
    const pathLower = pathname.toLowerCase();
    return COLLECTIONS.find(c => pathLower.includes(c.toLowerCase())) ?? null;
  }, [pathname]);

  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(() => getCurrentCollection());

  const handleCollectionChange = (value: Collection) => {
    setSelectedCollection(value);
    setCategoryOpen(false);
    const basePath = "/customer/shopping/product_categories";
    const newPath = `${basePath}/${value.toLowerCase()}`;
    router.push(newPath, { scroll: false });
  };

  useEffect(() => {
    const currentCollection = getCurrentCollection();
    if (currentCollection !== selectedCollection) {
      setSelectedCollection(currentCollection);
    }
  }, [getCurrentCollection, selectedCollection]);

  const getSwatchStyle = (colorName: string): React.CSSProperties => {
    const normalizedName = colorName.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const colorValue = COLOR_MAPPINGS[normalizedName];

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

    return { backgroundColor: colorName };
  };

  const filteredCollections = COLLECTIONS.filter(collection =>
    collection.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div className="mb-6" ref={categoryRef}>
        <h2 className="text-sm font-medium mb-2">Category</h2>
        <div className="relative">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={categoryOpen}
            className="w-full justify-between bg-background px-4 py-2 shadow-2xl shadow-black transition-transform duration-300 hover:scale-95"
            onClick={() => setCategoryOpen(!categoryOpen)}
          >
            {selectedCollection ?? "Select collection..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
          {categoryOpen && (
            <div className="absolute z-50 w-full mt-2 bg-background border rounded-md shadow-lg">
              <input
                type="text"
                placeholder="Search categories..."
                className="w-full px-4 py-2 border-b"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <div className="max-h-[300px] overflow-y-auto">
                {filteredCollections.map(collection => (
                  <button
                    key={collection}
                    onClick={() => handleCollectionChange(collection)}
                    className={cn(
                      "flex w-full items-center px-4 py-2 hover:bg-muted",
                      selectedCollection === collection &&
                        "bg-primary text-primary-foreground"
                    )}
                  >
                    {collection}
                    {selectedCollection === collection && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Color Filter */}
      <div className="mb-6" ref={colorRef}>
        <h2 className="text-sm font-medium mb-2">Color</h2>
        <div className="relative">
          <Button
            variant="outline"
            className="w-full justify-between bg-background px-4 py-2 shadow-2xl shadow-black transition-transform duration-300 hover:scale-95"
            onClick={() => setIsColorOpen(!isColorOpen)}
          >
            <div className="flex items-center gap-2">
              {selectedColors.length > 0 ? (
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-1">
                    {selectedColors.slice(0, 3).map(color => (
                      <div
                        key={color}
                        className="h-4 w-4 rounded-full ring-2 ring-white"
                        style={getSwatchStyle(color)}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    {selectedColors.length} selected
                  </span>
                </div>
              ) : (
                "Select colors..."
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
          {isColorOpen && (
            <div className="absolute z-50 w-full mt-2 p-4 bg-background border rounded-md shadow-lg max-h-[300px] overflow-y-auto">
              <div className="grid grid-cols-6 gap-2">
                {availableColors.map(colorOption => (
                  <button
                    key={colorOption}
                    onClick={() => toggleColor(colorOption)}
                    className={cn(
                      "group relative",
                      !hasAvailableSizesForColor(colorOption) && "opacity-50"
                    )}
                    title={colorOption
                      .split("_")
                      .map(
                        word =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(" ")}
                  >
                    <div
                      className={`h-6 w-6 rounded-full transition-all duration-200 hover:scale-110
                        ${selectedColors.includes(colorOption) ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
                      style={getSwatchStyle(colorOption)}
                    />
                    {selectedColors.includes(colorOption) && (
                      <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-3 h-3 flex items-center justify-center text-[10px]">
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Size Filter */}
      <div className="mb-6" ref={sizeRef}>
        <h2 className="text-sm font-medium mb-2">Size</h2>
        <div className="relative">
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between bg-background shadow-2xl shadow-black transition-transform duration-300 hover:scale-95"
            onClick={() => setIsSizeOpen(!isSizeOpen)}
          >
            {selectedSizes.length > 0
              ? `${selectedSizes.length} sizes selected`
              : "Select sizes..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
          {isSizeOpen && (
            <div className="absolute z-50 w-full mt-2 bg-background border rounded-md shadow-lg">
              <div className="max-h-[300px] overflow-y-auto p-2">
                {availableSizes.map(sizeOption => (
                  <button
                    key={sizeOption}
                    onClick={() => toggleSize(sizeOption)}
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-2 rounded-md",
                      selectedSizes.includes(sizeOption)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted",
                      !hasAvailableColorsForSize(sizeOption) && "opacity-50"
                    )}
                  >
                    {sizeOption}
                    {selectedSizes.includes(sizeOption) && (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {(selectedColors.length > 0 || selectedSizes.length > 0) && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-medium">Active Filters:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedColors.map(color => (
              <Button
                key={color}
                variant="secondary"
                size="sm"
                onClick={() => toggleColor(color)}
                className="flex items-center gap-1"
              >
                <div
                  className="h-3 w-3 rounded-full"
                  style={getSwatchStyle(color)}
                />
                <span className="ml-1">
                  {color
                    .split("_")
                    .map(
                      word =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(" ")}
                </span>
                <ChevronsUpDown className="h-3 w-3 ml-1" />
              </Button>
            ))}
            {selectedSizes.map(size => (
              <Button
                key={size}
                variant="secondary"
                size="sm"
                onClick={() => toggleSize(size)}
                className="flex items-center gap-1"
              >
                Size: {size}
                <ChevronsUpDown className="h-3 w-3 ml-1" />
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;
