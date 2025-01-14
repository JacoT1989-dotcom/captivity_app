import React, { useState } from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { useSession } from "@/app/SessionProvider";
import { EditModal } from "./EditModal";
import {
  CategoryHeroItem,
  CategoryHeroUpdateData,
  CollectionBannerItem,
  CollectionBannerUpdateData,
  HeroData,
} from "../collection-banner-types";

interface UniversalHeroSectionProps {
  heroData?: HeroData;
  type: "collection" | "category";
  onUpdate: (formData: FormData) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  onUpdateWithoutImage: (
    id: string,
    data: CategoryHeroUpdateData | CollectionBannerUpdateData
  ) => Promise<void>;
}

const UniversalHeroSection: React.FC<UniversalHeroSectionProps> = ({
  heroData,
  type,
  onUpdate,
  onRemove,
  onUpdateWithoutImage,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const sessionData = useSession();
  const isEditor = sessionData?.user?.role === "EDITOR";

  const handleUpdate = async (formData: FormData) => {
    if (!heroData) return;

    try {
      const hasNewImage = formData.has("image");
      if (hasNewImage) {
        await onUpdate(formData);
      } else {
        const title = formData.get("title") as string;
        const opacity = parseFloat(formData.get("opacity") as string);
        const baseData = {
          title,
          backgroundColor: "#000000",
          opacity,
        };

        if (type === "collection") {
          const collectionId = formData.get("collectionId") as string;
          await onUpdateWithoutImage(heroData.id, {
            ...baseData,
            collectionId,
          });
        } else {
          const categoryName = formData.get("categoryName") as string;
          await onUpdateWithoutImage(heroData.id, {
            ...baseData,
            categoryName,
          });
        }
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating hero:", error);
    }
  };

  if (!heroData) return null;

  // Create properly typed hero data based on type
  const heroDataWithType: HeroData =
    type === "category"
      ? ({
          ...heroData,
          type: "category" as const,
        } as CategoryHeroItem)
      : ({
          ...heroData,
          type: "collection" as const,
        } as CollectionBannerItem);

  return (
    <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] mb-8 overflow-hidden">
      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-black z-10"
        style={{ opacity: heroData.opacity }}
      />

      {/* Hero Image */}
      <Image
        src={heroData.imageUrl}
        alt={heroData.title}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
        priority
      />

      {/* Title Overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-wider">
          {heroData.title}
        </h1>
      </div>

      {isEditor && (
        <>
          {/* Edit/Delete buttons */}
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-2 z-30">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 sm:p-2 bg-white/80 rounded-full hover:bg-white transition-colors hover:scale-125"
              aria-label={`Edit ${type} hero section`}
            >
              <Pencil className="w-3 h-3 sm:w-4 sm:h-4 dark:text-black" />
            </button>
            <button
              onClick={() => onRemove(heroData.id)}
              className="p-1.5 sm:p-2 bg-white/80 rounded-full hover:bg-white transition-colors hover:scale-125"
              aria-label={`Delete ${type} hero section`}
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 dark:text-black" />
            </button>
          </div>

          <EditModal
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
            currentImage={heroData.imageUrl}
            currentData={heroDataWithType}
            onSave={handleUpdate}
          />
        </>
      )}
    </div>
  );
};

export default UniversalHeroSection;
