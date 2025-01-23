import {
  Product,
  VariationStock,
  FilterState,
  CollectionType,
  CollectionCategory,
} from "../types";

export interface ProductStoreState {
  // Collection States
  products: Product[];
  filteredProducts: Product[];
  paginatedProducts: Product[];
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

export interface ProductStoreActions {
  fetchAllProducts: () => Promise<void>;
  fetchProducts: (
    page?: number,
    limit?: number,
    search?: string
  ) => Promise<void>;
  fetchProduct: (productId: string) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
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
  ) => Promise<void>;
  setProducts: (products: Product[]) => void;
  filterByPathname: (pathname: string) => void;
  applyFilters: (filters: FilterState) => void;
  categorizeProducts: (products: Product[]) => void;
  reset: () => void;
}

export type ProductStore = ProductStoreState & ProductStoreActions;

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
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10,
  isLoading: false,
  error: null,
  filters: {
    stockLevel: "all",
    sizes: [],
    colors: [],
    types: [],
    searchTerm: "",
  },
};
