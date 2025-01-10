import React from "react";
import Image from "next/image";
import { Control, useFormContext, useFieldArray } from "react-hook-form";
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

interface VariationsTabProps {
  control: Control<ProductFormData>;
}

const VariationsTab: React.FC<VariationsTabProps> = ({ control }) => {
  const { setValue, watch } = useFormContext<ProductFormData>();

  // Main variations field array
  const {
    fields: colorFields,
    append: appendColor,
    remove: removeColor,
    update: updateColor,
  } = useFieldArray({
    control,
    name: "variations",
  });

  const handleVariationImageUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setValue(`variations.${index}.variationImage`, file);
      setValue(
        `variations.${index}.variationImageURL`,
        URL.createObjectURL(file),
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

  const addSizeToVariation = (variationIndex: number) => {
    const variation = colorFields[variationIndex];
    const currentSizes = variation.sizes || [];
    const newSize = {
      size: "",
      quantity: 0,
      sku: "",
      sku2: "",
    };

    updateColor(variationIndex, {
      ...variation,
      sizes: [...currentSizes, newSize],
    });
  };

  const removeSizeFromVariation = (
    variationIndex: number,
    sizeIndex: number
  ) => {
    const variation = colorFields[variationIndex];
    const newSizes = variation.sizes.filter((_, idx) => idx !== sizeIndex);

    updateColor(variationIndex, {
      ...variation,
      sizes: newSizes,
    });
  };

  React.useEffect(() => {
    return () => {
      colorFields.forEach((field, index) => {
        const imageUrl = watch(`variations.${index}.variationImageURL`);
        if (imageUrl && imageUrl.startsWith("blob:")) {
          URL.revokeObjectURL(imageUrl);
        }
      });
    };
  }, [colorFields, watch]);

  const emptySize = {
    size: "",
    quantity: 0,
    sku: "",
    sku2: "",
  };

  const emptyVariation = {
    name: "",
    color: "",
    sizes: [emptySize],
    variationImageURL: "",
    variationImage: null,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Variations</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => appendColor(emptyVariation)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Color Variation
        </Button>
      </div>

      {colorFields.map((field, variationIndex) => (
        <div key={field.id} className="space-y-4 p-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <h4 className="text-md font-medium">
              Color Variation {variationIndex + 1}
            </h4>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => removeColor(variationIndex)}
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
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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

          {/* Size Variations */}
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

            {field.sizes?.map((size, sizeIndex) => (
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

                <div className="flex items-end">
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
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VariationsTab;
