"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { cache } from "react";
import { UserSettings as PrismaUserSettings } from "@prisma/client";

interface ContactInfo {
  id: string;
  city: string;
  telephone: string;
  general: string;
  websiteQueries: string;
  userSettingsId: string;
}

interface ContactFormData {
  city: string;
  telephone: string;
  general: string;
  websiteQueries: string;
}

interface ContactActionResult {
  success: boolean;
  data?: ContactInfo[];
  error?: string;
}

interface ExtendedUserSettings extends PrismaUserSettings {
  OfficeLocation: ContactInfo[];
  user?: {
    storeSlug: string | null;
  } | null;
}

const getCachedUserSettings = cache(
  async (userId: string): Promise<ExtendedUserSettings | null> => {
    const settings = await prisma.userSettings.findUnique({
      where: { userId },
      include: {
        OfficeLocation: {
          orderBy: { id: "asc" },
        },
        user: {
          select: {
            storeSlug: true,
          },
        },
      },
    });
    return settings;
  }
);

const getCachedVendorSettings = cache(
  async (storeSlug: string): Promise<ExtendedUserSettings | null> => {
    const settings = await prisma.userSettings.findFirst({
      where: {
        user: {
          storeSlug: storeSlug,
          role: "VENDOR",
        },
      },
      include: {
        OfficeLocation: {
          orderBy: { id: "asc" },
        },
        user: {
          select: {
            storeSlug: true,
          },
        },
      },
    });
    return settings;
  }
);

export async function getContactInfo(): Promise<ContactActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) return { success: false, error: "Unauthorized access" };

    if (user.role === "VENDOR") {
      const userSettings = await getCachedUserSettings(user.id);
      return {
        success: true,
        data: userSettings?.OfficeLocation || [],
      };
    }

    if (user.role === "VENDORCUSTOMER") {
      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { companyName: true },
      });

      if (!currentUser) return { success: false, error: "User not found" };

      const userSettings = await prisma.userSettings.findFirst({
        where: {
          user: {
            role: "VENDOR",
            storeName: currentUser.companyName,
          },
        },
        include: {
          OfficeLocation: true,
        },
      });

      return {
        success: true,
        data: userSettings?.OfficeLocation || [],
      };
    }

    return { success: true, data: [] };
  } catch (error) {
    console.error("Error getting contact info:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function createContactInfo(
  data: ContactFormData
): Promise<ContactActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can manage contact info");

    const userSettings = await getCachedUserSettings(user.id);
    let updatedSettings: ExtendedUserSettings | null;

    if (!userSettings) {
      updatedSettings = await prisma.userSettings.create({
        data: {
          userId: user.id,
          OfficeLocation: {
            create: data,
          },
        },
        include: {
          OfficeLocation: true,
          user: {
            select: {
              storeSlug: true,
            },
          },
        },
      });
    } else {
      await prisma.officeLocation.create({
        data: {
          ...data,
          userSettingsId: userSettings.id,
        },
      });

      updatedSettings = await prisma.userSettings.findUnique({
        where: { userId: user.id },
        include: {
          OfficeLocation: true,
          user: {
            select: {
              storeSlug: true,
            },
          },
        },
      });
    }

    return {
      success: true,
      data: updatedSettings?.OfficeLocation || [],
    };
  } catch (error) {
    console.error("Error creating contact info:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function updateContactInfo(
  id: string,
  data: ContactFormData
): Promise<ContactActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can manage contact info");

    const userSettings = await getCachedUserSettings(user.id);
    if (!userSettings) throw new Error("User settings not found");

    await prisma.officeLocation.update({
      where: {
        id,
        userSettingsId: userSettings.id,
      },
      data,
    });

    const updatedSettings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
      include: {
        OfficeLocation: true,
        user: {
          select: {
            storeSlug: true,
          },
        },
      },
    });

    return {
      success: true,
      data: updatedSettings?.OfficeLocation || [],
    };
  } catch (error) {
    console.error("Error updating contact info:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function deleteContactInfo(
  id: string
): Promise<ContactActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can manage contact info");

    const userSettings = await getCachedUserSettings(user.id);
    if (!userSettings) throw new Error("User settings not found");

    await prisma.officeLocation.delete({
      where: {
        id,
        userSettingsId: userSettings.id,
      },
    });

    const updatedSettings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
      include: {
        OfficeLocation: true,
        user: {
          select: {
            storeSlug: true,
          },
        },
      },
    });

    return {
      success: true,
      data: updatedSettings?.OfficeLocation || [],
    };
  } catch (error) {
    console.error("Error deleting contact info:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export const getVendorContactsBySlug = cache(
  async (storeSlug: string): Promise<ContactActionResult> => {
    try {
      const userSettings = await getCachedVendorSettings(storeSlug);
      return {
        success: true,
        data: userSettings?.OfficeLocation || [],
      };
    } catch (error) {
      console.error("Error getting vendor contacts:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  }
);
