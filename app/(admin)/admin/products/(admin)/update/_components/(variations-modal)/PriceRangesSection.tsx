import React, { useCallback, useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit2, Save, X } from "lucide-react";
import type { Product, DynamicPricing } from "../../types";
import { useUpdateDynamicPricing } from "../../_store/productHooks";
import { formatZAR, priceRangeConfigs } from "../../utils";

interface PriceRange {
  range: string;
  quantity: {
    from: string;
    to: string;
  };
  price: number;
  id: string;
}

interface EditablePriceRange extends PriceRange {
  editedPrice: string;
}

interface PriceRangesSectionProps {
  product: Product;
  updateLocalProduct: (product: Product) => void;
}

export const PriceRangesSection: React.FC<PriceRangesSectionProps> = ({
  product,
  updateLocalProduct,
}) => {
  const [editingPriceRanges, setEditingPriceRanges] = useState(false);
  const [editablePriceRanges, setEditablePriceRanges] = useState<
    EditablePriceRange[]
  >([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const updateDynamicPricing = useUpdateDynamicPricing();

  useEffect(() => {
    if (product?.dynamicPricing) {
      const ranges = product.dynamicPricing
        .filter((pricing: DynamicPricing) =>
          priceRangeConfigs.some(
            config => config.from === pricing.from && config.to === pricing.to
          )
        )
        .map((pricing: DynamicPricing) => ({
          range:
            priceRangeConfigs.find(
              c => c.from === pricing.from && c.to === pricing.to
            )?.label || `${pricing.from}-${pricing.to} items`,
          quantity: { from: pricing.from, to: pricing.to },
          price: parseFloat(pricing.amount),
          id: pricing.id,
          editedPrice: pricing.amount,
        }))
        .sort((a, b) => parseInt(a.quantity.from) - parseInt(b.quantity.from));

      setEditablePriceRanges(ranges);
    }
  }, [product]);

  const handleEditPriceRanges = useCallback(() => {
    setEditingPriceRanges(true);
  }, []);

  const handlePriceRangeChange = useCallback((id: string, value: string) => {
    setEditablePriceRanges(prev =>
      prev.map(range =>
        range.id === id ? { ...range, editedPrice: value } : range
      )
    );
  }, []);

  const handleSavePriceRanges = useCallback(async () => {
    if (!product || !editablePriceRanges.length || isUpdating) return;

    const updatedPricing = editablePriceRanges.map(range => ({
      id: range.id,
      from: range.quantity.from,
      to: range.quantity.to,
      amount: parseFloat(range.editedPrice),
    }));

    try {
      setIsUpdating(true);

      await updateDynamicPricing(product.id, updatedPricing);

      const updatedProduct = {
        ...product,
        dynamicPricing: updatedPricing.map(p => ({
          ...p,
          type: "dynamic",
          productId: product.id,
          amount: p.amount.toString(),
        })),
      };

      updateLocalProduct(updatedProduct);
      setEditingPriceRanges(false);
    } catch (error) {
      console.error("Failed to update pricing:", error);
    } finally {
      setIsUpdating(false);
    }
  }, [
    product,
    editablePriceRanges,
    updateDynamicPricing,
    updateLocalProduct,
    isUpdating,
  ]);

  if (!editablePriceRanges.length) return null;

  return (
    <div className="flex flex-col gap-1 mt-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-700">Price Ranges:</div>
        {!editingPriceRanges && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEditPriceRanges}
            disabled={isUpdating}
          >
            <Edit2 className="h-3 w-3 mr-1" />
            Edit Prices
          </Button>
        )}
      </div>
      {editingPriceRanges ? (
        <>
          {editablePriceRanges.map(range => (
            <div
              key={range.id}
              className="flex items-center justify-between text-sm gap-2"
            >
              <span className="text-gray-600">{range.range}</span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={range.editedPrice}
                  onChange={e =>
                    handlePriceRangeChange(range.id, e.target.value)
                  }
                  className="w-24 h-6 text-xs"
                  disabled={isUpdating}
                />
              </div>
            </div>
          ))}
          <div className="flex justify-end gap-2 mt-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditingPriceRanges(false)}
              disabled={isUpdating}
            >
              <X className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={handleSavePriceRanges}
              disabled={isUpdating}
            >
              <Save className="h-3 w-3" />
              {isUpdating && <span className="ml-2">Saving...</span>}
            </Button>
          </div>
        </>
      ) : (
        editablePriceRanges.map(range => (
          <div
            key={range.id}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-gray-600">{range.range}</span>
            <span className="font-medium text-gray-900">
              {formatZAR(parseFloat(range.editedPrice))}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default PriceRangesSection;
