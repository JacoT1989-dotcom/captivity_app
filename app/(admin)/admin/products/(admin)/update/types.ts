// types.ts
import { Prisma } from "@prisma/client";

// Base Types
export type QueryMode = "default" | "insensitive";

// Product Related Types
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
  dynamicPricing: DynamicPricing[];
  featuredImage: FeaturedImage | null;
  variations: Variation[];
}

export interface DynamicPricing {
  id: string;
  from: string;
  to: string;
  type: string;
  amount: string;
  productId: string;
}

export interface Variation {
  id: string;
  name: string;
  color: string;
  size: string;
  sku: string;
  sku2: string;
  variationImageURL: string;
  quantity: number;
  productId: string;
}

export interface FeaturedImage {
  id: string;
  thumbnail: string;
  medium: string;
  large: string;
  productId: string;
}

// Collection Types
export type CollectionType = "apparel" | "headwear" | "collections";

export type ApparelCategory =
  | "all-in-apparel"
  | "new-in-apparel"
  | "men"
  | "women"
  | "kids"
  | "t-shirts"
  | "golfers"
  | "hoodies"
  | "jackets"
  | "bottoms";

export type HeadwearCategory =
  | "all-in-headwear"
  | "new-in-headwear"
  | "flat-peaks"
  | "pre-curved-peaks"
  | "hats"
  | "multifunctional-headwear"
  | "beanies"
  | "trucker-caps"
  | "bucket-hats";

export type CollectionCategory =
  | "all-in-collections"
  | "camo-collection"
  | "winter-collection"
  | "baseball-collection"
  | "fashion-collection"
  | "sport-collection"
  | "industrial-collection"
  | "leisure-collection"
  | "kids-collection"
  | "african-collection";

// Filter Types
export interface FilterState {
  stockLevel: "all" | "in-stock" | "low-stock" | "out-of-stock";
  sizes: string[];
  colors: string[];
  types: string[];
}

// API Response Types
export interface UpdateStockResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ProductWithRelations {
  success: boolean;
  data?: Product;
  error?: string;
}

export interface ProductsResponse {
  success: boolean;
  data?: {
    products: Product[];
    pagination: {
      total: number;
      pages: number;
      currentPage: number;
      perPage: number;
    };
  };
  error?: string;
}

export interface VariationStock {
  id: string;
  quantity: number;
}

// Image Types
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
] as const;

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

// Store State Types
export interface ProductState {
  // Collection States
  products: Product[];
  filteredProducts: Product[];
  apparelProducts: Product[];
  headwearProducts: Product[];
  collectionProducts: Record<CollectionCategory, Product[]>;
  currentCollection: CollectionType | null;
  currentCategory: string | null;

  // Pagination State
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;

  // UI States
  isLoading: boolean;
  error: string | null;
  filters: FilterState;
}

export interface ProductStore extends ProductState {
  // CRUD Operations
  fetchProducts: (
    page?: number,
    limit?: number,
    search?: string
  ) => Promise<void>;
  fetchProduct: (productId: string) => Promise<void>;
  updateProductStock: (
    productId: string,
    variations: VariationStock[]
  ) => Promise<void>;
  updateVariationImage: (
    productId: string,
    variationId: string,
    image: File
  ) => Promise<void>;

  // Collection Operations
  setProducts: (products: Product[]) => void;
  filterByPathname: (pathname: string) => void;
  applyFilters: (filters: FilterState) => void;
  categorizeProducts: (products: Product[]) => void;
  reset: () => void;
}
