import { z } from "zod";

////////////// Register Validation   /////////////////

export const registrationSchema = z
  .object({
    companyName: z.string().min(1, "Company name is required"),
    vatNumber: z.string().optional(),
    ckNumber: z.string().optional(),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    email: z.string().email("Invalid email address"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phoneNumber: z.string().min(10, "Phone nr must be 10 numbers or more"),
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
    website: z.string().url("Invalid URL").optional().or(z.literal("")),
    resellingLocation: z.string().optional(),
    position: z.string().optional(),
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
    salesRep: z.enum(["noOne", "rep1", "rep2", "rep3", "rep4"]),
    agreeTerms: z
      .boolean()
      .refine(
        val => val === true,
        "You must agree to the terms and conditions"
      ),
    displayName: z.string().optional(), // Add this line
  })
  .refine(
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

export type RegistrationFormData = z.infer<typeof registrationSchema>;

////////////// Login Validation   /////////////////

const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ allowed"
  ),
  password: requiredString.min(8, "Must be at least 8 characters"),
  role: z
    .enum([
      "USER",
      "CUSTOMER",
      "SUBSCRIBER",
      "PROMO",
      "DISTRIBUTOR",
      "SHOPMANAGER",
      "EDITOR",
      "ADMIN",
    ])
    .default("USER"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type LoginValues = z.infer<typeof loginSchema>;

////////////////////////////////////////////////////

export const productSchema = z.object({
  type: z.string().min(1, "Type is required"),
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Name is required"),
  published: z.boolean(),
  isFeatured: z.boolean(),
  visibility: z.string().min(1, "Visibility is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  taxStatus: z.string().min(1, "Tax status is required"),
  inStock: z.boolean(),
  backordersAllowed: z.boolean(),
  soldIndividually: z.boolean(),
  allowReviews: z.boolean(),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  tags: z.array(z.string()),
  imageUrl: z.string().url("Invalid image URL"),
  upsells: z.array(z.string()),
  position: z.number().int().min(0, "Position must be a non-negative integer"),
  attribute1Name: z.string().optional(),
  attribute1Values: z.array(z.string()).optional(),
  attribute2Name: z.string().optional(),
  attribute2Values: z.array(z.string()).optional(),
  regularPrice: z.number().min(0, "Price must be non-negative"),
  stock: z.number().int().min(0, "Stock must be non-negative"),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const categoryOptions = [
  { value: "Headwear Collection", label: "HEADWEAR" },
  { value: "Apparel Collection", label: "APPAREL" },
  { value: "All Collection", label: "ALL" },
  { value: "Men", label: "Men" },
  { value: "Women", label: "Women" },
  { value: "Summer Collection", label: "Summer" },
  { value: "Winter", label: "Winter" },
  { value: "Baseball", label: "Baseball" },
  { value: "Kids", label: "Kids" },
  { value: "Fashion", label: "Fashion" },
  { value: "Leisure", label: "Leisure" },
  { value: "Signature", label: "Signature" },
  { value: "Sport", label: "Sport" },
  { value: "Hats", label: "Hats" },
  { value: "T- Shirts", label: "T- shirts" },
  { value: "African", label: "African" },

  // Add more categories as needed
];

export const colorOptions = [
  { value: "Red", label: "Red" },
  { value: "Blue", label: "Blue" },
  { value: "Green", label: "Green" },
  { value: "Yellow", label: "Yellow" },
  { value: "Black", label: "Black" },
  { value: "White", label: "White" },
  { value: "Stone", label: "Stone" },
  { value: "Grey", label: "Grey" },
  { value: "Army Green", label: "Army Green" },
  { value: "Army Brown", label: "Army Brown" },
  { value: "Camo Green", label: "Camo Green" },
  // Add more colors as needed
];
