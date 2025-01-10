"use client";

import { create } from "zustand";
import { useEffect } from "react";
import {
  getCollections,
  removeCollection,
  updateCollection,
  uploadCollection,
} from "../_editor-actions/section2-actions";

export interface CollectionItem {
  id: string;
  type: string;
  title: string;
  image: string;
  href: string;
  position: number;
  backgroundColor?: string;
}

type CollectionResponse = {
  id: string;
  type: string;
  title: string;
  image: string;
  href: string;
  position: number;
  backgroundColor: string | null;
};

interface CollectionState {
  collections: CollectionItem[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
}

interface CollectionActions {
  upload: (formData: FormData) => Promise<void>;
  remove: (id: string) => Promise<void>;
  update: (id: string, formData: FormData) => Promise<void>;
  fetchCollections: () => Promise<void>;
  reset: () => void;
  setInitialized: (initialized: boolean) => void;
}

const transformCollections = (
  collections: CollectionResponse[]
): CollectionItem[] => {
  return collections.map(collection => ({
    ...collection,
    backgroundColor: collection.backgroundColor || undefined,
  }));
};

type CollectionStore = CollectionState & CollectionActions;

const initialState: CollectionState = {
  collections: [],
  isLoading: false,
  error: null,
  initialized: false,
};

export const useCollectionStore = create<CollectionStore>()((set, get) => ({
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
      const result = await uploadCollection(formData);
      if (!result.success) throw new Error(result.error || "Upload failed");

      set({
        collections: transformCollections(
          (result.collections as CollectionResponse[]) || []
        ),
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
      const result = await removeCollection(id);
      if (!result.success) throw new Error(result.error || "Remove failed");

      set({
        collections: transformCollections(
          (result.collections as CollectionResponse[]) || []
        ),
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
      const result = await updateCollection(id, formData);
      if (!result.success) throw new Error(result.error || "Update failed");

      set({
        collections: transformCollections(
          (result.collections as CollectionResponse[]) || []
        ),
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

  fetchCollections: async () => {
    const { isLoading, initialized } = get();
    if (isLoading || initialized) return;

    set({ isLoading: true, error: null });
    try {
      const result = await getCollections();
      if (!result.success) throw new Error(result.error || "Fetch failed");

      set({
        collections: transformCollections(
          (result.collections as CollectionResponse[]) || []
        ),
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

export const useCollections = () =>
  useCollectionStore(state => state.collections);
export const useCollectionLoading = () =>
  useCollectionStore(state => state.isLoading);
export const useCollectionError = () =>
  useCollectionStore(state => state.error);
export const useCollectionInitialized = () =>
  useCollectionStore(state => state.initialized);

export const useCollectionData = () => {
  const fetchCollections = useCollectionStore(state => state.fetchCollections);
  const collections = useCollections();
  const isLoading = useCollectionLoading();
  const error = useCollectionError();
  const initialized = useCollectionInitialized();
  const upload = useCollectionStore(state => state.upload);
  const remove = useCollectionStore(state => state.remove);
  const update = useCollectionStore(state => state.update);

  useEffect(() => {
    if (!initialized) {
      fetchCollections();
    }
  }, [fetchCollections, initialized]);

  return {
    collections,
    isLoading,
    error,
    upload,
    remove,
    update,
    fetchCollections,
    initialized,
  };
};
