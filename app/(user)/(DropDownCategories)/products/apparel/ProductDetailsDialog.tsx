import React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

interface Product {
  id: string;
  productName: string;
  sellingPrice: number;
  featuredImage: { large: string } | null;
  variations: Variation[];
}

interface ProductDetailsDialogProps {
  product: Product | null;
  onClose: () => void;
}

const ProductDetailsDialog = ({
  product,
  onClose,
}: ProductDetailsDialogProps) => {
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

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        {product && (
          <>
            <DialogHeader>
              <DialogTitle>{product.productName}</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-square relative rounded-lg overflow-hidden">
                {product.featuredImage ? (
                  <Image
                    src={product.featuredImage.large}
                    alt={product.productName}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                    <span className="text-6xl font-bold text-muted-foreground/50">
                      {product.productName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <p className="text-2xl font-bold">
                  {formatPrice(product.sellingPrice)}
                </p>

                <div className="space-y-2">
                  <h4 className="font-semibold">Available Colors:</h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(
                      new Set(product.variations.map(v => v.color))
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
                      getTotalStock(product.variations) > 0
                        ? "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-100"
                        : "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-100"
                    }`}
                  >
                    {getTotalStock(product.variations) > 0
                      ? `In Stock (${getTotalStock(product.variations)} units)`
                      : "Out of Stock"}
                  </span>
                </div>

                <Button className="w-full" asChild>
                  <a href={`/products/${product.id}`}>View Full Details</a>
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;
