"use client";

import React, { useMemo, useEffect } from "react";
import { Loader2 } from "lucide-react";
import HeroSection from "@/app/(user)/_components/(collection-hero)/HeroSection";
import { useCategoryHeroStore } from "@/app/(editor)/_editor-store/category-hero-store";
import { useSession } from "@/app/SessionProvider";
import { EmptyHeroUpload } from "@/app/(user)/_components/(collection-hero)/EmptyHeroUpload";

const AllInApparelCategory: React.FC = () => {
  const sessionData = useSession();
  const isEditor = sessionData?.user?.role === "EDITOR";

  const { heroes, upload, isLoading, initialized, fetchHeroes } =
    useCategoryHeroStore();

  useEffect(() => {
    if (!initialized) {
      fetchHeroes();
    }
  }, [initialized, fetchHeroes]);

  const allApparelHero = useMemo(
    () => heroes.find(hero => hero.categoryName === "ALL_APPAREL"),
    [heroes]
  );

  const handleNewUpload = async (formData: FormData) => {
    try {
      formData.set("title", "ALL IN APPAREL");
      formData.set("categoryName", "ALL_APPAREL");
      formData.set("backgroundColor", "#000000");
      formData.set("opacity", "0.4");
      await upload(formData);
    } catch (error) {
      console.error("Error uploading hero:", error);
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

  if (!allApparelHero && isEditor) {
    return (
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <EmptyHeroUpload
          onUpload={handleNewUpload}
          defaultTitle="ALL IN APPAREL"
          defaultCategory="ALL_APPAREL"
        />
      </div>
    );
  }

  return <HeroSection heroData={allApparelHero} />;
};

export default AllInApparelCategory;
