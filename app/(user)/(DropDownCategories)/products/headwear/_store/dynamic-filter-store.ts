import { create } from "zustand";
import { Product, FilterOption } from "./types";

interface DynamicFilterState {
  availableSizes: FilterOption[];
  availableColors: FilterOption[];
  setAvailableSizes: (products: Product[], pathname?: string) => void;
  setAvailableColors: (
    products: Product[],
    pathname?: string,
    selectedSizes?: string[]
  ) => void;
}

const normalizeString = (str: string): string => {
  return str.toLowerCase().replace(/[-_\s]/g, "");
};

const filterProductsByPathname = (
  products: Product[],
  pathname?: string
): Product[] => {
  if (!pathname) return products;

  const pathParts = pathname.split("/").filter(Boolean);
  const categoryType = pathParts[1] || "";
  const specificCategory = pathParts[2] || "";

  if (categoryType === "headwear") {
    return products.filter(product => {
      if (!product.category || product.category.length === 0) {
        return false;
      }

      if (!specificCategory || specificCategory === "all-in-headwear") {
        return product.category.some(cat => {
          const normalizedCat = normalizeString(cat);
          return (
            normalizedCat.includes("hat") ||
            normalizedCat.includes("cap") ||
            normalizedCat.includes("beanie") ||
            normalizedCat.includes("headwear")
          );
        });
      }

      return product.category.some(cat => {
        const normalizedCat = normalizeString(cat);
        const normalizedSpecific = normalizeString(specificCategory);
        return normalizedCat.includes(normalizedSpecific);
      });
    });
  }

  return products;
};

const countVariationsByColor = (
  products: Product[],
  selectedSizes?: string[]
): Map<string, number> => {
  const colorCounts = new Map<string, number>();

  products.forEach(product => {
    product.variations.forEach(variation => {
      // Only count colors for variations that match the selected sizes
      if (selectedSizes && selectedSizes.length > 0) {
        if (!selectedSizes.includes(variation.size)) {
          return;
        }
      }

      if (variation.color) {
        const currentCount = colorCounts.get(variation.color) || 0;
        colorCounts.set(variation.color, currentCount + 1);
      }
    });
  });

  return colorCounts;
};

export const useDynamicFilterStore = create<DynamicFilterState>(set => ({
  availableSizes: [],
  availableColors: [],

  setAvailableSizes: (products: Product[], pathname?: string) => {
    const filteredProducts = filterProductsByPathname(products, pathname);
    const sizesSet = new Set<string>();

    filteredProducts.forEach(product => {
      product.variations.forEach(variation => {
        if (variation.size) {
          sizesSet.add(variation.size);
        }
      });
    });

    const availableSizes: FilterOption[] = Array.from(sizesSet)
      .sort()
      .map(size => ({
        value: size,
        label: size,
      }));

    set({ availableSizes });
  },

  setAvailableColors: (
    products: Product[],
    pathname?: string,
    selectedSizes?: string[]
  ) => {
    const filteredProducts = filterProductsByPathname(products, pathname);
    const colorCounts = countVariationsByColor(filteredProducts, selectedSizes);

    const availableColors: FilterOption[] = Array.from(colorCounts.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([color, count]) => ({
        value: color,
        label: `${color} (${count})`,
      }));

    set({ availableColors });
  },
}));

export const useAvailableSizes = () =>
  useDynamicFilterStore(state => state.availableSizes);
export const useAvailableColors = () =>
  useDynamicFilterStore(state => state.availableColors);
