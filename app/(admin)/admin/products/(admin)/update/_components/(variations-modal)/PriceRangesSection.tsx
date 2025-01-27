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
  isStandardRange: boolean;
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
      // Create a set of valid starting points from priceRangeConfigs
      const validStartPoints = new Set(
        priceRangeConfigs.map(config => config.from)
      );

      // Group pricing by their starting points
      const pricingByStart = product.dynamicPricing.reduce(
        (acc, pricing) => {
          if (validStartPoints.has(pricing.from)) {
            acc[pricing.from] = acc[pricing.from] || [];
            acc[pricing.from].push(pricing);
          }
          return acc;
        },
        {} as Record<string, DynamicPricing[]>
      );

      // Filter and transform the pricing data
      const ranges = priceRangeConfigs
        .map(config => {
          const pricings = pricingByStart[config.from] || [];
          if (pricings.length === 0) return null;

          // Try to find an exact match first
          let pricing = pricings.find(p => p.to === config.to);

          // If no exact match is found, look for a custom range
          if (!pricing && config.from === "601") {
            pricing = pricings[0]; // Use the custom range for 601+
          } else if (!pricing) {
            pricing = pricings.find(p => p.to === config.to);
          }

          if (!pricing) return null;

          return {
            range:
              config.from === "601"
                ? `${pricing.from}-${pricing.to} items` // Use actual range for 601+
                : config.label,
            quantity: { from: pricing.from, to: pricing.to },
            price: parseFloat(pricing.amount),
            id: pricing.id,
            editedPrice: pricing.amount,
            isStandardRange: config.to === pricing.to,
          };
        })
        .filter((range): range is EditablePriceRange => range !== null)
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
              <span
                className={`text-gray-600 ${!range.isStandardRange ? "italic" : ""}`}
              >
                {range.range}
              </span>
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
            <span
              className={`text-gray-600 ${!range.isStandardRange ? "italic" : ""}`}
            >
              {range.range}
            </span>
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
