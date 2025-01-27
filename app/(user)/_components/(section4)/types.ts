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

export interface ContentProps {
  currentSlide: number;
  slidesPerView: number;
  onNext: () => void;
  onPrev: () => void;
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

// Let me break down this TypeScript type definition:

// Record<K, T> is a utility type in TypeScript that creates an object type where:

// K represents the keys (property names)
// T represents the type of values those properties will hold

// The syntax K extends keyof any means K must be a valid object property key type (string, number, or symbol).
// Here's a practical example:
// typescriptCopy// Creates a type where all keys are strings and all values are numbers
// type NumberRecord = Record<string, number>;

// // This is equivalent to:
// type NumberRecord = {
//     [key: string]: number;
// }

// // Example usage:
// const scores: NumberRecord = {
//     "john": 85,
//     "mary": 92,
//     "bob": 78
// };

// // Another example with specific keys
// type UserRoles = Record<"admin" | "user" | "guest", boolean>;

// // This creates a type equivalent to:
// type UserRoles = {
//     admin: boolean;
//     user: boolean;
//     guest: boolean;
// }

// const permissions: UserRoles = {
//     admin: true,
//     user: true,
//     guest: false
// };
// It's particularly useful when you want to create a dictionary or map-like object where you know the type of values but the keys could vary (within the constraints of K).
