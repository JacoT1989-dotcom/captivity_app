import React, { useCallback, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit2, Save, X } from "lucide-react";
import type { Product, DynamicPricing } from "../../types";
import { formatZAR, priceRangeConfigs } from "./utils";
import { useUpdateDynamicPricing } from "../../_store/productHooks";

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
  const updateDynamicPricing = useUpdateDynamicPricing();

  const priceRanges = useMemo<PriceRange[] | null>(() => {
    if (!product) return null;
    return product.dynamicPricing
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
      }))
      .sort((a, b) => parseInt(a.quantity.from) - parseInt(b.quantity.from));
  }, [product]);

  const handleEditPriceRanges = useCallback(() => {
    if (!priceRanges) return;
    setEditablePriceRanges(
      priceRanges.map(range => ({
        ...range,
        editedPrice: range.price.toString(),
      }))
    );
    setEditingPriceRanges(true);
  }, [priceRanges]);

  const handlePriceRangeChange = useCallback((id: string, value: string) => {
    setEditablePriceRanges(prev =>
      prev.map(range =>
        range.id === id ? { ...range, editedPrice: value } : range
      )
    );
  }, []);

  const handleSavePriceRanges = useCallback(async () => {
    if (!product || !editablePriceRanges.length) return;

    const updatedPricing = editablePriceRanges.map(range => ({
      id: range.id,
      from: range.quantity.from,
      to: range.quantity.to,
      amount: parseFloat(range.editedPrice),
    }));

    try {
      setEditingPriceRanges(false);
      const updatedProduct = {
        ...product,
        dynamicPricing: updatedPricing.map(p => ({
          ...p,
          type: "dynamic",
          productId: product.id,
          amount: p.amount.toString(),
        })) as DynamicPricing[],
      } as Product;

      updateLocalProduct(updatedProduct);
      await updateDynamicPricing(product.id, updatedPricing);
    } catch (error) {
      console.error("Failed to update pricing:", error);
      setEditingPriceRanges(true);
    }
  }, [product, editablePriceRanges, updateDynamicPricing, updateLocalProduct]);

  if (!priceRanges) return null;

  return (
    <div className="flex flex-col gap-1 mt-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-700">Price Ranges:</div>
        {!editingPriceRanges && (
          <Button variant="ghost" size="sm" onClick={handleEditPriceRanges}>
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
                />
              </div>
            </div>
          ))}
          <div className="flex justify-end gap-2 mt-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditingPriceRanges(false)}
            >
              <X className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="default" onClick={handleSavePriceRanges}>
              <Save className="h-3 w-3" />
            </Button>
          </div>
        </>
      ) : (
        priceRanges.map((range, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-gray-600">{range.range}</span>
            <span className="font-medium text-gray-900">
              {formatZAR(range.price)}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default PriceRangesSection;
