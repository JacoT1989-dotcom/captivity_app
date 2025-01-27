import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { isHighlightedProduct } from "./types";
import { useSession } from "@/app/SessionProvider";
import type { Product, HighlightedProduct } from "./types";

const MAX_PRODUCTS = 8;

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
  const maxSlide = Math.max(0, Math.max(products.length, 1) - slidesPerView);
  const session = useSession();
  const isEditor = session?.user?.role === "EDITOR";

  console.log("ProductSlider isEditor:", isEditor); // Debug log
  console.log("ProductSlider onAddNew exists:", !!onAddNew); // Debug log

  // Calculate empty slots
  const emptySlots = Math.max(0, MAX_PRODUCTS - products.length);
  const emptySlotArray = Array.from({ length: emptySlots }).map((_, index) => ({
    isEmpty: true,
    id: `empty-${index}`,
  }));

  const allSlots = [...products, ...emptySlotArray];

  const handleAddClick = (e: React.MouseEvent) => {
    console.log("Add button clicked"); // Debug log
    e.preventDefault();
    e.stopPropagation();
    if (onAddNew) {
      console.log("Calling onAddNew"); // Debug log
      onAddNew();
    }
  };

  return (
    <div className="relative">
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)`,
          }}
        >
          {allSlots.map((item, index) => {
            if ("isEmpty" in item) {
              return isEditor ? (
                <div key={item.id} className="w-1/4 flex-shrink-0 px-3">
                  <Card
                    className="group cursor-pointer overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100 transition-all h-full"
                    onClick={handleAddClick}
                  >
                    <CardContent className="p-0">
                      <div className="aspect-square relative flex items-center justify-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <Plus className="w-8 h-8" />
                          <span className="text-sm font-medium">
                            Add Product
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div key={item.id} className="w-1/4 flex-shrink-0 px-3" />
              );
            }

            const isHighlighted = isHighlightedProduct(item);
            const canEdit = isEditor && isHighlighted;

            return (
              <div key={item.id} className="w-1/4 flex-shrink-0 px-3">
                <Card className="group cursor-pointer overflow-hidden border-none shadow-none">
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes=""
                      />
                      {canEdit && (
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {onEdit && (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                onEdit(item as HighlightedProduct);
                              }}
                              className="p-2 bg-white/80 rounded-full hover:bg-white hover:shadow-md transition-all"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          )}
                          {onRemove && (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                onRemove(item.id);
                              }}
                              className="p-2 bg-white/80 rounded-full hover:bg-white hover:shadow-md transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 space-y-1">
                      <h3 className="text-sm font-medium">{item.title}</h3>
                      <div className="flex items-center gap-2">
                        {"salePrice" in item ? (
                          <>
                            <span className="text-sm font-medium text-red-600">
                              R{item.salePrice}
                            </span>
                            <span className="text-sm text-gray-500 line-through decoration-gray-500">
                              R{item.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-medium">
                            R{item.price}
                          </span>
                        )}
                      </div>
                      <div className="flex">
                        {Array.from({
                          length: Math.floor(item.rating || 0),
                        }).map((_, i) => (
                          <span key={i} className="text-yellow-400">
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
        disabled={currentSlide === maxSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
}
