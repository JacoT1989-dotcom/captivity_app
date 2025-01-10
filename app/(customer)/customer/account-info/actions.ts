"use server";

import prisma from "@/lib/prisma";
import { hash, verify } from "@node-rs/argon2";
import { isRedirectError } from "next/dist/client/components/redirect";
import {
  updateAddressSchema,
  UpdateAddressValues,
  updateBusinessInfoSchema,
  UpdateBusinessInfoValues,
  updatePasswordSchema,
  UpdatePasswordValues,
  updatePersonalInfoSchema,
  UpdatePersonalInfoValues,
} from "./validation";

// Update Personal Information
export async function updatePersonalInfo(
  userId: string,
  formData: UpdatePersonalInfoValues
): Promise<{ success?: boolean; error?: string }> {
  try {
    const validatedData = updatePersonalInfoSchema.parse(formData);

    // Check if email is being changed and if it's already taken
    if (validatedData.email) {
      const existingEmail = await prisma.user.findFirst({
        where: {
          AND: [
            {
              email: {
                equals: validatedData.email,
                mode: "insensitive",
              },
            },
            {
              id: {
                not: userId,
              },
            },
          ],
        },
      });

      if (existingEmail) {
        return {
          error: "Email already taken",
        };
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        displayName: validatedData.displayName,
        email: validatedData.email,
        phoneNumber: validatedData.phoneNumber,
        website: validatedData.website || null,
        bio: validatedData.bio,
        avatarUrl: validatedData.avatarUrl || null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating personal info:", error);
    return {
      error: "Failed to update personal information. Please try again.",
    };
  }
}

// Update Address Information
export async function updateAddress(
  userId: string,
  formData: UpdateAddressValues
): Promise<{ success?: boolean; error?: string }> {
  try {
    const validatedData = updateAddressSchema.parse(formData);

    await prisma.user.update({
      where: { id: userId },
      data: {
        streetAddress: validatedData.streetAddress,
        addressLine2: validatedData.addressLine2,
        suburb: validatedData.suburb,
        townCity: validatedData.townCity,
        postcode: validatedData.postcode,
        country: validatedData.country,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating address:", error);
    return {
      error: "Failed to update address information. Please try again.",
    };
  }
}

// Update Business Information
export async function updateBusinessInfo(
  userId: string,
  formData: UpdateBusinessInfoValues
): Promise<{ success?: boolean; error?: string }> {
  try {
    const validatedData = updateBusinessInfoSchema.parse(formData);

    await prisma.user.update({
      where: { id: userId },
      data: {
        companyName: validatedData.companyName,
        vatNumber: validatedData.vatNumber,
        ckNumber: validatedData.ckNumber,
        position: validatedData.position,
        natureOfBusiness: validatedData.natureOfBusiness,
        currentSupplier: validatedData.currentSupplier,
        otherSupplier: validatedData.otherSupplier,
        resellingTo: validatedData.resellingLocation,
        salesRep: validatedData.salesRep,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating business info:", error);
    return {
      error: "Failed to update business information. Please try again.",
    };
  }
}

// Update Password
export async function updatePassword(
  userId: string,
  formData: UpdatePasswordValues
): Promise<{ success?: boolean; error?: string }> {
  try {
    const validatedData = updatePasswordSchema.parse(formData);

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });

    if (!user) {
      return { error: "User not found" };
    }

    // Verify current password
    const validPassword = await verify(
      user.passwordHash,
      validatedData.currentPassword
    );

    if (!validPassword) {
      return { error: "Current password is incorrect" };
    }

    // Hash new password
    const newPasswordHash = await hash(validatedData.newPassword, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating password:", error);
    return {
      error: "Failed to update password. Please try again.",
    };
  }
}

// Helper function to handle partial updates
export async function updatePartialUserInfo(
  userId: string,
  data: Partial<
    UpdatePersonalInfoValues & UpdateAddressValues & UpdateBusinessInfoValues
  >
): Promise<{ success?: boolean; error?: string }> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        // Convert empty strings to null for optional fields
        website: data.website || null,
        avatarUrl: data.avatarUrl || null,
        bio: data.bio || null,
        addressLine2: data.addressLine2 || null,
        suburb: data.suburb || null,
        vatNumber: data.vatNumber || null,
        ckNumber: data.ckNumber || null,
        position: data.position || null,
        otherSupplier: data.otherSupplier || null,
        resellingTo: data.resellingLocation || null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating user info:", error);
    return {
      error: "Failed to update information. Please try again.",
    };
  }
}
