"use server";

import { put, del } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { cache } from "react";
import { User as DbUser, UserRole, Prisma } from "@prisma/client";
import {
  ProfileActionResult,
  ProfileImageType,
  UserProfileData,
  profileUpdateSchema,
  ProfileUpdateData,
  userProfileSelect,
  IMAGE_CONFIG,
  ALLOWED_MIME_TYPES,
  AllowedMimeType,
  fileValidationSchema,
  VendorRoles,
} from "./profile";

// Define a minimal type for authenticated user from auth
interface AuthUser {
  id: string;
  role: UserRole;
}

// Type guard for checking if user is a vendor or vendor customer
function isVendorUser(user: AuthUser): boolean {
  return ["VENDOR", "VENDORCUSTOMER"].includes(user.role);
}

// Type guard for file type checking
function isAllowedMimeType(type: string): type is AllowedMimeType {
  return ALLOWED_MIME_TYPES.includes(type as AllowedMimeType);
}

// Cache function for user profiles
const getCachedUserProfile = cache(async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: userProfileSelect,
  });
});

// Get user profile details
export async function getUserProfile(
  userId?: string
): Promise<ProfileActionResult> {
  try {
    const session = await validateRequest();
    if (!session.user) {
      return {
        success: false,
        avatarUrl: null,
        backgroundUrl: null,
        error: "Unauthorized access",
      };
    }

    // If userId is provided, verify permission to view that profile
    const targetUserId = userId || session.user.id;
    if (
      userId &&
      session.user.id !== userId &&
      !["VENDOR", "ADMIN"].includes(session.user.role)
    ) {
      return {
        success: false,
        avatarUrl: null,
        backgroundUrl: null,
        error: "Insufficient permissions to view this profile",
      };
    }

    const profile = await getCachedUserProfile(targetUserId);
    if (!profile) {
      return {
        success: false,
        avatarUrl: null,
        backgroundUrl: null,
        error: "Profile not found",
      };
    }

    return {
      success: true,
      avatarUrl: profile.avatarUrl,
      backgroundUrl: profile.backgroundUrl,
      userData: profile as UserProfileData,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return {
      success: false,
      avatarUrl: null,
      backgroundUrl: null,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Update user profile details
export async function updateUserProfile(
  data: ProfileUpdateData
): Promise<ProfileActionResult> {
  try {
    const session = await validateRequest();
    if (!session.user) throw new Error("Unauthorized access");

    const validatedData = profileUpdateSchema.parse(data);

    const updatedProfile = await prisma.user.update({
      where: { id: session.user.id },
      data: validatedData,
      select: userProfileSelect,
    });

    return {
      success: true,
      avatarUrl: updatedProfile.avatarUrl,
      backgroundUrl: updatedProfile.backgroundUrl,
      userData: updatedProfile as UserProfileData,
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return {
      success: false,
      avatarUrl: null,
      backgroundUrl: null,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Upload profile image (avatar or background)
export async function uploadProfileImage(
  formData: FormData,
  imageType: ProfileImageType
): Promise<ProfileActionResult> {
  try {
    const session = await validateRequest();
    if (!session.user) throw new Error("Unauthorized access");
    if (!isVendorUser(session.user)) {
      throw new Error("Unauthorized role");
    }

    const file = formData.get(imageType) as File;
    if (!file) throw new Error("No file provided");

    // Validate file type
    if (!isAllowedMimeType(file.type)) {
      throw new Error(
        "Invalid file type. Only JPEG, PNG, and WebP images are allowed"
      );
    }

    // Validate file using schema
    const validation = fileValidationSchema.safeParse({
      size: file.size,
      type: file.type,
    });

    if (!validation.success) {
      throw new Error(validation.error.errors[0].message);
    }

    const maxSize = IMAGE_CONFIG.maxSizes[imageType];
    if (file.size > maxSize * 1024 * 1024) {
      throw new Error(`File size must be less than ${maxSize}MB`);
    }

    // Delete existing image if present
    const currentProfile = await getCachedUserProfile(session.user.id);
    const currentUrl =
      imageType === "avatar"
        ? currentProfile?.avatarUrl
        : currentProfile?.backgroundUrl;

    if (currentUrl) {
      const oldPath = new URL(currentUrl).pathname.slice(1);
      await del(oldPath);
    }

    // Upload new image
    const fileExt = file.name.split(".").pop() || "png";
    const timestamp = Date.now();
    const path = `${IMAGE_CONFIG.paths[imageType]}/${session.user.id}_${timestamp}.${fileExt}`;

    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: false,
    });

    if (!blob.url) throw new Error("Failed to get URL from blob storage");

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        [imageType === "avatar" ? "avatarUrl" : "backgroundUrl"]: blob.url,
      },
      select: userProfileSelect,
    });

    return {
      success: true,
      avatarUrl: updatedUser.avatarUrl,
      backgroundUrl: updatedUser.backgroundUrl,
      userData: updatedUser as UserProfileData,
    };
  } catch (error) {
    console.error(`Error uploading ${imageType}:`, error);
    return {
      success: false,
      avatarUrl: null,
      backgroundUrl: null,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Remove profile image (avatar or background)
export async function removeProfileImage(
  imageType: ProfileImageType
): Promise<ProfileActionResult> {
  try {
    const session = await validateRequest();
    if (!session.user) throw new Error("Unauthorized access");
    if (!isVendorUser(session.user)) {
      throw new Error("Unauthorized role");
    }

    const currentProfile = await getCachedUserProfile(session.user.id);
    const currentUrl =
      imageType === "avatar"
        ? currentProfile?.avatarUrl
        : currentProfile?.backgroundUrl;

    if (!currentUrl) {
      throw new Error(`No ${imageType} image found`);
    }

    const path = new URL(currentUrl).pathname.slice(1);
    await del(path);

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        [imageType === "avatar" ? "avatarUrl" : "backgroundUrl"]: null,
      },
      select: userProfileSelect,
    });

    return {
      success: true,
      avatarUrl: updatedUser.avatarUrl,
      backgroundUrl: updatedUser.backgroundUrl,
      userData: updatedUser as UserProfileData,
    };
  } catch (error) {
    console.error(`Error removing ${imageType}:`, error);
    return {
      success: false,
      avatarUrl: null,
      backgroundUrl: null,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Get vendor customers (for vendor accounts)
export async function getVendorCustomers(): Promise<ProfileActionResult[]> {
  try {
    const session = await validateRequest();
    if (!session.user) throw new Error("Unauthorized access");

    const vendorProfile = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, storeSlug: true },
    });

    if (
      !vendorProfile ||
      vendorProfile.role !== "VENDOR" ||
      !vendorProfile.storeSlug
    ) {
      throw new Error("Unauthorized role or invalid vendor configuration");
    }

    const customers = await prisma.user.findMany({
      where: {
        role: "VENDORCUSTOMER",
        storeSlug: {
          startsWith: vendorProfile.storeSlug.split("-customer-")[0],
        },
      },
      select: userProfileSelect,
    });

    return customers.map(customer => ({
      success: true,
      avatarUrl: customer.avatarUrl,
      backgroundUrl: customer.backgroundUrl,
      userData: customer as UserProfileData,
    }));
  } catch (error) {
    console.error("Error fetching vendor customers:", error);
    return [
      {
        success: false,
        avatarUrl: null,
        backgroundUrl: null,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
    ];
  }
}
