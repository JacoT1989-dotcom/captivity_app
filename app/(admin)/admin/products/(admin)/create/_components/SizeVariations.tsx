import React from "react";
import { Control } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductFormData } from "../types";

interface SizeVariationsProps {
  control: Control<ProductFormData>;
  variationIndex: number;
  field: any; // You might want to type this properly based on your field structure
  updateColor: (index: number, value: any) => void;
}

export const SizeVariations: React.FC<SizeVariationsProps> = ({
  control,
  variationIndex,
  field,
  updateColor,
}) => {
  const addSizeToVariation = (variationIndex: number) => {
    const currentSizes = field.sizes || [];
    const newSize = {
      size: "",
      quantity: 0,
      sku: "",
      sku2: "",
    };

    updateColor(variationIndex, {
      ...field,
      sizes: [...currentSizes, newSize],
    });
  };

  const removeSizeFromVariation = (
    variationIndex: number,
    sizeIndex: number
  ) => {
    const newSizes = field.sizes.filter(
      (_: any, idx: number) => idx !== sizeIndex
    );

    updateColor(variationIndex, {
      ...field,
      sizes: newSizes,
    });
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
                <FormControl>
                  <Input {...field} />
                </FormControl>
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
