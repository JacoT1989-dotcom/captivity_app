import React from "react";
import { Control } from "react-hook-form";
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
                  <Input {...field} type="number" step="0.01" min="0" />
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
    </div>
  );
};

export default DynamicPricingTab;