import { z } from "zod";

export const helpRequestSchema = z.object({
  id: z.number(),
  selectedOption: z.string().min(1, "Please select an option"),
  text: z
    .string()
    .min(1, "Please provide details")
    .max(1000, "Message too long"),
});

export const helpFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .trim(),
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),
  assistanceType: z.enum(["Suggestions", "HelpMe", "General Info"], {
    required_error: "Please select assistance type",
  }),
  suggestions: z
    .array(z.string().trim().min(1, "Suggestion cannot be empty"))
    .optional(),
  helpRequests: z.array(helpRequestSchema).optional(),
  generalInfo: z
    .array(z.string().trim().min(1, "Information cannot be empty"))
    .optional(),
});

// Schema for the quick contact form
export const quickContactSchema = z.object({
  name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .trim(),
  lastname: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),
  company: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters")
    .trim(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters")
    .trim(),
});

// Types inferred from the schemas
export type HelpFormData = z.infer<typeof helpFormSchema>;
export type QuickContactFormData = z.infer<typeof quickContactSchema>;
