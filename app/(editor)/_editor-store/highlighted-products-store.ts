"use client";

import { create } from "zustand";
import { useEffect } from "react";
import {
  uploadNewArrival,
  updateNewArrival,
  removeNewArrival,
} from "../_editor-actions/(highlighted-products)/new-arrivals-actions";
import {
  uploadBestSeller,
  updateBestSeller,
  removeBestSeller,
} from "../_editor-actions/(highlighted-products)/best-sellers-actions";
import {
  uploadOnSaleProduct,
  updateOnSaleProduct,
  removeOnSaleProduct,
} from "../_editor-actions/(highlighted-products)/on-sale-products-actions";
import { getHighlightedProducts } from "../_editor-actions/(highlighted-products)/highlight-products-utils";

// Types for each product category
export interface HighlightedProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  rating: number;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OnSaleProduct extends HighlightedProduct {
  salePrice: number;
}

interface HighlightedProductsState {
  newArrivals: HighlightedProduct[];
  bestSellers: HighlightedProduct[];
  onSaleProducts: OnSaleProduct[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
}

interface HighlightedProductsActions {
  // New Arrivals actions
  uploadNewArrival: (formData: FormData) => Promise<void>;
  updateNewArrival: (id: string, formData: FormData) => Promise<void>;
  removeNewArrival: (id: string) => Promise<void>;

  // Best Sellers actions
  uploadBestSeller: (formData: FormData) => Promise<void>;
  updateBestSeller: (id: string, formData: FormData) => Promise<void>;
  removeBestSeller: (id: string) => Promise<void>;

  // On Sale Products actions
  uploadOnSaleProduct: (formData: FormData) => Promise<void>;
  updateOnSaleProduct: (id: string, formData: FormData) => Promise<void>;
  removeOnSaleProduct: (id: string) => Promise<void>;

