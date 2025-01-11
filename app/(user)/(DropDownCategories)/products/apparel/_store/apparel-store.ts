"use client";

import { create } from "zustand";
import {
  CategoryStore,
  CategoryState,
  FilterState,
  Product,
  SortOrderType,
} from "./types";
import { getAllCategories } from "../apparel-actions";
import { applyProductFilters } from "./utils";

const initialState: CategoryState = {
  categories: [],
  products: [],
  filteredProducts: [],
  currentPath: "",
  isLoading: false,
  error: null,
  initialized: false,
  sortOrder: "relevance",
  filters: {
    stockLevel: "all",
    sizes: [],
    colors: [],
    types: [],
  },
};

interface ColorStats {
  uniqueColors: string[];
  distribution: { [color: string]: number };
  total: number;
}

const getEffectivePrice = (product: Product): number => {
  const now = new Date();
  const activePricing = product.dynamicPricing.find(
    pricing => new Date(pricing.from) <= now && new Date(pricing.to) >= now
  );

  if (!activePricing) return product.sellingPrice;

  if (activePricing.type === "percentage") {
    const discount = parseFloat(activePricing.amount);
    return product.sellingPrice * (1 - discount / 100);
  } else if (activePricing.type === "fixed") {
    const discount = parseFloat(activePricing.amount);
    return product.sellingPrice - discount;
  }

  return product.sellingPrice;
};

const matchesCategory = (
  textToSearch: string,
  categoryType: string
): boolean => {
  const text = textToSearch.toLowerCase();
  const category = categoryType.toLowerCase();

  const categoryMappings: Record<string, string[]> = {
    tshirts: ["shirt", "t-shirt", "tshirt", "tee"],
    hoodies: ["hood", "sweatshirt", "sweater"],
    jackets: ["jacket", "coat", "blazer", "warmer"],
    bottoms: ["pant", "trouser", "short", "jogger", "track"],
    golfers: ["golf", "polo"],
    sweaters: ["sweater", "jumper", "pullover"],
    tops: ["top", "shirt", "blouse", "vest"],
    men: ["mens", "men's", "men"],
    women: ["womens", "women's", "women", "ladies", "lady's", "lady"],
    kids: ["kids", "kid's", "kid", "youth", "junior", "children"],
  };

  const searchTerms = categoryMappings[category] || [category];
  return searchTerms.some(term => text.includes(term));
};

const isApparelProduct = (textToSearch: string): boolean => {
  const apparelTerms = [
    "apparel",
    "clothing",
    "wear",
    "shirt",
    "t-shirt",
    "tshirt",
    "jacket",
    "hoodie",
    "pant",
    "short",
    "vest",
    "golfer",
    "sweater",
    "jumper",
    "coat",
    "jogger",
    "active",
    "top",
  ];

  const text = textToSearch.toLowerCase();
  return apparelTerms.some(term => text.includes(term));
};

const analyzeColors = (products: Product[]): ColorStats => {
  const distribution: { [color: string]: number } = {};
  const uniqueColors = new Set<string>();

  if (!products?.length) {
    return { uniqueColors: [], distribution: {}, total: 0 };
  }

  products.forEach(product => {
    if (
      isApparelProduct([...product.category, product.productName].join(" "))
    ) {
      product.variations?.forEach(variation => {
        if (variation?.color) {
          const normalizedColor = variation.color.toLowerCase().trim();
          uniqueColors.add(normalizedColor);
          distribution[normalizedColor] =
            (distribution[normalizedColor] || 0) + 1;
        }
      });
    }
  });

  const sortedColors = Array.from(uniqueColors).sort();

  // Only log if there are colors found
  if (sortedColors.length > 0) {
    console.log("\n=== Color Analysis Report ===");
    console.log(`Total unique colors: ${sortedColors.length}`);

    console.log("\n--- Top 10 Most Common Colors ---");
    Object.entries(distribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .forEach(([color, count]) => {
        console.log(`${color}: ${count} items`);
      });

    console.log("\n--- All Available Colors ---");
    console.log("Alphabetical list of all colors:");
    console.log(sortedColors.join(", "));

    console.log("\n--- Full Color Distribution ---");
    Object.entries(distribution)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([color, count]) => {
        console.log(`${color}: ${count} items`);
      });
  }

  return {
    uniqueColors: sortedColors,
    distribution,
    total: sortedColors.length,
  };
};

