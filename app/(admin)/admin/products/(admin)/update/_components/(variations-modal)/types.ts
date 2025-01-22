// types.ts
export interface DynamicPricing {
  id: string;
  from: string;
  to: string;
  type: string;
  amount: string;
  productId: string;
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

export interface Product {
  id: string;
  productName: string;
  sellingPrice: number;
  variations: Variation[];
  dynamicPricing: DynamicPricing[];
}

export interface VariationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export interface PriceRange {
  range: string;
  quantity: {
    from: string;
    to: string;
  };
  price: number;
}

export interface PriceRangeConfig {
  from: string;
  to: string;
  label: string;
}
