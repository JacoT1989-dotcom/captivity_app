import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  fetchAllCollections,
  toggleProductPublishStatus,
  type FetchCollectionsResult,
} from "../actions";
import { type CollectionCounts } from "../types";

interface FeaturedImage {
  thumbnail: string;
  medium: string;
  large: string;
}

interface Product {
  id: string;
  productName: string;
  category: string[];
  description: string;
  sellingPrice: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  featuredImage?: FeaturedImage | null;
}

type CollectionNames = keyof CollectionCounts;

type Collections = {
  [K in CollectionNames]: Product[];
};

interface CollectionsState {
  collections: Collections;
  counts: CollectionCounts;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  fetchCollections: () => Promise<void>;
  toggleProductStatus: (productId: string) => Promise<boolean>;
  updateProductInCollections: (productId: string, isPublished: boolean) => void;
}

type PersistedState = Pick<
  CollectionsState,
  "collections" | "counts" | "lastFetched"
>;

const FETCH_COOLDOWN = 60000; // 1 minute cooldown

// Request tracking outside of store to persist across re-renders
const requestTracker = {
  currentRequest: null as Promise<void> | null,
  lastFetchTimestamp: 0,
  isFetching: false,
};

const DEFAULT_COLLECTIONS: Collections = {
  winter: [],
  summer: [],
  camo: [],
  baseball: [],
  signature: [],
  fashion: [],
  leisure: [],
  sport: [],
  african: [],
  industrial: [],
};

const DEFAULT_COUNTS: CollectionCounts = {
  winter: 0,
  summer: 0,
  camo: 0,
  baseball: 0,
  signature: 0,
  fashion: 0,
  leisure: 0,
  sport: 0,
  african: 0,
  industrial: 0,
};

export const useCollectionsStore = create<CollectionsState>()(
  devtools(
    persist(
      (set, get) => ({
        collections: DEFAULT_COLLECTIONS,
        counts: DEFAULT_COUNTS,
        isLoading: false,
        error: null,
        lastFetched: null,

        fetchCollections: async () => {
          const now = Date.now();

          // Return existing request if one is in progress
          if (requestTracker.currentRequest) {
            return requestTracker.currentRequest;
          }

          // Check if we have data and if it's fresh enough
          const hasData = Object.values(get().collections).some(
            collection => collection.length > 0
          );
          const isFreshEnough =
            now - requestTracker.lastFetchTimestamp < FETCH_COOLDOWN;

          if (hasData && isFreshEnough && !requestTracker.isFetching) {
            return;
          }

          // Prevent concurrent requests
          if (requestTracker.isFetching) {
            return;
          }

          requestTracker.isFetching = true;

          // Create new request
          requestTracker.currentRequest = (async () => {
            set({ isLoading: true, error: null });

            try {
              const response = await fetchAllCollections();

              if (response.success) {
                set({
                  collections: response.collections as Collections,
                  counts: response.counts as CollectionCounts,
                  isLoading: false,
                  lastFetched: now,
                });
                requestTracker.lastFetchTimestamp = now;
              } else {
                set({ error: response.error, isLoading: false });
              }
            } catch (error) {
              set({
                error:
                  error instanceof Error
                    ? error.message
                    : "An unexpected error occurred",
                isLoading: false,
              });
            } finally {
              requestTracker.currentRequest = null;
              requestTracker.isFetching = false;
            }
          })();

          return requestTracker.currentRequest;
        },

        toggleProductStatus: async (productId: string) => {
          try {
            const response = await toggleProductPublishStatus(productId);
            if (response.success) {
              get().updateProductInCollections(productId, response.isPublished);
              return true;
            }
            set({ error: response.error });
            return false;
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "An unexpected error occurred",
            });
            return false;
          }
        },

        updateProductInCollections: (
          productId: string,
          isPublished: boolean
        ) => {
          set((state: CollectionsState) => {
            const newCollections = { ...state.collections };
            let updated = false;

            (Object.keys(newCollections) as CollectionNames[]).forEach(key => {
              const collection = newCollections[key];
              const productIndex = collection.findIndex(
                p => p.id === productId
              );

              if (productIndex !== -1) {
                updated = true;
                newCollections[key] = [
                  ...collection.slice(0, productIndex),
                  { ...collection[productIndex], isPublished },
                  ...collection.slice(productIndex + 1),
                ];
              }
            });

            if (!updated) return state;

            const newCounts = Object.entries(newCollections).reduce(
              (acc, [key, products]) => ({
                ...acc,
                [key]: products.length,
              }),
              {} as CollectionCounts
            );

            return {
              ...state,
              collections: newCollections,
              counts: newCounts,
            };
          });
        },
      }),
      {
        name: "collections-store",
        partialize: (state: CollectionsState): PersistedState => ({
          collections: state.collections,
          counts: state.counts,
          lastFetched: state.lastFetched,
        }),
        merge: (
          persistedState: unknown,
          currentState: CollectionsState
        ): CollectionsState => {
          const typedPersistedState = persistedState as Partial<PersistedState>;

          return {
            ...currentState,
            collections:
              typedPersistedState?.collections ?? DEFAULT_COLLECTIONS,
            counts: typedPersistedState?.counts ?? DEFAULT_COUNTS,
            lastFetched: typedPersistedState?.lastFetched ?? null,
            isLoading: false,
            error: null,
          };
        },
      }
    ),
    {
      name: "collections-store",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);
