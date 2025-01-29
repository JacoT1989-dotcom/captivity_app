// VariationsGrid.tsx
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ProductLookupModal from "./ProductLookupModal";
import { useCategoryStore } from "./_store/all-collections-store";
import type { Product, Variation } from "./_store/types";

// Define simplified product lookup type that matches what's passed from parent
interface SimplifiedProductLookup {
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

interface ColorVariation {
  color: string;
  variations: Variation[];
}

interface ProductVariations {
  [productId: string]: {
    variations: ColorVariation[];
  };
}

interface VariationsGridProps {
  variations: Variation[];
  products: SimplifiedProductLookup;
}

const getFullProduct = (
  baseProduct: SimplifiedProductLookup[string],
  productId: string,
  variations: Variation[]
): Product => {
  return {
    id: baseProduct.id,
    productName: baseProduct.productName,
    sellingPrice: baseProduct.sellingPrice,
    dynamicPricing: baseProduct.dynamicPricing,
    variations: variations.filter(v => v.productId === productId),
    userId: "",
    category: [],
    description: "",
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    reviews: [],
    featuredImage: null,
  };
};

const VariationsGrid: React.FC<VariationsGridProps> = ({
  variations,
  products,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const { filters } = useCategoryStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(price);
  };

  // Group variations by product
  const groupedByProduct = variations.reduce<Record<string, Variation[]>>(
    (acc, variation) => {
      if (!acc[variation.productId]) {
        acc[variation.productId] = [];
      }
      acc[variation.productId].push(variation);
      return acc;
    },
    {}
  );

  // Create product variations structure for modal
  const productVariations = Object.entries(
    groupedByProduct
  ).reduce<ProductVariations>((acc, [productId, productVars]) => {
    acc[productId] = {
      variations: [],
    };

    // Group by color
    const colorGroups = productVars.reduce<Record<string, Variation[]>>(
      (colors, variation) => {
        if (!colors[variation.color]) {
          colors[variation.color] = [];
        }
        colors[variation.color].push(variation);
        return colors;
      },
      {}
    );

    // Sort sizes within each color group
    Object.values(colorGroups).forEach(variations => {
      variations.sort((a, b) => {
        const sizeA = parseFloat(a.size) || a.size;
        const sizeB = parseFloat(b.size) || b.size;

        if (typeof sizeA === "number" && typeof sizeB === "number") {
          return sizeA - sizeB;
        }
        return String(sizeA).localeCompare(String(sizeB));
      });
    });

    // Create color variations array
    acc[productId].variations = Object.entries(colorGroups).map(
      ([color, vars]) => ({
        color,
        variations: vars,
      })
    );

    return acc;
  }, {});

  // Filter products based on selected filters
  const filteredProducts = Object.entries(groupedByProduct).filter(
    ([productId, productVars]) => {
      if (filters.colors.length > 0) {
        const hasMatchingColor = productVars.some(v =>
          filters.colors.includes(v.color)
        );
        if (!hasMatchingColor) return false;
      }

      if (filters.sizes.length > 0) {
        const hasMatchingSize = productVars.some(v =>
          filters.sizes.includes(v.size)
        );
        if (!hasMatchingSize) return false;
      }

      if (filters.stockLevel !== "all") {
        const hasStock = productVars.some(v => v.quantity > 0);
        if (filters.stockLevel === "in" && !hasStock) return false;
        if (filters.stockLevel === "out" && hasStock) return false;
      }

      return true;
    }
  );

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        {filteredProducts.map(([productId, productVars]) => {
          const product = products[productId];
          if (!product) return null;

          const uniqueColors = [...new Set(productVars.map(v => v.color))];
          const displayColors = uniqueColors.slice(0, 2);
          const remainingColorCount = Math.max(0, uniqueColors.length - 2);
          const displayVariation = productVars[0];

          return (
            <div
              key={productId}
              className="relative bg-background rounded-lg border border-border overflow-hidden max-w-full"
              style={{ minHeight: "0" }}
            >
              <div className="aspect-square relative w-full">
                {displayVariation.variationImageURL ? (
                  <Image
                    src={displayVariation.variationImageURL}
                    alt={displayVariation.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    priority
                    onError={e => {
                      const imgElement = e.target as HTMLImageElement;
                      imgElement.src = "/placeholder.jpg";
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-4xl sm:text-5xl font-bold text-muted-foreground/50">
                        {product.productName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}

                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      productVars.some(v => v.quantity > 0)
                        ? "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-100"
                        : "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-100"
                    }`}
                  >
                    {productVars.some(v => v.quantity > 0)
                      ? "In Stock"
                      : "Out of Stock"}
                  </span>
                </div>
              </div>

              <div className="p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold text-foreground line-clamp-1 hover:line-clamp-none">
                  {product.productName}
                </h3>

                {!filters.colors.length && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {displayColors.map(color => (
                      <div
                        key={color}
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-md border border-border"
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                    {remainingColorCount > 0 && (
                      <Button
                        onClick={() => setSelectedProduct(productId)}
                        variant="default"
                        className="h-5 sm:h-6 px-2 text-xs"
                      >
                        +{remainingColorCount} more
                      </Button>
                    )}
                  </div>
                )}

                <p className="mt-2 text-base sm:text-lg font-bold text-foreground">
                  {formatPrice(product.sellingPrice)}
                </p>

                <Button
                  onClick={() => setSelectedProduct(productId)}
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

      <ProductLookupModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        productId={selectedProduct}
        product={
          selectedProduct
            ? getFullProduct(
                products[selectedProduct],
                selectedProduct,
                variations
              )
            : undefined
        }
        productVariations={
          selectedProduct ? productVariations[selectedProduct] : undefined
        }
      />
    </>
  );
};

export default VariationsGrid;
