// app/actions/_lib/vendor-validation.ts
import * as z from "zod";

export const vendorFormSchema = z.object({
  vendorBranch: z.string().min(1, "Branch is required"),
  methodOfCollection: z.string().min(1, "Collection method is required"),
  salesRep: z.string().optional().default(""),
  referenceNumber: z.string().optional().default(""),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(100, "Company name must be less than 100 characters"),
  countryRegion: z.string().min(1, "Country/Region is required"),
  streetAddress: z
    .string()
    .min(1, "Street address is required")
    .max(200, "Street address must be less than 200 characters"),
  apartmentSuite: z
    .string()
    .max(100, "Apartment/Suite must be less than 100 characters")
    .optional()
    .default(""),
  townCity: z
    .string()
    .min(1, "Town/City is required")
    .max(100, "Town/City must be less than 100 characters"),
  province: z.string().min(1, "Province is required"),
  postcode: z
    .string()
    .min(1, "Postcode is required")
    .max(20, "Postcode must be less than 20 characters")
    .regex(/^[0-9]{4,5}$/, "Invalid postcode format"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(
      /^(\+27|0)[1-9][0-9]{8}$/,
      "Invalid phone number format. Must be a valid South African number"
    ),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(100, "Email must be less than 100 characters"),
  orderNotes: z
    .string()
    .max(500, "Order notes must be less than 500 characters")
    .optional()
    .default(""),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  receiveEmailReviews: z.boolean().default(false),
});

// Constants for form validation
export const VENDOR_COLLECTION_METHODS = [
  { id: "pickup", label: "Pickup" },
  { id: "delivery", label: "Delivery" },
] as const;

export const VENDOR_PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
  "Western Cape",
] as const;

export const VENDOR_BRANCHES = [
  { id: "johannesburg", label: "Johannesburg" },
  { id: "pretoria", label: "Pretoria" },
  { id: "capetown", label: "Cape Town" },
  { id: "durban", label: "Durban" },
] as const;

// Type for the validated form data
export type VendorFormData = z.infer<typeof vendorFormSchema>;

// Validation helper functions
export function validateVendorPhone(phone: string): boolean {
  return /^(\+27|0)[1-9][0-9]{8}$/.test(phone);
}

export function validateVendorEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateVendorPostcode(postcode: string): boolean {
  return /^[0-9]{4,5}$/.test(postcode);
}

// Error messages
export const VENDOR_ERROR_MESSAGES = {
  INVALID_PHONE:
    "Invalid phone number format. Must be a valid South African number",
  INVALID_EMAIL: "Invalid email address format",
  INVALID_POSTCODE: "Invalid postcode format. Must be 4-5 digits",
  REQUIRED_FIELD: "This field is required",
  TERMS_REQUIRED: "You must agree to the terms and conditions",
  INVALID_BRANCH: "Please select a valid branch",
  INVALID_COLLECTION: "Please select a valid collection method",
  INVALID_PROVINCE: "Please select a valid province",
} as const;

// Custom hook for form error handling (if using React)
export function useVendorFormValidation(formData: Partial<VendorFormData>) {
  const errors: Partial<Record<keyof VendorFormData, string>> = {};

  if (formData.phone && !validateVendorPhone(formData.phone)) {
    errors.phone = VENDOR_ERROR_MESSAGES.INVALID_PHONE;
  }

  if (formData.email && !validateVendorEmail(formData.email)) {
    errors.email = VENDOR_ERROR_MESSAGES.INVALID_EMAIL;
  }

  if (formData.postcode && !validateVendorPostcode(formData.postcode)) {
    errors.postcode = VENDOR_ERROR_MESSAGES.INVALID_POSTCODE;
  }

  // Add more custom validations as needed

  return errors;
}

// Order status helper
export const VENDOR_ORDER_STATUS = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
} as const;

export type VendorOrderStatus = keyof typeof VENDOR_ORDER_STATUS;

// Helper function to format currency
export function formatVendorCurrency(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(amount);
}
