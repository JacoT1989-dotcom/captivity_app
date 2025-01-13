import React, { useState } from "react";
import Image from "next/image";
import { Product } from "./_store/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProductGridProps {
  products: Array<
    Product & {
      featuredImage: Product["featuredImage"] | null;
    }
  >;
}

const ProductGrid = ({ products }: ProductGridProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(price);
  };

  const getTotalStock = (variations: Product["variations"]) => {
    return variations.reduce(
      (total, variation) => total + variation.quantity,
      0
    );
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map(product => (
          <div
            key={product.id}
            className="group relative bg-background rounded-lg hover:shadow-lg transition-shadow shadow-lg border border-border"
          >
            <div className="aspect-square relative overflow-hidden rounded-t-lg">
              {product.featuredImage ? (
                <Image
                  src={product.featuredImage.large}
                  alt={product.productName}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold text-muted-foreground/50">
                      {product.productName.charAt(0).toUpperCase()}
                    </span>
                    <span className="mt-2 text-xs text-muted-foreground font-medium">
                      {product.category[0]?.replace(/-/g, " ")}
                    </span>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-foreground opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

              {/* Stock badge */}
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

            <div className="p-4">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-foreground/90 transition-colors line-clamp-1 hover:line-clamp-none">
                {product.productName}
              </h3>
              <p className="mt-2 text-lg font-bold text-foreground">
                {formatPrice(product.sellingPrice)}
              </p>
              <div className="mt-2 flex items-center gap-2">
                {Array.from(new Set(product.variations.map(v => v.color)))
                  .slice(0, 2)
                  .map(color => (
                    <div
                      key={color}
                      className="w-6 h-6 rounded-full border border-border"
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                {product.variations.length > 2 && (
                  <Button
                    onClick={() => setSelectedProduct(product)}
                    variant="ghost"
                    className="h-6 px-2 text-xs"
                  >
                    +{product.variations.length - 2} more
                  </Button>
                )}
              </div>
              <Button
                onClick={() => setSelectedProduct(product)}
                className="w-full mt-4"
                variant="secondary"
              >
                View More
              </Button>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No products found in this category
          </div>
        )}
      </div>

      <Dialog
        open={!!selectedProduct}
        onOpenChange={() => setSelectedProduct(null)}
      >
        <DialogContent className="sm:max-w-2xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.productName}</DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  {selectedProduct.featuredImage ? (
                    <Image
                      src={selectedProduct.featuredImage.large}
                      alt={selectedProduct.productName}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                      <span className="text-6xl font-bold text-muted-foreground/50">
                        {selectedProduct.productName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <p className="text-2xl font-bold">
                    {formatPrice(selectedProduct.sellingPrice)}
                  </p>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Available Colors:</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(
                        new Set(selectedProduct.variations.map(v => v.color))
                      ).map(color => (
                        <span
                          key={color}
                          className="px-3 py-1 text-sm font-medium bg-muted text-muted-foreground rounded-full"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Stock Status:</h4>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        getTotalStock(selectedProduct.variations) > 0
                          ? "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-100"
                          : "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-100"
                      }`}
                    >
                      {getTotalStock(selectedProduct.variations) > 0
                        ? `In Stock (${getTotalStock(selectedProduct.variations)} units)`
                        : "Out of Stock"}
                    </span>
                  </div>

                  <Button className="w-full" asChild>
                    <a href={`/products/${selectedProduct.id}`}>
                      View Full Details
                    </a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductGrid;
