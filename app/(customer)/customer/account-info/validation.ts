import { z } from "zod";

// Base validators

// Personal Information Update Schema
export const updatePersonalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  displayName: z.string().min(1, "Display name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "phone no is required to be 10 numbers"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  bio: z.string().optional(),
  avatarUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

// Address Update Schema
export const updateAddressSchema = z.object({
  streetAddress: z.string().min(1, "Street address is required"),
  addressLine2: z.string().optional(),
  suburb: z.string().optional(),
  townCity: z.string().min(1, "Town/City is required"),
  postcode: z.string().min(1, "Postcode is required"),
  country: z.enum([
    "southAfrica",
    "namibia",
    "botswana",
    "zimbabwe",
    "mozambique",
  ]),
});

// Business Information Base Schema (without refinement)
const businessInfoBase = z.object({
  companyName: z.string().min(1, "Company name is required"),
  vatNumber: z.string().optional(),
  ckNumber: z.string().optional(),
  position: z.string().optional(),
  natureOfBusiness: z.enum([
    "distributors",
    "retailer",
    "manufacturer",
    "service",
    "other",
  ]),
  currentSupplier: z.enum([
    "none",
    "supplier1",
    "supplier2",
    "supplier3",
    "other",
  ]),
  otherSupplier: z.string().optional(),
  resellingLocation: z.string().optional(),
  salesRep: z.enum(["noOne", "rep1", "rep2", "rep3", "rep4"]),
});

// Full Business Information Schema with refinement
export const updateBusinessInfoSchema = businessInfoBase.refine(
  data => {
    if (data.currentSupplier === "other" && !data.otherSupplier) {
      return false;
    }
    return true;
  },
  {
    message: "Please specify the other supplier",
    path: ["otherSupplier"],
  }
);

// Password Update Schema
export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

// Complete Profile Update Schema
export const completeProfileUpdateSchema = z.object({
  personal: updatePersonalInfoSchema,
  address: updateAddressSchema,
  business: updateBusinessInfoSchema,
});

// Partial schemas for when only some fields are being updated
export const partialPersonalInfoSchema = updatePersonalInfoSchema.partial();
export const partialAddressSchema = updateAddressSchema.partial();
export const partialBusinessInfoSchema = businessInfoBase.partial();

// Type exports
export type UpdatePersonalInfoValues = z.infer<typeof updatePersonalInfoSchema>;
export type UpdateAddressValues = z.infer<typeof updateAddressSchema>;
export type UpdateBusinessInfoValues = z.infer<typeof updateBusinessInfoSchema>;
export type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;
export type CompleteProfileUpdateValues = z.infer<
  typeof completeProfileUpdateSchema
>;

// Partial types
export type PartialPersonalInfoValues = z.infer<
  typeof partialPersonalInfoSchema
>;
export type PartialAddressValues = z.infer<typeof partialAddressSchema>;
export type PartialBusinessInfoValues = z.infer<
  typeof partialBusinessInfoSchema
>;

// Validation helper for partial business info updates
export const validatePartialBusinessInfo = (
  data: PartialBusinessInfoValues
) => {
  // Only validate otherSupplier if currentSupplier is provided and is "other"
  if (data.currentSupplier === "other" && !data.otherSupplier) {
    throw new Error("Please specify the other supplier");
  }
  return data;
};
