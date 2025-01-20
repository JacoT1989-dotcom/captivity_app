// types.ts

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

export interface DynamicPricing {
  id: string;
  from: string;
  to: string;
  type: string;
  amount: string;
  productId: string;
}

export interface Product {
  id: string;
  productName: string;
  sellingPrice: number;
  dynamicPricing: DynamicPricing[];
}

export interface ProductVariations {
  [productId: string]: {
    variations: ColorVariation[];
    product?: Product;
  };
}

export interface ColorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct: string | null;
  groupedVariations: ProductVariations;
}

export interface PricingRangesProps {
  dynamicPricing: DynamicPricing[] | undefined;
  sellingPrice: number;
}
