"use client";

import { create } from "zustand";
import { useEffect } from "react";
import {
  uploadCategory,
  removeCategory,
  getCategories,
  getVendorCategoriesBySlug,
} from "../_actions/category-actions";

interface CategoryItem {
  url: string;
  categoryName: string;
}

interface CategoryState {
  categories: CategoryItem[];
  isLoading: boolean;
  error: string | null;
  currentVendor?: string;
}

interface CategoryActions {
  upload: (formData: FormData) => Promise<void>;
  remove: (url: string) => Promise<void>;
  fetchCategories: (storeSlug?: string) => Promise<void>;
  reset: () => void;
}

type CategoryStore = CategoryState & CategoryActions;

const initialState: CategoryState = {
  categories: [],
  isLoading: false,
  error: null,
  currentVendor: undefined,
};

export const useCategoryStore = create<CategoryStore>()((set, get) => ({
  ...initialState,

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
      const result = await uploadCategory(formData);
      if (!result.success) throw new Error(result.error || "Upload failed");

      set({
        categories: result.categories || [],
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
      const result = await removeCategory(url);
      if (!result.success) throw new Error(result.error || "Remove failed");

      set({
        categories: result.categories || [],
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

  fetchCategories: async (storeSlug?: string) => {
    const { isLoading, currentVendor } = get();
    if (isLoading) return;

    // Reset state if vendor changes
    if (currentVendor !== storeSlug) {
      set({ ...initialState, currentVendor: storeSlug });
    }

    set({ isLoading: true, error: null });
    try {
      const result = storeSlug
        ? await getVendorCategoriesBySlug(storeSlug)
        : await getCategories();

      if (!result.success) throw new Error(result.error || "Fetch failed");

      set({
        categories: result.categories || [],
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
export const useCategories = () => useCategoryStore(state => state.categories);
export const useCategoryLoading = () =>
  useCategoryStore(state => state.isLoading);
export const useCategoryError = () => useCategoryStore(state => state.error);
export const useCurrentVendor = () =>
  useCategoryStore(state => state.currentVendor);

export const useCategoryData = (storeSlug?: string) => {
  const fetchCategories = useCategoryStore(state => state.fetchCategories);
  const currentVendor = useCurrentVendor();
  const categories = useCategories();
  const isLoading = useCategoryLoading();
  const error = useCategoryError();
  const upload = useCategoryStore(state => state.upload);
  const remove = useCategoryStore(state => state.remove);

  useEffect(() => {
    // Force a fresh fetch when vendor changes
    if (storeSlug !== currentVendor) {
      fetchCategories(storeSlug);
    }
  }, [storeSlug, currentVendor, fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    upload,
    remove,
  };
};
