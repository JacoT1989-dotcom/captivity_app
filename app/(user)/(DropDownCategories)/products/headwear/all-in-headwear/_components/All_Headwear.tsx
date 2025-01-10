"use client";

import React, { useMemo, useEffect } from "react";
import { Loader2 } from "lucide-react";
import HeroSection from "@/app/(user)/_components/(collection-hero)/HeroSection";
import { EmptyHeroUpload } from "@/app/(user)/_components/(collection-hero)/EmptyHeroUpload";
import { useCategoryHeroStore } from "@/app/(editor)/_editor-store/category-hero-store";
import { useSession } from "@/app/SessionProvider";

const AllInHeadwearProductList: React.FC = () => {
  const sessionData = useSession();
  const isEditor = sessionData?.user?.role === "EDITOR";

  const { heroes, upload, update, isLoading, initialized, fetchHeroes } =
    useCategoryHeroStore();

  useEffect(() => {
    if (!initialized) {
      fetchHeroes();
    }
  }, [initialized, fetchHeroes]);

  const allHeadwearHero = useMemo(
    () => heroes.find(hero => hero.categoryName === "ALL_HEADWEAR"),
    [heroes]
  );

  const handleHeroUpdate = async (formData: FormData) => {
    try {
      const title = formData.get("title") as string;
      const categoryName = formData.get("categoryName") as string;

      if (allHeadwearHero) {
        await update(allHeadwearHero.id, {
          title: title || allHeadwearHero.title,
          categoryName: categoryName || allHeadwearHero.categoryName,
          backgroundColor: allHeadwearHero.backgroundColor,
          opacity: allHeadwearHero.opacity,
        });
      } else {
        formData.set("title", "ALL IN HEADWEAR");
        formData.set("categoryName", "ALL_HEADWEAR");
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

  if (!allHeadwearHero && isEditor) {
    return (
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <EmptyHeroUpload
          onUpload={handleHeroUpdate}
          defaultTitle="ALL IN HEADWEAR"
          defaultCategory="ALL_HEADWEAR"
        />
      </div>
    );
  }

  return allHeadwearHero ? (
    <HeroSection
      heroData={allHeadwearHero}
      onUpdate={isEditor ? handleHeroUpdate : undefined}
    />
  ) : null;
};

export default AllInHeadwearProductList;
