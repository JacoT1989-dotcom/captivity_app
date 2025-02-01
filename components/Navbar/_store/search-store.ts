import { create } from "zustand";
import { PrismaProduct } from "../types";
import { getProducts } from "../search-actions";

interface SearchState {
  allProducts: PrismaProduct[];
  filteredProducts: PrismaProduct[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  searchProducts: (query: string) => void;
  clearSearch: () => void;
  initializeProducts: () => Promise<void>;
}

let isInitializing = false;
let hasInitialized = false;

export const useSearchStore = create<SearchState>((set, get) => ({
  allProducts: [],
  filteredProducts: [],
  isLoading: false,
  error: null,
  searchQuery: "",

  initializeProducts: async () => {
    if (hasInitialized || isInitializing) {
      return;
    }

    try {
      isInitializing = true;
      set({ isLoading: true });

      const result = await getProducts(100);

      if (result.success && result.data) {
        set({
          allProducts: result.data.products,
          error: null,
        });
        hasInitialized = true;
      } else {
        set({
          error: result.error || "Failed to fetch products",
          allProducts: [],
        });
      }
    } catch (error) {
      set({
        error: "An unexpected error occurred",
        allProducts: [],
      });
    } finally {
      isInitializing = false;
      set({ isLoading: false });
    }
  },

  searchProducts: (query: string) => {
    const state = get();

    if (!query.trim()) {
      set({ filteredProducts: [], searchQuery: "" });
      return;
    }

    const lowerQuery = query.toLowerCase().trim();

    const filtered = state.allProducts.filter(product => {
      // Check name
      if (product.productName.toLowerCase().includes(lowerQuery)) {
        return true;
      }

      // Check categories
      const categoryMatch = product.category.some(cat =>
        cat.toLowerCase().includes(lowerQuery)
      );
      if (categoryMatch) {
        return true;
      }

      // Check variations
      const variationMatch = product.variations.some(variation => {
        return (
          variation.name.toLowerCase().includes(lowerQuery) ||
          variation.color.toLowerCase().includes(lowerQuery) ||
          variation.sku.toLowerCase().includes(lowerQuery) ||
          variation.sku2.toLowerCase().includes(lowerQuery)
        );
      });
      if (variationMatch) return true;

      return false;
    });

    // Take first 5 results
    const limitedResults = filtered.slice(0, 5);

    set({
      filteredProducts: limitedResults,
      searchQuery: query,
    });
  },

  clearSearch: () => {
    set({
      filteredProducts: [],
      searchQuery: "",
      error: null,
    });
  },
}));
