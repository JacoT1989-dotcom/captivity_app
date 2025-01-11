import { Prisma } from "@prisma/client";

export interface FeaturedImage {
  id: string;
  thumbnail: string;
  medium: string;
  large: string;
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

export interface DynamicPricing {
  id: string;
  from: string;
  to: string;
  type: string;
  amount: string;
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
  reviews: Prisma.JsonValue[];
  featuredImage?: FeaturedImage | null;
  variations: Variation[];
  dynamicPricing: DynamicPricing[];
}

// Filter related interfaces
export interface FilterOption {
  value: string;
  label: string;
}

export interface Filter {
  name: string;
  type: FilterType;
  options: FilterOption[];
}

export type FilterType =
  | "stockLevel"
  | "types"
  | "sizes"
  | "colors"
  | "pricingType";

export interface FilterState {
  stockLevel: string;
  sizes: string[];
  colors: string[];
  types: string[];
  pricingType?: string;
}

export interface FilterSectionProps {
  filter: Filter;
  isOpen: boolean;
  onToggle: () => void;
  selectedValues: FilterState[keyof FilterState]; // This allows for both string and string[]
  onFilterChange: (value: string) => void;
}

export interface FilterComponentProps {
  options: FilterOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

// Add new interfaces for specific filter components
export interface SizeFilterProps {
  options: FilterOption[];
  selectedValue: string[];
  onChange: (value: string) => void;
}

export interface ColorFilterProps {
  options: FilterOption[];
  selectedValue: string[];
  onChange: (value: string) => void;
}

export interface StockLevelFilterProps extends FilterComponentProps {}

export interface ProductTypeFilterProps extends FilterComponentProps {}

export interface PricingFilterProps extends FilterComponentProps {}

// Store related interfaces
export interface CategoryState {
  categories: string[];
  products: Product[];
  filteredProducts: Product[];
  currentPath: string;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  sortOrder: string;
  filters: FilterState;
}

export interface CategoryActions {
  fetchCategories: () => Promise<void>;
  setProducts: (products: Product[]) => void;
  filterProductsByPath: (pathname: string) => void;
  sortProducts: (sortOrder: string) => void;
  applyFilters: (filters: FilterState) => void;
  reset: () => void;
  getCurrentPricing: (product: Product) => DynamicPricing | null;
  getEffectivePrice: (product: Product) => number;
}

export interface CategoryStore extends CategoryState, CategoryActions {}

export interface FilterSidebarProps {
  className?: string;
  onFilterChange?: (filters: FilterState) => void;
  initialFilters?: FilterState;
}
