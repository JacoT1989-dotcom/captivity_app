"use server";

import prisma from "@/lib/prisma";
import { hash, verify } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import { z } from "zod";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";

// Schemas
const vendorCustomerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    storeSlug: z
      .string()
      .min(3, "Store name must be at least 3 characters")
      .regex(
        /^[a-zA-Z0-9-]+$/,
        "Only letters, numbers, and hyphens are allowed"
      ),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type VendorCustomerFormData = z.infer<typeof vendorCustomerSchema>;
type LoginFormData = z.infer<typeof loginSchema>;

// Registration
export async function vendorCustomerSignUp(
  formData: VendorCustomerFormData
): Promise<{ error?: string; success?: boolean }> {
  try {
    const validatedData = vendorCustomerSchema.parse(formData);

    // Case-insensitive vendor store check
    const vendorStore = await prisma.user.findFirst({
      where: {
        storeSlug: {
          equals: validatedData.storeSlug,
          mode: "insensitive",
        },
        role: "VENDOR",
      },
    });

    if (!vendorStore) {
      return {
        error: "Vendor store not found. Please check the store name.",
      };
    }

    // Case-insensitive username check
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: validatedData.username,
          mode: "insensitive",
        },
      },
    });

    if (existingUsername) {
      return {
        error: "Username already taken",
      };
    }

    // Case-insensitive email check
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: validatedData.email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return {
        error: "Email already taken",
      };
    }

    const userId = generateIdFromEntropySize(10);
    const passwordHash = await hash(validatedData.password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    // Create customer storeSlug using vendor's actual storeSlug
    const customerStoreSlug = `${vendorStore.storeSlug}-customer-${validatedData.username}`;

    // Case-insensitive check for existing customer slug
    const existingCustomerSlug = await prisma.user.findFirst({
      where: {
        storeSlug: {
          equals: customerStoreSlug,
          mode: "insensitive",
        },
      },
    });

    if (existingCustomerSlug) {
      return {
        error: "Unable to create account. Please try a different username.",
      };
    }

    await prisma.user.create({
      data: {
        id: userId,
        username: validatedData.username,
        email: validatedData.email,
        passwordHash,
        storeSlug: customerStoreSlug,
        role: "VENDORCUSTOMER",
        firstName: "Pending",
        lastName: "Pending",
        displayName: validatedData.username,
        streetAddress: "Pending",
        townCity: "Pending",
        postcode: "Pending",
        country: "Pending",
        natureOfBusiness: "Pending",
        currentSupplier: "Pending",
        salesRep: "Pending",
        companyName: "Pending",
        phoneNumber: "Pending",
        agreeTerms: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    if (isRedirectError(error)) throw error;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          error:
            "This store name is already taken. Please try a different one.",
        };
      }
    }

    return {
      error: "Something went wrong. Please try again.",
    };
  }
}

// Login
export async function vendorCustomerLogin(
  formData: LoginFormData
): Promise<{ error?: string; redirect?: string }> {
  try {
    const validatedData = loginSchema.parse(formData);

    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: validatedData.email,
          mode: "insensitive",
        },
        role: {
          in: ["VENDOR", "VENDORCUSTOMER"],
        },
      },
    });

    if (!user || !user.passwordHash) {
      return {
        error: "Invalid email or password",
      };
    }

    const validPassword = await verify(
      user.passwordHash,
      validatedData.password,
      {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      }
    );

    if (!validPassword) {
      return {
        error: "Invalid email or password",
      };
    }

    // For VENDOR role, use their storeSlug directly
    // For VENDORCUSTOMER, extract vendor store slug from their storeSlug
    const vendorStoreSlug =
      user.role === "VENDOR"
        ? user.storeSlug
        : user.storeSlug?.split("-customer-")[0];

    if (!vendorStoreSlug) {
      return {
        error: "Invalid store configuration",
      };
    }

    // Create session
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    // Role-based redirect
    const redirectPath =
      user.role === "VENDOR"
        ? `/vendor/${vendorStoreSlug}/dashboard`
        : `/vendor/${vendorStoreSlug}/welcome`;

    return {
      redirect: redirectPath,
    };
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof z.ZodError) {
      return {
        error: error.errors[0].message,
      };
    }
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}
