import { Prisma } from "@prisma/client";

export type QueryMode = "default" | "insensitive";

export interface UpdateStockResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ProductWithRelations {
  success: boolean;
  data?: {
    id: string;
    productName: string;
    category: string[];
    description: string;
    sellingPrice: number;
    isPublished: boolean;
    reviews: any[];
    featuredImage: {
      id: string;
      thumbnail: string;
      medium: string;
      large: string;
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
    }[];
    dynamicPricing: {
      id: string;
      from: string;
      to: string;
      type: string;
      amount: string;
    }[];
  };
  error?: string;
}

export interface ImageUrls {
  thumbnail: string;
  medium: string;
  large: string;
}

export interface ProductsResponse {
  success: boolean;
  data?: {
    products: ProductWithRelations["data"][];
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
