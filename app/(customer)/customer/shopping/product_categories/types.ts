import { OrderStatus } from "@prisma/client";
import {
  Product,
  DynamicPricing,
  Variation,
  FeaturedImage,
  Prisma,
} from "@prisma/client";

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

export type ProductWithRelations = ProductWithReviews & {
  dynamicPricing: DynamicPricing[];
  variations: Variation[];
  featuredImage: FeaturedImage | null;
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

export interface Order {
  id: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  orderItems: OrderItem[];
}

export interface User {
  id: string;
  role:
    | "USER"
    | "CUSTOMER"
    | "SUBSCRIBER"
    | "PROMO"
    | "DISTRIBUTOR"
    | "SHOPMANAGER"
    | "EDITOR"
    | "ADMIN";
  isLoading?: boolean;
  orders?: Order[];
}

export interface ActionResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
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
