import {
    Product,
    Variation,
    DynamicPricing,
    FeaturedImage,
  } from "@prisma/client";
  
  export type ProductWithRelations = Product & {
    dynamicPricing: DynamicPricing[];
    variations: Variation[];
    featuredImage: FeaturedImage | null;
  };
  
  export type VariationWithRelations = Variation & {
    product: ProductWithRelations;
  };
  
  export type ProductAndVariation = {
    product: ProductWithRelations;
    variation: Variation;
  };
  
  export type FetchVariationResult =
    | {
        success: true;
        data: VariationWithRelations;
      }
    | {
        success: false;
        error: string;
      };
  
  export type FetchProductAndVariationResult =
    | {
        success: true;
        data: ProductAndVariation;
      }
    | {
        success: false;
        error: string;
      };
  
  export type FetchVariationsResult =
    | {
        success: true;
        data: Variation[];
      }
    | {
        success: false;
        error: string;
      };
  
  export interface VariationDetailsProps {
    data: VariationWithRelations;
  }