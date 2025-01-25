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
import { Edit2, ImageOff, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import {
  Product,
  Variation,
  VariationsModalProps,
  UpdateStockResult,
} from "../../types";
import { VariationCard } from "./VariationCard";
import {
  useUpdateStock,
  useUpdateVariationImage,
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
  const [processingImage, setProcessingImage] = useState<string | null>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [showDebugLog, setShowDebugLog] = useState(false);

  const updateStock = useUpdateStock();
  const updateVariationImage = useUpdateVariationImage();
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

  const handleColorImageUpload = async (color: string, file: File) => {
    if (!product) {
      addDebugLog("Error: No product available for image upload");
      return;
    }

    addDebugLog(`Starting image upload for color: ${color}`);
    addDebugLog(
      `File details - Name: ${file.name}, Size: ${file.size}B, Type: ${file.type}`
    );

    setProcessingImage(color);

    try {
      const colorVariations = product.variations.filter(v => v.color === color);
      addDebugLog(
        `Found ${colorVariations.length} variations for color ${color}`
      );

      if (colorVariations.length === 0) {
        throw new Error(`No variations found for color ${color}`);
      }

      // Update first variation
      addDebugLog(
        `Updating image for first variation (ID: ${colorVariations[0].id})`
      );
      await updateVariationImage(product.id, colorVariations[0].id, file);

      // Update remaining variations
      for (const variation of colorVariations.slice(1)) {
        addDebugLog(
          `Updating image for additional variation (ID: ${variation.id})`
        );
        await updateVariationImage(product.id, variation.id, file);
      }

      addDebugLog(
        "All variations updated successfully, fetching updated product data"
      );
      await fetchProduct(product.id);
      addDebugLog("Product data refreshed successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      addDebugLog(`Error updating color group images: ${errorMessage}`);
      console.error("Image upload error:", error);
    } finally {
      setProcessingImage(null);
    }
  };

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

                  <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden border">
                    {colorGroup.masterImage ? (
                      <Image
                        src={colorGroup.masterImage}
                        alt={`${color} master image`}
                        fill
                        className="object-contain p-2"
                        sizes="96px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <ImageOff className="h-6 w-6 text-gray-400" />
                        <span className="text-xs text-gray-500 mt-1">
                          No image
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id={`color-image-${color}`}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleColorImageUpload(color, file);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute bottom-1 right-1 bg-white/80 hover:bg-white"
                      onClick={() =>
                        document.getElementById(`color-image-${color}`)?.click()
                      }
                      disabled={processingImage === color}
                    >
                      <Edit2 className="h-3 w-3" />
                      {processingImage === color && (
                        <span className="absolute inset-0 flex items-center justify-center bg-white/80">
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
                        </span>
                      )}
                    </Button>
                  </div>
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
