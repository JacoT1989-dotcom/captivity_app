import * as z from "zod";

export const formSchema = z.object({
  captivityBranch: z.string().min(1, "Branch is required"),
  methodOfCollection: z.string().min(1, "Collection method is required"),
  salesRep: z.string().optional().default(""),
  referenceNumber: z.string().optional().default(""),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  companyName: z.string().min(1, "Company name is required"),
  countryRegion: z.string().min(1, "Country/Region is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  apartmentSuite: z.string().optional().default(""),
  townCity: z.string().min(1, "Town/City is required"),
  province: z.string().min(1, "Province is required"),
  postcode: z.string().min(1, "Postcode is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email address"),
  orderNotes: z.string().optional().default(""),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  receiveEmailReviews: z.boolean().default(false),
});

export type FormValues = z.infer<typeof formSchema>;
