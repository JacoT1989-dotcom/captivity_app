"use client";

import React, { useMemo, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useSession } from "@/app/SessionProvider";
import { useCollectionBannerStore } from "../../_editor/hero-upload-store";
import {
  CategoryHeroUpdateData,
  CollectionBannerUpdateData,
} from "../../_editor/collection-banner-types";
import { UniversalEmptyUpload } from "../../_editor/_components/UniversalEmptyUpload";
import UniversalHeroSection from "../../_editor/_components/UniversalHeroSection";

const COLLECTION_ID = "african-collection";
const COLLECTION_TITLE = "African Collection";

const AfricanCollection: React.FC = () => {
  const sessionData = useSession();
  const isEditor = sessionData?.user?.role === "EDITOR";

  const {
    banners,
    upload,
    update,
    updateWithImage,
    remove,
    isLoading,
    initialized,
    fetchBanners,
  } = useCollectionBannerStore();

  useEffect(() => {
    if (!initialized) {
      fetchBanners();
    }
  }, [initialized, fetchBanners]);

  const africanCollectionBanner = useMemo(
    () => banners.find(banner => banner.collectionId === COLLECTION_ID),
    [banners]
  );

  const handleBannerUpload = async (formData: FormData) => {
    try {
      // Set default values for new upload if not provided
      formData.set("title", COLLECTION_TITLE);
      formData.set("collectionId", COLLECTION_ID);
      formData.set("backgroundColor", "#000000");
      formData.set("opacity", "0.4");

      await upload(formData);
    } catch (error) {
      console.error("Error uploading banner:", error);
      throw error;
    }
  };

  const handleBannerUpdate = async (formData: FormData) => {
    if (!africanCollectionBanner) return;

    try {
      await updateWithImage(africanCollectionBanner.id, formData);
    } catch (error) {
      console.error("Error updating banner:", error);
      throw error;
    }
  };

  const handleUpdateWithoutImage = async (
    id: string,
    data: CategoryHeroUpdateData | CollectionBannerUpdateData
  ) => {
    try {
      if ("collectionId" in data) {
        await update(id, {
          title: data.title,
          collectionId: data.collectionId,
          backgroundColor: data.backgroundColor,
          opacity: data.opacity,
        });
      }
    } catch (error) {
      console.error("Error updating banner:", error);
      throw error;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <Loader2 className="mx-auto my-3 animate-spin h-8 w-8" />
        <p className="text-muted-foreground">Loading banner...</p>
      </div>
    );
  }

  // Show empty upload state for editors when no banner exists
  if (!africanCollectionBanner && isEditor) {
    console.log("Showing empty upload state"); // Debug log
    return (
      <div className="w-full">
        <UniversalEmptyUpload
          onUpload={handleBannerUpload}
          collectionType="collection"
          customTitle={COLLECTION_TITLE}
          customIdentifier={COLLECTION_ID}
        />
      </div>
    );
  }

  // Show banner if it exists
  if (africanCollectionBanner) {
    return (
      <UniversalHeroSection
        heroData={africanCollectionBanner}
        type="collection"
        onUpdate={handleBannerUpdate}
        onRemove={remove}
        onUpdateWithoutImage={handleUpdateWithoutImage}
      />
    );
  }

  // Return null if no banner and user is not an editor
  return null;
};

export default AfricanCollection;
