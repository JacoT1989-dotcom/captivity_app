import { z } from "zod";
import { Control } from "react-hook-form";

// Define size variation schema
export const sizeVariationSchema = z.object({
  size: z.string().min(1, "Size is required"),
  quantity: z.number().min(0, "Quantity cannot be negative"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  sku2: z.string().optional(),
});

// Dynamic pricing schema
export const dynamicPricingSchema = z.object({
  from: z.string().min(1, "From value is required"),
  to: z.string().min(1, "To value is required"),
  type: z.enum(["fixed_price", "percentage"] as const),
  amount: z.string().min(1, "Amount is required"),
});

// Featured image schema
export const featuredImageSchema = z.object({
  file: z.any().optional(), // For the File object
  thumbnail: z.string(),
  medium: z.string(),
  large: z.string(),
});

// Color variation schema
export const colorVariationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().optional(),
  variationImageURL: z.string().optional(),
  variationImage: z.any().optional(), // For the File object
  sizes: z.array(sizeVariationSchema).min(1, "At least one size is required"),
});

// Define the complete product form schema
export const productFormSchema = z.object({
  productName: z.string().min(3, "Product name must be at least 3 characters"),
  category: z.array(z.string()).min(1, "At least one category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  sellingPrice: z.number().min(0.01, "Price must be greater than 0"),
  isPublished: z.boolean(),
  dynamicPricing: z.array(dynamicPricingSchema),
  variations: z.array(colorVariationSchema),
  featuredImage: featuredImageSchema,
});

// Infer types from schemas
export type ProductFormData = z.infer<typeof productFormSchema>;
export type DynamicPricing = z.infer<typeof dynamicPricingSchema>;
export type SizeVariation = z.infer<typeof sizeVariationSchema>;
export type ColorVariation = z.infer<typeof colorVariationSchema>;
export type FeaturedImage = z.infer<typeof featuredImageSchema>;

// Extended types for file handling
export interface FileWithPreview extends File {
  preview?: string;
}

// Form component prop types
export interface FormTabProps {
  control: Control<ProductFormData>;
}

export interface VariationTabProps extends FormTabProps {
  control: Control<ProductFormData>;
}

export interface FeaturedImageTabProps extends FormTabProps {
  control: Control<ProductFormData>;
}

export interface BasicInfoTabProps extends FormTabProps {
  control: Control<ProductFormData>;
}

export interface DynamicPricingTabProps extends FormTabProps {
  control: Control<ProductFormData>;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Product creation response
export interface CreateProductResponse {
  id: string;
}

// Size validation
export const validateSize = (size: string): boolean => {
  return size.length > 0;
};

// SKU validation
export const validateSKU = (sku: string): boolean => {
  return sku.length >= 3;
};

// Price validation
export const validatePrice = (price: number): boolean => {
  return price > 0;
};

// Quantity validation
export const validateQuantity = (quantity: number): boolean => {
  return quantity >= 0;
};

// Category validation
export const validateCategory = (categories: string[]): boolean => {
  return categories.length > 0 && categories.every(cat => cat.length > 0);
};

// Image file validation
export const validateImageFile = (file: File | undefined): boolean => {
  if (!file) return true; // Optional
  const validTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];
  return validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024; // 5MB limit
};

// Dynamic pricing validation
export const validateDynamicPricing = (
  dynamicPricing: DynamicPricing
): boolean => {
  return (
    dynamicPricing.from.length > 0 &&
    dynamicPricing.to.length > 0 &&
    dynamicPricing.amount.length > 0
  );
};

// Color variation validation
export const validateColorVariation = (variation: ColorVariation): boolean => {
  return (
    variation.name.length > 0 &&
    variation.sizes.length > 0 &&
    variation.sizes.every(
      size => validateSize(size.size) && validateSKU(size.sku)
    )
  );
};

export const DEFAULT_SIZE_VARIATION: SizeVariation = {
  size: "",
  quantity: 0,
  sku: "",
  sku2: "",
};

export const DEFAULT_COLOR_VARIATION: ColorVariation = {
  name: "",
  color: "",
  variationImageURL: "",
  variationImage: undefined,
  sizes: [DEFAULT_SIZE_VARIATION],
};

export const DEFAULT_DYNAMIC_PRICING: DynamicPricing = {
  from: "",
  to: "",
  type: "fixed_price",
  amount: "",
};

export const DEFAULT_FEATURED_IMAGE: FeaturedImage = {
  file: undefined,
  thumbnail: "",
  medium: "",
  large: "",
};
