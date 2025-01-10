"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import billingAddressSchema from "../validation";
import { z } from "zod";

type ActionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function updateBillingAddress(
  formData: z.infer<typeof billingAddressSchema>
): Promise<ActionResponse<any>> {
  try {
    const validatedData = billingAddressSchema.parse(formData);

    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        companyName: validatedData.companyName,
        country: validatedData.countryRegion, // Maps to country in DB
        streetAddress: validatedData.streetAddress,
        addressLine2: validatedData.apartmentSuite,
        townCity: validatedData.townCity,
        suburb: validatedData.province,
        postcode: validatedData.postcode,
        phoneNumber: validatedData.phone,
        email: validatedData.email,
      },
    });

    revalidatePath("/account");
    revalidatePath("/billing");

    return {
      success: true,
      data: updatedUser,
    };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid form data",
      };
    }

    console.error("Billing address update error:", error);
    return {
      success: false,
      error: "Failed to update billing address",
    };
  }
}

export async function getUserDetails() {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return {
        success: false,
        message: "Authentication required",
        error: "Please login to view details",
      };
    }

    const userDetails = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        salesRep: true,
        companyName: true,
        country: true,
        streetAddress: true,
        addressLine2: true,
        townCity: true,
        suburb: true,
        postcode: true,
        agreeTerms: false,
      },
    });

    if (!userDetails) {
      return {
        success: false,
        message: "User details not found",
        error: "No user details found",
      };
    }

    return {
      success: true,
      message: "User details retrieved successfully",
      data: userDetails,
    };
  } catch (error) {
    console.error("Error retrieving user details:", error);
    return {
      success: false,
      message: "Failed to retrieve user details",
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
