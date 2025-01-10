import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

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
    mainVariation: Variation;
    colorVariations: ColorVariation[];
  };
}

interface VariationsGridProps {
  variations: Variation[];
  products: ProductLookup;
}

const VariationsGrid = ({ variations, products }: VariationsGridProps) => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(price);
  };

  // Group variations by product and color
  const groupedVariations = variations.reduce<ProductVariations>(
    (acc, variation) => {
      if (!acc[variation.productId]) {
        acc[variation.productId] = {
          mainVariation: variation,
          colorVariations: [],
        };
      }

      const existingColor = acc[variation.productId].colorVariations.find(
        cv => cv.color === variation.color
      );

      if (!existingColor) {
        acc[variation.productId].colorVariations.push({
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

  const colorMap: { [key: string]: string } = {
    Black: "#000000",
    White: "#FFFFFF",
    Navy: "#000080",
    Grey: "#808080",
    Red: "#FF0000",
    Green: "#008000",
    Blue: "#0000FF",
    Yellow: "#FFFF00",
    Purple: "#800080",
    Orange: "#FFA500",
    "Army Brown": "#8B4513",
    "Army Green": "#4B5320",
    "Black/Grey": "#333333",
    "Black/Orange": "#FF4500",
    Bottle: "#006B3C",
    "Bottle/Khaki": "#4A5D23",
    "Burgundy/White": "#800020",
    "Burnt Orange": "#CC5500",
    "Camo Black": "#1A1A1A",
    "Camo Blue": "#1B4B7D",
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Object.entries(groupedVariations).map(
          ([productId, { mainVariation, colorVariations }]) => {
            const product = products[productId];
            const initialColors = colorVariations.slice(0, 3);
            const remainingCount = colorVariations.length - 3;

            return (
              <div
                key={productId}
                className="group relative bg-background rounded-lg hover:shadow-lg transition-shadow shadow-lg border border-border"
              >
                <Link href={`/products/${productId}`}>
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    {mainVariation.variationImageURL ? (
                      <Image
                        src={mainVariation.variationImageURL}
                        alt={mainVariation.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        priority
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                        <div className="text-center">
                          <span className="block text-lg font-medium text-muted-foreground">
                            {product?.productName || mainVariation.name}
                          </span>
                          <span className="block text-sm text-muted-foreground/70 mt-1">
                            {mainVariation.color} - {mainVariation.size}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
                        {mainVariation.size}
                      </span>
                    </div>

                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          mainVariation.quantity > 0
                            ? "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-100"
                            : "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-100"
                        }`}
                      >
                        {mainVariation.quantity > 0
                          ? "In Stock"
                          : "Out of Stock"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                      {product?.productName || mainVariation.name}
                    </h3>

                    <div className="mt-4 flex items-center gap-4">
                      {initialColors.map(({ color }) => (
                        <div key={color} className="relative group">
                          <button
                            className={`relative w-5 h-5 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1`}
                          >
                            <div
                              className={`absolute inset-0 rounded-full ${
                                color === "White"
                                  ? "border border-gray-200"
                                  : ""
                              }`}
                              style={{
                                backgroundColor: colorMap[color] || "#000000",
                              }}
                            />
                          </button>
                          <span className="absolute pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {color}
                          </span>
                        </div>
                      ))}
                      {remainingCount > 0 && (
                        <button
                          onClick={e => {
                            e.preventDefault();
                            setSelectedProduct(productId);
                          }}
                          className="px-3 py-1 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          +{remainingCount} more
                        </button>
                      )}
                    </div>

                    {product && (
                      <p className="mt-3 text-lg font-bold text-foreground">
                        {formatPrice(product.sellingPrice)}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            );
          }
        )}
      </div>

      <Dialog
        open={!!selectedProduct}
        onOpenChange={() => setSelectedProduct(null)}
      >
        <DialogContent className="max-w-[500px] w-[500px] max-h-[500px] h-[500px] p-0">
          <div className="relative border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Available Colors</h2>
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 hover:text-muted-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {selectedProduct && (
            <div className="overflow-y-auto h-[calc(500px-70px)] p-6">
              <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                {groupedVariations[selectedProduct].colorVariations.map(
                  ({ color, variations }) => (
                    <div key={color} className="flex items-center gap-3">
                      <div className="relative w-5 h-5 rounded-full">
                        <div
                          className={`absolute inset-0 rounded-full ${
                            color === "White" ? "border border-gray-200" : ""
                          }`}
                          style={{
                            backgroundColor: colorMap[color] || "#000000",
                          }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {color}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VariationsGrid;
