// _store/dynamic-filter-store.ts

import { create } from "zustand";
import { Product, FilterOption } from "./types";

interface DynamicFilterState {
  availableSizes: FilterOption[];
  availableColors: FilterOption[];
  setAvailableSizes: (products: Product[]) => void;
  setAvailableColors: (products: Product[]) => void;
}

const normalizeString = (str: string): string => {
  return str.toLowerCase().replace(/[-_\s]/g, "");
};

const isHeadwearProduct = (product: Product): boolean => {
  return product.category.some(cat => {
    const normalizedCat = normalizeString(cat);
    return (
      normalizedCat.includes("hat") ||
      normalizedCat.includes("cap") ||
      normalizedCat.includes("beanie") ||
      normalizedCat.includes("headwear")
    );
  });
};

export const useDynamicFilterStore = create<DynamicFilterState>(set => ({
  availableSizes: [],
  availableColors: [],

  setAvailableSizes: (products: Product[]) => {
    const sizesSet = new Set<string>();

    products.forEach(product => {
      if (isHeadwearProduct(product)) {
        product.variations.forEach(variation => {
          if (variation.size) {
            sizesSet.add(variation.size);
          }
        });
      }
    });

    const availableSizes: FilterOption[] = Array.from(sizesSet)
      .sort()
      .map(size => ({
        value: size,
        label: size,
      }));

    set({ availableSizes });
  },

  setAvailableColors: (products: Product[]) => {
    const colorsSet = new Set<string>();

    products.forEach(product => {
      if (isHeadwearProduct(product)) {
        product.variations.forEach(variation => {
          if (variation.color) {
            colorsSet.add(variation.color);
          }
        });
      }
    });

    const availableColors: FilterOption[] = Array.from(colorsSet)
      .sort()
      .map(color => ({
        value: color,
        label: color,
      }));

    set({ availableColors });
  },
}));

export const useAvailableSizes = () =>
  useDynamicFilterStore(state => state.availableSizes);
export const useAvailableColors = () =>
  useDynamicFilterStore(state => state.availableColors);
