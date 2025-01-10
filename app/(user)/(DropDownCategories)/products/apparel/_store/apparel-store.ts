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

const DEBUG = process.env.NODE_ENV === "development";

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

export const useCategoryStore = create<CategoryStore>()((set, get) => ({
  ...initialState,

  fetchCategories: async () => {
    const { isLoading } = get();
    if (isLoading) {
      if (DEBUG) console.log("Fetch categories skipped - already loading");
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const result = await getAllCategories();

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to fetch categories");
      }

      if (DEBUG) {
        console.log("API Response:", {
          success: result.success,
          categoriesCount: result.data.categories.length,
          productsCount: result.data.allProducts.length,
          sampleProduct: result.data.allProducts[0]
            ? {
                id: result.data.allProducts[0].id,
                name: result.data.allProducts[0].productName,
                categories: result.data.allProducts[0].category,
              }
            : "No products",
        });
      }

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
      console.error("Error in fetchCategories:", error);
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch categories",
        initialized: true,
      });
    }
  },

  setProducts: products => {
    if (DEBUG) {
      console.log("Setting products:", {
        count: products.length,
        sampleCategories: products[0]?.category || [],
      });
    }

    set({ products });
    const { currentPath } = get();
    if (currentPath) {
      get().filterProductsByPath(currentPath);
    }
  },

  filterProductsByPath: pathname => {
    const { products, filters } = get();

    if (DEBUG) {
      console.log("Starting product filtering for path:", pathname);
    }

    const pathParts = pathname.split("/").filter(Boolean);
    const categoryType = pathParts[1] || "";
    const specificCategory = pathParts[2] || "";

    let filteredByPath = products;

    if (categoryType === "apparel") {
      filteredByPath = products.filter(product => {
        // Combine all searchable text
        const searchableText = [...product.category, product.productName].join(
          " "
        );

        // Check if it's an apparel product first
        if (!isApparelProduct(searchableText)) {
          return false;
        }

        // If no specific category or showing all apparel, return all apparel products
        if (!specificCategory || specificCategory === "all-in-apparel") {
          return true;
        }

        // Check for specific category matches
        return matchesCategory(searchableText, specificCategory);
      });

      if (DEBUG) {
        console.log("Category filtering results:", {
          type: categoryType,
          specific: specificCategory,
          remainingProducts: filteredByPath.length,
          sampleProducts: filteredByPath.slice(0, 3).map(p => p.productName),
        });
      }
    }

    const finalFilters = { ...filters };
    if (specificCategory === `all-in-${categoryType}`) {
      finalFilters.types = [];
    }

    const filteredProducts = applyProductFilters(filteredByPath, finalFilters);

    if (DEBUG) {
      console.log("Final filtered results:", {
        totalProducts: filteredProducts.length,
        hasVariations: filteredProducts.filter(p => p.variations.length > 0)
          .length,
        sampleProducts: filteredProducts.slice(0, 3).map(p => p.productName),
      });
    }

    set({
      filteredProducts,
      currentPath: pathname,
    });
  },

  applyFilters: (newFilters: FilterState) => {
    if (DEBUG) {
      console.log("Applying filters:", newFilters);
    }

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
    if (DEBUG) {
      console.log("Sorting products:", { sortOrder });
    }

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

    set({ filteredProducts: sortedProducts, sortOrder });
  },

  reset: () => {
    if (DEBUG) console.log("Resetting store to initial state");
    set(initialState);
  },
}));

// Selector hooks for accessing store state
export const useCategories = () => useCategoryStore(state => state.categories);
export const useFilteredProducts = () =>
  useCategoryStore(state => state.filteredProducts);
export const useCategoryLoading = () =>
  useCategoryStore(state => state.isLoading);
export const useCategoryError = () => useCategoryStore(state => state.error);
export const useCategoryInitialized = () =>
  useCategoryStore(state => state.initialized);
