import { create } from "zustand";
import { persist } from "zustand/middleware";
import { COLOR_MAPPINGS } from "../shopping/product_categories/_components/ColorMapping";
import { ProductWithRelations } from "../shopping/product_categories/types";
import { Variation } from "@prisma/client";

interface FilterState {
  currentCategory: string | null;
  selectedColors: string[];
  selectedSizes: string[];

  // Actions
  setCurrentCategory: (category: string | null) => void;
  toggleColor: (color: string) => void;
  toggleSize: (size: string) => void;
  resetFilters: () => void;

  // Getters
  getColorValue: (
    colorName: string
  ) => string | { colors: string[]; pattern: string };
  getAvailableFilters: (products: ProductWithRelations[]) => {
    colors: Array<{ name: string; count: number; isMultiColor: boolean }>;
    sizes: Array<{ name: string; count: number }>;
  };
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      currentCategory: null,
      selectedColors: [],
      selectedSizes: [],

      setCurrentCategory: category => {
        set({
          currentCategory: category,
          selectedColors: [],
          selectedSizes: [],
        });
      },

      toggleColor: color => {
        set(state => {
          const colors = new Set(state.selectedColors);
          if (colors.has(color)) {
            colors.delete(color);
          } else {
            colors.add(color);
          }
          return { selectedColors: Array.from(colors) };
        });
      },

      toggleSize: size => {
        set(state => {
          const sizes = new Set(state.selectedSizes);
          if (sizes.has(size)) {
            sizes.delete(size);
          } else {
            sizes.add(size);
          }
          return { selectedSizes: Array.from(sizes) };
        });
      },

      resetFilters: () => set({ selectedColors: [], selectedSizes: [] }),

      getColorValue: (colorName: string) => {
        const normalizedName = colorName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "_")
          .replace(/_+/g, "_")
          .replace(/^_|_$/g, "");
        return COLOR_MAPPINGS[normalizedName] || colorName;
      },

      getAvailableFilters: (products: ProductWithRelations[]) => {
        const colorMap = new Map<string, number>();
        const sizeMap = new Map<string, number>();
        const multiColorSet = new Set<string>();

        // Process all variations
        products.forEach(product => {
          product.variations.forEach((variation: Variation) => {
            if (variation.color) {
              colorMap.set(
                variation.color,
                (colorMap.get(variation.color) || 0) + 1
              );

              // Check if it's a multi-color option
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
              sizeMap.set(
                variation.size,
                (sizeMap.get(variation.size) || 0) + 1
              );
            }
          });
        });

        // Sort colors: single colors first, then multi-colors, both alphabetically within their groups
        const colors = Array.from(colorMap.entries())
          .map(([name, count]) => ({
            name,
            count,
            isMultiColor: multiColorSet.has(name),
          }))
          .sort((a, b) => {
            if (a.isMultiColor !== b.isMultiColor) {
              return a.isMultiColor ? 1 : -1;
            }
            return a.name.localeCompare(b.name);
          });

        const sizes = Array.from(sizeMap.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => a.name.localeCompare(b.name));

        return { colors, sizes };
      },
    }),
    {
      name: "filter-storage",
    }
  )
);
