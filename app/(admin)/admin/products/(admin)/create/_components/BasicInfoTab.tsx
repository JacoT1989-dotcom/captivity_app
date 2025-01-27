import React, { useEffect } from "react";
import { Control, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProductFormData } from "../types";

interface BasicInfoTabProps {
  control: Control<ProductFormData>;
}

const categoryOptions = {
  headwear: [
    { value: "new-in-headwear", label: "New In Headwear" },
    { value: "flat-peaks", label: "Flat Peaks" },
    { value: "pre-curved-peaks", label: "Pre-curved Peaks" },
    { value: "hats", label: "Hats" },
    { value: "multifunctional-headwear", label: "Multifunctional Headwear" },
    { value: "beanies", label: "Beanies" },
    { value: "trucker-caps", label: "Trucker Caps" },
    { value: "bucket-hats", label: "Bucket Hats" },
  ],
  apparel: [
    { value: "new-in-apparel", label: "New In Apparel" },
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
    { value: "kids", label: "Kids" },
    { value: "t-shirts", label: "T-Shirts" },
    { value: "golfers", label: "Golfers" },
    { value: "hoodies", label: "Hoodies" },
    { value: "jackets", label: "Jackets" },
    { value: "bottoms", label: "Bottoms" },
  ],
  collections: [
    { value: "camo-collection", label: "Camo Collection" },
    { value: "winter-collection", label: "Winter Collection" },
    { value: "baseball-collection", label: "Baseball Collection" },
    { value: "fashion-collection", label: "Fashion Collection" },
    { value: "sport-collection", label: "Sport Collection" },
    { value: "industrial-collection", label: "Industrial Collection" },
    { value: "leisure-collection", label: "Leisure Collection" },
    { value: "kids-collection", label: "Kids Collection" },
    { value: "african-collection", label: "African Collection" },
  ],
};

// Flatten all options into a single array for searching
const allOptions = [
  ...categoryOptions.headwear,
  ...categoryOptions.apparel,
  ...categoryOptions.collections,
];

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ control }) => {
  const { watch, setValue } = useFormContext<ProductFormData>();

  // Watch the selling price
  const sellingPrice = watch("sellingPrice");

  // Effect to update first dynamic pricing tier when selling price changes
  useEffect(() => {
    if (sellingPrice > 0) {
      setValue(`dynamicPricing.0.amount`, sellingPrice.toString(), {
        shouldValidate: true,
      });
    }
  }, [sellingPrice, setValue]);

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="productName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter product name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="category"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Categories</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "justify-between",
                      !field.value?.length && "text-muted-foreground"
                    )}
                  >
                    {field.value?.length > 0
                      ? `${field.value.length} categories selected`
                      : "Select categories"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Search categories..." />
                  <CommandEmpty>No category found.</CommandEmpty>
                  <div className="max-h-[300px] overflow-y-auto">
                    <CommandGroup heading="Headwear">
                      {categoryOptions.headwear.map(option => (
                        <CommandItem
                          key={option.value}
                          onSelect={() => {
                            const values = field.value || [];
                            const newValues = values.includes(option.value)
                              ? values.filter(value => value !== option.value)
                              : [...values, option.value];
                            field.onChange(newValues);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value?.includes(option.value)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandGroup heading="Apparel">
                      {categoryOptions.apparel.map(option => (
                        <CommandItem
                          key={option.value}
                          onSelect={() => {
                            const values = field.value || [];
                            const newValues = values.includes(option.value)
                              ? values.filter(value => value !== option.value)
                              : [...values, option.value];
                            field.onChange(newValues);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value?.includes(option.value)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandGroup heading="Collections">
                      {categoryOptions.collections.map(option => (
                        <CommandItem
                          key={option.value}
                          onSelect={() => {
                            const values = field.value || [];
                            const newValues = values.includes(option.value)
                              ? values.filter(value => value !== option.value)
                              : [...values, option.value];
                            field.onChange(newValues);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value?.includes(option.value)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </div>
                </Command>
              </PopoverContent>
            </Popover>
            {field.value?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {field.value.map(category => {
                  const option = allOptions.find(opt => opt.value === category);
                  return (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {option?.label}
                      <button
                        type="button"
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onClick={() => {
                          field.onChange(
                            field.value?.filter(value => value !== category)
                          );
                        }}
                      >
                        ✕
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter product description"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="sellingPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Selling Price</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...field}
                onChange={e => {
                  const value = parseFloat(e.target.value);
                  field.onChange(isNaN(value) ? 0 : value);
                }}
              />
            </FormControl>
            <FormDescription>
              This price will automatically set the base price for quantities
              1-24
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="isPublished"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Published</FormLabel>
              <FormDescription>
                Make this product visible in the store
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default BasicInfoTab;
