import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, ImageOff } from "lucide-react";
import { getStockBadgeColor } from "../../utils";

interface DynamicPricing {
  id: string;
  from: string;
  to: string;
  type: string;
  amount: string;
  productId: string;
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

interface Product {
  id: string;
  productName: string;
  sellingPrice: number;
  variations: Variation[];
  dynamicPricing: DynamicPricing[];
}

interface VariationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

interface PriceRange {
  range: string;
  quantity: {
    from: string;
    to: string;
  };
  price: number;
}

interface PriceRangeConfig {
  from: string;
  to: string;
  label: string;
}

const VariationsModal: React.FC<VariationsModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [selectedColor, setSelectedColor] = useState<string>("all");

  const priceRangeConfigs = useMemo<PriceRangeConfig[]>(
    () => [
      { from: "1", to: "24", label: "1-24 items" },
      { from: "25", to: "100", label: "25-100 items" },
      { from: "101", to: "600", label: "101-600 items" },
      { from: "601", to: "20000", label: "601-20000 items" },
    ],
    []
  );

  const formatZAR = (amount: number): string => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const priceRanges = useMemo<PriceRange[] | null>(() => {
    if (!product) return null;

    try {
      const ranges = product.dynamicPricing
        .filter(pricing =>
          priceRangeConfigs.some(
            config => config.from === pricing.from && config.to === pricing.to
          )
        )
        .map(pricing => {
          const config = priceRangeConfigs.find(
            c => c.from === pricing.from && c.to === pricing.to
          );

          return {
            range: config?.label || `${pricing.from}-${pricing.to} items`,
            quantity: {
              from: pricing.from,
              to: pricing.to,
            },
            price: parseFloat(pricing.amount),
          };
        });

      return ranges.sort(
        (a, b) => parseInt(a.quantity.from) - parseInt(b.quantity.from)
      );
    } catch (error) {
      console.error("Error processing price ranges:", error);
      return null;
    }
  }, [product, priceRangeConfigs]);

  const uniqueColors = useMemo(() => {
    if (!product?.variations) return [];
    return Array.from(new Set(product.variations.map(v => v.color))).sort();
  }, [product?.variations]);

  const uniqueSizes = useMemo(() => {
    if (!product?.variations) return [];
    return Array.from(new Set(product.variations.map(v => v.size))).sort();
  }, [product?.variations]);

  const filteredVariations = useMemo(() => {
    if (!product?.variations) return [];
    return product.variations.filter(variation => {
      const matchesSize =
        selectedSize === "all" || variation.size === selectedSize;
      const matchesColor =
        selectedColor === "all" || variation.color === selectedColor;
      return matchesSize && matchesColor;
    });
  }, [product?.variations, selectedSize, selectedColor]);

  const groupedVariations = useMemo(() => {
    const result: Record<string, Record<string, Variation[]>> = {};
    filteredVariations.forEach(variation => {
      if (!result[variation.color]) {
        result[variation.color] = {};
      }
      if (!result[variation.color][variation.size]) {
        result[variation.color][variation.size] = [];
      }
      result[variation.color][variation.size].push(variation);
    });
    return result;
  }, [filteredVariations]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedSize("all");
      setSelectedColor("all");
    }
  }, [isOpen]);

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="p-0 mx-auto w-[95%] sm:w-[90%] max-w-[1800px] h-[90vh] md:h-[80vh] flex flex-col"
        aria-describedby="variation-content"
      >
        <div id="variation-content" className="sr-only">
          Product variations and pricing details for {product.productName}
        </div>

        <DialogHeader className="px-4 py-3 border-b sticky top-0 bg-white z-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  {product.productName} - Variations
                </DialogTitle>
                {priceRanges && (
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="text-sm font-medium text-gray-700">
                      Price Ranges:
                    </div>
                    {priceRanges.map((range, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-600">{range.range}</span>
                        <span className="font-medium text-gray-900">
                          {formatZAR(range.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex gap-4">
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  {uniqueSizes.map(size => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedColor} onValueChange={setSelectedColor}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Colors</SelectItem>
                  {uniqueColors.map(color => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-6">
            {Object.entries(groupedVariations).map(([color, sizeGroups]) => (
              <div key={color} className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-medium flex items-center gap-2">
                    {color}
                    <div
                      className="w-5 h-5 rounded border"
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
                  {Object.entries(sizeGroups).map(([size, variations]) => {
                    const variation = variations[0];
                    return (
                      <div
                        key={`${color}-${size}`}
                        className="bg-white rounded-lg border p-2 space-y-2"
                      >
                        <div className="relative aspect-square rounded-md overflow-hidden bg-gray-50">
                          {variation.variationImageURL ? (
                            <Image
                              src={variation.variationImageURL}
                              alt={`${color} ${size}`}
                              fill
                              className="object-contain p-2"
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                            />
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <ImageOff className="h-6 w-6 text-gray-400" />
                              <span className="text-xs text-gray-500 mt-1">
                                No image
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-medium">Size:</span>
                            <span>{size}</span>
                          </div>

                          <div className="flex justify-between items-center text-xs">
                            <span className="font-medium">SKU:</span>
                            <span>{variation.sku}</span>
                          </div>

                          <div className="flex justify-between items-center text-xs">
                            <span className="font-medium">SKU2:</span>
                            <span>{variation.sku2}</span>
                          </div>

                          <div className="flex justify-between items-center text-xs">
                            <span className="font-medium">Stock:</span>
                            <span
                              className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getStockBadgeColor(
                                variation.quantity
                              )}`}
                            >
                              {variation.quantity}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-xs">
                            <span className="font-medium">Base Price:</span>
                            <span className="font-medium">
                              {formatZAR(product.sellingPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VariationsModal;
