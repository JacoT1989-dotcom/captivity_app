import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ProductLookup {
  [key: string]: {
    id: string;
    productName: string;
    sellingPrice: number;
  };
}

interface VariationsGridProps {
  variations: Array<{
    id: string;
    name: string;
    color: string;
    size: string;
    sku: string;
    sku2: string;
    variationImageURL: string;
    quantity: number;
    productId: string;
  }>;
  products: ProductLookup;
}

const VariationsGrid = ({ variations, products }: VariationsGridProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(price);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {variations.map(variation => {
        const product = products[variation.productId];

        return (
          <Link
            key={variation.id}
            href={`/products/${variation.productId}`}
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

              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded">
                    {variation.color}
                  </span>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded">
                    Size: {variation.size}
                  </span>
                </div>
              </div>

              {product && (
                <p className="mt-3 text-lg font-bold text-foreground">
                  {formatPrice(product.sellingPrice)}
                </p>
              )}
            </div>
          </Link>
        );
      })}

      {variations.length === 0 && (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          No variations found with selected filters
        </div>
      )}
    </div>
  );
};

export default VariationsGrid;
