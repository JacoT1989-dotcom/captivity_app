"use client";

import { create } from "zustand";
import { useEffect } from "react";
import {
  getHeroSlides,
  removeHeroSlide,
  uploadHeroSlide,
  updateHeroSlideWithImage,
} from "../_editor-actions/hero-actions";

export interface HeroSlideItem {
  id: string;
  image: string;
  backgroundColor: string;
  title: string;
  subtitle: string;
  cta: string;
}

interface HeroSlideState {
  slides: HeroSlideItem[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
}

interface HeroSlideActions {
  upload: (formData: FormData) => Promise<void>;
  remove: (id: string) => Promise<void>;
  update: (id: string, formData: FormData) => Promise<void>;
  fetchSlides: () => Promise<void>;
  reset: () => void;
  setInitialized: (initialized: boolean) => void;
}

type HeroSlideStore = HeroSlideState & HeroSlideActions;

const initialState: HeroSlideState = {
  slides: [],
  isLoading: false,
  error: null,
  initialized: false,
};

export const useHeroSlideStore = create<HeroSlideStore>()((set, get) => ({
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
      const result = await uploadHeroSlide(formData);
      if (!result.success) throw new Error(result.error || "Upload failed");

      set({
        slides: result.slides || [],
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
      const result = await removeHeroSlide(id);
      if (!result.success) throw new Error(result.error || "Remove failed");

      set({
        slides: result.slides || [],
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

  update: async (id: string, formData: FormData) => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const result = await updateHeroSlideWithImage(id, formData);
      if (!result.success) throw new Error(result.error || "Update failed");

      set({
        slides: result.slides || [],
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

  fetchSlides: async () => {
    const { isLoading, initialized } = get();
    if (isLoading || initialized) return;

    set({ isLoading: true, error: null });
    try {
      const result = await getHeroSlides();
      if (!result.success) throw new Error(result.error || "Fetch failed");

      set({
        slides: result.slides || [],
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
}));

// Selector hooks for accessing specific state values
export const useHeroSlides = () => useHeroSlideStore(state => state.slides);
export const useHeroSlideLoading = () =>
  useHeroSlideStore(state => state.isLoading);
export const useHeroSlideError = () => useHeroSlideStore(state => state.error);
export const useHeroSlideInitialized = () =>
  useHeroSlideStore(state => state.initialized);

// Main data hook that provides access to all hero slide functionality
export const useHeroSlideData = () => {
  const fetchSlides = useHeroSlideStore(state => state.fetchSlides);
  const slides = useHeroSlides();
  const isLoading = useHeroSlideLoading();
  const error = useHeroSlideError();
  const initialized = useHeroSlideInitialized();
  const upload = useHeroSlideStore(state => state.upload);
  const remove = useHeroSlideStore(state => state.remove);
  const update = useHeroSlideStore(state => state.update);

  useEffect(() => {
    if (!initialized) {
      fetchSlides();
    }
  }, [fetchSlides, initialized]);

  return {
    slides,
    isLoading,
    error,
    upload,
    remove,
    update,
    fetchSlides,
    initialized,
  };
};
