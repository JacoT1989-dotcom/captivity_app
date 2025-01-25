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
import ColorImageUploader from "./ColorImageUploader";
import { Product, Variation, VariationsModalProps } from "../../types";
import { VariationCard } from "./VariationCard";
import {
  useUpdateStock,
  useProducts,
  useSetProducts,
  useFetchProduct,
} from "../../_store/productHooks";
import PriceRangesSection from "./PriceRangesSection";

interface EditableVariation extends Omit<Variation, "quantity"> {
  quantity: string;
}

interface ColorGroup {
  sizes: {
    [size: string]: Variation[];
  };
  masterImage?: string;
}

interface GroupedVariations {
  [color: string]: ColorGroup;
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
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const updateStock = useUpdateStock();
  const products = useProducts();
  const setProducts = useSetProducts();
  const fetchProduct = useFetchProduct();

  const addDebugLog = useCallback((message: string) => {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp}: ${message}`;
    console.log(`[VariationsModal Debug] ${message}`);
    setDebugLog(prev => [...prev, logMessage]);
  }, []);

  useEffect(() => {
    if (isOpen && product) {
      addDebugLog(
        `Modal opened for product: ${product.productName} (ID: ${product.id})`
      );
      addDebugLog(`Total variations: ${product.variations.length}`);
    }
  }, [isOpen, product, addDebugLog]);

  const uniqueColors = useMemo<string[]>(() => {
    if (!product?.variations) {
      addDebugLog("No variations found in product");
      return [];
    }
    const colors = Array.from(
      new Set(product.variations.map(v => v.color))
    ).sort();
    addDebugLog(`Found unique colors: ${colors.join(", ")}`);
    return colors;
  }, [product?.variations, addDebugLog]);

  const uniqueSizes = useMemo<string[]>(() => {
    if (!product?.variations) {
      addDebugLog("No variations found for sizes");
      return [];
    }
    const sizes = Array.from(
      new Set(product.variations.map(v => v.size))
    ).sort();
    addDebugLog(`Found unique sizes: ${sizes.join(", ")}`);
    return sizes;
  }, [product?.variations, addDebugLog]);

  const filteredVariations = useMemo<Variation[]>(() => {
    if (!product?.variations) return [];

    const filtered = product.variations.filter(variation => {
      const matchesSize =
        selectedSize === "all" || variation.size === selectedSize;
      const matchesColor =
        selectedColor === "all" || variation.color === selectedColor;
      return matchesSize && matchesColor;
    });

    addDebugLog(`Filtered variations: ${filtered.length} matches found`);
    return filtered;
  }, [product?.variations, selectedSize, selectedColor, addDebugLog]);

  const groupedVariations = useMemo<GroupedVariations>(() => {
    const result: GroupedVariations = {};
    filteredVariations.forEach(variation => {
      if (!result[variation.color]) {
        result[variation.color] = {
          sizes: {},
          masterImage: variation.variationImageURL,
        };
      }
      if (!result[variation.color].sizes[variation.size]) {
        result[variation.color].sizes[variation.size] = [];
      }
      result[variation.color].sizes[variation.size].push(variation);
    });

    addDebugLog(
      `Grouped variations by color: ${Object.keys(result).length} color groups`
    );
    return result;
  }, [filteredVariations, addDebugLog]);

  const updateLocalProduct = useCallback(
    (updatedProduct: Product) => {
      const newProducts = products.map(p =>
        p.id === updatedProduct.id ? updatedProduct : p
      );
      setProducts(newProducts);
      addDebugLog("Local product state updated");
    },
    [products, setProducts, addDebugLog]
  );

  const handleSaveVariation = useCallback(
    async (variation: Variation) => {
      if (!editingVariation || !product) {
        addDebugLog("Error: Missing editing variation or product data");
        return;
      }

      const updatedQuantity = parseInt(editingVariation.quantity);
      if (isNaN(updatedQuantity)) {
        addDebugLog("Error: Invalid quantity value");
        return;
      }

      try {
        addDebugLog(
          `Saving variation ${variation.id} with quantity: ${updatedQuantity}`
        );
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

        addDebugLog("Variation stock updated successfully");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        addDebugLog(`Error updating stock: ${errorMessage}`);
        console.error("Stock update error:", error);
        setEditingVariation(editingVariation);
      }
    },
    [editingVariation, product, updateStock, updateLocalProduct, addDebugLog]
  );

  const handleEditVariation = useCallback(
    (variation: Variation) => {
      if (!product) {
        addDebugLog("Error: No product available for editing");
        return;
      }
      addDebugLog(`Starting edit for variation: ${variation.id}`);
      setEditingVariation({
        ...variation,
        quantity: variation.quantity.toString(),
      });
    },
    [product, addDebugLog]
  );

  const handleEditingChange = useCallback(
    (updatedVariation: EditableVariation) => {
      addDebugLog(`Updating editing variation ${updatedVariation.id}`);
      setEditingVariation(updatedVariation);
    },
    [addDebugLog]
  );

  useEffect(() => {
    if (!isOpen) {
      addDebugLog("Modal closing, resetting states");
      setSelectedSize("all");
      setSelectedColor("all");
      setEditingVariation(null);
      setDebugLog([]);
    }
  }, [isOpen, addDebugLog]);

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
            {Object.entries(groupedVariations).map(([color, colorGroup]) => (
              <div key={color} className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-medium">{color}</h3>
                    <div
                      className="w-5 h-5 rounded border"
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                  </div>

                  <ColorImageUploader
                    color={color}
                    masterImage={colorGroup.masterImage}
                    product={product}
                    onUpdateComplete={() => fetchProduct(product.id)}
                    addDebugLog={addDebugLog}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
                  {Object.entries(colorGroup.sizes).map(
                    ([size, variations]) => {
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
                          onEditingChange={handleEditingChange}
                        />
                      );
                    }
                  )}
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
