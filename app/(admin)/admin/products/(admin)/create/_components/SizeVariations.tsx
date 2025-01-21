import React from "react";
import { Control, useFormContext } from "react-hook-form";
import { Plus, Trash2, Check, ChevronsUpDown } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { cn } from "@/lib/utils";
import { ProductFormData } from "../types";

const SIZES = [
  // Standard sizes
  "XS",
  "S/M",
  "M/L",
  "L/XL",
  "XL",
  "2XL",
  "3XL",
  "4XL",
  "5XL",
  // Specific sizes
  "Small",
  "Medium",
  "Large",
  "XSmall",
  "OSFM",
  "osfm",
  // Kids sizes
  "1/2 yrs",
  "3/4 yrs",
  "5/6 yrs",
  "7/8 yrs",
  "9/10 yrs",
  "11/12 yrs",
  "13/14 yrs",
  "120cm",
];

interface SizeVariationsProps {
  control: Control<ProductFormData>;
  variationIndex: number;
  field: any;
}

export const SizeVariations: React.FC<SizeVariationsProps> = ({
  control,
  variationIndex,
  field,
}) => {
  const { setValue, getValues } = useFormContext<ProductFormData>();

  const addSizeToVariation = (variationIndex: number) => {
    // Get current variation data
    const currentVariation = getValues(`variations.${variationIndex}`);
    const currentSizes = currentVariation.sizes || [];

    const newSize = {
      size: "",
      quantity: 0,
      sku: "",
      sku2: "",
    };

    // Update while preserving all existing data
    setValue(
      `variations.${variationIndex}`,
      {
        ...currentVariation,
        sizes: [...currentSizes, newSize],
      },
      {
        shouldValidate: true,
      }
    );
  };

  const removeSizeFromVariation = (
    variationIndex: number,
    sizeIndex: number
  ) => {
    // Get current variation data
    const currentVariation = getValues(`variations.${variationIndex}`);
    const newSizes = currentVariation.sizes.filter(
      (_, idx) => idx !== sizeIndex
    );

    // Update while preserving all existing data
    setValue(
      `variations.${variationIndex}`,
      {
        ...currentVariation,
        sizes: newSizes,
      },
      {
        shouldValidate: true,
      }
    );
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <h5 className="text-sm font-medium">Sizes</h5>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addSizeToVariation(variationIndex)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Size
        </Button>
      </div>

      {field.sizes?.map((size: any, sizeIndex: number) => (
        <div
          key={sizeIndex}
          className="grid grid-cols-4 gap-4 p-4 bg-accent/50 rounded-lg mb-2"
        >
          <FormField
            control={control}
            name={`variations.${variationIndex}.sizes.${sizeIndex}.size`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value || "Select size..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search size..." />
                      <CommandEmpty>No size found.</CommandEmpty>
                      <div className="max-h-[300px] overflow-y-auto">
                        <CommandGroup>
                          {SIZES.map(size => (
                            <CommandItem
                              key={size}
                              value={size}
                              onSelect={() => {
                                field.onChange(size);
                              }}
                            >
                              {size}
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  field.value === size
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </div>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`variations.${variationIndex}.sizes.${sizeIndex}.quantity`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={e =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`variations.${variationIndex}.sizes.${sizeIndex}.sku`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`variations.${variationIndex}.sizes.${sizeIndex}.sku2`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU2</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-end">
            {field.sizes.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() =>
                  removeSizeFromVariation(variationIndex, sizeIndex)
                }
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SizeVariations;
