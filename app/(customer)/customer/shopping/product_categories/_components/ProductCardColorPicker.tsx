"use client";

import React, { memo, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProductImage, ProductPrice } from "./ProductCardComponents";
import { ProductWithRelations } from "../types";
import { useColorStore } from "../../../_store/useColorStore";
import ViewMore from "@/app/(customer)/_components/ViewMore"; // Import ViewMore component

interface ProductCardProps {
  product: ProductWithRelations;
  selectedColors: string[];
  selectedSizes: string[];
}

const ProductCard: React.FC<ProductCardProps> = memo(
  ({ product, selectedColors, selectedSizes }) => {
    const setSelectedColor = useColorStore(state => state.setSelectedColor);
    const defaultVariation = product.variations?.[0];

    // Find first matching variation based on selected filters
    const { currentVariation, totalStock } = useMemo(() => {
      const defaultVariation = product.variations?.[0];
      const matchingVariation =
        product.variations?.find(
          v =>
            selectedColors.some(
              color => v.color.toLowerCase() === color.toLowerCase()
            ) &&
            (!selectedSizes.length || selectedSizes.includes(v.size))
        ) || defaultVariation;

      const total = product.variations.reduce(
        (sum, variation) => sum + variation.quantity,
        0
      );

      return {
        currentVariation: matchingVariation,
        totalStock: total,
      };
    }, [product.variations, selectedColors, selectedSizes]);

    const handleShopClick = (e: React.MouseEvent) => {
      if (currentVariation?.color) {
        setSelectedColor(product.id, currentVariation.color);
      }
    };

    return (
      <Card className="h-auto overflow-hidden shadow-2xl shadow-black dark:shadow-gray-500 transition-transform duration-300 hover:scale-95">
        <div className="relative">
          <ProductImage
            imageSrc={
              currentVariation?.variationImageURL ||
              product.featuredImage?.large
            }
            alt={product.productName}
          />
        </div>
        <CardContent className="p-4">
          <h1 className="text-md font-md text-foreground font-semibold mb-2 line-clamp-1 hover:line-clamp-none">
            {product.productName}
          </h1>

          <div className="flex-col justify-start items-center mb-2">
            <div className="text-sm text-gray-600">
              {currentVariation && (
                <span>
                  {currentVariation.color} Stock: {currentVariation.quantity}
                </span>
              )}
            </div>
          </div>

          <ProductPrice
            dynamicPricing={product.dynamicPricing}
            sellingPrice={product.sellingPrice}
          />

          <div className="space-y-2">
            <Link
              href={`/customer/shopping/${product.id}`}
              className="w-full"
              onClick={handleShopClick}
            >
              <Button
                variant="destructive"
                size="sm"
                className="w-full text-sm py-2"
              >
                Shop
              </Button>
            </Link>

            <ViewMore
              href={`/customer/shopping/${product.id}/${currentVariation?.id || ""}`}
              variant="default"
              size="md"
            >
              View More Details
            </ViewMore>
          </div>
        </CardContent>
      </Card>
    );
  }
);

ProductCard.displayName = "ProductCard";
export default ProductCard;
