import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
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
import PriceRangesSection from "./PriceRangesSection";
import {
  useUpdateStock,
  useProducts,
  useSetProducts,
} from "../../_store/productHooks";

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
  product: initialProduct,
  onProductUpdate,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [selectedColor, setSelectedColor] = useState<string>("all");
  const [editingVariation, setEditingVariation] =
    useState<EditableVariation | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const updateStateRef = useRef(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  const updateStock = useUpdateStock();
  const products = useProducts();

  // Prevent modal from closing during updates
  useEffect(() => {
    if (isUpdating) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "";
      };
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () =>
        window.removeEventListener("beforeunload", handleBeforeUnload);
    }
  }, [isUpdating]);

  // Keep product in sync with store updates
  useEffect(() => {
    if (initialProduct && isOpen) {
      const updatedProduct = products.find(p => p.id === initialProduct.id);
      if (updatedProduct && !updateStateRef.current) {
        setProduct(updatedProduct);
      }
    }
  }, [products, initialProduct, isOpen]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

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
    return result;
  }, [filteredVariations]);

  const handleEditVariation = useCallback((variation: Variation) => {
    setEditingVariation({
      ...variation,
      quantity: variation.quantity.toString(),
    });
  }, []);

  const handleEditingChange = useCallback(
    (newEditingVariation: EditableVariation) => {
      setEditingVariation(newEditingVariation);
    },
    []
  );

  const handleSaveVariation = useCallback(
    async (variation: Variation) => {
      if (!editingVariation || !product) return;

      const updatedQuantity = parseInt(editingVariation.quantity);
      if (isNaN(updatedQuantity)) return;

      setIsUpdating(true);
      updateStateRef.current = true;

      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      try {
        await updateStock(product.id, [
          {
            id: variation.id,
            quantity: updatedQuantity,
          },
        ]);

        const updatedProduct = {
          ...product,
          variations: product.variations.map(v =>
            v.id === variation.id ? { ...v, quantity: updatedQuantity } : v
          ),
        };

        setProduct(updatedProduct);
        onProductUpdate(updatedProduct);
        setEditingVariation(null);
      } catch (error) {
        console.error("Error saving variation:", error);
      } finally {
        updateTimeoutRef.current = setTimeout(() => {
          updateStateRef.current = false;
          setIsUpdating(false);
        }, 100);
      }
    },
    [editingVariation, product, updateStock, onProductUpdate]
  );

  const updateLocalProduct = useCallback(
    (updatedProduct: Product) => {
      updateStateRef.current = true;
      setProduct(updatedProduct);
      onProductUpdate(updatedProduct);
      updateTimeoutRef.current = setTimeout(() => {
        updateStateRef.current = false;
      }, 100);
    },
    [onProductUpdate]
  );

  const handleModalClose = useCallback(() => {
    if (isUpdating || updateStateRef.current) {
      return;
    }
    onClose();
  }, [onClose, isUpdating]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open && (isUpdating || updateStateRef.current)) {
        return;
      }
      if (!open) {
        handleModalClose();
      }
    },
    [handleModalClose, isUpdating]
  );

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="p-0 mx-auto w-[95%] sm:w-[90%] max-w-[1800px] h-[90vh] md:h-[80vh] flex flex-col"
        onPointerDownOutside={e => {
          if (isUpdating || updateStateRef.current) {
            e.preventDefault();
          }
        }}
        onInteractOutside={e => {
          if (isUpdating || updateStateRef.current) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={e => {
          if (isUpdating || updateStateRef.current) {
            e.preventDefault();
          }
        }}
      >
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
                    onImageUpdate={newUrl => {
                      const updatedProduct = {
                        ...product,
                        variations: product.variations.map(v =>
                          v.color === color
                            ? { ...v, variationImageURL: newUrl }
                            : v
                        ),
                      };
                      updateLocalProduct(updatedProduct);
                    }}
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
