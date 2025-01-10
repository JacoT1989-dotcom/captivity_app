"use client";

import { create } from "zustand";
import { useEffect } from "react";
import {
  uploadBestSeller,
  removeBestSeller,
  getBestSellers,
  getVendorBestSellersBySlug,
} from "../_actions/best_seller-actions";

export interface BestSellerItem {
  url: string;
  productName: string;
}

interface BestSellerState {
  bestSellers: BestSellerItem[];
  isLoading: boolean;
  error: string | null;
  currentVendor?: string;
}

interface BestSellerActions {
  upload: (formData: FormData) => Promise<void>;
  remove: (url: string) => Promise<void>;
  fetchBestSellers: (storeSlug?: string) => Promise<void>;
  reset: () => void;
}

type BestSellerStore = BestSellerState & BestSellerActions;

const initialState: BestSellerState = {
  bestSellers: [],
  isLoading: false,
  error: null,
  currentVendor: undefined,
};

// Helper function to clear vendor storage
const clearVendorStorage = (vendorSlug: string) => {
  localStorage.removeItem(`vendor-bestseller-storage-${vendorSlug}`);
};

export const useBestSellerStore = create<BestSellerStore>()((set, get) => ({
  ...initialState,

  reset: () => {
    const { isLoading, currentVendor } = get();
    if (isLoading) return;

    if (currentVendor) {
      clearVendorStorage(currentVendor);
    }

    set(initialState);
  },

  upload: async (formData: FormData) => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const result = await uploadBestSeller(formData);
      if (!result.success) throw new Error(result.error || "Upload failed");

      set({
        bestSellers: result.urls || [],
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Upload failed",
      });
      throw error;
    }
  },

  remove: async (url: string) => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const result = await removeBestSeller(url);
      if (!result.success) throw new Error(result.error || "Remove failed");

      set({
        bestSellers: result.urls || [],
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Remove failed",
      });
      throw error;
    }
  },

  fetchBestSellers: async (storeSlug?: string) => {
    const { isLoading, currentVendor } = get();
    if (isLoading) return;

    // Reset state if vendor changes
    if (currentVendor !== storeSlug) {
      if (currentVendor) {
        clearVendorStorage(currentVendor);
      }
      set({ ...initialState, currentVendor: storeSlug });
    }

    set({ isLoading: true, error: null });
    try {
      const result = storeSlug
        ? await getVendorBestSellersBySlug(storeSlug)
        : await getBestSellers();

      if (!result.success) throw new Error(result.error || "Fetch failed");

      set({
        bestSellers: result.urls || [],
        isLoading: false,
        error: null,
        currentVendor: storeSlug,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Fetch failed",
      });
    }
  },
}));

// Selector hooks
export const useBestSellers = () =>
  useBestSellerStore(state => state.bestSellers);
export const useBestSellerLoading = () =>
  useBestSellerStore(state => state.isLoading);
export const useBestSellerError = () =>
  useBestSellerStore(state => state.error);
export const useCurrentVendor = () =>
  useBestSellerStore(state => state.currentVendor);

export const useBestSellerData = (storeSlug?: string) => {
  const fetchBestSellers = useBestSellerStore(state => state.fetchBestSellers);
  const currentVendor = useCurrentVendor();
  const bestSellers = useBestSellers();
  const isLoading = useBestSellerLoading();
  const error = useBestSellerError();
  const upload = useBestSellerStore(state => state.upload);
  const remove = useBestSellerStore(state => state.remove);

  useEffect(() => {
    // Force a fresh fetch when vendor changes
    if (storeSlug !== currentVendor) {
      fetchBestSellers(storeSlug);
    }
  }, [storeSlug, currentVendor, fetchBestSellers]);

  return {
    bestSellers,
    isLoading,
    error,
    upload,
    remove,
  };
};
