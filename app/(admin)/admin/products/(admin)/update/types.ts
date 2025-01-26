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
  onProductUpdate: (updatedProduct: Product) => void;
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
  imageUrl?: string;
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

// Store Types
export interface ProductStoreState {
  products: Product[];
  filteredProducts: Product[];
  paginatedProducts: Product[];
  apparelProducts: Product[];
  headwearProducts: Product[];
  collectionProducts: Record<CollectionCategory, Product[]>;
  currentCollection: CollectionType | null;
  currentCategory: string | null;
  filters: FilterState;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  isLoading: boolean;
  error: string | null;
}

export interface ProductStore extends ProductStoreState {
  fetchAllProducts: () => Promise<void>;
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
  updateProductDynamicPricing: (
    productId: string,
    pricing: { id: string; from: string; to: string; amount: number }[]
  ) => Promise<void>;
  updateVariationImage: (
    productId: string,
    variationId: string,
    image: File
  ) => Promise<UpdateStockResult>;
  deleteProduct: (productId: string) => Promise<void>;
  setProducts: (products: Product[]) => void;
  categorizeProducts: (products: Product[]) => void;
  filterByPathname: (pathname: string) => void;
  applyFilters: (filters: FilterState) => void;
  reset: () => void;
}

export const initialStoreState: ProductStoreState = {
  products: [],
  filteredProducts: [],
  paginatedProducts: [],
  apparelProducts: [],
  headwearProducts: [],
  collectionProducts: {
    "all-in-collections": [],
    "camo-collection": [],
    "winter-collection": [],
    "baseball-collection": [],
    "fashion-collection": [],
    "sport-collection": [],
    "industrial-collection": [],
    "leisure-collection": [],
    "kids-collection": [],
    "african-collection": [],
  },
  currentCollection: null,
  currentCategory: null,
  filters: {
    stockLevel: "all",
    sizes: [],
    colors: [],
    types: [],
  },
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 10,
  totalItems: 0,
  isLoading: true,
  error: null,
};
