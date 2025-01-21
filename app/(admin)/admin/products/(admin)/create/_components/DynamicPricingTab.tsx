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

const PRESET_RANGES = [
  { from: "1", to: "24" },
  { from: "25", to: "100" },
  { from: "101", to: "600" },
  { from: "601", to: "2000" },
];

const DynamicPricingTab: React.FC<DynamicPricingTabProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Dynamic Pricing</h3>
      </div>

      {PRESET_RANGES.map((range, index) => (
        <div key={index} className="flex gap-4 items-start">
          <FormField
            control={control}
            name={`dynamicPricing.${index}.from`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>From</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    value={range.from}
                    readOnly
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
              <FormItem className="flex-1">
                <FormLabel>To</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    value={range.to}
                    readOnly
                  />
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
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input {...field} type="number" step="0.01" min="0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Hidden field for type */}
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
