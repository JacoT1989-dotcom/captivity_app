import { create } from "zustand";
import { searchProducts as searchProductsApi } from "../search-actions";
import { PrismaProduct, SearchParams, SearchResult } from "../types";

interface SearchState {
  products: PrismaProduct[];
  isLoading: boolean;
  error: string | null;
  searchParams: SearchParams;
  setSearchParams: (params: Partial<SearchParams>) => void;
  searchProducts: () => Promise<void>;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>()((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  searchParams: {
    query: "",
    limit: 5,
    isPublished: true,
  },

  setSearchParams: params => {
    const currentParams = get().searchParams;
    const newParams = {
      ...currentParams,
      ...params,
    };
    console.log("Setting search params:", newParams);
    set({ searchParams: newParams });
  },

  searchProducts: async () => {
    const { searchParams } = get();
    console.log("Starting search with params:", searchParams);

    if (!searchParams.query || searchParams.query.length < 2) {
      console.log("Search query too short");
      return;
    }

    set({ isLoading: true });

    try {
      const result: SearchResult = await searchProductsApi(searchParams);
      console.log("Raw search result:", result);

      // Early return for unsuccessful search
      if (!result.success) {
        console.log("Search unsuccessful:", result.error);
        set({
          products: [],
          error: result.error || "Search failed",
          isLoading: false,
        });
        return;
      }

      // Check if data exists and has products
      if (result.data?.products) {
        console.log("Found products:", result.data.products.length);
        set({
          products: result.data.products,
          error: null,
          isLoading: false,
        });

        // Log the current state after update
        const currentState = get();
        console.log("Current state after update:", {
          productsCount: currentState.products.length,
          isLoading: currentState.isLoading,
          error: currentState.error,
        });
      } else {
        console.log("No products in response");
        set({
          products: [],
          error: "No products found",
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      set({
        products: [],
        error: "An unexpected error occurred",
        isLoading: false,
      });
    }
  },

  clearSearch: () => {
    console.log("Clearing search state");
    set({
      products: [],
      searchParams: {
        query: "",
        limit: 5,
        isPublished: true,
      },
      error: null,
    });
  },
}));
