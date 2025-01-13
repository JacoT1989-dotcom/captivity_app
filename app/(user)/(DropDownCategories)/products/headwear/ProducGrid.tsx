import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ProductDetailsDialog from "./ProductDetailsDialog";
import ProductLookupModal from "./ProductLookupModal";
import { Product as StoreProduct } from "./_store/types";

// Define a simplified Product type for the grid
interface Product {
  id: string;
  productName: string;
  sellingPrice: number;
  featuredImage: { large: string } | null;
  variations: Array<{
    id: string;
    color: string;
    quantity: number;
  }>;
  category: string[];
}

interface ProductGridProps {
  products: StoreProduct[]; // Changed to use the store's Product type
}

const ProductGrid = ({ products }: ProductGridProps) => {
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(
    null
  );
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false);
  const [colorDialogProductId, setColorDialogProductId] = useState<
    string | null
  >(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(price);
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
                      className="w-6 h-6 rounded-md border border-border"
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                {Array.from(new Set(product.variations.map(v => v.color)))
                  .length > 2 && (
                  <Button
                    onClick={e => handleColorDialogOpen(product, e)}
                    variant="default"
                    className="h-6 px-2 text-xs"
                  >
                    +
                    {Array.from(new Set(product.variations.map(v => v.color)))
                      .length - 2}{" "}
                    more
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
