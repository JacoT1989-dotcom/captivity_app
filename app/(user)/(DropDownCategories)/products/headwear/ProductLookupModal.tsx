import React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCategoryStore } from "./_store/headwear-store";

interface ProductLookup {
  id: string;
  productName: string;
  sellingPrice: number;
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
  variations: ColorVariation[];
}

interface ProductLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
  product: ProductLookup | undefined;
  productVariations: ProductVariations | undefined;
}

const ProductLookupModal: React.FC<ProductLookupModalProps> = ({
  isOpen,
  onClose,
  productId,
  product,
  productVariations,
}) => {
  const { getCurrentPricing, getEffectivePrice } = useCategoryStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(price);
  };

  if (!productId || !product || !productVariations) {
    return null;
  }

  const groupedByColor = productVariations.variations.reduce<
    Record<string, Variation[]>
  >((acc, { color, variations }) => {
    acc[color] = variations;
    return acc;
  }, {});

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {product.productName}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={Object.keys(groupedByColor)[0]} className="w-full">
          <TabsList className="flex flex-wrap gap-2 h-auto">
            {Object.keys(groupedByColor).map(color => (
              <TabsTrigger
                key={color}
                value={color}
                className="flex items-center gap-2"
              >
                <div
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: color.toLowerCase() }}
                />
                <span>{color}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(groupedByColor).map(([color, variations]) => (
            <TabsContent key={color} value={color} className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {variations.map(variation => (
                  <div
                    key={variation.id}
                    className="bg-background rounded-lg border border-border p-4"
                  >
                    <div className="aspect-square relative rounded-lg overflow-hidden mb-4">
                      {variation.variationImageURL ? (
                        <Image
                          src={variation.variationImageURL}
                          alt={variation.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted">
                          <span className="text-muted-foreground">
                            No image
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {variation.name}
                        </span>
                        <span className="text-sm font-medium">
                          {variation.size}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          SKU: {variation.sku}
                        </span>
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

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">
                          {formatPrice(product.sellingPrice)}
                        </span>
                        <Button variant="secondary" size="sm">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProductLookupModal;
