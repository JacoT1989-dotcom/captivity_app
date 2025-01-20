import React, { useState } from "react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductSearchFieldProps, SearchProduct } from "../types";
import { searchProducts } from "../actions";

const ProductSearchField: React.FC<ProductSearchFieldProps> = ({
  control,
  onProductSelect,
}) => {
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (search: string) => {
    if (search.length < 3) return;

    setLoading(true);
    try {
      const result = await searchProducts(search);
      if (result.success && result.data) {
        setSearchResults(result.data);
      }
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsSearchMode(!isSearchMode)}
        >
          {isSearchMode ? "Enter Manually" : "Search Existing"}
        </Button>
      </div>

      {isSearchMode ? (
        <FormField
          control={control}
          name="productName"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Search Product</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="justify-between w-full"
                    >
                      {field.value || "Search products..."}
                      <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search products..."
                      onValueChange={handleSearch}
                    />
                    <CommandEmpty>
                      {loading ? "Searching..." : "No products found."}
                    </CommandEmpty>
                    <CommandGroup>
                      {searchResults.map(product => (
                        <CommandItem
                          key={product.id}
                          value={product.productName}
                          onSelect={() => {
                            field.onChange(product.productName);
                            onProductSelect(product);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === product.productName
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {product.productName}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <FormField
          control={control}
          name="productName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default ProductSearchField;
