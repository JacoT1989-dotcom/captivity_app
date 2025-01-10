"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect } from "react";
import {
  createOpeningHours,
  deleteOpeningHours,
  getOpeningHours,
  getVendorOpeningHoursBySlug,
  updateOpeningHours,
} from "../_actions/tradingHours-actions";

export interface OpeningHoursInfo {
  id: string;
  city: string;
  mondayToThursday: string;
  friday: string;
  saturdaySunday: string;
  publicHolidays: string;
  userSettingsId: string;
}

type OpeningHoursFormData = Omit<OpeningHoursInfo, "id" | "userSettingsId">;

interface OpeningHoursState {
  openingHours: OpeningHoursInfo[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number;
  isHydrated: boolean;
  initialized: boolean;
}

interface OpeningHoursActions {
  update: (id: string, data: OpeningHoursFormData) => Promise<void>;
  create: (data: OpeningHoursFormData) => Promise<void>;
  remove: (id: string) => Promise<void>;
  fetchOpeningHours: (vendorWebsite?: string) => Promise<void>;
  setOpeningHours: (openingHours: OpeningHoursInfo[]) => void;
  setHydrated: (state: boolean) => void;
  reset: () => void;
}

type OpeningHoursStore = OpeningHoursState & OpeningHoursActions;

const CACHE_DURATION = 0.001 * 60 * 1000; // 5 minutes cache to ensure fresh data

const initialState: OpeningHoursState = {
  openingHours: [],
  isLoading: false,
  error: null,
  lastFetched: 0,
  isHydrated: false,
  initialized: false,
};

export const useOpeningHoursStore = create<OpeningHoursStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setHydrated: (state: boolean) => set({ isHydrated: state }),

      setOpeningHours: (openingHours: OpeningHoursInfo[]) => {
        set({
          openingHours,
          lastFetched: Date.now(),
          initialized: true,
        });
      },

      reset: () => {
        const { isLoading } = get();
        if (isLoading) return;
        set(initialState);
      },

      update: async (id: string, data: OpeningHoursFormData) => {
        const { isLoading } = get();
        if (isLoading) return;

        set({ isLoading: true, error: null });
        try {
          const result = await updateOpeningHours(id, data);
          if (!result.success) throw new Error(result.error || "Update failed");

          const updatedData = Array.isArray(result.data)
            ? result.data
            : result.data
              ? [result.data]
              : [];

          set({
            openingHours: updatedData,
            isLoading: false,
            error: null,
            lastFetched: Date.now(),
            initialized: true,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Update failed",
          });
          throw error;
        }
      },

      create: async (data: OpeningHoursFormData) => {
        const { isLoading } = get();
        if (isLoading) return;

        set({ isLoading: true, error: null });
        try {
          const result = await createOpeningHours(data);
          if (!result.success)
            throw new Error(result.error || "Creation failed");

          const newData = Array.isArray(result.data)
            ? result.data
            : result.data
              ? [result.data]
              : [];

          set({
            openingHours: newData,
            isLoading: false,
            error: null,
            lastFetched: Date.now(),
            initialized: true,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Creation failed",
          });
          throw error;
        }
      },

      remove: async (id: string) => {
        const { isLoading } = get();
        if (isLoading) return;

        set({ isLoading: true, error: null });
        try {
          const result = await deleteOpeningHours(id);
          if (!result.success)
            throw new Error(result.error || "Deletion failed");

          const remainingData = Array.isArray(result.data) ? result.data : [];

          set({
            openingHours: remainingData,
            isLoading: false,
            error: null,
            lastFetched: Date.now(),
            initialized: true,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Deletion failed",
          });
          throw error;
        }
      },

      fetchOpeningHours: async (vendorWebsite?: string) => {
        const { isLoading } = get();
        if (isLoading) return;

        set({ isLoading: true, error: null });
        try {
          const result = vendorWebsite
            ? await getVendorOpeningHoursBySlug(vendorWebsite)
            : await getOpeningHours();

          if (!result.success) throw new Error(result.error || "Fetch failed");

          const fetchedData = Array.isArray(result.data) ? result.data : [];

          set({
            openingHours: fetchedData,
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
      name: "vendor-opening-hours-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        openingHours: state.openingHours,
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
export const useOpeningHours = () =>
  useOpeningHoursStore(state => state.openingHours);
export const useOpeningHoursLoading = () =>
  useOpeningHoursStore(state => state.isLoading);
export const useOpeningHoursError = () =>
  useOpeningHoursStore(state => state.error);
export const useOpeningHoursHydrated = () =>
  useOpeningHoursStore(state => state.isHydrated);
export const useOpeningHoursInitialized = () =>
  useOpeningHoursStore(state => state.initialized);

export const useOpeningHoursData = (vendorWebsite?: string) => {
  const fetchOpeningHours = useOpeningHoursStore(
    state => state.fetchOpeningHours
  );
  const openingHours = useOpeningHours();
  const isHydrated = useOpeningHoursHydrated();
  const lastFetched = useOpeningHoursStore(state => state.lastFetched);

  useEffect(() => {
    // Always fetch on mount and when cache expires
    if (
      isHydrated &&
      (!lastFetched || Date.now() - lastFetched >= CACHE_DURATION)
    ) {
      fetchOpeningHours(vendorWebsite);
    }
  }, [isHydrated, lastFetched, fetchOpeningHours, vendorWebsite]);

  return {
    openingHours,
    isLoading: useOpeningHoursLoading(),
    error: useOpeningHoursError(),
    update: useOpeningHoursStore(state => state.update),
    create: useOpeningHoursStore(state => state.create),
    remove: useOpeningHoursStore(state => state.remove),
  };
};
