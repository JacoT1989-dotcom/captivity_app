// types/collection-banner.ts

export interface CollectionBannerItem {
  id: string;
  imageUrl: string;
  collectionId: string;
  title: string;
  backgroundColor: string;
  opacity: number;
}

export interface CollectionBannerState {
  banners: CollectionBannerItem[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
}

export interface CollectionBannerActions {
  upload: (formData: FormData) => Promise<void>;
  remove: (id: string) => Promise<void>;
  update: (
    id: string,
    data: {
      title: string;
      collectionId: string;
      backgroundColor?: string;
      opacity?: number;
    }
  ) => Promise<void>;
  updateWithImage: (id: string, formData: FormData) => Promise<void>;
  fetchBanners: () => Promise<void>;
  reset: () => void;
  setInitialized: (initialized: boolean) => void;
}

export type CollectionBannerStore = CollectionBannerState &
  CollectionBannerActions;
