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
  const specificCollection = pathParts[2];

  if (
    !specificCollection ||
    specificCollection === "all-collections" ||
    specificCollection === "all-in-collections"
  ) {
    return products;
  }

  return products.filter(product => {
    if (!product.category || product.category.length === 0) return false;

    return product.category.some(cat => {
      const normalizedCat = normalizeString(cat);
      const normalizedCollection = normalizeString(
        specificCollection.replace("-collection", "")
      );
      return (
        normalizedCat === normalizedCollection ||
        normalizedCat === normalizedCollection + "collection" ||
        normalizedCat.includes(normalizedCollection)
      );
    });
  });
};

interface ColorInfo {
  color: string;
  count: number;
  productIds: Set<string>;
}

const countVariationsByColor = (
  products: Product[],
  selectedSizes?: string[]
): Map<string, ColorInfo> => {
  const colorInfo = new Map<string, ColorInfo>();

  products.forEach(product => {
    // Get unique colors for this product considering size filters
    const productColors = new Set<string>();

    product.variations.forEach(variation => {
      if (!variation.color) return;

      // Check if this variation matches the size filter
      if (selectedSizes && selectedSizes.length > 0) {
        if (!selectedSizes.includes(variation.size)) {
          return;
        }
      }

      productColors.add(variation.color);
    });

    // Update global color counts
    productColors.forEach(color => {
      if (!colorInfo.has(color)) {
        colorInfo.set(color, {
          color,
          count: 0,
          productIds: new Set(),
        });
      }

      const info = colorInfo.get(color)!;
      if (!info.productIds.has(product.id)) {
        info.count += 1;
        info.productIds.add(product.id);
      }
    });
  });

  return colorInfo;
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
    const colorInfo = countVariationsByColor(filteredProducts, selectedSizes);

    const availableColors: FilterOption[] = Array.from(colorInfo.values())
      .sort((a, b) => {
        // First sort by count (descending)
        if (b.count !== a.count) {
          return b.count - a.count;
        }
        // Then alphabetically by color name
        return a.color.localeCompare(b.color);
      })
      .map(info => ({
        value: info.color,
        label: `${info.color} (${info.count})`,
      }));

    set({ availableColors });
  },
}));

export const useAvailableSizes = () =>
  useDynamicFilterStore(state => state.availableSizes);
export const useAvailableColors = () =>
  useDynamicFilterStore(state => state.availableColors);
