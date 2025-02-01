import { Prisma } from "@prisma/client";

export interface DynamicPricing {
  id: string;
  from: string;
  to: string;
  type: string;
  amount: string;
  productId: string;
}

export interface PrismaProduct {
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
  featuredImage?: {
    id: string;
    thumbnail: string;
    medium: string;
    large: string;
    productId: string;
  } | null;
  variations: {
    id: string;
    name: string;
    color: string;
    size: string;
    sku: string;
    sku2: string;
    variationImageURL: string;
    quantity: number;
    productId: string;
  }[];
}

export interface SearchParams {
  query?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  isPublished?: boolean;
  sortBy?:
    | "price_asc"
    | "price_desc"
    | "name_asc"
    | "name_desc"
    | "newest"
    | "oldest";
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  success: boolean;
  data?: {
    // Note the optional (?) data property
    products: PrismaProduct[];
    total: number;
  };
  error?: string;
}
