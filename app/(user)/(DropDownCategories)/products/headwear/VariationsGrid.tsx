import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCategoryStore } from "./_store/headwear-store";
import ProductLookupModal from "./ProductLookupModal";

interface ProductLookup {
  [key: string]: {
    id: string;
    productName: string;
    sellingPrice: number;
  };
}

interface Variation {
  id: string;
  name: string;
  color: string;
  size: string;
  sku: string;
  sku2: string;
  variationImageURL: string;
  quantity: number;
  productId: string;
}

interface ColorVariation {
  color: string;
  variations: Variation[];
}

interface ProductVariations {
  [productId: string]: {
    variations: ColorVariation[];
  };
}

const VariationsGrid = ({
  variations,
  products,
}: {
  variations: Variation[];
  products: ProductLookup;
}) => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const { filters } = useCategoryStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(price);
  };

  // Group variations by product and color
  const groupedByProduct = variations.reduce<
    Record<string, Record<string, Variation>>
  >((acc, variation) => {
    if (!acc[variation.productId]) {
      acc[variation.productId] = {};
    }
    // For each color, keep only the first variation
    if (!acc[variation.productId][variation.color]) {
      acc[variation.productId][variation.color] = variation;
    }
    return acc;
  }, {});

  // Create the full product variations structure for the modal
  const productVariations = variations.reduce<ProductVariations>(
    (acc, variation) => {
      if (!acc[variation.productId]) {
        acc[variation.productId] = {
          variations: [],
        };
      }

      const existingColor = acc[variation.productId].variations.find(
        cv => cv.color === variation.color
      );

      if (!existingColor) {
        acc[variation.productId].variations.push({
          color: variation.color,
          variations: [variation],
        });
      } else {
        existingColor.variations.push(variation);
      }

      return acc;
    },
    {}
  );

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Object.entries(groupedByProduct).map(
          ([productId, colorVariations]) => {
            const product = products[productId];
            const displayVariations =
              filters.colors.length > 0
                ? Object.values(colorVariations).filter(variation =>
                    filters.colors.includes(variation.color)
                  )
                : [Object.values(colorVariations)[0]]; // Show only first color if no filter

            if (displayVariations.length === 0) return null;

            const variation = displayVariations[0];
            const availableColors = Object.values(colorVariations).slice(0, 2);
            const remainingCount = Object.keys(colorVariations).length - 2;

            return (
              <div
                key={`${productId}-${variation.color}`}
                className="group relative bg-background rounded-lg hover:shadow-lg transition-shadow shadow-lg border border-border"
              >
                <div className="aspect-square relative overflow-hidden rounded-t-lg">
                  {variation.variationImageURL ? (
                    <Image
                      src={variation.variationImageURL}
                      alt={variation.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                      <div className="text-center">
                        <span className="block text-lg font-medium text-muted-foreground">
                          {product?.productName || variation.name}
                        </span>
                        <span className="block text-sm text-muted-foreground/70 mt-1">
                          {variation.color} - {variation.size}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
                      {variation.size}
                    </span>
                  </div>

                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        variation.quantity > 0
                          ? "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-100"
                          : "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-100"
                      }`}
                    >
                      {variation.quantity > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                    {product?.productName || variation.name}
                  </h3>

                  {!filters.colors.length && availableColors.length > 0 && (
                    <div className="mt-4 flex items-center gap-2">
                      {availableColors.map(variation => (
                        <div
                          key={variation.color}
                          className={`w-6 h-6 rounded-full border border-border`}
                          style={{
                            backgroundColor: variation.color.toLowerCase(),
                          }}
                          title={variation.color}
                        />
                      ))}
                      {remainingCount > 0 && (
                        <Button
                          onClick={() => setSelectedProduct(productId)}
                          variant="ghost"
                          className="h-6 px-2 text-xs"
                        >
                          +{remainingCount} more
                        </Button>
                      )}
                    </div>
                  )}

                  {product && (
                    <p className="mt-3 text-lg font-bold text-foreground">
                      {formatPrice(product.sellingPrice)}
                    </p>
                  )}

                  <Button
                    onClick={() => setSelectedProduct(productId)}
                    className="w-full mt-4"
                    variant="secondary"
                  >
                    View More
                  </Button>
                </div>
              </div>
            );
          }
        )}
      </div>

      <ProductLookupModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        productId={selectedProduct}
        product={selectedProduct ? products[selectedProduct] : undefined}
        productVariations={
          selectedProduct ? productVariations[selectedProduct] : undefined
        }
      />
    </>
  );
};

export default VariationsGrid;
