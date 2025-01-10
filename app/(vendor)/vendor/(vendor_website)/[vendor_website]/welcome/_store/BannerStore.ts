"use client";

import { create } from "zustand";
import { useEffect } from "react";
import {
  uploadBanner,
  removeBanner,
  getBanners,
  getVendorBannersBySlug,
} from "../_actions/banner-actions";

interface BannerItem {
  url: string;
}

interface BannerState {
  banners: BannerItem[];
  isLoading: boolean;
  error: string | null;
  currentVendor?: string;
}

interface BannerActions {
  upload: (formData: FormData) => Promise<void>;
  remove: (url: string) => Promise<void>;
  fetchBanners: (storeSlug?: string) => Promise<void>;
  reset: () => void;
}

type BannerStore = BannerState & BannerActions;

const initialState: BannerState = {
  banners: [],
  isLoading: false,
  error: null,
  currentVendor: undefined,
};

export const useBannerStore = create<BannerStore>()((set, get) => ({
  ...initialState,

  reset: () => set(initialState),

  upload: async (formData: FormData) => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const result = await uploadBanner(formData);
      if (!result.success) throw new Error(result.error || "Upload failed");

      set({
        banners: (result.urls || []).map(url => ({ url })),
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
      const result = await removeBanner(url);
      if (!result.success) throw new Error(result.error || "Remove failed");

      set({
        banners: (result.urls || []).map(url => ({ url })),
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

  fetchBanners: async (storeSlug?: string) => {
    const { isLoading, currentVendor } = get();
    if (isLoading) return;

    // Reset state if vendor changes
    if (currentVendor !== storeSlug) {
      set({ ...initialState, currentVendor: storeSlug });
    }

    set({ isLoading: true, error: null });
    try {
      const result = storeSlug
        ? await getVendorBannersBySlug(storeSlug)
        : await getBanners();

      if (!result.success) throw new Error(result.error || "Fetch failed");

      set({
        banners: (result.urls || []).map(url => ({ url })),
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

export const useBanners = () => useBannerStore(state => state.banners);
export const useBannerLoading = () => useBannerStore(state => state.isLoading);
export const useBannerError = () => useBannerStore(state => state.error);

export const useBannerData = (storeSlug?: string) => {
  const fetchBanners = useBannerStore(state => state.fetchBanners);
  const reset = useBannerStore(state => state.reset);
  const banners = useBannerStore(state => state.banners);
  const isLoading = useBannerStore(state => state.isLoading);
  const error = useBannerStore(state => state.error);
  const upload = useBannerStore(state => state.upload);
  const remove = useBannerStore(state => state.remove);

  useEffect(() => {
    // Fetch fresh data whenever the storeSlug changes
    fetchBanners(storeSlug);

    // Cleanup on unmount or vendor change
    return () => {
      reset();
    };
  }, [storeSlug, fetchBanners, reset]);

  return {
    banners,
    isLoading,
    error,
    upload,
    remove,
  };
};
