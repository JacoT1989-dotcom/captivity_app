import React, { useState, useCallback } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import Image from "next/image";
import { useSearchStore } from "./_store/search-store";
import { PrismaProduct } from "./types";

export const SearchButton = () => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const store = useSearchStore();

  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);

      if (!value) {
        store.clearSearch();
        return;
      }

      store.setSearchParams({ query: value, limit: 5 });

      if (value.length >= 2) {
        store.searchProducts();
      }
    },
    [store]
  );

  const handleClear = useCallback(() => {
    setSearchValue("");
    store.clearSearch();
  }, [store]);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen);
      if (!newOpen) {
        handleClear();
      }
    },
    [handleClear]
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-white hover:text-black transition-colors"
          aria-label="Open search"
        >
          <Search className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px] p-0" align="end">
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              value={searchValue}
              onValueChange={handleSearch}
              placeholder="Search products..."
              className="h-11 border-0 focus:ring-0"
            />
            {searchValue && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="max-h-[400px] overflow-auto p-2">
            {store.isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : store.products.length === 0 && searchValue.length >= 2 ? (
              <CommandEmpty>No products found.</CommandEmpty>
            ) : store.products.length > 0 ? (
              <CommandGroup>
                <div className="grid grid-cols-2 gap-2">
                  {store.products.map((product: PrismaProduct) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      onClick={() => setOpen(false)}
                      className="block"
                    >
                      <div className="group rounded-lg border border-border bg-background p-2 transition-colors hover:bg-accent">
                        <div className="flex space-x-3">
                          {product.featuredImage && (
                            <div className="h-20 w-20 relative flex-shrink-0">
                              <Image
                                src={product.featuredImage.thumbnail}
                                alt={product.productName}
                                fill
                                className="object-cover rounded-md"
                              />
                            </div>
                          )}
                          <div className="flex flex-col flex-1 min-w-0">
                            <h3 className="font-medium text-sm text-foreground truncate">
                              {product.productName}
                            </h3>
                            <p className="text-xs text-muted-foreground truncate">
                              {product.category.join(", ")}
                            </p>
                            <div className="mt-auto">
                              <p className="text-sm font-bold text-foreground">
                                R{product.sellingPrice.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/search?q=${encodeURIComponent(searchValue)}`}
                  onClick={() => setOpen(false)}
                  className="block text-center text-sm text-primary hover:text-primary/80 p-2 border-t mt-2"
                >
                  View all results
                </Link>
              </CommandGroup>
            ) : null}
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
