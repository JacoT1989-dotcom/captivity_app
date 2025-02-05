"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ProductDetailsDialog from "./ProductDetailsDialog";
import ProductLookupModal from "./(lookupmodal)/ProductLookupModal";
import ColorSwatch from "./(lookupmodal)/ColorSwatch";
import { Product as StoreProduct } from "./_store/types";

interface ProductGridProps {
  products: StoreProduct[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(
    null
  );
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false);
  const [colorDialogProductId, setColorDialogProductId] = useState<
    string | null
  >(null);

  // const formatPrice = (price: number) => {
  //   return new Intl.NumberFormat("en-ZA", {
  //     style: "currency",
  //     currency: "ZAR",
  //   }).format(price);
  // };

  const getBasePrice = (product: StoreProduct) => {
    const basePricing = product.dynamicPricing.find(
      pricing => pricing.from === "1" && pricing.to === "24"
    );

    return basePricing ? parseFloat(basePricing.amount) : product.sellingPrice;
  };

  const getTotalStock = (variations: StoreProduct["variations"]) => {
    return variations.reduce(
      (total, variation) => total + variation.quantity,
      0
    );
  };

  const handleColorDialogOpen = (
    product: StoreProduct,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setColorDialogProductId(product.id);
    setIsColorDialogOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        {products.map(product => (
          <div
            key={product.id}
            className="relative bg-background rounded-lg border border-border overflow-hidden max-w-full"
            style={{ minHeight: "0" }}
          >
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

            <div className="p-3 sm:p-4 flex flex-col">
              <h3 className="text-base sm:text-lg font-semibold text-foreground line-clamp-1 hover:line-clamp-none text-center">
                {product.productName}
              </h3>
              {/* <p className="mt-2 text-base sm:text-lg font-bold text-foreground text-center">
                {formatPrice(getBasePrice(product))}
              </p> */}

              {/* Fixed Height Color Variants Container */}
              <div className="h-[3.25rem] mt-2">
                <div className="flex flex-col items-center gap-1">
                  {/* Color swatches row */}
                  <div className="flex justify-center gap-1">
                    {Array.from(new Set(product.variations.map(v => v.color)))
                      .slice(0, 3)
                      .map(color => (
                        <div
                          key={color}
                          className="transform scale-75 cursor-pointer"
                        >
                          <ColorSwatch
                            color={color}
                            isSelected={false}
                            onClick={(
                              e: React.MouseEvent<HTMLButtonElement>
                            ) => {
                              e.stopPropagation();
                              handleColorDialogOpen(product, e);
                            }}
                            showCheckmark={false}
                          />
                        </div>
                      ))}
                  </div>

                  {/* More button - will wrap to next line */}
                  {Array.from(new Set(product.variations.map(v => v.color)))
                    .length > 3 && (
                    <Button
                      onClick={e => handleColorDialogOpen(product, e)}
                      variant="default"
                      className="h-5 px-1.5 text-xs min-w-[3.5rem]"
                    >
                      +
                      {Array.from(new Set(product.variations.map(v => v.color)))
                        .length - 3}{" "}
                      more
                    </Button>
                  )}
                </div>
              </div>

              <Button
                onClick={() => setSelectedProduct(product)}
                className="w-full mt-5 sm:mt-4"
                variant="secondary"
              >
                View More
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Details Dialog */}
      <ProductDetailsDialog
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Color Selection Dialog */}
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
            variations: selectedProduct.variations.reduce(
              (acc, curr) => {
                const existing = acc.find(v => v.color === curr.color);
                if (existing) {
                  existing.variations.push(curr);
                } else {
                  acc.push({ color: curr.color, variations: [curr] });
                }
                return acc;
              },
              [] as Array<{
                color: string;
                variations: typeof selectedProduct.variations;
              }>
            ),
          }}
        />
      )}
    </>
  );
};

export default ProductGrid;