  // Common actions
  fetchAllProducts: () => Promise<void>;
  reset: () => void;
  setInitialized: (initialized: boolean) => void;
}

type HighlightedProductsStore = HighlightedProductsState &
  HighlightedProductsActions;

const initialState: HighlightedProductsState = {
  newArrivals: [],
  bestSellers: [],
  onSaleProducts: [],
  isLoading: false,
  error: null,
  initialized: false,
};

export const useHighlightedProductsStore = create<HighlightedProductsStore>()(
  (set, get) => ({
    ...initialState,

    setInitialized: (initialized: boolean) => set({ initialized }),

    reset: () => {
      const { isLoading } = get();
      if (isLoading) return;
      set(initialState);
    },

    // New Arrivals actions
    uploadNewArrival: async (formData: FormData) => {
      const { isLoading } = get();
      if (isLoading) return;

      set({ isLoading: true, error: null });
      try {
        const result = await uploadNewArrival(formData);
        if (!result.success) throw new Error(result.error || "Upload failed");

        set(state => ({
          newArrivals: result.newArrivals || state.newArrivals,
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        set({
          isLoading: false,
          error: error instanceof Error ? error.message : "Upload failed",
        });
        throw error;
      }
    },

    updateNewArrival: async (id: string, formData: FormData) => {
      const { isLoading } = get();
      if (isLoading) return;

      set({ isLoading: true, error: null });
      try {
        const result = await updateNewArrival(id, formData);
        if (!result.success) throw new Error(result.error || "Update failed");

        set(state => ({
          newArrivals: result.newArrivals || state.newArrivals,
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        set({
          isLoading: false,
          error: error instanceof Error ? error.message : "Update failed",
        });
        throw error;
      }
    },

    removeNewArrival: async (id: string) => {
      const { isLoading } = get();
      if (isLoading) return;

      set({ isLoading: true, error: null });
      try {
        const result = await removeNewArrival(id);
        if (!result.success) throw new Error(result.error || "Remove failed");

        set(state => ({
          newArrivals: result.newArrivals || state.newArrivals,
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        set({
          isLoading: false,
          error: error instanceof Error ? error.message : "Remove failed",
        });
        throw error;
      }
    },

    // Best Sellers actions
    uploadBestSeller: async (formData: FormData) => {
      const { isLoading } = get();
      if (isLoading) return;

      set({ isLoading: true, error: null });
      try {
        const result = await uploadBestSeller(formData);
        if (!result.success) throw new Error(result.error || "Upload failed");

        set(state => ({
          bestSellers: result.bestSellers || state.bestSellers,
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        set({
          isLoading: false,
          error: error instanceof Error ? error.message : "Upload failed",
        });
        throw error;
      }
    },

    updateBestSeller: async (id: string, formData: FormData) => {
      const { isLoading } = get();
      if (isLoading) return;

      set({ isLoading: true, error: null });
      try {
        const result = await updateBestSeller(id, formData);
        if (!result.success) throw new Error(result.error || "Update failed");

        set(state => ({
          bestSellers: result.bestSellers || state.bestSellers,
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        set({
          isLoading: false,
          error: error instanceof Error ? error.message : "Update failed",
        });
        throw error;
      }
    },

    removeBestSeller: async (id: string) => {
      const { isLoading } = get();
      if (isLoading) return;

      set({ isLoading: true, error: null });
      try {
        const result = await removeBestSeller(id);
        if (!result.success) throw new Error(result.error || "Remove failed");

        set(state => ({
          bestSellers: result.bestSellers || state.bestSellers,
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        set({
          isLoading: false,
          error: error instanceof Error ? error.message : "Remove failed",
        });
        throw error;
      }
    },

    // On Sale Products actions
    uploadOnSaleProduct: async (formData: FormData) => {
      const { isLoading } = get();
      if (isLoading) return;

      set({ isLoading: true, error: null });
      try {
        const result = await uploadOnSaleProduct(formData);
        if (!result.success) throw new Error(result.error || "Upload failed");

        set(state => ({
          onSaleProducts: result.onSaleProducts || state.onSaleProducts,
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        set({
          isLoading: false,
          error: error instanceof Error ? error.message : "Upload failed",
        });
        throw error;
      }
    },

    updateOnSaleProduct: async (id: string, formData: FormData) => {
      const { isLoading } = get();
      if (isLoading) return;

      set({ isLoading: true, error: null });
      try {
        const result = await updateOnSaleProduct(id, formData);
        if (!result.success) throw new Error(result.error || "Update failed");

        set(state => ({
          onSaleProducts: result.onSaleProducts || state.onSaleProducts,
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        set({
          isLoading: false,
          error: error instanceof Error ? error.message : "Update failed",
        });
        throw error;
      }
    },

    removeOnSaleProduct: async (id: string) => {
      const { isLoading } = get();
      if (isLoading) return;

      set({ isLoading: true, error: null });
      try {
        const result = await removeOnSaleProduct(id);
        if (!result.success) throw new Error(result.error || "Remove failed");

        set(state => ({
          onSaleProducts: result.onSaleProducts || state.onSaleProducts,
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        set({
          isLoading: false,
          error: error instanceof Error ? error.message : "Remove failed",
        });
        throw error;
      }
    },

    // Fetch all products
    fetchAllProducts: async () => {
      const { isLoading, initialized } = get();
      if (isLoading || initialized) return;

      set({ isLoading: true, error: null });
      try {
        const result = await getHighlightedProducts();
        if (!result.success) throw new Error(result.error || "Fetch failed");

        set({
          newArrivals: result.newArrivals || [],
          bestSellers: result.bestSellers || [],
          onSaleProducts: result.onSaleProducts || [],
          isLoading: false,
          error: null,
          initialized: true,
        });
      } catch (error) {
        set({
          isLoading: false,
          error: error instanceof Error ? error.message : "Fetch failed",
          initialized: true,
        });
      }
    },
  })
);

// Selector hooks
export const useNewArrivals = () =>
  useHighlightedProductsStore(state => state.newArrivals);
export const useBestSellers = () =>
  useHighlightedProductsStore(state => state.bestSellers);
export const useOnSaleProducts = () =>
  useHighlightedProductsStore(state => state.onSaleProducts);
export const useHighlightedProductsLoading = () =>
  useHighlightedProductsStore(state => state.isLoading);
export const useHighlightedProductsError = () =>
  useHighlightedProductsStore(state => state.error);
export const useHighlightedProductsInitialized = () =>
  useHighlightedProductsStore(state => state.initialized);

// Main data hook
export const useHighlightedProductsData = () => {
  const store = useHighlightedProductsStore();
  const { fetchAllProducts } = store;
  const initialized = useHighlightedProductsInitialized();

  useEffect(() => {
    if (!initialized) {
      fetchAllProducts();
    }
  }, [fetchAllProducts, initialized]);

  return {
    newArrivals: store.newArrivals,
    bestSellers: store.bestSellers,
    onSaleProducts: store.onSaleProducts,
    isLoading: store.isLoading,
    error: store.error,
    uploadNewArrival: store.uploadNewArrival,
    updateNewArrival: store.updateNewArrival,
    removeNewArrival: store.removeNewArrival,
    uploadBestSeller: store.uploadBestSeller,
    updateBestSeller: store.updateBestSeller,
    removeBestSeller: store.removeBestSeller,
    uploadOnSaleProduct: store.uploadOnSaleProduct,
    updateOnSaleProduct: store.updateOnSaleProduct,
    removeOnSaleProduct: store.removeOnSaleProduct,
    initialized,
  };
};
