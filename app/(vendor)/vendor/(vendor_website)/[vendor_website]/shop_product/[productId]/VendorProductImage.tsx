import React from "react";
import Image from "next/image";
import { VendorProductImageProps } from "./types";

interface VendorThumbnail {
  id: string;
  imageUrl: string;
  color: string;
  isSelected: boolean;
}

const VendorProductImage: React.FC<VendorProductImageProps> = ({
  selectedVariation,
  product,
  uniqueColors,
  onColorSelect,
}) => {
  // Use placehold.co as a reliable placeholder service
  const PLACEHOLDER_IMAGE =
    "https://placehold.co/400x400/e5e7eb/a1a1aa?text=No+Image";

  // Get the main display image
  const mainImage = React.useMemo(() => {
    // If a variation is selected and has an image, show it
    if (selectedVariation?.variationImageURL) {
      const url = selectedVariation.variationImageURL;
      // Support both URL patterns
      if (
        url.includes("captivity.co.za") ||
        url.includes("vercel-storage.com")
      ) {
        return url;
      }
    }

    // Otherwise, show the featured image
    if (product.featuredImage?.medium) {
      const url = product.featuredImage.medium;
      // Support both URL patterns
      if (
        url.includes("captivity.co.za") ||
        url.includes("vercel-storage.com")
      ) {
        return url;
      }
    }

    return PLACEHOLDER_IMAGE;
  }, [selectedVariation, product.featuredImage]);

  // Create array of only variation thumbnails
  const thumbnails: VendorThumbnail[] = React.useMemo(() => {
    const thumbs: VendorThumbnail[] = [];
    const addedImageUrls = new Set<string>();

    // Add one variation thumbnail per unique color
    uniqueColors.forEach(color => {
      const variation = product.variations.find(
        v => v.color === color && v.variationImageURL
      );

      if (variation?.variationImageURL) {
        const url = variation.variationImageURL;
        // Support both URL patterns
        if (
          (url.includes("captivity.co.za") ||
            url.includes("vercel-storage.com")) &&
          !addedImageUrls.has(url)
        ) {
          thumbs.push({
            id: variation.id,
            imageUrl: url,
            color: variation.color,
            isSelected: selectedVariation?.id === variation.id,
          });
          addedImageUrls.add(url);
        }
      }
    });

    return thumbs;
  }, [uniqueColors, product.variations, selectedVariation]);

  // Function to handle image loading error
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = PLACEHOLDER_IMAGE;
  };

  return (
    <div className="w-full md:w-1/2 pr-0 md:pr-6 mb-4 md:mb-0">
      {/* Main Image */}
      <div className="relative w-full h-[380px] mb-4">
        <Image
          src={mainImage}
          alt={product.productName}
          fill
          sizes="(max-width: 768px) 90vw, 40vw"
          style={{ objectFit: "cover" }}
          className="rounded-lg border border-border bg-muted"
          priority
          onError={handleImageError}
        />
      </div>

      {/* Color Variation Thumbnails */}
      {thumbnails.length > 0 && (
        <div className="flex flex-wrap -mx-2">
          {thumbnails.map(thumb => (
            <div key={thumb.id} className="w-1/4 px-2 mb-4">
              <div
                className={`relative w-full pt-[100%] cursor-pointer rounded-md overflow-hidden border ${
                  thumb.isSelected
                    ? "ring-2 ring-ring border-primary"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => onColorSelect(thumb.color)}
              >
                <Image
                  src={thumb.imageUrl}
                  alt={`${product.productName} - ${thumb.color}`}
                  fill
                  sizes="(max-width: 768px) 25vw, 8.5vw"
                  style={{ objectFit: "cover" }}
                  className="bg-muted"
                  priority
                  onError={handleImageError}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center mt-1">
                {thumb.color}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorProductImage;
