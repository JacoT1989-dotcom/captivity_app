import React from "react";
import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VendorProductFormData } from "../types";

interface DynamicPricingTabProps {
  control: Control<VendorProductFormData>;
}

const DynamicPricingTab: React.FC<DynamicPricingTabProps> = ({ control }) => {
  const { watch } = useFormContext<VendorProductFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "dynamicPricing",
  });

  const basePrice = watch("sellingPrice") || 0;

  const calculatePrice = (type: string, amount: string, basePrice: number) => {
    if (!amount) return null;
    const numAmount = parseFloat(amount);
    if (type === "percentage") {
      return basePrice * (1 - numAmount / 100);
    }
    return numAmount;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">Bulk Pricing</h3>
          <p className="text-sm text-muted-foreground">
            Base Price: R{basePrice.toFixed(2)}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              from: "",
              to: "",
              type: "fixed_price",
              amount: "",
            })
          }
          className="w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Quantity Range
        </Button>
      </div>

      {fields.map((field, index) => {
        const type = watch(`dynamicPricing.${index}.type`);
        const amount = watch(`dynamicPricing.${index}.amount`);
        const calculatedPrice = calculatePrice(type, amount, basePrice);

        return (
          <div
            key={field.id}
            className="flex flex-col gap-4 bg-accent/50 p-4 rounded-lg"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormField
                control={control}
                name={`dynamicPricing.${index}.from`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity From</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="1"
                        placeholder="Minimum quantity"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`dynamicPricing.${index}.to`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity To</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="1"
                        placeholder="Maximum quantity"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`dynamicPricing.${index}.type`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select price type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fixed_price">Fixed Price</SelectItem>
                        <SelectItem value="percentage">
                          Percentage Off
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`dynamicPricing.${index}.amount`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder={type === "percentage" ? "% off" : "Price"}
                        className="w-full"
                      />
                    </FormControl>
                    {calculatedPrice !== null && (
                      <FormDescription>
                        {type === "percentage" ? (
                          <>
                            {field.value}% off = ${calculatedPrice.toFixed(2)}{" "}
                            per item
                          </>
                        ) : (
                          `Fixed price: $${field.value} per item`
                        )}
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => remove(index)}
                className="mt-2 sm:mt-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
      })}

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Set different prices for different quantity
          ranges. For example:
          <br className="hidden sm:block" />• 1-10 items: Regular price ($
          {basePrice.toFixed(2)})
          <br className="hidden sm:block" />
          • 11-50 items: Fixed price $X per item
          <br className="hidden sm:block" />• 51+ items: X% off per item
        </p>
      </div>
    </div>
  );
};

export default DynamicPricingTab;
