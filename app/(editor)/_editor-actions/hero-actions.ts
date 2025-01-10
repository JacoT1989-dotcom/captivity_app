"use server";
// test
import { put, del } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { cache } from "react";

interface HeroSlideActionResult {
  success: boolean;
  slides?: Array<{
    id: string;
    image: string;
    backgroundColor: string;
    title: string;
    subtitle: string;
    cta: string;
  }>;
  error?: string;
}

// Cache frequently used queries
const getCachedUserSettings = cache(async (userId: string) => {
  return prisma.userSettings.findUnique({
    where: { userId },
    include: {
      HeroSlide: true,
    },
  });
});

export async function uploadHeroSlide(
  formData: FormData
): Promise<HeroSlideActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (!["EDITOR", "ADMIN", "SUPERADMIN"].includes(user.role)) {
      throw new Error("Insufficient permissions");
    }

    const file = formData.get("image") as File;
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const backgroundColor = formData.get("backgroundColor") as string;
    const cta = formData.get("cta") as string;

    if (!file || !file.size) throw new Error("No file provided");
    if (!title || !subtitle || !backgroundColor || !cta) {
      throw new Error("All fields are required");
    }
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }
    if (file.size > 6 * 1024 * 1024) {
      throw new Error("File size must be less than 5MB");
    }

    // Get or create user settings
    const userSettings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });

    const existingSlides = await prisma.heroSlide.count({
      where: { userSettingsId: userSettings.id },
    });

    if (existingSlides >= 5) {
      throw new Error("Maximum of 5 hero slides allowed");
    }

    const fileExt = file.name.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const path = `hero-slides/slide_${user.id}_${timestamp}.${fileExt}`;

    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: false,
    });

    if (!blob.url) throw new Error("Failed to get URL from blob storage");

    const { HeroSlide } = await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        HeroSlide: {
          create: {
            image: blob.url,
            backgroundColor,
            title,
            subtitle,
            cta,
          },
        },
      },
      include: {
        HeroSlide: true,
      },
    });

    return {
      success: true,
      slides: HeroSlide.map(slide => ({
        id: slide.id,
        image: slide.image,
        backgroundColor: slide.backgroundColor,
        title: slide.title,
        subtitle: slide.subtitle,
        cta: slide.cta,
      })),
    };
  } catch (error) {
    console.error("Error uploading hero slide:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function removeHeroSlide(
  id: string
): Promise<HeroSlideActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (!["EDITOR", "ADMIN", "SUPERADMIN"].includes(user.role)) {
      throw new Error("Insufficient permissions");
    }

    const slide = await prisma.heroSlide.findFirst({
      where: {
        id,
        userSettings: {
          userId: user.id,
        },
      },
    });

    if (!slide) {
      throw new Error("Hero slide not found");
    }

    const path = new URL(slide.image).pathname.slice(1);
    await del(path);

    const { HeroSlide } = await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        HeroSlide: {
          delete: { id: slide.id },
        },
      },
      include: {
        HeroSlide: true,
      },
    });

    return {
      success: true,
      slides: HeroSlide.map(slide => ({
        id: slide.id,
        image: slide.image,
        backgroundColor: slide.backgroundColor,
        title: slide.title,
        subtitle: slide.subtitle,
        cta: slide.cta,
      })),
    };
  } catch (error) {
    console.error("Error removing hero slide:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export const getHeroSlides = cache(async (): Promise<HeroSlideActionResult> => {
  try {
    const slides = await prisma.heroSlide.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        userSettings: {
          select: {
            user: {
              select: {
                role: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      slides: slides.map(slide => ({
        id: slide.id,
        image: slide.image,
        backgroundColor: slide.backgroundColor,
        title: slide.title,
        subtitle: slide.subtitle,
        cta: slide.cta,
      })),
    };
  } catch (error) {
    console.error("Error getting hero slides:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
});

export async function updateHeroSlide(
  id: string,
  data: {
    title: string;
    subtitle: string;
    backgroundColor: string;
    cta: string;
  }
): Promise<HeroSlideActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (!["EDITOR", "ADMIN", "SUPERADMIN"].includes(user.role)) {
      throw new Error("Insufficient permissions");
    }

    const slide = await prisma.heroSlide.findFirst({
      where: {
        id,
        userSettings: {
          userId: user.id,
        },
      },
    });

    if (!slide) {
      throw new Error("Hero slide not found");
    }

    const { HeroSlide } = await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        HeroSlide: {
          update: {
            where: { id },
            data: {
              title: data.title,
              subtitle: data.subtitle,
              backgroundColor: data.backgroundColor,
              cta: data.cta,
            },
          },
        },
      },
      include: {
        HeroSlide: true,
      },
    });

    return {
      success: true,
      slides: HeroSlide.map(slide => ({
        id: slide.id,
        image: slide.image,
        backgroundColor: slide.backgroundColor,
        title: slide.title,
        subtitle: slide.subtitle,
        cta: slide.cta,
      })),
    };
  } catch (error) {
    console.error("Error updating hero slide:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function updateHeroSlideWithImage(
  id: string,
  formData: FormData
): Promise<HeroSlideActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (!["EDITOR", "ADMIN", "SUPERADMIN"].includes(user.role)) {
      throw new Error("Insufficient permissions");
    }

    const slide = await prisma.heroSlide.findFirst({
      where: {
        id,
        userSettings: {
          userId: user.id,
        },
      },
    });

    if (!slide) {
      throw new Error("Hero slide not found");
    }

    // If there's a new image, upload it
    let imageUrl = slide.image;
    const newImage = formData.get("image") as File;
    if (newImage?.size) {
      // Delete old image
      const oldPath = new URL(slide.image).pathname.slice(1);
      await del(oldPath);

      // Upload new image
      const fileExt = newImage.name.split(".").pop() || "jpg";
      const path = `hero-slides/slide_${user.id}_${Date.now()}.${fileExt}`;
      const blob = await put(path, newImage, {
        access: "public",
        addRandomSuffix: false,
      });
      imageUrl = blob.url;
    }

    const { HeroSlide } = await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        HeroSlide: {
          update: {
            where: { id },
            data: {
              image: imageUrl,
              title: formData.get("title") as string,
              subtitle: formData.get("subtitle") as string,
              backgroundColor: formData.get("backgroundColor") as string,
              cta: formData.get("cta") as string,
            },
          },
        },
      },
      include: {
        HeroSlide: true,
      },
    });

    return {
      success: true,
      slides: HeroSlide.map(slide => ({
        id: slide.id,
        image: slide.image,
        backgroundColor: slide.backgroundColor,
        title: slide.title,
        subtitle: slide.subtitle,
        cta: slide.cta,
      })),
    };
  } catch (error) {
    console.error("Error updating hero slide:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
