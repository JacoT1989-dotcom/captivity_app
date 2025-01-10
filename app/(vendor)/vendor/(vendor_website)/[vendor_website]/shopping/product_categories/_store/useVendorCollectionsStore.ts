import { create } from "zustand";
import { fetchVendorCollections } from "../actions";
import { Collections, CollectionCounts, Product } from "./types";

interface VendorCollectionsState {
  collections: Collections | null;
  filteredCollections: Collections | null;
  counts: CollectionCounts | null;
  isLoading: boolean;
  error: string | null;
  isFetched: boolean;
  isInitializing: boolean;
  searchQuery: string;
}

interface VendorCollectionsActions {
  fetchCollections: (vendorWebsite?: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  reset: () => void;
}

type VendorCollectionsStore = VendorCollectionsState & VendorCollectionsActions;

const initialState: VendorCollectionsState = {
  collections: null,
  filteredCollections: null,
  counts: null,
  isLoading: false,
  error: null,
  isFetched: false,
  isInitializing: false,
  searchQuery: "",
};

export const useVendorCollectionsStore = create<VendorCollectionsStore>(
  (set, get) => ({
    ...initialState,

    fetchCollections: async (vendorWebsite?: string) => {
      const state = get();
      if (
        state.isLoading ||
        state.isInitializing ||
        (state.isFetched && state.collections)
      ) {
        return;
      }

      try {
        set({ isLoading: true, error: null, isInitializing: true });
        const result = await fetchVendorCollections(vendorWebsite);

        if (result.success) {
          set({
            collections: result.collections,
            filteredCollections: result.collections,
            counts: result.counts,
            isLoading: false,
            isFetched: true,
            isInitializing: false,
          });
        } else {
          set({
            error: result.error,
            isLoading: false,
            isFetched: true,
            isInitializing: false,
          });
        }
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
          isLoading: false,
          isFetched: true,
          isInitializing: false,
        });
      }
    },

    setSearchQuery: (query: string) => {
      const collections = get().collections;
      set({ searchQuery: query });

      if (!collections) return;

      if (!query) {
        set({ filteredCollections: collections });
        return;
      }

      const searchLower = query.toLowerCase();
      const filtered = Object.entries(collections).reduce<Collections>(
        (acc, [key, products]) => ({
          ...acc,
          [key]: products.filter(
            (product: Product) =>
              product.productName.toLowerCase().includes(searchLower) ||
              product.description.toLowerCase().includes(searchLower) ||
              product.category.some((category: string) =>
                category.toLowerCase().includes(searchLower)
              )
          ),
        }),
        {} as Collections
      );

      set({ filteredCollections: filtered });
    },

    reset: () => {
      set(initialState);
    },
  })
);
