import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { isHighlightedProduct } from "./types";
import type { Product, HighlightedProduct, EmptySlot } from "./types";

const MAX_PRODUCTS = 8;
const SLIDES_PER_VIEW = 4;

interface ProductSliderProps {
  products: (Product | HighlightedProduct)[];
  currentSlide: number;
  slidesPerView: number;
  onNext: () => void;
  onPrev: () => void;
  onEdit?: (product: HighlightedProduct) => void;
  onRemove?: (id: string) => Promise<void>;
  onAddNew?: () => void;
}

export function ProductSlider({
  products,
  currentSlide,
  slidesPerView,
  onNext,
  onPrev,
  onEdit,
  onRemove,
  onAddNew,
}: ProductSliderProps) {
  // Calculate empty slots needed
  const emptySlots = Math.max(0, MAX_PRODUCTS - products.length);
  const hasEmptySlots = products.length < MAX_PRODUCTS;

  // Create array of all slots (products + empty)
  const allSlots = React.useMemo(() => {
    const slots: (Product | HighlightedProduct | EmptySlot)[] = [...products];
    for (let i = 0; i < emptySlots; i++) {
      slots.push({
        isEmpty: true,
        id: `empty-${i}`,
      } as EmptySlot);
    }
    return slots;
  }, [products, emptySlots]);

  // Get current visible slots
  const startIdx = currentSlide * SLIDES_PER_VIEW;
  const currentSlots = allSlots.slice(startIdx, startIdx + SLIDES_PER_VIEW);

  // Calculate if we can slide more
  const hasNextSlide = startIdx + SLIDES_PER_VIEW < allSlots.length;

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddNew && hasEmptySlots) {
      onAddNew();
    }
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-4 gap-6">
        {currentSlots.map((item, index) => {
          if ("isEmpty" in item) {
            return (
              <div key={item.id} className="aspect-square">
                {onAddNew && hasEmptySlots && (
                  <Card
                    className="h-full group cursor-pointer overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100 transition-all"
                    onClick={handleAddClick}
                  >
                    <CardContent className="p-0 h-full">
                      <div className="aspect-square relative flex items-center justify-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-gray-400 group-hover:text-gray-600 transition-colors">
                          <Plus className="w-8 h-8" />
                          <span className="text-sm font-medium">
                            Add Product ({products.length}/{MAX_PRODUCTS})
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          }

          const isHighlighted = isHighlightedProduct(item);
          const canEdit = onEdit && isHighlighted;

          return (
            <div key={item.id} className="aspect-square">
              <Card className="h-full group cursor-pointer overflow-visible border-none shadow-none">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {canEdit && (
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onEdit(item as HighlightedProduct);
                          }}
                          className="p-2 bg-white/80 rounded-full hover:bg-white hover:shadow-md transition-all"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {onRemove && (
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onRemove(item.id.toString());
                            }}
                            className="p-2 bg-white/80 rounded-full hover:bg-white hover:shadow-md transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 space-y-2 bg-white relative z-10">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {"salePrice" in item ? (
                        <>
                          <span className="text-sm font-medium text-red-600">
                            R{item.salePrice?.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500 line-through decoration-gray-500">
                            R{item.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-medium text-gray-900">
                          R{item.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < Math.floor(item.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute -left-4 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg hidden md:flex"
        onClick={onPrev}
        disabled={currentSlide === 0}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg hidden md:flex"
        onClick={onNext}
        disabled={!hasNextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Mobile Navigation Dots */}
      <div className="flex justify-center gap-2 mt-4 md:hidden">
        {Array.from({
          length: Math.ceil(allSlots.length / SLIDES_PER_VIEW),
        }).map((_, i) => (
          <button
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === currentSlide ? "bg-gray-800" : "bg-gray-300"
            }`}
            onClick={() => {
              const newSlide = i;
              if (newSlide < currentSlide) {
                onPrev();
              } else if (newSlide > currentSlide) {
                onNext();
              }
            }}
          />
        ))}
      </div>

      {/* Debug info - can be removed in production */}
      <div className="absolute bottom-0 left-0 text-xs text-gray-500">
        Slide {currentSlide + 1}/{Math.ceil(allSlots.length / SLIDES_PER_VIEW)}{" "}
        • Products: {products.length}/{MAX_PRODUCTS} • Empty: {emptySlots}
      </div>
    </div>
  );
}

export default ProductSlider;
