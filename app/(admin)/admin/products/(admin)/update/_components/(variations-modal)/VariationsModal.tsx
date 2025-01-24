import React, { useCallback, useEffect, useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit2, Save, X } from "lucide-react";
import type { VariationsModalProps, Variation, PriceRange } from "./types";
import type { Product, DynamicPricing } from "../../types";
import { VariationCard } from "./VariationCard";
import { formatZAR, priceRangeConfigs } from "./utils";
import {
  useUpdateStock,
  useUpdateVariationImage,
  useUpdateDynamicPricing,
  useProducts,
  useSetProducts,
} from "../../_store/productHooks";

interface EditableVariation extends Omit<Variation, "quantity"> {
  quantity: string;
}

interface GroupedVariations {
  [color: string]: {
    [size: string]: Variation[];
  };
}

interface EditablePriceRange extends PriceRange {
  id: string;
  editedPrice: string;
}

const VariationsModal: React.FC<VariationsModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [selectedColor, setSelectedColor] = useState<string>("all");
  const [editingVariation, setEditingVariation] =
    useState<EditableVariation | null>(null);
  const [editingPriceRanges, setEditingPriceRanges] = useState(false);
  const [editablePriceRanges, setEditablePriceRanges] = useState<
    EditablePriceRange[]
  >([]);

  const updateStock = useUpdateStock();
  const updateVariationImage = useUpdateVariationImage();
  const updateDynamicPricing = useUpdateDynamicPricing();
  const products = useProducts();
  const setProducts = useSetProducts();

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

  const uniqueColors = useMemo<string[]>(() => {
    if (!product?.variations) return [];
    return Array.from(new Set(product.variations.map(v => v.color))).sort();
  }, [product?.variations]);

  const uniqueSizes = useMemo<string[]>(() => {
    if (!product?.variations) return [];
    return Array.from(new Set(product.variations.map(v => v.size))).sort();
  }, [product?.variations]);

  const filteredVariations = useMemo<Variation[]>(() => {
    if (!product?.variations) return [];
    return product.variations.filter(variation => {
      const matchesSize =
        selectedSize === "all" || variation.size === selectedSize;
      const matchesColor =
        selectedColor === "all" || variation.color === selectedColor;
      return matchesSize && matchesColor;
    });
  }, [product?.variations, selectedSize, selectedColor]);

  const groupedVariations = useMemo<GroupedVariations>(() => {
    const result: GroupedVariations = {};
    filteredVariations.forEach(variation => {
      if (!result[variation.color]) result[variation.color] = {};
      if (!result[variation.color][variation.size]) {
        result[variation.color][variation.size] = [];
      }
      result[variation.color][variation.size].push(variation);
    });
    return result;
  }, [filteredVariations]);

  const updateLocalProduct = useCallback(
    (updatedProduct: Product) => {
      const newProducts = products.map(p =>
        p.id === updatedProduct.id ? updatedProduct : p
      );
      setProducts(newProducts);
    },
    [products, setProducts]
  );

  const handleEditPriceRanges = useCallback(() => {
    if (!priceRanges) return;
    setEditablePriceRanges(
      priceRanges.map(range => ({
        ...range,
        id: range.id,
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

  const handleImageUpload = useCallback(
    async (variationId: string, file: File) => {
      if (!product) return;
      try {
        await updateVariationImage(product.id, variationId, file);
      } catch (error) {
        console.error("Failed to update image:", error);
      }
    },
    [product, updateVariationImage]
  );

  const handleSaveVariation = useCallback(
    async (variation: Variation) => {
      if (!editingVariation || !product) return;

      const updatedQuantity = parseInt(editingVariation.quantity);
      if (isNaN(updatedQuantity)) return;

      try {
        setEditingVariation(null);
        const updatedVariations = product.variations.map(v =>
          v.id === variation.id ? { ...v, quantity: updatedQuantity } : v
        );
        const updatedProduct = {
          ...product,
          variations: updatedVariations,
        } as Product;

        updateLocalProduct(updatedProduct);
        await updateStock(product.id, [
          {
            id: variation.id,
            quantity: updatedQuantity,
          },
        ]);
      } catch (error) {
        console.error("Failed to update stock:", error);
        setEditingVariation(editingVariation);
      }
    },
    [editingVariation, product, updateStock, updateLocalProduct]
  );

  const handleEditVariation = useCallback(
    (variation: Variation) => {
      if (!product) return;
      setEditingVariation({
        ...variation,
        quantity: variation.quantity.toString(),
      });
    },
    [product]
  );

  const handleEditingChange = useCallback(
    (updatedVariation: EditableVariation) => {
      setEditingVariation(updatedVariation);
    },
    []
  );

  useEffect(() => {
    if (!isOpen) {
      setSelectedSize("all");
      setSelectedColor("all");
      setEditingVariation(null);
      setEditingPriceRanges(false);
    }
  }, [isOpen]);

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 mx-auto w-[95%] sm:w-[90%] max-w-[1800px] h-[90vh] md:h-[80vh] flex flex-col">
        <DialogHeader className="px-4 py-3 border-b sticky top-0 bg-white z-10">
          <div className="space-y-4 flex justify-between">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  {product.productName} - Variations
                </DialogTitle>
                {priceRanges && (
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-700">
                        Price Ranges:
                      </div>
                      {!editingPriceRanges && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleEditPriceRanges}
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
                                  handlePriceRangeChange(
                                    range.id,
                                    e.target.value
                                  )
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
                          <Button
                            size="sm"
                            variant="default"
                            onClick={handleSavePriceRanges}
                          >
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
                )}
              </div>
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
                      <VariationCard
                        key={`${color}-${size}`}
                        variation={variation}
                        color={color}
                        size={size}
                        product={product}
                        editingVariation={editingVariation}
                        onEdit={handleEditVariation}
                        onSave={handleSaveVariation}
                        onCancelEdit={() => setEditingVariation(null)}
                        onUpdateImage={handleImageUpload}
                        onEditingChange={handleEditingChange}
                      />
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
