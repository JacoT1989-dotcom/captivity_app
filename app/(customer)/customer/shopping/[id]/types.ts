import { Product, Variation } from "@prisma/client";
import { z } from "zod";
import { Control } from "react-hook-form";

// Existing types for product display
export type ProductWithRelations = Product & {
  variations: Variation[];
  featuredImage: { medium: string } | null;
};

export type ProductDetailsProps = {
  product: ProductWithRelations;
};

export type AddToCartButtonProps = {
  selectedVariation: Variation | null;
  quantity: number;
  disabled: boolean;
};

export type ColorSelectorProps = {
  colors: string[];
  selectedColor: string | undefined;
  variations: Variation[];
  onColorSelect: (color: string) => void;
  productName: string;
};

export type SizeSelectorProps = {
  sizes: string[];
  selectedSize: string | undefined;
  onSizeSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export type QuantitySelectorProps = {
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export interface ProductImageProps {
  selectedVariation: Variation | null;
  product: {
    id: string;
    productName: string;
    featuredImage: {
      thumbnail: string;
      medium: string;
      large: string;
    } | null;
    variations: Array<{
      id: string;
      color: string;
      variationImageURL: string;
    }>;
  };
  uniqueColors: string[];
  onColorSelect: (color: string) => void;
}

// New types for product form
export const productFormSchema = z.object({
  productName: z.string().min(3, "Product name must be at least 3 characters"),
  category: z.array(z.string()).min(1, "At least one category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  sellingPrice: z.number().min(0.01, "Price must be greater than 0"),
  isPublished: z.boolean(),
  dynamicPricing: z.array(
    z.object({
      from: z.string().min(1, "From value is required"),
      to: z.string().min(1, "To value is required"),
      type: z.enum(["fixed_price", "percentage"] as const),
      amount: z.string().min(1, "Amount is required"),
    })
  ),
  variations: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      color: z.string().optional(),
      size: z.string().optional(),
      sku: z.string().min(3, "SKU must be at least 3 characters"),
      sku2: z.string().optional(),
      variationImageURL: z.string().optional(),
      variationImage: z.any().optional(), // For the File object
      quantity: z.number().min(0, "Quantity cannot be negative"),
    })
  ),
  featuredImage: z.object({
    file: z.any().optional(),
    thumbnail: z.string(),
    medium: z.string(),
    large: z.string(),
  }),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

// Additional type helpers
export type DynamicPricing = ProductFormData["dynamicPricing"][number];
export type VariationFormData = ProductFormData["variations"][number];
export type FeaturedImageFormData = ProductFormData["featuredImage"];

// Form component prop types
export interface VariationTabProps {
  control: Control<ProductFormData>;
}

export interface FeaturedImageTabProps {
  control: Control<ProductFormData>;
}

export interface BasicInfoTabProps {
  control: Control<ProductFormData>;
}

export interface DynamicPricingTabProps {
  control: Control<ProductFormData>;
}
