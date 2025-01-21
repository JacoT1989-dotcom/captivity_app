import React from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getStockStatus } from "../utils";

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
  if (!product) return null;

  const getStockBadgeColor = (quantity: number) => {
    const status = getStockStatus(quantity);
    switch (status) {
      case "out-of-stock":
        return "bg-red-100 text-red-800";
      case "low-stock":
        return "bg-yellow-100 text-yellow-800";
      case "in-stock":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Group variations by color
  const groupedVariations = product.variations.reduce(
    (acc, variation) => {
      if (!acc[variation.color]) {
        acc[variation.color] = [];
      }
      acc[variation.color].push(variation);
      return acc;
    },
    {} as Record<string, Variation[]>
  );

  return (
    <Dialog open={isOpen}>
      <DialogContent className="p-0 mx-auto w-[95%] sm:w-[90%] max-w-7xl h-[90vh] md:h-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b rounded-t-md bg-white sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-gray-900">
            {product.productName} - Variations
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* Main Content */}
        <div className="overflow-y-auto p-4 max-h-[calc(100vh-10rem)]">
          {/* Group by Color */}
          {Object.entries(groupedVariations).map(([color, variations]) => (
            <div key={color} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-medium">Color: {color}</h3>
                <div
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: color.toLowerCase() }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {variations.map(variation => (
                  <div
                    key={variation.id}
                    className="bg-white rounded-lg border p-4 space-y-4"
                  >
                    {/* Variation Image */}
                    <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-50">
                      {variation.variationImageURL && (
                        <Image
                          src={variation.variationImageURL}
                          alt={`${variation.color} ${variation.size}`}
                          fill
                          className="object-contain p-2"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      )}
                    </div>

                    {/* Variation Details */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Size:</span>
                        <span className="text-sm">{variation.size}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">SKU:</span>
                        <span className="text-sm">{variation.sku}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">SKU2:</span>
                        <span className="text-sm">{variation.sku2}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Stock:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStockBadgeColor(variation.quantity)}`}
                        >
                          {variation.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VariationsModal;
