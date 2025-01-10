"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect } from "react";
import {
  uploadLogo,
  removeLogo,
  getLogo,
  getVendorLogoBySlug,
  type LogoActionResult,
} from "@/app/(vendor)/actions";

interface LogoState {
  logoUrl: string | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number;
  isHydrated: boolean;
  initialized: boolean;
}

interface LogoActions {
  upload: (formData: FormData) => Promise<void>;
  remove: () => Promise<void>;
  fetchLogo: (vendorWebsite?: string) => Promise<void>;
  setLogo: (url: string | null) => void;
  setHydrated: (state: boolean) => void;
  reset: () => void;
}

type LogoStore = LogoState & LogoActions;

const CACHE_DURATION = 0.001 * 60 * 1000; // 5 minutes cache to ensure fresh data

const initialState: LogoState = {
  logoUrl: null,
  isLoading: false,
  error: null,
  lastFetched: 0,
  isHydrated: false,
  initialized: false,
};

export const useLogoStore = create<LogoStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setHydrated: (state: boolean) => set({ isHydrated: state }),

      setLogo: (url: string | null) => {
        set({
          logoUrl: url,
          lastFetched: Date.now(),
          initialized: true,
        });
      },

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
          const result = await uploadLogo(formData);
          if (!result.success) throw new Error(result.error || "Upload failed");

          set({
            logoUrl: result.url || null,
            isLoading: false,
            error: null,
            lastFetched: Date.now(),
            initialized: true,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Upload failed",
          });
          throw error;
        }
      },

      remove: async () => {
        const { isLoading } = get();
        if (isLoading) return;

        set({ isLoading: true, error: null });
        try {
          const result = await removeLogo();
          if (!result.success) throw new Error(result.error || "Remove failed");

          set({
            logoUrl: null,
            isLoading: false,
            error: null,
            lastFetched: Date.now(),
            initialized: true,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Remove failed",
          });
          throw error;
        }
      },

      fetchLogo: async (vendorWebsite?: string) => {
        const { isLoading } = get();
        if (isLoading) return;

        set({ isLoading: true, error: null });

        try {
          const result = vendorWebsite
            ? await getVendorLogoBySlug(vendorWebsite)
            : await getLogo();

          if (!result.success) throw new Error(result.error || "Fetch failed");

          set({
            logoUrl: result.url || null,
            isLoading: false,
            error: null,
            lastFetched: Date.now(),
            initialized: true,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Fetch failed",
            lastFetched: Date.now(),
          });
        }
      },
    }),
    {
      name: "vendor-logo-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        logoUrl: state.logoUrl,
        lastFetched: state.lastFetched,
        initialized: state.initialized,
      }),
      onRehydrateStorage: () => state => {
        state?.setHydrated(true);
      },
    }
  )
);

// Selector hooks
export const useLogo = () => useLogoStore(state => state.logoUrl);
export const useLogoLoading = () => useLogoStore(state => state.isLoading);
export const useLogoError = () => useLogoStore(state => state.error);
export const useLogoHydrated = () => useLogoStore(state => state.isHydrated);
export const useLogoInitialized = () =>
  useLogoStore(state => state.initialized);

export const useLogoData = (vendorWebsite?: string) => {
  const fetchLogo = useLogoStore(state => state.fetchLogo);
  const logoUrl = useLogo();
  const isHydrated = useLogoHydrated();
  const lastFetched = useLogoStore(state => state.lastFetched);

  useEffect(() => {
    // Always fetch on mount and when cache expires
    if (
      isHydrated &&
      (!lastFetched || Date.now() - lastFetched >= CACHE_DURATION)
    ) {
      fetchLogo(vendorWebsite);
    }
  }, [isHydrated, lastFetched, fetchLogo, vendorWebsite]);

  return {
    logoUrl,
    isLoading: useLogoLoading(),
    error: useLogoError(),
    upload: useLogoStore(state => state.upload),
    remove: useLogoStore(state => state.remove),
  };
};
