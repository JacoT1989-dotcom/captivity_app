import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Product } from "./_store/types";
import PricingRanges from "./PricingRanges";
import ProductSelectionControls from "./ProductSelectionControls";

interface ProductVariation {
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
  variations: ProductVariation[];
}

interface ProductVariations {
  variations: ColorVariation[];
}

interface ProductLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
  product: Product | undefined;
  productVariations: ProductVariations | undefined;
}

const ProductLookupModal: React.FC<ProductLookupModalProps> = ({
  isOpen,
  onClose,
  productId,
  product,
  productVariations,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [currentVariation, setCurrentVariation] =
    useState<ProductVariation | null>(null);

  useEffect(() => {
    if (isOpen && productId && productVariations) {
      const firstColorWithStock = productVariations.variations.find(colorVar =>
        colorVar.variations.some(v => v.quantity > 0)
      );

      if (firstColorWithStock) {
        setSelectedColor(firstColorWithStock.color);
        const firstSizeWithStock = firstColorWithStock.variations.find(
          v => v.quantity > 0
        );
        if (firstSizeWithStock) {
          setSelectedSize(firstSizeWithStock.size);
          setCurrentVariation(firstSizeWithStock);
        }
      } else {
        setSelectedColor(productVariations.variations[0]?.color || "");
        setSelectedSize(
          productVariations.variations[0]?.variations[0]?.size || ""
        );
        setCurrentVariation(
          productVariations.variations[0]?.variations[0] || null
        );
      }
      setQuantity(1);
    }
  }, [isOpen, productId, productVariations]);

  useEffect(() => {
    if (selectedColor && selectedSize && productVariations) {
      const colorVariation = productVariations.variations.find(
        v => v.color === selectedColor
      );
      const variation = colorVariation?.variations.find(
        v => v.size === selectedSize
      );
      setCurrentVariation(variation || null);

      if (variation && variation.quantity < quantity) {
        setQuantity(Math.max(1, variation.quantity));
      }
    }
  }, [selectedColor, selectedSize, productVariations, quantity]);

  if (!productId || !product || !productVariations) return null;

  const getCurrentImage = () => {
    if (currentVariation?.variationImageURL) {
      return currentVariation.variationImageURL;
    }
    return product.featuredImage?.large || "";
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="p-0 mx-auto w-[95%] sm:w-[70%] max-w-7xl max-h-[70vh] md:h-auto overflow-auto">
        <DialogTitle className="sr-only">
          {product.productName} - Product Details
        </DialogTitle>
        <DialogDescription className="sr-only">
          Select color, size, and quantity for {product.productName}
        </DialogDescription>

        <div className="flex items-center justify-between p-3 border-b rounded-md bg-white sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-red-600">
            {product.productName}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto md:overflow-hidden h-[calc(100%-3.5rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-4">
            <div className="lg:col-span-2">
              <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-50 border">
                <Image
                  src={getCurrentImage()}
                  alt={product.productName}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <ProductSelectionControls
                productVariations={productVariations}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                quantity={quantity}
                setQuantity={setQuantity}
                currentVariation={currentVariation}
              />

              <Button
                className="w-full py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 
                          transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!currentVariation || currentVariation.quantity === 0}
                asChild
              >
                <Link href={"/login"}>Login</Link>
              </Button>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border p-3">
                <PricingRanges
                  dynamicPricing={product.dynamicPricing}
                  sellingPrice={product.sellingPrice}
                  productId={product.id}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductLookupModal;
