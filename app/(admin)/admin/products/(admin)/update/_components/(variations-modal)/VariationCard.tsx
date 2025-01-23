// VariationCard.tsx
import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageOff, Edit2, Save, X } from "lucide-react";
import { getStockBadgeColor } from "../../utils";
import { formatZAR } from "./utils";
import { Variation, Product } from "./types";

interface EditableVariation extends Omit<Variation, "quantity"> {
  quantity: string;
}

interface VariationCardProps {
  variation: Variation;
  color: string;
  size: string;
  product: Product;
  editingVariation: EditableVariation | null;
  onEdit: (variation: Variation) => void;
  onSave: (variation: Variation) => void;
  onCancelEdit: () => void;
  onUpdateImage: (variationId: string, file: File) => Promise<void>;
  onEditingChange: (editingVariation: EditableVariation) => void;
}

export const VariationCard: React.FC<VariationCardProps> = ({
  variation,
  color,
  size,
  product,
  editingVariation,
  onEdit,
  onSave,
  onCancelEdit,
  onUpdateImage,
  onEditingChange,
}) => {
  const isEditing = editingVariation?.id === variation.id;

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await onUpdateImage(variation.id, file);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-2 space-y-2">
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
            <span className="text-xs text-gray-500 mt-1">No image</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id={`image-upload-${variation.id}`}
          onChange={handleImageUpload}
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute bottom-1 right-1 bg-white/80 hover:bg-white"
          onClick={() =>
            document.getElementById(`image-upload-${variation.id}`)?.click()
          }
        >
          <Edit2 className="h-3 w-3" />
        </Button>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="font-medium">Size:</span>
          <span>{size}</span>
        </div>

        {isEditing && editingVariation ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium">Stock:</span>
              <Input
                type="number"
                className="h-6 text-xs"
                value={editingVariation.quantity}
                onChange={e =>
                  onEditingChange({
                    ...editingVariation,
                    quantity: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <Button size="sm" variant="ghost" onClick={onCancelEdit}>
                <X className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={() => onSave(variation)}
              >
                <Save className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium">SKU:</span>
              <span className="line-clamp-1 hover:line-clamp-none">
                {variation.sku}
              </span>
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

            <div className="space-y-1">
              <div className="text-xs font-medium">Dynamic Pricing:</div>
              {product.dynamicPricing.map(pricing => (
                <div
                  key={pricing.id}
                  className="flex justify-between items-center text-xs"
                >
                  <span>
                    {pricing.from}-{pricing.to}:
                  </span>
                  <span>{formatZAR(parseFloat(pricing.amount))}</span>
                </div>
              ))}
            </div>

            <Button
              size="sm"
              variant="outline"
              className="w-full mt-2"
              onClick={() => onEdit(variation)}
            >
              <Edit2 className="h-3 w-3 mr-1" />
              Edit Stock
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default VariationCard;
