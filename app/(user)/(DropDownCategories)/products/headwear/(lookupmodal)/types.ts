// types.ts

export interface ProductLookup {
    id: string;
    productName: string;
    sellingPrice: number;
    dynamicPricing: {
      id: string;
      from: string;
      to: string;
      type: string;
      amount: string;
      productId: string;
    }[];
  }
  
  export interface Variation {
    id: string;
    name: string;
    color: string;
    size: string;
    sku: string;
    sku2: string;
    variationImageURL: string;
    quantity: number;
    productId: string;
  }
  
  export interface ColorVariation {
    color: string;
    variations: Variation[];
  }
  
  export interface ProductVariations {
    variations: ColorVariation[];
  }
  
  export interface ProductLookupModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: string | null;
    product: ProductLookup | undefined;
    productVariations: ProductVariations | undefined;
  }