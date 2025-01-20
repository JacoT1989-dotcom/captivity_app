import React from "react";
import { Control, useFieldArray } from "react-hook-form";
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

interface DynamicPricingTabProps {
  control: Control<ProductFormData>;
}

const DynamicPricingTab: React.FC<DynamicPricingTabProps> = ({ control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "dynamicPricing",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Dynamic Pricing</h3>
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
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Pricing Rule
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-4 items-start">
          <FormField
            control={control}
            name={`dynamicPricing.${index}.from`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>From</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min="0" />
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
                  <Input {...field} type="number" min="0" />
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

          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="mt-8"
            onClick={() => remove(index)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default DynamicPricingTab;