export const useCategoryStore = create<CategoryStore>()((set, get) => ({
  ...initialState,

  fetchCategories: async () => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const result = await getAllCategories();

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to fetch categories");
      }

      const colorStats = analyzeColors(result.data.allProducts);

      set({
        categories: result.data.categories,
        products: result.data.allProducts,
        filteredProducts: result.data.allProducts,
        isLoading: false,
        error: null,
        initialized: true,
      });

      const { currentPath } = get();
      if (currentPath) {
        get().filterProductsByPath(currentPath);
      }
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch categories",
        initialized: true,
      });
    }
  },

  setProducts: products => {
    analyzeColors(products);
    set({ products });

    const { currentPath } = get();
    if (currentPath) {
      get().filterProductsByPath(currentPath);
    }
  },

  filterProductsByPath: pathname => {
    const { products, filters } = get();
    const pathParts = pathname.split("/").filter(Boolean);
    const categoryType = pathParts[1] || "";
    const specificCategory = pathParts[2] || "";

    let filteredByPath = products;

    if (categoryType === "apparel") {
      filteredByPath = products.filter(product => {
        const searchableText = [...product.category, product.productName].join(
          " "
        );

        if (!isApparelProduct(searchableText)) {
          return false;
        }

        if (!specificCategory || specificCategory === "all-in-apparel") {
          return true;
        }

        return matchesCategory(searchableText, specificCategory);
      });

      // Only analyze colors for apparel category
      analyzeColors(filteredByPath);
    }

    const finalFilters = { ...filters };
    if (specificCategory === `all-in-${categoryType}`) {
      finalFilters.types = [];
    }

    const filteredProducts = applyProductFilters(filteredByPath, finalFilters);

    set({
      filteredProducts,
      currentPath: pathname,
    });
  },

  applyFilters: (newFilters: FilterState) => {
    const { products, currentPath } = get();
    set({ filters: newFilters });

    if (currentPath) {
      get().filterProductsByPath(currentPath);
    } else {
      const filteredProducts = applyProductFilters(products, newFilters);
      set({ filteredProducts });
    }
  },

  sortProducts: (sortOrder: SortOrderType) => {
    const { filteredProducts } = get();
    let sortedProducts = [...filteredProducts];

    switch (sortOrder) {
      case "price-asc":
        sortedProducts.sort(
          (a, b) => getEffectivePrice(a) - getEffectivePrice(b)
        );
        break;
      case "price-desc":
        sortedProducts.sort(
          (a, b) => getEffectivePrice(b) - getEffectivePrice(a)
        );
        break;
      case "name-asc":
        sortedProducts.sort((a, b) =>
          a.productName.localeCompare(b.productName)
        );
        break;
      case "name-desc":
        sortedProducts.sort((a, b) =>
          b.productName.localeCompare(a.productName)
        );
        break;
      case "newest":
        sortedProducts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    set({ filteredProducts: sortedProducts, sortOrder });
  },

  reset: () => {
    set(initialState);
  },
}));
// Selector hooks for accessing store state
export const useCategories = () => useCategoryStore(state => state.categories);

export const useProducts = () => useCategoryStore(state => state.products);

export const useFilteredProducts = () =>
  useCategoryStore(state => state.filteredProducts);

export const useCategoryLoading = () =>
  useCategoryStore(state => state.isLoading);

export const useCategoryError = () => useCategoryStore(state => state.error);

export const useCategoryInitialized = () =>
  useCategoryStore(state => state.initialized);

export const useSortOrder = () => useCategoryStore(state => state.sortOrder);

export const useFilters = () => useCategoryStore(state => state.filters);

export const useCurrentPath = () =>
  useCategoryStore(state => state.currentPath);

// Action hooks
export const useFetchCategories = () =>
  useCategoryStore(state => state.fetchCategories);

export const useSetProducts = () =>
  useCategoryStore(state => state.setProducts);

export const useFilterProductsByPath = () =>
  useCategoryStore(state => state.filterProductsByPath);

export const useApplyFilters = () =>
  useCategoryStore(state => state.applyFilters);

export const useSortProducts = () =>
  useCategoryStore(state => state.sortProducts);

export const useResetStore = () => useCategoryStore(state => state.reset);

// Dynamic pricing hooks
export const useEffectivePrice = (product: Product): number =>
  getEffectivePrice(product);

export const useHasActiveDynamicPricing = (product: Product): boolean => {
  const now = new Date();
  return product.dynamicPricing.some(
    pricing => new Date(pricing.from) <= now && new Date(pricing.to) >= now
  );
};

export const useDiscountPercentage = (product: Product): number | null => {
  const effectivePrice = getEffectivePrice(product);
  if (effectivePrice === product.sellingPrice) return null;

  const discountPercentage =
    ((product.sellingPrice - effectivePrice) / product.sellingPrice) * 100;
  return Math.round(discountPercentage);
};
