// ProductDetailsDialog.tsx
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Product as StoreProduct } from "./_store/types";
import { ColorDisplay } from "./utils";
interface ProductDetailsDialogProps {
  product: StoreProduct | null;
  onClose: () => void;
}

const ProductDetailsDialog = ({
  product,
  onClose,
}: ProductDetailsDialogProps) => {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [currentImage, setCurrentImage] = useState<string>("");

  useEffect(() => {
    if (product) {
      const firstColor = product.variations[0]?.color;
      setSelectedColor(firstColor || "");
    }
  }, [product]);

  useEffect(() => {
    if (product && selectedColor) {
      const variation = product.variations.find(v => v.color === selectedColor);
      if (variation?.variationImageURL) {
        setCurrentImage(variation.variationImageURL);
      } else if (product.featuredImage?.large) {
        setCurrentImage(product.featuredImage.large);
      }
    }
  }, [product, selectedColor]);

  if (!product) return null;

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

  const availableColors = Array.from(
    new Set(product.variations.map(v => v.color))
  );

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product.productName}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image section */}
          <div className="aspect-square relative rounded-lg overflow-hidden">
            {currentImage ? (
              <Image
                src={currentImage}
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
              <h4 className="font-semibold mb-2">Colors:</h4>
              <div className="flex flex-wrap gap-3">
                {availableColors.map(color => (
                  <ColorDisplay
                    key={color}
                    color={color}
                    isSelected={selectedColor === color}
                    onClick={() => setSelectedColor(color)}
                  />
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
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;
