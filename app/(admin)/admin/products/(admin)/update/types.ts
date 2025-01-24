import { Prisma } from "@prisma/client";

// Base Types
export type QueryMode = "default" | "insensitive";

// Image Types and Constants
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

// Filter Types
export interface FilterState {
  stockLevel: "all" | "in-stock" | "low-stock" | "out-of-stock";
  sizes: string[];
  colors: string[];
  types: string[];
  searchTerm?: string;
}

// Price Range Types
export interface PriceRange {
  id: string;
  range: string;
  quantity: {
    from: string;
    to: string;
  };
  price: number;
}

export interface PriceRangeConfig {
  from: string;
  to: string;
  label: string;
}

export interface EditablePriceRange extends PriceRange {
  editedPrice: string;
}

// Component Props Types
export interface VariationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export interface PriceRangesSectionProps {
  product: Product;
  updateLocalProduct: (product: Product) => void;
}

// API Response Types
export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ImageUploadResponse extends ApiResponse {
  imageUrl?: string;
}

export interface ProductResponse extends ApiResponse {
  data?: Product;
}

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
