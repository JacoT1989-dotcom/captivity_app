import React from "react";
import { Control, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProductFormData } from "../types";

interface DynamicPricingTabProps {
  control: Control<ProductFormData>;
}

const DynamicPricingTab: React.FC<DynamicPricingTabProps> = ({ control }) => {
  const { watch } = useFormContext<ProductFormData>();
  const sellingPrice = watch("sellingPrice");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Dynamic Pricing</h3>
      </div>

      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex gap-4 items-start">
          <FormField
            control={control}
            name={`dynamicPricing.${index}.from`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>From</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min="0" readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`dynamicPricing.${index}.to`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>To</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min="0" readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`dynamicPricing.${index}.amount`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number" 
                    step="0.01" 
                    min="0"
                    // Disable the first range if it's tied to selling price
                    readOnly={index === 0}
                    // Show selling price in the first range
                    value={index === 0 ? sellingPrice || '' : field.value}
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
              <input type="hidden" {...field} value="fixed_price" />
            )}
          />
        </div>
      ))}

      {/* Add helper text to explain the first range */}
      <p className="text-sm text-muted-foreground mt-2">
        The price for quantities 1-24 is automatically set to match the selling price.
      </p>
    </div>
  );
};

export default DynamicPricingTab;