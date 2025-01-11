"use client";

import { create } from "zustand";
import { getAllCategories } from "../actions";
import { CategoryStore, CategoryState, FilterState, Product } from "./types";

export const normalizeString = (str: string): string => {
  return str.toLowerCase().replace(/[-_\s]/g, "");
};

const getCurrentPricing = (product: Product) => {
  if (!product.dynamicPricing || product.dynamicPricing.length === 0) {
    return null;
  }

  const now = new Date();
  return (
    product.dynamicPricing.find(pricing => {
      const fromDate = new Date(pricing.from);
      const toDate = new Date(pricing.to);
      return now >= fromDate && now <= toDate;
    }) || null
  );
};

const getEffectivePrice = (product: Product) => {
  const currentPricing = getCurrentPricing(product);
  if (!currentPricing) return product.sellingPrice;

  const amount = parseFloat(currentPricing.amount);
  if (currentPricing.type === "percentage") {
    return product.sellingPrice * (1 - amount / 100);
  } else if (currentPricing.type === "fixed") {
    return product.sellingPrice - amount;
  }
  return product.sellingPrice;
};

function applyProductFilters(
  products: Product[],
  filters: FilterState,
  pathname?: string
): Product[] {
  const pathParts = (pathname || "").split("/").filter(Boolean);
  const categoryType = pathParts[1] || "";
  const specificCategory = pathParts[2] || "";

  let categoryFilteredProducts = products;

  if (categoryType === "headwear") {
    categoryFilteredProducts = products.filter(product => {
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

  const filteredProducts = categoryFilteredProducts
    .filter(product => {
      // Filter by pricing type if specified
      if (filters.pricingType) {
        const currentPricing = getCurrentPricing(product);
        if (!currentPricing || currentPricing.type !== filters.pricingType) {
          return false;
        }
      }

      const hasMatchingVariation = product.variations.some(variation => {
        if (
          filters.colors.length > 0 &&
          !filters.colors.includes(variation.color)
        ) {
          return false;
        }

        if (
          filters.sizes.length > 0 &&
          !filters.sizes.includes(variation.size)
        ) {
          return false;
        }

        if (filters.stockLevel !== "all") {
          if (filters.stockLevel === "in" && variation.quantity <= 0)
            return false;
          if (filters.stockLevel === "out" && variation.quantity > 0)
            return false;
        }

        return true;
      });

      return hasMatchingVariation;
    })
    .map(product => ({
      ...product,
      variations: product.variations.filter(variation => {
        if (
          filters.colors.length > 0 &&
          !filters.colors.includes(variation.color)
        ) {
          return false;
        }

        if (
          filters.sizes.length > 0 &&
          !filters.sizes.includes(variation.size)
        ) {
          return false;
        }

        if (filters.stockLevel !== "all") {
          if (filters.stockLevel === "in" && variation.quantity <= 0)
            return false;
          if (filters.stockLevel === "out" && variation.quantity > 0)
            return false;
        }

        return true;
      }),
    }));

  return filteredProducts;
}

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
    pricingType: undefined,
  },
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

      set({
        categories: result.data.categories,
        products: result.data.allProducts,
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
    set({ products });
    const { currentPath } = get();
    if (currentPath) {
      get().filterProductsByPath(currentPath);
    }
  },

  filterProductsByPath: (pathname: string) => {
    const { products, filters } = get();
    const filteredProducts = applyProductFilters(products, filters, pathname);

    set({
      filteredProducts,
      currentPath: pathname,
    });
  },

  applyFilters: (newFilters: FilterState) => {
    const { products, currentPath } = get();
    set({ filters: newFilters });

    if (currentPath) {
      const filteredProducts = applyProductFilters(
        products,
        newFilters,
        currentPath
      );
      set({ filteredProducts });
    } else {
      const filteredProducts = applyProductFilters(products, newFilters);
      set({ filteredProducts });
    }
  },

  sortProducts: (sortOrder: string) => {
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

  getCurrentPricing,
  getEffectivePrice,

  reset: () => {
    set(initialState);
  },
}));

export const useCategories = () => useCategoryStore(state => state.categories);
export const useFilteredProducts = () =>
  useCategoryStore(state => state.filteredProducts);
export const useCategoryLoading = () =>
  useCategoryStore(state => state.isLoading);
export const useCategoryError = () => useCategoryStore(state => state.error);
export const useCategoryInitialized = () =>
  useCategoryStore(state => state.initialized);
export const useCurrentPricing = () =>
  useCategoryStore(state => state.getCurrentPricing);
export const useEffectivePrice = () =>
  useCategoryStore(state => state.getEffectivePrice);
