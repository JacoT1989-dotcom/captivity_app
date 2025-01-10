// app/(user)/(DropDownCategories)/products/headwear/pre-curved-peaks/_components/PreCurvedPeaks.tsx
"use client";

import React, { useMemo, useEffect } from "react";
import { Loader2 } from "lucide-react";
import HeroSection from "@/app/(user)/_components/(collection-hero)/HeroSection";
import { EmptyHeroUpload } from "@/app/(user)/_components/(collection-hero)/EmptyHeroUpload";
import { useCategoryHeroStore } from "@/app/(editor)/_editor-store/category-hero-store";
import { useSession } from "@/app/SessionProvider";

const PreCurvedPeaksProductList: React.FC = () => {
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

  const preCurvedPeaksHero = useMemo(
    () => heroes.find(hero => hero.categoryName === "PRE CURVED PEAKS"),
    [heroes]
  );

  const handleHeroUpdate = async (formData: FormData) => {
    try {
      const title = formData.get("title") as string;
      const categoryName = formData.get("categoryName") as string;

      if (preCurvedPeaksHero) {
        await update(preCurvedPeaksHero.id, {
          title: title || preCurvedPeaksHero.title,
          categoryName: categoryName || preCurvedPeaksHero.categoryName,
          backgroundColor: preCurvedPeaksHero.backgroundColor,
          opacity: preCurvedPeaksHero.opacity,
        });
      } else {
        // Set default values for new upload
        formData.set("title", "PRE CURVED PEAKS");
        formData.set("categoryName", "PRE CURVED PEAKS");
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
  if (!preCurvedPeaksHero && isEditor) {
    return (
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <EmptyHeroUpload
          onUpload={handleHeroUpdate}
          defaultTitle="PRE CURVED PEAKS"
          defaultCategory="PRE CURVED PEAKS"
        />
      </div>
    );
  }

  // If there's no hero and user is not an editor, return null
  if (!preCurvedPeaksHero) return null;

  return (
    <HeroSection
      heroData={preCurvedPeaksHero}
      onUpdate={isEditor ? handleHeroUpdate : undefined}
    />
  );
};

export default PreCurvedPeaksProductList;
