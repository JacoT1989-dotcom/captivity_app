import React, { memo, useMemo } from "react";
import Image from "next/image";
import { DynamicPricing } from "@prisma/client";

export const ProductPrice = memo(
  ({
    dynamicPricing,
    sellingPrice,
  }: {
    dynamicPricing: DynamicPricing[];
    sellingPrice: number;
  }) => {
    const price =
      dynamicPricing.length > 0
        ? parseFloat(dynamicPricing[0].amount)
        : sellingPrice;

    return (
      <p className="text-gray-600 font-medium mb-4">R {price.toFixed(2)}</p>
    );
  }
);

ProductPrice.displayName = "ProductPrice";

const DEFAULT_IMAGE = "/placeholder.jpg";

export const ProductImage = memo(
  ({ imageSrc, alt }: { imageSrc?: string | null; alt: string }) => {
    const imageUrl = useMemo(() => imageSrc || DEFAULT_IMAGE, [imageSrc]);

    return (
      <div className="relative w-full aspect-square">
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </div>
    );
  }
);

ProductImage.displayName = "ProductImage";
