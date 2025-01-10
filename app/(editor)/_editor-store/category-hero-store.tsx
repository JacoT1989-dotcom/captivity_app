// app/(editor)/_editor-store/headwear-hero-store.ts
"use client";

import { create } from "zustand";
import { useEffect } from "react";
import {
  getCategoryHeroes,
  removeCategoryHero,
  updateCategoryHero,
  updateCategoryHeroWithImage,
  uploadCategoryHero,
  fetchNewHeadwear,
} from "../_editor-actions/headwear-hero-actions";

export interface CategoryHeroItem {
  id: string;
  imageUrl: string;
  categoryName: string;
  title: string;
  backgroundColor: string;
  opacity: number;
}

export interface FeaturedImage {
  id: string;
  thumbnail: string;
  medium: string;
  large: string;
  productId: string;
}

export interface Product {
  id: string;
  userId: string;
  productName: string;
  category: string[];
  description: string;
  sellingPrice: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  reviews: any[];
  featuredImage: FeaturedImage | null;
}

export type ProductWithFeaturedImage = Omit<Product, "featuredImage"> & {
  featuredImage: FeaturedImage | null;
};

interface CategoryHeroState {
  heroes: CategoryHeroItem[];
  products: ProductWithFeaturedImage[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
}

interface CategoryHeroActions {
  upload: (formData: FormData) => Promise<void>;
  remove: (id: string) => Promise<void>;
  update: (
    id: string,
    data: {
      title: string;
      categoryName: string;
      backgroundColor?: string;
      opacity?: number;
    }
  ) => Promise<void>;
  updateWithImage: (id: string, formData: FormData) => Promise<void>;
  fetchHeroes: () => Promise<void>;
  fetchNewHeadwear: () => Promise<void>;
  reset: () => void;
  setInitialized: (initialized: boolean) => void;
}

type CategoryHeroStore = CategoryHeroState & CategoryHeroActions;

const initialState: CategoryHeroState = {
  heroes: [],
  products: [],
  isLoading: false,
  error: null,
  initialized: false,
};

export const useCategoryHeroStore = create<CategoryHeroStore>()((set, get) => ({
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
      const result = await uploadCategoryHero(formData);
      if (!result.success) throw new Error(result.error || "Upload failed");

      set({
        heroes: result.heroes || [],
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
      const result = await removeCategoryHero(id);
      if (!result.success) throw new Error(result.error || "Remove failed");

      set({
        heroes: result.heroes || [],
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
      categoryName: string;
      backgroundColor?: string;
      opacity?: number;
    }
  ) => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const result = await updateCategoryHero(id, data);
      if (!result.success) throw new Error(result.error || "Update failed");

      set({
        heroes: result.heroes || [],
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
      const result = await updateCategoryHeroWithImage(id, formData);
      if (!result.success) throw new Error(result.error || "Update failed");

      set({
        heroes: result.heroes || [],
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

  fetchHeroes: async () => {
    const { isLoading, initialized } = get();
    if (isLoading || initialized) return;

    set({ isLoading: true, error: null });
    try {
      const result = await getCategoryHeroes();
      if (!result.success) throw new Error(result.error || "Fetch failed");

      set({
        heroes: result.heroes || [],
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

  fetchNewHeadwear: async () => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const result = await fetchNewHeadwear();
      if (!result.success) throw new Error(result.error || "Fetch failed");

      set({
        products: result.data?.products || [],
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Fetch failed",
      });
    }
  },
}));

// Selector hooks for accessing specific state values
export const useCategoryHeroes = () =>
  useCategoryHeroStore(state => state.heroes);
export const useProducts = () => useCategoryHeroStore(state => state.products);
export const useCategoryHeroLoading = () =>
  useCategoryHeroStore(state => state.isLoading);
export const useCategoryHeroError = () =>
  useCategoryHeroStore(state => state.error);
export const useCategoryHeroInitialized = () =>
  useCategoryHeroStore(state => state.initialized);

// Main data hook that provides access to all category hero functionality
export const useCategoryHeroData = () => {
  const fetchHeroes = useCategoryHeroStore(state => state.fetchHeroes);
  const heroes = useCategoryHeroes();
  const isLoading = useCategoryHeroLoading();
  const error = useCategoryHeroError();
  const initialized = useCategoryHeroInitialized();
  const upload = useCategoryHeroStore(state => state.upload);
  const remove = useCategoryHeroStore(state => state.remove);
  const update = useCategoryHeroStore(state => state.update);
  const updateWithImage = useCategoryHeroStore(state => state.updateWithImage);

  useEffect(() => {
    if (!initialized) {
      fetchHeroes();
    }
  }, [fetchHeroes, initialized]);

  return {
    heroes,
    isLoading,
    error,
    upload,
    remove,
    update,
    updateWithImage,
    fetchHeroes,
    initialized,
  };
};
