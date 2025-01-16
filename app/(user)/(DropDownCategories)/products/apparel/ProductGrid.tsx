import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ColorDialog from "./ColorDialog";
import ProductDetailsDialog from "./ProductDetailsDialog";
import { Product, Variation } from "./_store/types";

interface ColorVariation {
  color: string;
  variations: Variation[];
}

interface ProductVariations {
  [productId: string]: {
    variations: ColorVariation[];
    product?: Product;
  };
}

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false);
  const [colorDialogProductId, setColorDialogProductId] = useState<
    string | null
  >(null);

  const groupedVariations = useMemo(() => {
    const grouped: ProductVariations = {};
    products.forEach(product => {
      const colorGroups = product.variations.reduce(
        (acc: { [color: string]: Variation[] }, variation) => {
          if (!acc[variation.color]) {
            acc[variation.color] = [];
          }
          acc[variation.color].push(variation);
          return acc;
        },
        {}
      );

      const colorVariations: ColorVariation[] = Object.entries(colorGroups).map(
        ([color, variations]) => ({
          color,
          variations,
        })
      );

      grouped[product.id] = {
        variations: colorVariations,
        product: product,
      };
    });
    return grouped;
  }, [products]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(price);
  };

  const getTotalStock = (variations: Variation[]) => {
    return variations.reduce(
      (total, variation) => total + variation.quantity,
      0
    );
  };

  const handleColorDialogOpen = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const productData = groupedVariations[productId];
    if (productData && productData.variations.length > 0) {
      setColorDialogProductId(productId);
      setIsColorDialogOpen(true);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-8">
        {products.map(product => (
          <div
            key={product.id}
            className="group relative bg-background rounded-lg hover:shadow-lg transition-shadow shadow-lg border border-border"
          >
            <div className="relative w-full pb-[100%] overflow-hidden rounded-t-lg">
              {product.featuredImage ? (
                <Image
                  src={product.featuredImage.large}
                  alt={product.productName}
                  fill
                  className="absolute inset-0 object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 45vw, (max-width: 768px) 33vw, 25vw"
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

            <div className="p-2 sm:p-4">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-foreground/90 transition-colors line-clamp-1 hover:line-clamp-none text-center">
                {product.productName}
              </h3>
              <p className="mt-2 text-lg font-bold text-foreground text-center">
                {formatPrice(product.sellingPrice)}
              </p>
              <div className="mt-2 flex justify-center items-center gap-2">
                {Array.from(new Set(product.variations.map(v => v.color)))
                  .slice(0, 3)
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
                    onClick={e => handleColorDialogOpen(product.id, e)}
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

        {products.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No products found in this category
          </div>
        )}
      </div>

      <ProductDetailsDialog
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <ColorDialog
        isOpen={isColorDialogOpen}
        onClose={() => {
          setIsColorDialogOpen(false);
          setColorDialogProductId(null);
        }}
        selectedProduct={colorDialogProductId}
        groupedVariations={groupedVariations}
      />
    </>
  );
};

export default ProductGrid;
