"use client";

import { create } from "zustand";
import { getAllCategories } from "../actions";
import { CategoryStore, CategoryState, FilterState, Product } from "./types";

export const normalizeString = (str: string): string => {
  return str.toLowerCase().replace(/[-_\s]/g, "");
};

function applyProductFilters(
  products: Product[],
  filters: FilterState
): Product[] {
  console.log("🔍 Applying filters to products:", {
    initialCount: products.length,
    filters,
  });

  const filteredProducts = products
    .filter(product => {
      // Check if any variations match the stock level filter
      if (filters.stockLevel !== "all") {
        const hasMatchingStock = product.variations.some(variation => {
          if (filters.stockLevel === "in" && variation.quantity > 0)
            return true;
          if (filters.stockLevel === "out" && variation.quantity <= 0)
            return true;
          return false;
        });
        if (!hasMatchingStock) return false;
      }

      // Type filter check
      if (filters.types.length > 0) {
        const typeMatch = product.category.some(category =>
          filters.types.some(type => {
            const normalizedCat = normalizeString(category);
            const normalizedType = normalizeString(type);
            const matches = normalizedCat.includes(normalizedType);
            console.log("🏷️ Type matching:", {
              category: normalizedCat,
              type: normalizedType,
              matches,
            });
            return matches;
          })
        );
        return typeMatch;
      }

      return true;
    })
    .map(product => ({
      ...product,
      variations: product.variations.filter(variation => {
        // Apply color filter
        if (
          filters.colors.length > 0 &&
          !filters.colors.includes(variation.color)
        ) {
          return false;
        }

        // Apply size filter
        if (
          filters.sizes.length > 0 &&
          !filters.sizes.includes(variation.size)
        ) {
          return false;
        }

        // Apply stock level filter to individual variations
        if (filters.stockLevel !== "all") {
          if (filters.stockLevel === "in" && variation.quantity <= 0)
            return false;
          if (filters.stockLevel === "out" && variation.quantity > 0)
            return false;
        }

        return true;
      }),
    }));

  console.log("✅ After applying filters:", {
    finalCount: filteredProducts.length,
    filters,
  });

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
  },
};

export const useCategoryStore = create<CategoryStore>()((set, get) => ({
  ...initialState,

  fetchCategories: async () => {
    const { isLoading } = get();
    if (isLoading) return;

    console.log("🔄 Fetching categories...");
    set({ isLoading: true, error: null });

    try {
      const result = await getAllCategories();

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to fetch categories");
      }

      console.log("📦 Categories fetched:", {
        categoriesCount: result.data.categories.length,
        productsCount: result.data.allProducts.length,
      });

      set({
        categories: result.data.categories,
        products: result.data.allProducts,
        isLoading: false,
        error: null,
        initialized: true,
      });

      const { currentPath } = get();
      if (currentPath) {
        console.log("🛣️ Filtering by existing path:", currentPath);
        get().filterProductsByPath(currentPath);
      }
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch categories",
        initialized: true,
      });
    }
  },

  setProducts: products => {
    console.log("📝 Setting products:", products.length);
    set({ products });
    const { currentPath } = get();
    if (currentPath) {
      get().filterProductsByPath(currentPath);
    }
  },

  filterProductsByPath: pathname => {
    const { products, filters } = get();
    console.log("🔍 Starting path filtering:", {
      pathname,
      totalProducts: products.length,
    });

    const pathParts = pathname.split("/").filter(Boolean);
    const categoryType = pathParts[1] || ""; // e.g., "headwear"
    const specificCategory = pathParts[2] || ""; // e.g., "all-in-headwear"

    console.log("🛣️ Path analysis:", { categoryType, specificCategory });

    let filteredByPath = products;

    // Handle all headwear products including all-in-headwear
    if (categoryType === "headwear") {
      console.log("👒 Filtering for headwear products");
      filteredByPath = products.filter(product => {
        if (!product.category || product.category.length === 0) {
          return false;
        }

        // For all-in-headwear or no specific category, show all headwear products
        if (!specificCategory || specificCategory === "all-in-headwear") {
          const isHeadwear = product.category.some(cat => {
            const normalizedCat = normalizeString(cat);
            return (
              normalizedCat.includes("hat") ||
              normalizedCat.includes("cap") ||
              normalizedCat.includes("beanie") ||
              normalizedCat.includes("headwear")
            );
          });
          console.log("🎩 Headwear check:", {
            categories: product.category,
            isHeadwear,
          });
          return isHeadwear;
        }

        // For specific categories (e.g., beanies, caps)
        return product.category.some(cat => {
          const normalizedCat = normalizeString(cat);
          const normalizedSpecific = normalizeString(specificCategory);
          const matches = normalizedCat.includes(normalizedSpecific);
          console.log("🏷️ Category matching:", {
            category: normalizedCat,
            specific: normalizedSpecific,
            matches,
          });
          return matches;
        });
      });
    }

    console.log("🔄 Intermediate results:", {
      afterPathFilter: filteredByPath.length,
    });

    // Only apply additional filters if they're not "all" or empty
    let finalFilters = { ...filters };
    if (finalFilters.types.includes("all-in-headwear")) {
      finalFilters = { ...finalFilters, types: [] };
    }

    const filteredProducts = applyProductFilters(filteredByPath, finalFilters);

    console.log("✅ Final results:", {
      finalCount: filteredProducts.length,
      pathname,
      filters: finalFilters,
    });

    set({
      filteredProducts,
      currentPath: pathname,
    });
  },

  applyFilters: (newFilters: FilterState) => {
    console.log("🔄 Applying new filters:", newFilters);
    const { products, currentPath } = get();
    set({ filters: newFilters });

    if (currentPath) {
      console.log("🛣️ Using current path:", currentPath);
      get().filterProductsByPath(currentPath);
    } else {
      console.log("⚠️ No current path, applying filters directly");
      const filteredProducts = applyProductFilters(products, newFilters);
      set({ filteredProducts });
    }
  },

  sortProducts: (sortOrder: string) => {
    console.log("📊 Sorting products:", sortOrder);
    const { filteredProducts } = get();
    let sortedProducts = [...filteredProducts];

    switch (sortOrder) {
      case "price-asc":
        sortedProducts.sort((a, b) => a.sellingPrice - b.sellingPrice);
        break;
      case "price-desc":
        sortedProducts.sort((a, b) => b.sellingPrice - a.sellingPrice);
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

    console.log("✅ Sorting complete:", {
      count: sortedProducts.length,
      sortOrder,
    });

    set({ filteredProducts: sortedProducts, sortOrder });
  },

  reset: () => {
    console.log("🔄 Resetting store to initial state");
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
