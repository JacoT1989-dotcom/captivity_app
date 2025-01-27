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
  onAddNew?: () => void; // Add this line
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

// Type guards
export function isHighlightedProduct(
  product: Product | HighlightedProduct
): product is HighlightedProduct {
  return (
    typeof product.id === "string" &&
    "position" in product &&
    "createdAt" in product &&
    "updatedAt" in product
  );
}

export function isStaticProduct(
  product: Product | HighlightedProduct
): product is Product {
  return typeof product.id === "number" && !("position" in product);
}

// For the products data structure in tabs
export type ProductsRecord = Record<string, Product[]>;
