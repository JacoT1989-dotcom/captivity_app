"use client";

import { create } from "zustand";
import { useEffect } from "react";
import {
  getCollectionBanners,
  removeCollectionBanner,
  updateCollectionBanner,
  updateCollectionBannerWithImage,
  uploadCollectionBanner,
} from "./hero-upload-actions";
import {
  CollectionBannerItem,
  CollectionBannerState,
  CollectionBannerStore,
} from "./collection-banner-types";

const initialState: CollectionBannerState = {
  banners: [],
  isLoading: false,
  error: null,
  initialized: false,
};

// Helper function to transform server data to match our types
const transformBannerData = (banners: any[]): CollectionBannerItem[] => {
  return banners.map(banner => ({
    ...banner,
    type: "collection" as const,
  }));
};

export const useCollectionBannerStore = create<CollectionBannerStore>()(
  (set, get) => ({
    ...initialState,

    setInitialized: (initialized: boolean) => set({ initialized }),

    reset: () => {
      const { isLoading } = get();
      if (isLoading) return;
      set(initialState);
    },

    upload: async (formData: FormData) => {
      const { isLoading } = get();
      if (isLoading) return;

      set({ isLoading: true, error: null });
      try {
        const result = await uploadCollectionBanner(formData);
        if (!result.success) throw new Error(result.error || "Upload failed");

        set({
          banners: transformBannerData(result.banners || []),
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

    remove: async (id: string) => {
      const { isLoading } = get();
      if (isLoading) return;

      set({ isLoading: true, error: null });
      try {
        const result = await removeCollectionBanner(id);
        if (!result.success) throw new Error(result.error || "Remove failed");

        set({
          banners: transformBannerData(result.banners || []),
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

    update: async (
      id: string,
      data: {
        title: string;
        collectionId: string;
        backgroundColor?: string;
        opacity?: number;
      }
    ) => {
      const { isLoading } = get();
      if (isLoading) return;

      set({ isLoading: true, error: null });
      try {
        const result = await updateCollectionBanner(id, data);
        if (!result.success) throw new Error(result.error || "Update failed");

        set({
          banners: transformBannerData(result.banners || []),
          isLoading: false,
          error: null,
        });
      } catch (error) {
        set({
          isLoading: false,
          error: error instanceof Error ? error.message : "Update failed",
        });
        throw error;
      }
    },

    updateWithImage: async (id: string, formData: FormData) => {
      const { isLoading } = get();
      if (isLoading) return;

      set({ isLoading: true, error: null });
      try {
        const result = await updateCollectionBannerWithImage(id, formData);
        if (!result.success) throw new Error(result.error || "Update failed");

        set({
          banners: transformBannerData(result.banners || []),
          isLoading: false,
          error: null,
        });
      } catch (error) {
        set({
          isLoading: false,
          error: error instanceof Error ? error.message : "Update failed",
        });
        throw error;
      }
    },

    fetchBanners: async () => {
      const { isLoading, initialized } = get();
      if (isLoading || initialized) return;

      set({ isLoading: true, error: null });
      try {
        const result = await getCollectionBanners();
        if (!result.success) throw new Error(result.error || "Fetch failed");

        set({
          banners: transformBannerData(result.banners || []),
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

// Selector hooks for accessing specific state values
export const useCollectionBanners = () =>
  useCollectionBannerStore(state => state.banners);
export const useCollectionBannerLoading = () =>
  useCollectionBannerStore(state => state.isLoading);
export const useCollectionBannerError = () =>
  useCollectionBannerStore(state => state.error);
export const useCollectionBannerInitialized = () =>
  useCollectionBannerStore(state => state.initialized);

// Main data hook that provides access to all collection banner functionality
export const useCollectionBannerData = () => {
  const fetchBanners = useCollectionBannerStore(state => state.fetchBanners);
  const banners = useCollectionBanners();
  const isLoading = useCollectionBannerLoading();
  const error = useCollectionBannerError();
  const initialized = useCollectionBannerInitialized();
  const upload = useCollectionBannerStore(state => state.upload);
  const remove = useCollectionBannerStore(state => state.remove);
  const update = useCollectionBannerStore(state => state.update);
  const updateWithImage = useCollectionBannerStore(
    state => state.updateWithImage
  );

  useEffect(() => {
    if (!initialized) {
      fetchBanners();
    }
  }, [fetchBanners, initialized]);

  return {
    banners,
    isLoading,
    error,
    upload,
    remove,
    update,
    updateWithImage,
    fetchBanners,
    initialized,
  };
};
