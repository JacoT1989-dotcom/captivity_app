"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { cache } from "react";

interface OpeningHoursInfo {
  id: string;
  city: string;
  mondayToThursday: string;
  friday: string;
  saturdaySunday: string;
  publicHolidays: string;
  userSettingsId: string;
}

interface OpeningHoursFormData {
  city: string;
  mondayToThursday: string;
  friday: string;
  saturdaySunday?: string;
  publicHolidays?: string;
}

interface OpeningHoursActionResult {
  success: boolean;
  data?: OpeningHoursInfo[];
  error?: string;
}

const getCachedUserOpeningHours = cache(
  async (userId: string): Promise<OpeningHoursInfo[] | null> => {
    const openingHours = await prisma.openingHours.findMany({
      where: {
        userSettings: {
          userId: userId,
        },
      },
      orderBy: { id: "asc" },
    });
    return openingHours;
  }
);

const getCachedVendorOpeningHours = cache(
  async (storeSlug: string): Promise<OpeningHoursInfo[] | null> => {
    const openingHours = await prisma.openingHours.findMany({
      where: {
        userSettings: {
          user: {
            storeSlug: storeSlug,
            role: "VENDOR",
          },
        },
      },
      orderBy: { id: "asc" },
    });
    return openingHours;
  }
);

export async function getOpeningHours(): Promise<OpeningHoursActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) return { success: false, error: "Unauthorized access" };

    if (user.role === "VENDOR") {
      const openingHours = await getCachedUserOpeningHours(user.id);
      return {
        success: true,
        data: openingHours || [],
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
      });

      if (!userSettings) return { success: true, data: [] };

      const openingHours = await prisma.openingHours.findMany({
        where: { userSettingsId: userSettings.id },
      });

      return {
        success: true,
        data: openingHours || [],
      };
    }

    return { success: true, data: [] };
  } catch (error) {
    console.error("Error getting opening hours:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function createOpeningHours(
  data: OpeningHoursFormData
): Promise<OpeningHoursActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can manage opening hours");

    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
    });

    let updatedOpeningHours;

    if (!userSettings) {
      updatedOpeningHours = await prisma.userSettings.create({
        data: {
          userId: user.id,
          OpeningHours: {
            create: {
              ...data,
              saturdaySunday: data.saturdaySunday || "Closed",
              publicHolidays: data.publicHolidays || "Closed",
            },
          },
        },
        include: {
          OpeningHours: true,
        },
      });
    } else {
      await prisma.openingHours.create({
        data: {
          ...data,
          saturdaySunday: data.saturdaySunday || "Closed",
          publicHolidays: data.publicHolidays || "Closed",
          userSettingsId: userSettings.id,
        },
      });

      updatedOpeningHours = await prisma.userSettings.findUnique({
        where: { userId: user.id },
        include: {
          OpeningHours: true,
        },
      });
    }

    return {
      success: true,
      data: updatedOpeningHours?.OpeningHours || [],
    };
  } catch (error) {
    console.error("Error creating opening hours:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function updateOpeningHours(
  id: string,
  data: OpeningHoursFormData
): Promise<OpeningHoursActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can manage opening hours");

    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
    });
    if (!userSettings) throw new Error("User settings not found");

    await prisma.openingHours.update({
      where: {
        id,
        userSettingsId: userSettings.id,
      },
      data: {
        ...data,
        saturdaySunday: data.saturdaySunday || "Closed",
        publicHolidays: data.publicHolidays || "Closed",
      },
    });

    const updatedSettings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
      include: {
        OpeningHours: true,
      },
    });

    return {
      success: true,
      data: updatedSettings?.OpeningHours || [],
    };
  } catch (error) {
    console.error("Error updating opening hours:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function deleteOpeningHours(
  id: string
): Promise<OpeningHoursActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can manage opening hours");

    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
    });
    if (!userSettings) throw new Error("User settings not found");

    await prisma.openingHours.delete({
      where: {
        id,
        userSettingsId: userSettings.id,
      },
    });

    const updatedSettings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
      include: {
        OpeningHours: true,
      },
    });

    return {
      success: true,
      data: updatedSettings?.OpeningHours || [],
    };
  } catch (error) {
    console.error("Error deleting opening hours:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export const getVendorOpeningHoursBySlug = cache(
  async (storeSlug: string): Promise<OpeningHoursActionResult> => {
    try {
      const openingHours = await getCachedVendorOpeningHours(storeSlug);
      return {
        success: true,
        data: openingHours || [],
      };
    } catch (error) {
      console.error("Error getting vendor opening hours:", error);
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
