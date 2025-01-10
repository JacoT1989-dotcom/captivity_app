"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import dns from "dns/promises";

const setupStoreSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  storeSlug: z
    .string()
    .min(3, "Store URL must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9-]+$/,
      "Store URL can only contain letters, numbers, and hyphens"
    ),
  storeDescription: z.string().min(1, "Store description is required"),
  storePhoneNumber: z.string().min(1, "Store phone number is required"),
  storeContactEmail: z.string().email("Invalid email address"),
  customDomain: z
    .string()
    .regex(
      /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
      "Invalid domain format"
    )
    .optional()
    .nullable(),
});

type SetupStoreData = z.infer<typeof setupStoreSchema>;

async function verifyDomainDNS(domain: string): Promise<boolean> {
  try {
    const records = await dns.resolve(domain, "A");
    // Vercel's edge network IP
    const vercelIP = "76.76.21.21";
    return records.includes(vercelIP);
  } catch (error) {
    console.error("DNS verification error:", error);
    return false;
  }
}

export async function setupStore(data: SetupStoreData) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { error: "Not authenticated" };
    }

    const validatedData = setupStoreSchema.parse(data);

    // Check for existing store slug (case-insensitive)
    const existingStoreSlug = await prisma.user.findFirst({
      where: {
        storeSlug: {
          equals: validatedData.storeSlug,
          mode: "insensitive",
        },
        NOT: {
          id: user.id,
        },
      },
    });

    if (existingStoreSlug) {
      return { error: "Store URL is already taken" };
    }

    // Handle custom domain verification if provided
    if (validatedData.customDomain) {
      // Check if domain is already in use
      const existingDomain = await prisma.user.findFirst({
        where: {
          customDomain: {
            equals: validatedData.customDomain,
            mode: "insensitive",
          },
          NOT: {
            id: user.id,
          },
        },
      });

      if (existingDomain) {
        return { error: "Custom domain is already in use" };
      }

      // Verify DNS settings
      const isDNSValid = await verifyDomainDNS(validatedData.customDomain);
      if (!isDNSValid) {
        return {
          error:
            "Domain DNS is not properly configured. Please ensure your A record points to Vercel's IP (76.76.21.21).",
        };
      }
    }

    // Update user with store information
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        storeName: validatedData.storeName,
        storeSlug: validatedData.storeSlug.toLowerCase(), // Ensure consistent casing
        storeDescription: validatedData.storeDescription,
        storePhoneNumber: validatedData.storePhoneNumber,
        storeContactEmail: validatedData.storeContactEmail,
        customDomain: validatedData.customDomain?.toLowerCase() || null, // Ensure consistent casing
        isVendorActive: true,
        role: "VENDOR",
      },
    });

    revalidatePath("/vendor/" + validatedData.storeSlug);

    return {
      success: true,
      message: validatedData.customDomain
        ? "Store setup successful! Your custom domain will be active once DNS propagation is complete (may take up to 48 hours)."
        : "Store setup successful!",
    };
  } catch (error) {
    console.error("Store setup error:", error);

    if (error instanceof z.ZodError) {
      return {
        error: error.errors[0].message,
      };
    }

    return { error: "Failed to setup store" };
  }
}
