import React, { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useEffectivePrice } from "./_store/apparel-store";

interface ColorVariation {
  color: string;
  variations: {
    id: string;
    name: string;
    color: string;
    size: string;
    sku: string;
    sku2: string;
    variationImageURL: string;
    quantity: number;
    productId: string;
  }[];
}

interface ProductVariations {
  [productId: string]: {
    variations: ColorVariation[];
    product?: {
      id: string;
      productName: string;
      sellingPrice: number;
      dynamicPricing: {
        from: string;
        to: string;
        type: string;
        amount: string;
      }[];
    };
  };
}

interface ColorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct: string | null;
  groupedVariations: ProductVariations;
}

const ColorDialog: React.FC<ColorDialogProps> = ({
  isOpen,
  onClose,
  selectedProduct,
  groupedVariations,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  if (!selectedProduct || !groupedVariations[selectedProduct]) {
    return null;
  }

  const productData = groupedVariations[selectedProduct];
  const allColors = productData.variations.map(v => v.color);
  const allSizes = Array.from(
    new Set(
      productData.variations.flatMap(colorVar =>
        colorVar.variations.map(v => v.size)
      )
    )
  ).sort();

  // Get variations for selected color
  const selectedColorVariations =
    productData.variations.find(v => v.color === selectedColor)?.variations ||
    [];

  // Find stock levels for selected combination
  const selectedVariation = selectedColorVariations.find(
    v => v.size === selectedSize
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(price);
  };

  const handleQuantityChange = (increment: boolean) => {
    if (increment) {
      setQuantity(prev => prev + 1);
    } else {
      setQuantity(prev => Math.max(1, prev - 1));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl p-0 gap-0">
        <DialogHeader className="p-6 flex-row justify-between items-center">
          <DialogTitle className="text-2xl">
            {productData.product?.productName || "Product Details"}
          </DialogTitle>
          <Button variant="ghost" className="h-auto p-2" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 pt-0">
          {/* Left Column - Image */}
          <div className="aspect-square relative rounded-lg overflow-hidden">
            {selectedVariation ? (
              <Image
                src={selectedVariation.variationImageURL}
                alt={selectedVariation.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                Select a color and size
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Dynamic Pricing Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-2 bg-muted p-4">
                <div className="font-medium">Quantity</div>
                <div className="font-medium">Price</div>
              </div>
              <div className="divide-y">
                {[
                  { range: "1 - 24", price: 59.95 },
                  { range: "25 - 100", price: 58.95 },
                  { range: "101 - 600", price: 57.95 },
                  { range: "601 - 20000", price: 56.95 },
                ].map(tier => (
                  <div
                    key={tier.range}
                    className="grid grid-cols-2 p-4 hover:bg-muted/50"
                  >
                    <div>{tier.range}</div>
                    <div>{formatPrice(tier.price)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Colour:</label>
              <div className="flex gap-2">
                {allColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border"
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Size:</label>
              <div className="flex flex-wrap gap-2">
                {allSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-md border transition-all ${
                      selectedSize === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Stock */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  className="px-3"
                  onClick={() => handleQuantityChange(false)}
                >
                  -
                </Button>
                <input
                  type="number"
                  value={quantity}
                  onChange={e =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-16 text-center border-0 focus:ring-0"
                />
                <Button
                  variant="ghost"
                  className="px-3"
                  onClick={() => handleQuantityChange(true)}
                >
                  +
                </Button>
              </div>
              {selectedVariation && (
                <div className="text-sm text-muted-foreground">
                  {selectedVariation.quantity} in stock
                </div>
              )}
            </div>

            {/* Add to Basket Button */}
            <Button className="w-full" size="lg">
              ADD TO BASKET
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ColorDialog;
