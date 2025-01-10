"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { revalidateTag, unstable_cache } from "next/cache";

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  userSettingsId: string;
}

interface SocialLinkFormData {
  platform: string;
  url: string;
}

interface SocialLinkActionResult {
  success: boolean;
  data?: SocialLink[];
  error?: string;
}

// Cache key functions
const getUserCacheKey = (userId: string) => `social_links_${userId}`;
const getVendorCacheKey = (websiteAddress: string) =>
  `vendor_social_links_${websiteAddress}`;

// Cached query for user's social links
const getCachedSocialLinks = unstable_cache(
  async (userId: string) => {
    return await prisma.userSettings.findUnique({
      where: { userId },
      include: {
        SocialMediaLink: {
          orderBy: { platform: "asc" },
        },
      },
    });
  },
  [],
  {
    tags: ["social-links"],
    revalidate: 30, // Cache for 30 seconds
  }
);

// Cached query for vendor's social links
const getVendorSettings = unstable_cache(
  async (websiteAddress: string) => {
    return await prisma.userSettings.findFirst({
      where: {
        user: {
          OR: [{ website: websiteAddress }, { storeSlug: websiteAddress }],
          role: "VENDOR",
        },
      },
      include: {
        SocialMediaLink: {
          orderBy: { platform: "asc" },
        },
      },
    });
  },
  [],
  {
    tags: ["vendor-social-links"],
    revalidate: 30, // Cache for 30 seconds
  }
);

export async function getSocialLinks(): Promise<SocialLinkActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) return { success: false, error: "Unauthorized access" };

    const userSettings = await getCachedSocialLinks(user.id);
    return {
      success: true,
      data: userSettings?.SocialMediaLink || [],
    };
  } catch (error) {
    console.error("Error getting social links:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getVendorSocialLinks(
  websiteAddress: string
): Promise<SocialLinkActionResult> {
  try {
    const vendorSettings = await getVendorSettings(websiteAddress);
    if (!vendorSettings) {
      return { success: false, error: "Vendor not found" };
    }

    return {
      success: true,
      data: vendorSettings.SocialMediaLink || [],
    };
  } catch (error) {
    console.error("Error getting vendor social links:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function createSocialLink(
  data: SocialLinkFormData
): Promise<SocialLinkActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");

    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
    });

    if (!userSettings) {
      await prisma.userSettings.create({
        data: {
          userId: user.id,
          SocialMediaLink: { create: data },
        },
      });
    } else {
      await prisma.socialMediaLink.create({
        data: {
          ...data,
          userSettingsId: userSettings.id,
        },
      });
    }

    // Revalidate cache
    revalidateTag("social-links");

    const updatedSettings = await getCachedSocialLinks(user.id);
    return {
      success: true,
      data: updatedSettings?.SocialMediaLink || [],
    };
  } catch (error) {
    console.error("Error creating social link:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function updateSocialLink(
  id: string,
  data: SocialLinkFormData
): Promise<SocialLinkActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");

    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
    });

    if (!userSettings) throw new Error("User settings not found");

    await prisma.socialMediaLink.update({
      where: { id, userSettingsId: userSettings.id },
      data,
    });

    // Revalidate cache
    revalidateTag("social-links");

    const updatedSettings = await getCachedSocialLinks(user.id);
    return {
      success: true,
      data: updatedSettings?.SocialMediaLink || [],
    };
  } catch (error) {
    console.error("Error updating social link:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function deleteSocialLink(
  id: string
): Promise<SocialLinkActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");

    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
    });

    if (!userSettings) throw new Error("User settings not found");

    await prisma.socialMediaLink.delete({
      where: { id, userSettingsId: userSettings.id },
    });

    // Revalidate cache
    revalidateTag("social-links");

    const updatedSettings = await getCachedSocialLinks(user.id);
    return {
      success: true,
      data: updatedSettings?.SocialMediaLink || [],
    };
  } catch (error) {
    console.error("Error deleting social link:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
