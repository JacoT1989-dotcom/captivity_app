import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, X, Loader2 } from "lucide-react";
import { formatZAR, getStockBadgeColor, priceRangeConfigs } from "../../utils";
import { Product, Variation } from "../../types";

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
  onSave: (variation: Variation) => Promise<void>;
  onCancelEdit: () => void;
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
  onEditingChange,
}) => {
  const isEditing = editingVariation?.id === variation.id;
  const [isSaving, setIsSaving] = useState(false);

  const filteredDynamicPricing = useMemo(() => {
    // Get standard ranges first
    const standardRanges = product.dynamicPricing.filter(
      pricing =>
        Number(pricing.from) < 601 &&
        priceRangeConfigs.some(
          config => config.from === pricing.from && config.to === pricing.to
        )
    );

    // Get the 601+ range
    const bulkRange = product.dynamicPricing.find(
      pricing => Number(pricing.from) >= 601
    );

    // Combine and sort
    return [...standardRanges, ...(bulkRange ? [bulkRange] : [])].sort(
      (a, b) => Number(a.from) - Number(b.from)
    );
  }, [product]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(variation);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-2 space-y-2">
      <div className="relative aspect-square rounded-md overflow-hidden bg-gray-50">
        <Image
          src={variation.variationImageURL || "/placeholder.png"}
          alt={`${color} ${size}`}
          fill
          className="object-contain p-2"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
        />
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
                disabled={isSaving}
              />
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={onCancelEdit}
                disabled={isSaving}
              >
                <X className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Save className="h-3 w-3" />
                )}
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
              {filteredDynamicPricing.map(pricing => (
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
              Edit Stock
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default VariationCard;
