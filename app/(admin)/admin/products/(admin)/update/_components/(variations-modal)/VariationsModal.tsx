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
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import type { Product, Variation, VariationsModalProps } from "../../types";
import { VariationCard } from "./VariationCard";
import {
  useUpdateStock,
  useUpdateVariationImage,
  useProducts,
  useSetProducts,
} from "../../_store/productHooks";
import PriceRangesSection from "./PriceRangesSection";

interface EditableVariation extends Omit<Variation, "quantity"> {
  quantity: string;
}

interface GroupedVariations {
  [color: string]: {
    [size: string]: Variation[];
  };
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

  const updateStock = useUpdateStock();
  const updateVariationImage = useUpdateVariationImage();
  const products = useProducts();
  const setProducts = useSetProducts();

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
                <PriceRangesSection
                  product={product}
                  updateLocalProduct={updateLocalProduct}
                />
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
