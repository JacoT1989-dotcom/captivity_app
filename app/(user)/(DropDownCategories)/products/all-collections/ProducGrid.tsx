"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ProductLookupModal from "./ProductLookupModal";
import { Product as StoreProduct } from "./_store/types";
import { ProductDetailsDialog } from "./ProductDetailsDialog";
import { ColorDisplay } from "./ColorBackground";

interface ProductGridProps {
  products: StoreProduct[];
}

interface ProductVariation {
  color: string;
  variations: StoreProduct["variations"];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(
    null
  );
  const [isColorDialogOpen, setIsColorDialogOpen] = useState<boolean>(false);
  const [colorDialogProductId, setColorDialogProductId] = useState<
    string | null
  >(null);

  // const formatPrice = (price: number): string => {
  //   return new Intl.NumberFormat("en-ZA", {
  //     style: "currency",
  //     currency: "ZAR",
  //   }).format(price);
  // };

  const getBasePrice = (product: StoreProduct): number => {
    const basePricing = product.dynamicPricing.find(
      pricing => pricing.from === "1" && pricing.to === "24"
    );
    return basePricing ? parseFloat(basePricing.amount) : product.sellingPrice;
  };

  const getTotalStock = (variations: StoreProduct["variations"]): number => {
    return variations.reduce(
      (total, variation) => total + variation.quantity,
      0
    );
  };

  const handleColorDialogOpen = (
    product: StoreProduct,
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>
  ): void => {
    e.stopPropagation();
    setSelectedProduct(product);
    setColorDialogProductId(product.id);
    setIsColorDialogOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 w-full max-w-full">
        {products.map(product => {
          const uniqueColors = Array.from(
            new Set(product.variations.map(v => v.color))
          );
          const displayColors = uniqueColors.slice(0, 3);
          const remainingColors = uniqueColors.length - 3;

          return (
            <div
              key={product.id}
              className="relative bg-background rounded-lg border border-border overflow-hidden w-full"
              style={{ maxWidth: "100%" }}
            >
              {/* Image Container */}
              <div className="aspect-square relative w-full">
                {product.featuredImage ? (
                  <Image
                    src={product.featuredImage.large}
                    alt={product.productName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-4xl sm:text-5xl font-bold text-muted-foreground/50">
                        {product.productName.charAt(0).toUpperCase()}
                      </span>
                      <span className="mt-2 text-xs text-muted-foreground font-medium">
                        {product.category[0]?.replace(/-/g, " ")}
                      </span>
                    </div>
                  </div>
                )}

                {/* Stock Badge */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      getTotalStock(product.variations) > 0
                        ? "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-100"
                        : "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-100"
                    }`}
                  >
                    {getTotalStock(product.variations) > 0
                      ? "In Stock"
                      : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Product Info Container */}
              <div className="p-3 sm:p-4 flex flex-col">
                <h3 className="text-base sm:text-lg font-semibold text-center text-foreground line-clamp-1 hover:line-clamp-none">
                  {product.productName}
                </h3>
                {/* <p className="mt-2 text-base sm:text-lg font-bold text-foreground text-center">
                  {formatPrice(getBasePrice(product))}
                </p> */}

                {/* Fixed Height Color Variants Container */}
                <div className="h-[3.75rem] mt-2">
                  <div className="flex flex-col items-center gap-1">
                    {/* Color swatches row */}
                    <div className="flex justify-center gap-1">
                      {displayColors.map(color => (
                        <div
                          key={color}
                          onClick={e => handleColorDialogOpen(product, e)}
                          className="cursor-pointer transform scale-90"
                        >
                          <ColorDisplay
                            color={color}
                            size="sm"
                            showTooltip={true}
                          />
                        </div>
                      ))}
                    </div>

                    {/* More button - will wrap to next line */}
                    {remainingColors > 0 && (
                      <Button
                        onClick={e => handleColorDialogOpen(product, e)}
                        variant="default"
                        className="h-5 px-1.5 text-xs min-w-[3.5rem]"
                      >
                        +{remainingColors} more
                      </Button>
                    )}
                  </div>
                </div>

                {/* View More Button */}
                <Button
                  onClick={() => setSelectedProduct(product)}
                  className="w-full mt-3 sm:mt-4"
                  variant="secondary"
                >
                  View More
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <ProductDetailsDialog
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {selectedProduct && (
        <ProductLookupModal
          isOpen={isColorDialogOpen}
          onClose={() => {
            setIsColorDialogOpen(false);
            setColorDialogProductId(null);
            setSelectedProduct(null);
          }}
          productId={colorDialogProductId}
          product={selectedProduct}
          productVariations={{
            variations: selectedProduct.variations.reduce<ProductVariation[]>(
              (acc, curr) => {
                const existing = acc.find(v => v.color === curr.color);
                if (existing) {
                  existing.variations.push(curr);
                } else {
                  acc.push({ color: curr.color, variations: [curr] });
                }
                return acc;
              },
              []
            ),
          }}
        />
      )}
    </>
  );
};

export default ProductGrid;
