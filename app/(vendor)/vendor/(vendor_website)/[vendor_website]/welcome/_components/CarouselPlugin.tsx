"use client";

import Image from "next/image";
import { useEffect, useState, useRef, useCallback, memo } from "react";
import { Trash2, Plus, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useBannerData } from "../_store/BannerStore";
import { useParams } from "next/navigation";
import { useSession } from "@/app/(vendor)/SessionProvider";

const MAX_BANNERS = 5;
const CAROUSEL_INTERVAL = 4000;

interface BannerImageProps {
  src: string;
  index: number;
  onRemove: (url: string) => void;
  isVendor: boolean;
}

interface UploadSlotProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  bannersLength: number;
}

const BannerImage = memo(
  ({ src, index, onRemove, isVendor }: BannerImageProps) => (
    <div className="relative group w-full h-full">
      <Image
        src={src}
        alt={`Banner ${index + 1}`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
        className="object-cover"
        priority
      />
      {isVendor && (
        <button
          onClick={() => onRemove(src)}
          className="absolute top-2 sm:top-4 left-2 sm:left-4 p-1.5 sm:p-2 bg-white/80 rounded-full 
                 opacity-0 group-hover:opacity-100 transition-opacity
                 hover:bg-white hover:text-red-500 z-10"
        >
          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}
    </div>
  )
);

BannerImage.displayName = "BannerImage";

const NavButton = memo(
  ({
    direction,
    onClick,
  }: {
    direction: "prev" | "next";
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className="absolute top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full 
                opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-20"
      style={{ [direction === "prev" ? "left" : "right"]: "1rem" }}
    >
      {direction === "prev" ? (
        <ChevronLeft className="w-6 h-6" />
      ) : (
        <ChevronRight className="w-6 h-6" />
      )}
    </button>
  )
);

NavButton.displayName = "NavButton";

const UploadSlot = memo(({ onFileSelect, bannersLength }: UploadSlotProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        onClick={handleClick}
        className="w-full max-w-[300px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[800px] 
                 h-[100px] sm:h-[150px] md:h-[200px] lg:h-[250px] 
                 flex items-center justify-center bg-gray-50 
                 border-2 border-dashed border-gray-300 
                 cursor-pointer hover:bg-gray-100 transition-colors"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileSelect}
          accept="image/*"
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3">
          <div className="p-2 rounded-full bg-gray-100">
            <Plus className="w-5 h-5 text-gray-500" />
          </div>
          <div className="flex flex-col items-center text-center">
            <p className="text-xs text-gray-500 mb-1">
              Click to upload banner ({bannersLength}/{MAX_BANNERS})
            </p>
            <p className="text-[11px] text-gray-400 font-medium">
              Recommended dimensions:
            </p>
            <p className="text-[11px] text-gray-400">
              width=1903 x height=438 pixels
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

UploadSlot.displayName = "UploadSlot";

export default function CarouselPlugin() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { user } = useSession();
  const params = useParams();
  const vendorSlug =
    typeof params?.vendor_website === "string"
      ? params.vendor_website
      : undefined;

  // Reset current index when vendor changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [vendorSlug]);

  const { banners, isLoading, error, upload, remove } =
    useBannerData(vendorSlug);

  const isVendor = user?.role === "VENDOR";
  const bannerUrls = banners.map(banner => banner.url);
  const showUploadSlot = isVendor && bannerUrls.length < MAX_BANNERS;
  const allSlides = showUploadSlot
    ? [...bannerUrls, "upload-slot"]
    : bannerUrls;

  const stopCarousel = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startCarousel = useCallback(() => {
    if (allSlides.length <= 1 || isPaused) {
      stopCarousel();
      return;
    }

    stopCarousel();
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % allSlides.length);
    }, CAROUSEL_INTERVAL);
  }, [allSlides.length, isPaused, stopCarousel]);

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!isVendor) return;

      const file = event.target.files?.[0];
      if (!file) return;

      if (bannerUrls.length >= MAX_BANNERS) {
        alert(`Maximum ${MAX_BANNERS} banners allowed`);
        return;
      }

      const formData = new FormData();
      formData.append("banner", file);
      try {
        await upload(formData);
        event.target.value = "";
      } catch (error) {
        console.error("Upload failed:", error);
      }
    },
    [isVendor, bannerUrls.length, upload]
  );

  const handleRemoveBanner = useCallback(
    async (url: string) => {
      if (
        !isVendor ||
        !window.confirm("Are you sure you want to remove this banner?")
      )
        return;
      try {
        await remove(url);
        setCurrentIndex(prev => (prev >= bannerUrls.length - 1 ? 0 : prev));
      } catch (error) {
        console.error("Remove failed:", error);
      }
    },
    [isVendor, remove, bannerUrls.length]
  );

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % allSlides.length);
  }, [allSlides.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + allSlides.length) % allSlides.length);
  }, [allSlides.length]);

  useEffect(() => {
    startCarousel();
    return () => stopCarousel();
  }, [startCarousel, stopCarousel]);

  if (isLoading) {
    return (
      <div className="w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] flex items-center justify-center bg-gray-50">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (bannerUrls.length === 0 && !showUploadSlot) {
    return null;
  }

  return (
    <div
      className="relative overflow-hidden w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex transition-transform duration-500 h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {allSlides.map((slide, index) => (
          <div
            key={slide === "upload-slot" ? "upload" : `banner-${index}`}
            className="flex-shrink-0 w-full h-full relative"
          >
            {slide === "upload-slot" && isVendor ? (
              <UploadSlot
                onFileSelect={handleFileSelect}
                bannersLength={bannerUrls.length}
              />
            ) : (
              <BannerImage
                src={slide}
                index={index}
                onRemove={handleRemoveBanner}
                isVendor={isVendor}
              />
            )}
          </div>
        ))}
      </div>

      {allSlides.length > 1 && (
        <>
          <NavButton direction="prev" onClick={handlePrev} />
          <NavButton direction="next" onClick={handleNext} />
        </>
      )}

      {isVendor && isLoading && (
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/80 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm">
          Uploading...
        </div>
      )}

      {isVendor && error && (
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-red-500 text-white px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm">
          {error}
        </div>
      )}

      {allSlides.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          {allSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
