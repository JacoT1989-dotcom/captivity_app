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
import { VendorProductFormData } from "../types";

interface VariationsTabProps {
  control: Control<VendorProductFormData>;
}

const VariationsTab: React.FC<VariationsTabProps> = ({ control }) => {
  const { setValue, watch } = useFormContext<VendorProductFormData>();

  const {
    fields: colorFields,
    append: appendColor,
    remove: removeColor,
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
      const currentVariation = watch(`variations.${index}`);
      const oldUrl = currentVariation.variationImageURL;

      // Revoke old URL if it exists
      if (oldUrl && oldUrl.startsWith("blob:")) {
        URL.revokeObjectURL(oldUrl);
      }

      const newUrl = URL.createObjectURL(file);

      setValue(`variations.${index}.variationImage`, file, {
        shouldValidate: false,
      });
      setValue(`variations.${index}.variationImageURL`, newUrl, {
        shouldValidate: false,
      });
    } catch (error) {
      console.error("Error handling variation image upload:", error);
    }
  };

  const addSizeToVariation = (variationIndex: number) => {
    const currentVariation = watch(`variations.${variationIndex}`);
    const currentSizes = currentVariation.sizes || [];
    const newSize = {
      size: "",
      quantity: 0,
      sku: "",
      sku2: "",
    };

    setValue(`variations.${variationIndex}.sizes`, [...currentSizes, newSize], {
      shouldValidate: false,
    });
  };

  const removeSizeFromVariation = (
    variationIndex: number,
    sizeIndex: number
  ) => {
    const currentVariation = watch(`variations.${variationIndex}`);
    const newSizes = currentVariation.sizes.filter(
      (_, idx) => idx !== sizeIndex
    );

    setValue(`variations.${variationIndex}.sizes`, newSizes, {
      shouldValidate: false,
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="text-lg font-medium">Variations</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            appendColor({
              name: "",
              color: "",
              variationImageURL: "",
              variationImage: undefined,
              sizes: [
                {
                  size: "",
                  quantity: 0,
                  sku: "",
                  sku2: "",
                },
              ],
            })
          }
          className="w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Variation
        </Button>
      </div>

      {colorFields.map((field, variationIndex) => (
        <div key={field.id} className="space-y-6 p-4 border rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h4 className="text-md font-medium">
              Variation {variationIndex + 1}
            </h4>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => removeColor(variationIndex)}
              className="w-8 h-8"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`variations.${variationIndex}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Variation name"
                      className="w-full"
                    />
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
                    <Input
                      {...field}
                      placeholder="Color (optional)"
                      className="w-full"
                    />
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
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={e =>
                        handleVariationImageUpload(variationIndex, e)
                      }
                      className="cursor-pointer w-full"
                    />
                    {field.value && (
                      <div className="relative w-16 h-16 shrink-0">
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
          <div className="mt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <h5 className="text-sm font-medium">Sizes</h5>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addSizeToVariation(variationIndex)}
                className="w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Size
              </Button>
            </div>

            <div className="space-y-4">
              {watch(`variations.${variationIndex}.sizes`, [])?.map(
                (size, sizeIndex) => (
                  <div
                    key={sizeIndex}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-accent/50 rounded-lg"
                  >
                    <FormField
                      control={control}
                      name={`variations.${variationIndex}.sizes.${sizeIndex}.size`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Size</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Size name"
                              className="w-full"
                            />
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
                              min="0"
                              placeholder="0"
                              className="w-full"
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
                            <Input
                              {...field}
                              placeholder="Enter SKU"
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-end justify-start sm:justify-end">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() =>
                          removeSizeFromVariation(variationIndex, sizeIndex)
                        }
                        className="w-8 h-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VariationsTab;
