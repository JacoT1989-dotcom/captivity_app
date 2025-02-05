// useFilterStore.ts
import { create } from "zustand";
import { COLOR_MAPPINGS } from "../shopping/product_categories/_components/ColorMapping";

interface FilterState {
  selectedColors: string[];
  selectedSizes: string[];
  pageSource: "list" | "detail" | null;
  toggleColor: (color: string) => void;
  toggleSize: (size: string) => void;
  getColorValue: (colorName: string) => string | { colors: string[] };
  resetFilters: () => void;
  setPageSource: (source: "list" | "detail" | null) => void;
  hasAvailableSizesForColor: (color: string, products: any[]) => boolean;
  hasAvailableColorsForSize: (size: string, products: any[]) => boolean;
  clearFilters: () => void;
  getAvailableColors: (products: any[]) => string[];
  getAvailableSizes: (products: any[]) => string[];
}

export const useFilterStore = create<FilterState>((set, get) => ({
  selectedColors: [],
  selectedSizes: [],
  pageSource: null,

  setPageSource: source => {
    set({ pageSource: source });
    // If we're coming from detail page and going to list, reset filters
    if (get().pageSource === "detail" && source === "list") {
      get().resetFilters();
    }
  },

  toggleColor: color => {
    // Only allow changes from list page
    if (get().pageSource === "list") {
      set(state => ({
        selectedColors: state.selectedColors.includes(color)
          ? state.selectedColors.filter(c => c !== color)
          : [...state.selectedColors, color],
      }));
    }
  },

  toggleSize: size => {
    // Only allow changes from list page
    if (get().pageSource === "list") {
      set(state => ({
        selectedSizes: state.selectedSizes.includes(size)
          ? state.selectedSizes.filter(s => s !== size)
          : [...state.selectedSizes, size],
      }));
    }
  },

  getColorValue: (colorName: string) => {
    const normalizedName = colorName.toLowerCase().replace(/[^a-z0-9]/g, "_");
    return COLOR_MAPPINGS[normalizedName] || colorName;
  },

  resetFilters: () => {
    set({ selectedColors: [], selectedSizes: [] });
  },

  hasAvailableSizesForColor: (color: string, products: any[]) => {
    return products.some(product =>
      product.variations?.some(
        (variation: any) =>
          variation.color === color &&
          (!get().selectedSizes.length ||
            get().selectedSizes.includes(variation.size || ""))
      )
    );
  },

  hasAvailableColorsForSize: (size: string, products: any[]) => {
    return products.some(product =>
      product.variations?.some(
        (variation: any) =>
          variation.size === size &&
          (!get().selectedColors.length ||
            get().selectedColors.includes(variation.color || ""))
      )
    );
  },

  clearFilters: () => {
    set({ selectedColors: [], selectedSizes: [] });
  },

  getAvailableColors: (products: any[]) => {
    const colors = new Set<string>();
    const multiColorSet = new Set<string>();

    if (Array.isArray(products)) {
      products.forEach(product => {
        if (product.variations) {
          product.variations.forEach((variation: any) => {
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
          });
        }
      });
    }

    // Sort colors: put multi-colors at the end
    return Array.from(colors).sort((a, b) => {
      const aIsMulti = multiColorSet.has(a);
      const bIsMulti = multiColorSet.has(b);
      if (aIsMulti !== bIsMulti) {
        return aIsMulti ? 1 : -1;
      }
      return a.localeCompare(b);
    });
  },

  getAvailableSizes: (products: any[]) => {
    const sizes = new Set<string>();

    if (Array.isArray(products)) {
      products.forEach(product => {
        if (product.variations) {
          product.variations.forEach((variation: any) => {
            if (variation.size) {
              sizes.add(variation.size);
            }
          });
        }
      });
    }

    return Array.from(sizes).sort();
  },
}));
