// types/hero-types.ts

// Base Hero interface for shared properties
export interface BaseHeroItem {
  id: string;
  imageUrl: string;
  title: string;
  backgroundColor: string;
  opacity: number;
}

// Category Hero types
export interface CategoryHeroItem extends BaseHeroItem {
  type: "category";
  categoryName: string;
}

export interface CategoryHeroState {
  heroes: CategoryHeroItem[];
  products: ProductWithFeaturedImage[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
}

export interface CategoryHeroActions {
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

export type CategoryHeroStore = CategoryHeroState & CategoryHeroActions;

// Collection Banner types
export interface CollectionBannerItem extends BaseHeroItem {
  type: "collection";
  collectionId: string;
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

// Shared Hero Types
export type HeroData = CategoryHeroItem | CollectionBannerItem;

export type HeroType = HeroData["type"];

export interface BaseHeroUpdateData {
  title: string;
  backgroundColor?: string;
  opacity?: number;
}

export interface CategoryHeroUpdateData extends BaseHeroUpdateData {
  categoryName: string;
}

export interface CollectionBannerUpdateData extends BaseHeroUpdateData {
  collectionId: string;
}

export type HeroUpdateData =
  | CategoryHeroUpdateData
  | CollectionBannerUpdateData;

// Product types
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

// Hero Response Types
export interface HeroActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CategoryHeroActionResult
  extends HeroActionResult<{
    heroes: CategoryHeroItem[];
    products?: ProductWithFeaturedImage[];
  }> {}

export interface CollectionBannerActionResult
  extends HeroActionResult<{
    banners: CollectionBannerItem[];
  }> {}

// Helper type guards
export function isCategoryHero(hero: HeroData): hero is CategoryHeroItem {
  return hero.type === "category";
}

export function isCollectionBanner(
  hero: HeroData
): hero is CollectionBannerItem {
  return hero.type === "collection";
}
