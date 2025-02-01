import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ColorDialog from "./(lookupmodal)/ColorDialog";

interface ProductLookup {
  [key: string]: {
    id: string;
    productName: string;
    sellingPrice: number;
    dynamicPricing: Array<{
      id: string;
      from: string;
      to: string;
      type: string;
      amount: string;
      productId: string;
    }>;
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

const getEffectivePrice = (product: ProductLookup[string]): number => {
  const now = new Date();
  const activePricing = product.dynamicPricing.find(
    pricing => new Date(pricing.from) <= now && new Date(pricing.to) >= now
  );

  if (!activePricing) return product.sellingPrice;

  if (activePricing.type === "percentage") {
    const discount = parseFloat(activePricing.amount);
    return product.sellingPrice * (1 - discount / 100);
  } else if (activePricing.type === "fixed") {
    const discount = parseFloat(activePricing.amount);
    return product.sellingPrice - discount;
  }

  return product.sellingPrice;
};

const VariationsGrid = ({
  variations,
  products,
}: {
  variations: Variation[];
  products: ProductLookup;
}) => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(price);
  };

  const availableColors = new Set(variations.map(v => v.color));

  const groupedVariations = variations.reduce<ProductVariations>(
    (acc, variation) => {
      if (!availableColors.has(variation.color)) {
        return acc;
      }

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
        {Object.entries(groupedVariations).map(
          ([productId, { variations: colorVariations }]) => {
            const product = products[productId];
            const displayVariation = colorVariations[0]?.variations[0];

            if (!displayVariation || !product) return null;

            const availableColors = colorVariations.slice(0, 2);
            const remainingCount = colorVariations.length - 2;
            const effectivePrice = getEffectivePrice(product);

            return (
              <div
                key={productId}
                className="group relative bg-background rounded-lg hover:shadow-lg transition-shadow shadow-lg border border-border"
              >
                <div className="aspect-square relative overflow-hidden rounded-t-lg">
                  {displayVariation.variationImageURL ? (
                    <Image
                      src={displayVariation.variationImageURL}
                      alt={displayVariation.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                      <div className="text-center">
                        <span className="block text-lg font-medium text-muted-foreground">
                          {product?.productName || displayVariation.name}
                        </span>
                        <span className="block text-sm text-muted-foreground/70 mt-1">
                          {displayVariation.color} - {displayVariation.size}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
                      {displayVariation.size}
                    </span>
                  </div>

                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        displayVariation.quantity > 0
                          ? "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-100"
                          : "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-100"
                      }`}
                    >
                      {displayVariation.quantity > 0
                        ? "In Stock"
                        : "Out of Stock"}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                    {product?.productName || displayVariation.name}
                  </h3>

                  <p className="mt-3 text-lg font-bold text-foreground">
                    {formatPrice(effectivePrice)}
                  </p>

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

        {variations.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No variations found with selected filters
          </div>
        )}
      </div>

      <ColorDialog
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        selectedProduct={selectedProduct}
        groupedVariations={{
          ...groupedVariations,
          [selectedProduct || ""]: {
            ...groupedVariations[selectedProduct || ""],
            product: selectedProduct ? products[selectedProduct] : undefined,
          },
        }}
      />
    </>
  );
};

export default VariationsGrid;
