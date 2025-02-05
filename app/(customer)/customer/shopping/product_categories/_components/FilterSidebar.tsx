"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useFilterStore } from "../../../_store/useFilterStore";
import { COLOR_MAPPINGS } from "./ColorMapping";
import { ProductWithRelations } from "../types";
import { Variation } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";

const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

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
    useFilterStore.getState().setPageSource("list");
    return () => {
      useFilterStore.getState().setPageSource(null);
    };
  }, []);

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
            className={cn(
              "w-full justify-between bg-background/80 backdrop-blur-sm px-4 py-3",
              "border border-border/50 shadow-2xl shadow-black",
              "transition-all duration-300 hover:scale-95 hover:shadow-xl",
              "group relative overflow-hidden",
              categoryOpen && "ring-2 ring-primary"
            )}
            onClick={() => setCategoryOpen(!categoryOpen)}
          >
            <span className="relative z-10">
              {selectedCollection ?? "Select collection..."}
            </span>
            <motion.div
              animate={{ rotate: categoryOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 group-hover:opacity-100" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
          <AnimatePresence>
            {categoryOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={dropdownVariants}
                className="absolute z-50 w-full mt-2 bg-background/80 backdrop-blur-sm border rounded-lg shadow-lg overflow-hidden"
              >
                <input
                  type="text"
                  placeholder="Search categories..."
                  className="w-full px-4 py-3 border-b bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <motion.div
                  className="max-h-[300px] overflow-y-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {filteredCollections.map((collection, index) => (
                    <motion.button
                      key={collection}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleCollectionChange(collection)}
                      className={cn(
                        "flex w-full items-center px-4 py-3 hover:bg-muted/50 transition-colors",
                        selectedCollection === collection &&
                          "bg-primary text-primary-foreground"
                      )}
                    >
                      {collection}
                      {selectedCollection === collection && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Color Filter */}
      <div className="mb-6" ref={colorRef}>
        <h2 className="text-sm font-medium mb-2">Color</h2>
        <div className="relative">
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between bg-background/80 backdrop-blur-sm px-4 py-3",
              "border border-border/50 shadow-2xl shadow-black",
              "transition-all duration-300 hover:scale-95 hover:shadow-xl",
              "group relative overflow-hidden",
              isColorOpen && "ring-2 ring-primary"
            )}
            onClick={() => setIsColorOpen(!isColorOpen)}
          >
            <div className="flex items-center gap-2 relative z-10">
              {selectedColors.length > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {selectedColors.slice(0, 3).map(color => (
                      <div
                        key={color}
                        className="h-5 w-5 rounded-full ring-2 ring-background shadow-sm"
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
            <motion.div
              animate={{ rotate: isColorOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 group-hover:opacity-100" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>

          <AnimatePresence>
            {isColorOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: {
                    opacity: 0,
                    y: -10,
                    scale: 0.95,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 24,
                    },
                  },
                  exit: {
                    opacity: 0,
                    y: -10,
                    scale: 0.95,
                    transition: { duration: 0.2 },
                  },
                }}
                className="absolute z-50 w-full mt-2 bg-background/80 backdrop-blur-sm border rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-4 max-h-[300px] overflow-y-auto">
                  <motion.div
                    className="grid grid-cols-6 gap-3"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                        },
                      },
                    }}
                  >
                    {availableColors.map(colorOption => (
                      <motion.button
                        key={colorOption}
                        variants={{
                          hidden: { opacity: 0, scale: 0.8 },
                          visible: { opacity: 1, scale: 1 },
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleColor(colorOption)}
                        className={cn(
                          "group relative aspect-square",
                          !hasAvailableSizesForColor(colorOption) &&
                            "opacity-50"
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
                          className={cn(
                            "w-full h-full rounded-full transition-all duration-200",
                            "shadow-md hover:shadow-lg",
                            selectedColors.includes(colorOption) &&
                              "ring-2 ring-primary ring-offset-2",
                            "group-hover:scale-105"
                          )}
                          style={getSwatchStyle(colorOption)}
                        />
                        <AnimatePresence>
                          {selectedColors.includes(colorOption) && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center text-[10px] shadow-lg"
                            >
                              <Check className="h-3 w-3" />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm border shadow-lg"
                        >
                          {colorOption
                            .split("_")
                            .map(
                              word =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                            )
                            .join(" ")}
                        </motion.div>
                      </motion.button>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Size Filter */}
      <div className="mb-6" ref={sizeRef}>
        <h2 className="text-sm font-medium mb-2">Size</h2>
        <div className="relative">
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between bg-background/80 backdrop-blur-sm px-4 py-3",
              "border border-border/50 shadow-2xl shadow-black",
              "transition-all duration-300 hover:scale-95 hover:shadow-xl",
              "group relative overflow-hidden",
              isSizeOpen && "ring-2 ring-primary"
            )}
            onClick={() => setIsSizeOpen(!isSizeOpen)}
          >
            <span className="relative z-10">
              {selectedSizes.length > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {selectedSizes.slice(0, 3).map(size => (
                      <div
                        key={size}
                        className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium"
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    {selectedSizes.length} selected
                  </span>
                </div>
              ) : (
                "Select sizes..."
              )}
            </span>
            <motion.div
              animate={{ rotate: isSizeOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 group-hover:opacity-100" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>

          <AnimatePresence>
            {isSizeOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: {
                    opacity: 0,
                    y: -10,
                    scale: 0.95,
                    transition: {
                      duration: 0.2,
                    },
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 24,
                    },
                  },
                  exit: {
                    opacity: 0,
                    y: -10,
                    scale: 0.95,
                    transition: {
                      duration: 0.2,
                    },
                  },
                }}
                className="absolute z-50 w-full mt-2 bg-background/80 backdrop-blur-sm border rounded-lg shadow-lg overflow-hidden"
              >
                <div className="max-h-[300px] overflow-y-auto p-2">
                  {availableSizes.map((sizeOption, index) => (
                    <motion.button
                      key={sizeOption}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => toggleSize(sizeOption)}
                      className={cn(
                        "flex w-full items-center justify-between px-4 py-3",
                        "rounded-md transition-colors",
                        "hover:bg-muted/50",
                        selectedSizes.includes(sizeOption) &&
                          "bg-primary text-primary-foreground",
                        !hasAvailableColorsForSize(sizeOption) && "opacity-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "h-6 w-6 rounded-full flex items-center justify-center text-sm",
                            selectedSizes.includes(sizeOption)
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {sizeOption}
                        </div>
                        <span className="font-medium">{sizeOption}</span>
                      </div>
                      {selectedSizes.includes(sizeOption) && (
                        <Check className="h-4 w-4 shrink-0" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Active Filters */}
      <AnimatePresence>
        {(selectedColors.length > 0 || selectedSizes.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-4 space-y-2"
          >
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-medium flex items-center gap-2"
            >
              Active Filters
              <span className="px-2 py-1 bg-primary/10 rounded-full text-xs">
                {selectedColors.length + selectedSizes.length}
              </span>
            </motion.h3>

            <div className="flex flex-wrap gap-2">
              {selectedColors.map((color, index) => (
                <motion.div
                  key={color}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleColor(color)}
                    className="group flex items-center gap-2 px-3 py-1 bg-background hover:bg-background/80 border shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105"
                  >
                    <div
                      className="h-4 w-4 rounded-full ring-1 ring-border/50"
                      style={getSwatchStyle(color)}
                    />
                    <span className="text-sm">
                      {color
                        .split("_")
                        .map(
                          word =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(" ")}
                    </span>
                    <motion.div
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.2 }}
                      className="text-muted-foreground group-hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </motion.div>
                  </Button>
                </motion.div>
              ))}

              {selectedSizes.map((size, index) => (
                <motion.div
                  key={size}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: (selectedColors.length + index) * 0.05 }}
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleSize(size)}
                    className="group flex items-center gap-2 px-3 py-1 bg-background hover:bg-background/80 border shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105"
                  >
                    <span className="h-4 w-4 flex items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                      {size}
                    </span>
                    <span className="text-sm">Size</span>
                    <motion.div
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.2 }}
                      className="text-muted-foreground group-hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </motion.div>
                  </Button>
                </motion.div>
              ))}
            </div>

            {(selectedColors.length > 0 || selectedSizes.length > 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    selectedColors.forEach(toggleColor);
                    selectedSizes.forEach(toggleSize);
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear all filters
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterSidebar;
