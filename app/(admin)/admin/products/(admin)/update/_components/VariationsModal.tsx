import React, { useEffect, useState } from "react";
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
import { getStockBadgeColor } from "../utils";

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
  variations: Variation[];
}

interface VariationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const VariationsModal: React.FC<VariationsModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [selectedColor, setSelectedColor] = useState<string>("all");

  useEffect(() => {
    if (!isOpen) {
      setSelectedSize("all");
      setSelectedColor("all");
    }
  }, [isOpen]);

  if (!product) return null;

  // Get unique colors and sizes
  const uniqueColors = Array.from(
    new Set(product.variations.map(v => v.color))
  ).sort();
  const uniqueSizes = Array.from(
    new Set(product.variations.map(v => v.size))
  ).sort();

  // Filter variations based on selected filters
  const filteredVariations = product.variations.filter(variation => {
    const matchesSize =
      selectedSize === "all" || variation.size === selectedSize;
    const matchesColor =
      selectedColor === "all" || variation.color === selectedColor;
    return matchesSize && matchesColor;
  });

  // Group filtered variations by color
  const groupedByColor = filteredVariations.reduce(
    (colorAcc, variation) => {
      if (!colorAcc[variation.color]) {
        colorAcc[variation.color] = {};
      }
      if (!colorAcc[variation.color][variation.size]) {
        colorAcc[variation.color][variation.size] = [];
      }
      colorAcc[variation.color][variation.size].push(variation);
      return colorAcc;
    },
    {} as Record<string, Record<string, Variation[]>>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 mx-auto w-[95%] sm:w-[90%] max-w-[1800px] h-[90vh] md:h-[80vh] flex flex-col">
        <DialogHeader className="px-4 py-3 border-b sticky top-0 bg-white z-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                {product.productName} - Variations
              </DialogTitle>
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
            {Object.entries(groupedByColor).map(([color, sizeGroups]) => (
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
