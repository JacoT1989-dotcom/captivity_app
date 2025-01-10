import { z } from "zod";
import { Control } from "react-hook-form";

// Define size variation schema
export const vendorSizeVariationSchema = z.object({
  size: z.string().min(1, "Size is required"),
  quantity: z.number().min(0, "Quantity cannot be negative"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  sku2: z.string().optional(),
});

// Dynamic pricing schema
export const vendorDynamicPricingSchema = z.object({
  from: z.string().min(1, "From value is required"),
  to: z.string().min(1, "To value is required"),
  type: z.enum(["fixed_price", "percentage"] as const),
  amount: z.string().min(1, "Amount is required"),
});

// Featured image schema
export const vendorFeaturedImageSchema = z.object({
  file: z.any().optional(), // For the File object
  thumbnail: z.string(),
  medium: z.string(),
  large: z.string(),
});

// Color variation schema
export const vendorColorVariationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().optional(),
  variationImageURL: z.string().optional(),
  variationImage: z.any().optional(), // For the File object
  sizes: z
    .array(vendorSizeVariationSchema)
    .min(1, "At least one size is required"),
});

// Define the complete product form schema
export const vendorProductFormSchema = z.object({
  productName: z.string().min(3, "Product name must be at least 3 characters"),
  category: z.array(z.string()).min(1, "At least one category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  sellingPrice: z.number().min(0.01, "Price must be greater than 0"),
  isPublished: z.boolean(),
  dynamicPricing: z.array(vendorDynamicPricingSchema),
  variations: z.array(vendorColorVariationSchema),
  featuredImage: vendorFeaturedImageSchema,
});

// Infer types from schemas
export type VendorProductFormData = z.infer<typeof vendorProductFormSchema>;
export type VendorDynamicPricing = z.infer<typeof vendorDynamicPricingSchema>;
export type VendorSizeVariation = z.infer<typeof vendorSizeVariationSchema>;
export type VendorColorVariation = z.infer<typeof vendorColorVariationSchema>;
export type VendorFeaturedImage = z.infer<typeof vendorFeaturedImageSchema>;

// Form component prop types
export interface VendorFormTabProps {
  control: Control<VendorProductFormData>;
}

// API response types
export interface VendorApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Product creation response
export interface CreateVendorProductResponse {
  id: string;
}

// Default values
export const DEFAULT_VENDOR_SIZE_VARIATION: VendorSizeVariation = {
  size: "",
  quantity: 0,
  sku: "",
  sku2: "",
};

export const DEFAULT_VENDOR_COLOR_VARIATION: VendorColorVariation = {
  name: "",
  color: "",
  variationImageURL: "",
  variationImage: undefined,
  sizes: [DEFAULT_VENDOR_SIZE_VARIATION],
};

export const DEFAULT_VENDOR_DYNAMIC_PRICING: VendorDynamicPricing = {
  from: "",
  to: "",
  type: "fixed_price",
  amount: "",
};

export const DEFAULT_VENDOR_FEATURED_IMAGE: VendorFeaturedImage = {
  file: undefined,
  thumbnail: "",
  medium: "",
  large: "",
};
