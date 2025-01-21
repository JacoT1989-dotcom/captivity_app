import React from "react";
import Image from "next/image";
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
import { ProductFormData } from "../types";
import { SizeVariations } from "./SizeVariations";
import { cn } from "@/lib/utils";
import { SOLID_COLORS } from "./solidColors";
import { PATTERN_COLORS } from "./patternColors";

// Combine both color types into a single array with type indicators
const ALL_COLORS = [
  ...SOLID_COLORS.map(color => ({
    ...color,
    type: "solid" as const,
  })),
  ...PATTERN_COLORS.map(color => ({
    name: color.name,
    type: "pattern" as const,
    colors: color.colors,
  })),
];

interface VariationsTabProps {
  control: Control<ProductFormData>;
}

const VariationsTab: React.FC<VariationsTabProps> = ({ control }) => {
  const { setValue, watch, getValues } = useFormContext<ProductFormData>();

  const handleVariationImageUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Get current variation data
      const currentVariation = getValues(`variations.${index}`);

      // Update while preserving all existing data
      setValue(
        `variations.${index}`,
        {
          ...currentVariation,
          variationImage: file,
          variationImageURL: URL.createObjectURL(file),
        },
        {
          shouldValidate: true,
        }
      );

      console.log(`Variation ${index} image stored:`, {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });
    } catch (error) {
      console.error("Error handling variation image upload:", error);
    }
  };

  const handleAddVariation = () => {
    // Get all current variations
    const currentVariations = getValues("variations") || [];

    const emptyVariation = {
      name: "",
      color: "",
      sizes: [
        {
          size: "",
          quantity: 0,
          sku: "",
          sku2: "",
        },
      ],
      variationImageURL: "",
      variationImage: null,
    };

    // Append new variation while preserving existing ones
    setValue("variations", [...currentVariations, emptyVariation], {
      shouldValidate: true,
    });
  };

  const handleRemoveVariation = (index: number) => {
    const currentVariations = getValues("variations");
    const newVariations = currentVariations.filter((_, idx) => idx !== index);
    setValue("variations", newVariations, { shouldValidate: true });
  };

  React.useEffect(() => {
    return () => {
      const variations = getValues("variations");
      variations?.forEach(variation => {
        if (variation.variationImageURL?.startsWith("blob:")) {
          URL.revokeObjectURL(variation.variationImageURL);
        }
      });
    };
  }, [getValues]);

  const variations = watch("variations") || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Variations</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddVariation}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Color Variation
        </Button>
      </div>

      {variations.map((field, variationIndex) => (
        <div key={variationIndex} className="space-y-4 p-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <h4 className="text-md font-medium">
              Color Variation {variationIndex + 1}
            </h4>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => handleRemoveVariation(variationIndex)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`variations.${variationIndex}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`variations.${variationIndex}.color`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
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
                          {field.value
                            ? ALL_COLORS.find(
                                color => color.name === field.value
                              )?.name
                            : "Select color..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search colors..." />
                        <CommandEmpty>No color found.</CommandEmpty>
                        <div className="max-h-[300px] overflow-y-auto">
                          <CommandGroup heading="Solid Colors">
                            {SOLID_COLORS.map(color => (
                              <CommandItem
                                key={color.name}
                                value={color.name}
                                onSelect={() => {
                                  field.onChange(color.name);
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: color.hex }}
                                  />
                                  <span>{color.name}</span>
                                </div>
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    field.value === color.name
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                          <CommandGroup heading="Pattern Colors">
                            {PATTERN_COLORS.map(pattern => (
                              <CommandItem
                                key={pattern.name}
                                value={pattern.name}
                                onSelect={() => {
                                  field.onChange(pattern.name);
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <div className="flex gap-1">
                                    {pattern.colors.map((color, idx) => (
                                      <div
                                        key={idx}
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: color }}
                                      />
                                    ))}
                                  </div>
                                  <span>{pattern.name}</span>
                                </div>
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    field.value === pattern.name
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
          </div>

          <FormField
            control={control}
            name={`variations.${variationIndex}.variationImageURL`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variation Image</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={e =>
                        handleVariationImageUpload(variationIndex, e)
                      }
                      className="cursor-pointer"
                    />
                    {field.value && (
                      <div className="relative w-16 h-16">
                        <Image
                          src={field.value}
                          alt="Variation preview"
                          fill
                          className="object-cover rounded-md"
                          sizes="64px"
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SizeVariations
            control={control}
            variationIndex={variationIndex}
            field={field}
          />
        </div>
      ))}
    </div>
  );
};

export default VariationsTab;
