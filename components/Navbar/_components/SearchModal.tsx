import React, { useState, useCallback, useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Link from "next/link";
import Image from "next/image";
import ProductLookupModal from "@/app/(user)/(DropDownCategories)/products/all-collections/ProductLookupModal";
import { useSearchStore } from "../_store/search-store";

interface ProductVariation {
  color: string;
  variations: any[];
}

interface SelectedProduct {
  id: string;
  product: any;
  variations: {
    variations: ProductVariation[];
  };
}

export const SearchButton = () => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedProduct, setSelectedProduct] =
    useState<SelectedProduct | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const store = useSearchStore();

  useEffect(() => {
    store.initializeProducts();
  }, [store]);

  const handleSearch = useCallback(
    (value: string) => {
      setInputValue(value);

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      if (!value.trim()) {
        store.clearSearch();
        return;
      }

      if (value.trim().length >= 2) {
        searchTimeoutRef.current = setTimeout(() => {
          store.searchProducts(value);
        }, 300);
      }
    },
    [store]
  );

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen);
      if (!newOpen) {
        setInputValue("");
        store.clearSearch();
      }
    },
    [store]
  );

  const handleProductSelect = (product: any) => {
    setSelectedProduct({
      id: product.id,
      product: product,
      variations: {
        variations: product.variations.reduce(
          (acc: ProductVariation[], curr: any) => {
            const existingColor = acc.find(v => v.color === curr.color);
            if (existingColor) {
              existingColor.variations.push(curr);
            } else {
              acc.push({
                color: curr.color,
                variations: [curr],
              });
            }
            return acc;
          },
          []
        ),
      },
    });
  };

  const handleProductModalClose = () => {
    setSelectedProduct(null);
    // Removed setOpen(false) to keep search modal open
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-white hover:text-black transition-colors"
        onClick={() => setOpen(true)}
        aria-label="Search products"
      >
        <Search className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Search Products</DialogTitle>
            <DialogDescription>
              Search through our catalog of products
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col w-full gap-4">
            <div className="flex items-center gap-2 border-b pb-4">
              <div className="flex-1">
                <input
                  type="search"
                  value={inputValue}
                  onChange={e => handleSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-3 py-2 bg-transparent outline-none"
                  aria-label="Search products"
                />
              </div>
              {inputValue && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setInputValue("");
                    store.clearSearch();
                  }}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {store.isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : store.filteredProducts.length === 0 &&
                inputValue.trim().length >= 2 ? (
                <div className="text-center py-6 text-gray-500">
                  No products found.
                </div>
              ) : store.filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {store.filteredProducts.map(product => (
                    <div
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className="cursor-pointer"
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleProductSelect(product);
                        }
                      }}
                    >
                      <div className="group rounded-lg border p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex gap-4">
                          {product.featuredImage && (
                            <div className="relative h-20 w-20 flex-shrink-0">
                              <Image
                                src={product.featuredImage.thumbnail}
                                alt={product.productName}
                                fill
                                className="rounded-md object-cover"
                                sizes="80px"
                                priority={false}
                              />
                            </div>
                          )}
                          <div className="flex flex-col min-w-0">
                            <h3 className="font-medium text-sm line-clamp-2">
                              {product.productName}
                            </h3>
                            <div className="mt-auto">
                              <p className="text-sm font-bold">
                                R{product.sellingPrice.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedProduct && (
        <ProductLookupModal
          isOpen={!!selectedProduct}
          onClose={handleProductModalClose}
          productId={selectedProduct.id}
          product={selectedProduct.product}
          productVariations={selectedProduct.variations}
        />
      )}
    </>
  );
};

export default SearchButton;
