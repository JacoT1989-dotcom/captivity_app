// shared/types.ts

export type FeaturedImage = {
  id: string;
  thumbnail: string;
  medium: string;
  large: string;
  productId: number;
};

export type Variation = {
  id: string;
  name: string;
  color: string;
  size: string;
  sku: string;
  sku2: string;
  variationImageURL: string;
  quantity: number;
  productId: number;
};

export type DynamicPricing = {
  id: string;
  from: string;
  to: string;
  type: string;
  amount: string;
  productId: number;
};

export type ProductWithFeaturedImage = {
  id: string;
  productName: string;
  category: string[];
  description: string;
  sellingPrice: number;
  isPublished: boolean;
  featuredImage: FeaturedImage | null;
  variations: Variation[];
  dynamicPricing: DynamicPricing[];
  // Add any other properties that might be missing
};
