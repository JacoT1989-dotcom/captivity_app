import { Prisma } from "@prisma/client";

export type StockLevelType = "all" | "in" | "out";
export type SortOrderType =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | "newest";

export interface DynamicPricing {
  id: string;
  from: string;
  to: string;
  type: string;
  amount: string;
  productId: string;
}

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
  dynamicPricing: DynamicPricing[];
  featuredImage?: FeaturedImage | null;
  variations: Variation[];
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface Filter {
  name: string;
  type: FilterType;
  options: FilterOption[];
}

export type FilterType = "stockLevel" | "types" | "sizes" | "colors";

export interface FilterState {
  stockLevel: StockLevelType;
  sizes: string[];
  colors: string[];
  types: string[];
}

export interface FilterSectionProps {
  filter: Filter;
  isOpen: boolean;
  onToggle: () => void;
  selectedValues: string | string[];
  onFilterChange: (value: string) => void;
}

export interface FilterComponentProps {
  options: FilterOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

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

export interface CategoryState {
  categories: string[];
  products: Product[];
  filteredProducts: Product[];
  currentPath: string;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  sortOrder: SortOrderType;
  filters: FilterState;
}

export interface CategoryActions {
  fetchCategories: () => Promise<void>;
  setProducts: (products: Product[]) => void;
  filterProductsByPath: (pathname: string) => void;
  sortProducts: (sortOrder: SortOrderType) => void;
  applyFilters: (filters: FilterState) => void;
  reset: () => void;
}

export interface CategoryStore extends CategoryState, CategoryActions {}

export interface FilterSidebarProps {
  className?: string;
  onFilterChange?: (filters: FilterState) => void;
  initialFilters?: FilterState;
}
