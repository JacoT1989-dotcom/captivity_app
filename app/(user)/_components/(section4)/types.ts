// types.ts

// Session types
export interface User {
  id: string;
  role: string;
}

export interface SessionContext {
  user: User | null;
}

// Base product interface for shared properties
export interface BaseProduct {
  title: string;
  price: number;
  image: string;
  rating: number;
}

// Static product for hardcoded data
export interface Product extends BaseProduct {
  id: number;
  salePrice?: number;
}

// Dynamic product from store
export interface HighlightedProduct extends BaseProduct {
  id: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

// Empty slot type for product grid
export interface EmptySlot {
  isEmpty: true;
  id: string;
}

// Union type for all possible slot types
export type SlotType = Product | HighlightedProduct | EmptySlot;

// Component Props
export interface BestSellersContentProps {
  currentSlide: number;
  slidesPerView: number;
  onNext: () => void;
  onPrev: () => void;
}

export interface TabNavigationProps {
  activeTab: string;
}

export interface ProductSliderProps {
  products: Array<Product | HighlightedProduct>;
  currentSlide: number;
  slidesPerView: number;
  onNext: () => void;
  onPrev: () => void;
  onEdit?: (product: HighlightedProduct) => void;
  onRemove?: (id: string) => Promise<void>;
  onAddNew?: () => void;
}

export interface ProductCardProps {
  id: string | number;
  title: string;
  price: number;
  image: string;
  rating: number;
  salePrice?: number;
  isEditor?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
}

// Modal Props
export interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: HighlightedProduct;
  onUpdate: (id: string, formData: FormData) => Promise<void>;
}

export interface ContentProps {
  currentSlide: number;
  slidesPerView: number;
  onNext: () => void;
  onPrev: () => void;
}

export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  error?: string | null;
}

// Store types
export interface HighlightedProductsState {
  newArrivals: HighlightedProduct[];
  bestSellers: HighlightedProduct[];
  onSaleProducts: HighlightedProduct[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
}

export interface HighlightProductActionResult {
  success: boolean;
  newArrivals?: HighlightedProduct[];
  bestSellers?: HighlightedProduct[];
  onSaleProducts?: HighlightedProduct[];
  error?: string;
}

// Type guards
export function isEmptySlot(item: any): item is EmptySlot {
  return item && item.isEmpty === true && typeof item.id === "string";
}

export function isHighlightedProduct(
  product: Product | HighlightedProduct | EmptySlot
): product is HighlightedProduct {
  return (
    !isEmptySlot(product) &&
    typeof (product as any).id === "string" &&
    "position" in product &&
    "createdAt" in product &&
    "updatedAt" in product
  );
}

export function isStaticProduct(
  product: Product | HighlightedProduct | EmptySlot
): product is Product {
  return (
    !isEmptySlot(product) &&
    typeof (product as any).id === "number" &&
    !("position" in product)
  );
}

// Constants
export const MAX_PRODUCTS = 8;
export const SLIDES_PER_VIEW = 4;

// For the products data structure in tabs
export type ProductsRecord = Record<string, Product[]>;

// Form data types
export interface ProductFormData {
  title: string;
  price: number;
  rating: number;
  image: File | null;
  position?: number;
  salePrice?: number;
}

// File validation types
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// User Settings types
export interface UserSettings {
  userId: string;
  NewArrival: HighlightedProduct[];
  BestSeller: HighlightedProduct[];
  OnSaleProduct: HighlightedProduct[];
}

// Upload types
export interface UploadResponse {
  url: string;
  success: boolean;
  error?: string;
}

// Filter and Sort types
export interface ProductFilters {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
}

export type SortOrder = "asc" | "desc";
export type SortField = "price" | "rating" | "createdAt" | "position";

export interface SortOptions {
  field: SortField;
  order: SortOrder;
}

// Pagination types
export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}
