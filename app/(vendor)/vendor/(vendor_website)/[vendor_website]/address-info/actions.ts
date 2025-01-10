"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import billingAddressSchema from "./validation";

type ActionResponse<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export async function updateShippingAddress(
  formData: z.infer<typeof billingAddressSchema>
): Promise<ActionResponse<any>> {
  try {
    const validatedData = billingAddressSchema.parse(formData);
    const { user } = await validateRequest();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Create shipping address object
    const shippingAddress = {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      phoneNumber: validatedData.phone,
      companyName: validatedData.companyName,
      country: validatedData.countryRegion,
      streetAddress: validatedData.streetAddress,
      addressLine2: validatedData.apartmentSuite,
      townCity: validatedData.townCity,
      suburb: validatedData.province,
      postcode: validatedData.postcode,
      type: "shipping",
    };

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        storeLocation: shippingAddress, // Using storeLocation JSON field for shipping address
      },
    });

    return {
      success: true,
      data: updatedUser,
      message: "Shipping address updated successfully",
    };
  } catch (error) {
    console.error("Shipping address update error:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid form data: " + error.errors[0].message,
      };
    }
    return {
      success: false,
      error: "Failed to update shipping address",
    };
  }
}

export async function getUserDetails(): Promise<ActionResponse<any>> {
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
        companyName: true,
        country: true,
        streetAddress: true,
        addressLine2: true,
        townCity: true,
        suburb: true,
        postcode: true,
        storeLocation: true, // For shipping address
        agreeTerms: true,
      },
    });

    if (!userDetails) {
      return {
        success: false,
        message: "User details not found",
        error: "No user details found",
      };
    }

    // Transform response to include shipping address
    const response = {
      ...userDetails,
      shippingAddress:
        userDetails.storeLocation &&
        (userDetails.storeLocation as any).type === "shipping"
          ? userDetails.storeLocation
          : null,
    };

    return {
      success: true,
      message: "User details retrieved successfully",
      data: response,
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
        country: validatedData.countryRegion,
        streetAddress: validatedData.streetAddress,
        addressLine2: validatedData.apartmentSuite,
        townCity: validatedData.townCity,
        suburb: validatedData.province,
        postcode: validatedData.postcode,
        phoneNumber: validatedData.phone,
        email: validatedData.email,
      },
    });

    return {
      success: true,
      data: updatedUser,
      message: "Billing address updated successfully",
    };
  } catch (error) {
    console.error("Billing address update error:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid form data: " + error.errors[0].message,
      };
    }
    return {
      success: false,
      error: "Failed to update billing address",
    };
  }
}
