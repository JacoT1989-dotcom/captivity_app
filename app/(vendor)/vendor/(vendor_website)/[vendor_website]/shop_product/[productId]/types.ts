import { VendorProduct, VendorVariation } from "@prisma/client";
import { z } from "zod";
import { Control } from "react-hook-form";

// ============================================================================
// Base Types and Interfaces
// ============================================================================

export interface VendorDynamicPricingRule {
  id: string;
  from: string;
  to: string;
  type: "fixed_price" | "percentage";
  amount: string;
  vendorProductId: string;
}

// Extended type with relations
export type VendorProductWithRelations = VendorProduct & {
  variations: VendorVariation[];
  featuredImage: { medium: string } | null;
  dynamicPricing: VendorDynamicPricingRule[];
};

// ============================================================================
// Component Props Types
// ============================================================================

export type VendorProductDetailsProps = {
  product: VendorProductWithRelations;
  vendorWebsite: string;
};

export type VendorAddToCartButtonProps = {
  selectedVariation: VendorVariation | null;
  quantity: number;
  disabled: boolean;
  onAddToCart?: () => void;
  className?: string;
};

export type VendorColorSelectorProps = {
  colors: string[];
  selectedColor: string | undefined;
  variations: VendorVariation[];
  onColorSelect: (color: string) => void;
  productName: string;
  className?: string;
};

export type VendorSizeSelectorProps = {
  sizes: string[];
  selectedSize: string | undefined;
  onSizeSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  className?: string;
};

export type VendorQuantitySelectorProps = {
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
};

export interface VendorProductImageProps {
  selectedVariation: VendorVariation | null;
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
  className?: string;
}

// ============================================================================
// Form Schema and Related Types
// ============================================================================

export const vendorProductFormSchema = z.object({
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
      variationImage: z.any().optional(),
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

export type VendorProductFormData = z.infer<typeof vendorProductFormSchema>;

// Form Data Types
export type VendorDynamicPricing =
  VendorProductFormData["dynamicPricing"][number];
export type VendorVariationFormData =
  VendorProductFormData["variations"][number];
export type VendorFeaturedImageFormData =
  VendorProductFormData["featuredImage"];

// ============================================================================
// Form Tab Props Types
// ============================================================================

export interface VendorFormTabBaseProps {
  control: Control<VendorProductFormData>;
  className?: string;
}

export interface VendorVariationTabProps extends VendorFormTabBaseProps {}
export interface VendorFeaturedImageTabProps extends VendorFormTabBaseProps {}
export interface VendorBasicInfoTabProps extends VendorFormTabBaseProps {}
export interface VendorDynamicPricingTabProps extends VendorFormTabBaseProps {}

// ============================================================================
// API Response Types
// ============================================================================

export interface VendorProductApiResponse {
  success: boolean;
  data?: VendorProductWithRelations;
  error?: string;
}

// ============================================================================
// Utility Types
// ============================================================================

export type VendorProductStatus = "draft" | "published" | "archived";

export interface VendorProductFilters {
  status?: VendorProductStatus;
  category?: string[];
  search?: string;
  sortBy?: "price" | "name" | "created" | "updated";
  sortOrder?: "asc" | "desc";
}
