import {
  DynamicPricing,
  FeaturedImage,
  Prisma,
  Product,
  Variation,
} from "@prisma/client";

export interface ActionResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ProductWithRelations extends Omit<Product, "reviews"> {
  dynamicPricing: DynamicPricing[];
  variations: Variation[];
  featuredImage: FeaturedImage | null;
  reviews: ReviewData[];
  canReview?: boolean;
}

export type CategoryType =
  | "winter"
  | "summer"
  | "sport"
  | "leisure"
  | "fashion"
  | "african"
  | "signature"
  | "industrial"
  | "baseball"
  | "camo"
  | "kids";

export type ReviewData = {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  orderId: string;
  verified: boolean;
};

// Define review input type for Prisma
export type ReviewInput = Omit<ReviewData, "createdAt"> & {
  createdAt: string;
};

export type ProductWithReviews = Omit<Product, "reviews"> & {
  reviews: ReviewData[];
  canReview?: boolean;
};

export type DbReview = Prisma.JsonValue;

// Your existing types...
export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  variation: {
    id: string;
    name: string;
    color: string;
    size: string;
    sku: string;
    sku2: string | null;
    variationImageURL: string | null;
  };
}

export interface ActionResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export type SubCategory =
  | "men"
  | "women"
  | "kids"
  | "hats"
  | "golfers"
  | "bottoms"
  | "caps"
  | "uncategorised";

export type CategorizedProducts = {
  [key in SubCategory]: ProductWithRelations[];
};
