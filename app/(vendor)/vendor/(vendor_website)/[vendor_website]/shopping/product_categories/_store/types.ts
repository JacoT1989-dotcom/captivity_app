export interface Product {
  id: string;
  productName: string;
  category: string[];
  description: string;
  sellingPrice: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  featuredImage?: {
    id: string;
    thumbnail: string;
    medium: string;
    large: string;
    vendorProductId: string;
  } | null;
}

export interface Collections {
  african: Product[];
  baseball: Product[];
  camo: Product[];
  fashion: Product[];
  industrial: Product[];
  kids: Product[];
  leisure: Product[];
  signature: Product[];
  sport: Product[];
  summer: Product[];
  winter: Product[];
}

export interface CollectionCounts {
  african: number;
  baseball: number;
  camo: number;
  fashion: number;
  industrial: number;
  kids: number;
  leisure: number;
  signature: number;
  sport: number;
  summer: number;
  winter: number;
}
