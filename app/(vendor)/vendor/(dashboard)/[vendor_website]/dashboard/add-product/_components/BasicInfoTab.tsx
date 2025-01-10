import React, { useState, useEffect, useMemo } from "react";
import { Control, useWatch, UseFormSetValue } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { VendorProductFormData } from "../types";
import { MultiSelect } from "./MultiSelect";
import debounce from "lodash/debounce";
import { searchProducts } from "../productSearch-actions";

interface BasicInfoTabProps {
  control: Control<VendorProductFormData>;
  setValue: UseFormSetValue<VendorProductFormData>;
}

const PRODUCT_CATEGORIES = [
  "summer-collection",
  "winter-collection",
  "african-collection",
  "baseball-collection",
  "camo-collection",
  "fashion-collection",
  "industrial-collection",
  "kids-collection",
  "leisure-collection",
  "signature-collection",
  "sport-collection",
];

const stripHtmlTags = (html: string): string => {
  if (typeof html !== "string") return "";

  // Remove common HTML tags and their contents
  let text = html.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // Remove remaining HTML tags but keep their contents
  text = text.replace(/<[^>]+>/g, "");

  // Convert common HTML entities
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Remove multiple spaces and trim
  text = text.replace(/\s+/g, " ").trim();

  // Handle bullet points
  text = text.replace(/•/g, "- ");

  return text;
};

const BasicInfoTab = ({ control, setValue }: BasicInfoTabProps) => {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const selectedProduct = useWatch({
    control,
    name: "productName",
  });

  const debouncedSearch = useMemo(
    () =>
      debounce(async (value: string) => {
        if (!value) {
          setProducts([]);
          setLoading(false);
          return;
        }

        setLoading(true);
        try {
          const result = await searchProducts(value);
          if (result.success && result.data) {
            setProducts(result.data);
          } else {
            console.error(result.error);
          }
        } catch (error) {
          console.error("Failed to search products:", error);
        } finally {
          setLoading(false);
        }
      }, 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const onProductSelect = (product: any) => {
    // Map the product fields to vendor product fields
    setValue("productName", product.productName);
    setValue("category", product.category);

    // Clean the description by removing HTML tags
    const cleanDescription = stripHtmlTags(product.description);
    setValue("description", cleanDescription);

    setValue("sellingPrice", product.sellingPrice);
    setValue("isPublished", product.isPublished);

    // Map variations if they exist
    if (product.variations && product.variations.length > 0) {
      const mappedVariations = product.variations.map((variation: any) => ({
        name: variation.name,
        color: variation.color,
        sizes: [
          {
            size: variation.size,
            quantity: variation.quantity,
            sku: variation.sku,
            sku2: variation.sku2 || "",
          },
        ],
        variationImageURL: variation.variationImageURL,
      }));
      setValue("variations", mappedVariations);
    }

    // Map featured image if it exists
    if (product.featuredImage) {
      setValue("featuredImage", {
        file: undefined, // Can't copy the file, but can copy the URLs
        thumbnail: product.featuredImage.thumbnail,
        medium: product.featuredImage.medium,
        large: product.featuredImage.large,
      });
    }

    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="productName"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="text-base">Product Name</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {field.value || "Select a product..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search products..."
                    onValueChange={debouncedSearch}
                    className="h-9"
                  />
                  <CommandEmpty>
                    {loading ? (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="ml-2">Searching...</span>
                      </div>
                    ) : (
                      "No products found."
                    )}
                  </CommandEmpty>
                  <CommandGroup>
                    {products.map((product, index) => (
                      <CommandItem
                        key={index}
                        value={product.productName}
                        onSelect={() => {
                          onProductSelect(product);
                        }}
                      >
                        {product.productName}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedProduct === product.productName
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <FormDescription className="text-sm">
              Search and select an existing product or enter a new product name
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="category"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="text-base">Categories</FormLabel>
            <FormControl>
              <MultiSelect
                options={PRODUCT_CATEGORIES}
                value={field.value || []}
                onChange={field.onChange}
              />
            </FormControl>
            <FormDescription className="text-sm">
              Select one or more categories for your product
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Enter a detailed description of your product"
                className="min-h-[120px] resize-y w-full"
              />
            </FormControl>
            <FormDescription className="text-sm">
              Provide a comprehensive description of your product including key
              features, materials, and specifications
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="sellingPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">Selling Price</FormLabel>
            <FormControl>
              <input
                type="number"
                step="0.01"
                min="0"
                {...field}
                onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </FormControl>
            <FormDescription className="text-sm">
              Set your product&apos;s base selling price (before any dynamic
              pricing rules)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="isPublished"
        render={({ field }) => (
          <FormItem className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-lg border p-4">
            <div className="space-y-1.5">
              <FormLabel className="text-base">Published Status</FormLabel>
              <FormDescription className="text-sm">
                Toggle whether this product should be visible in your store. You
                can change this later.
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-label="Published status"
                className="data-[state=checked]:bg-green-500"
              />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Make sure to fill out all required fields
          before proceeding to the next sections. You can save your product as a
          draft by toggling the Published Status off.
        </p>
      </div>
    </div>
  );
};

export default BasicInfoTab;
