// app/(user)/(DropDownCategories)/products/headwear/hats/_components/Hats.tsx
"use client";

import React, { useMemo, useEffect } from "react";
import { Loader2 } from "lucide-react";
import HeroSection from "@/app/(user)/_components/(collection-hero)/HeroSection";
import { EmptyHeroUpload } from "@/app/(user)/_components/(collection-hero)/EmptyHeroUpload";
import { useCategoryHeroStore } from "@/app/(editor)/_editor-store/category-hero-store";
import { useSession } from "@/app/SessionProvider";

const HatsProductList: React.FC = () => {
  const sessionData = useSession();
  const isEditor = sessionData?.user?.role === "EDITOR";

  const {
    heroes,
    products,
    upload,
    update,
    isLoading,
    initialized,
    fetchHeroes,
  } = useCategoryHeroStore();

  useEffect(() => {
    if (!initialized) {
      fetchHeroes();
    }
  }, [initialized, fetchHeroes]);

  const hatsHero = useMemo(
    () => heroes.find(hero => hero.categoryName === "HATS"),
    [heroes]
  );

  const handleHeroUpdate = async (formData: FormData) => {
    try {
      const title = formData.get("title") as string;
      const categoryName = formData.get("categoryName") as string;

      if (hatsHero) {
        await update(hatsHero.id, {
          title: title || hatsHero.title,
          categoryName: categoryName || hatsHero.categoryName,
          backgroundColor: hatsHero.backgroundColor,
          opacity: hatsHero.opacity,
        });
      } else {
        // Set default values for new upload
        formData.set("title", "HATS");
        formData.set("categoryName", "HATS");
        formData.set("backgroundColor", "#000000");
        formData.set("opacity", "0.4");
        await upload(formData);
      }
    } catch (error) {
      console.error("Error updating hero section:", error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <Loader2 className="mx-auto my-3 animate-spin h-8 w-8" />
        <p className="text-muted-foreground">Loading banner...</p>
      </div>
    );
  }

  // If there's no hero and user is an editor, show upload interface
  if (!hatsHero && isEditor) {
    return (
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <EmptyHeroUpload
          onUpload={handleHeroUpdate}
          defaultTitle="HATS"
          defaultCategory="HATS"
        />
      </div>
    );
  }

  // If there's no hero and user is not an editor, return null
  if (!hatsHero) return null;

  return (
    <HeroSection
      heroData={hatsHero}
      onUpdate={isEditor ? handleHeroUpdate : undefined}
    />
  );
};

export default HatsProductList;
