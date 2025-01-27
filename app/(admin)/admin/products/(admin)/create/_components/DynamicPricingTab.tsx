"use client";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface DynamicPricingTabProps {
  control: Control<ProductFormData>;
}

// Preset ranges with two options for the last range
const RANGE_OPTIONS = {
  standard: [
    { from: "1", to: "24" },
    { from: "25", to: "100" },
    { from: "101", to: "600" },
    { from: "601", to: "2000" },
  ],
  extended: [
    { from: "1", to: "24" },
    { from: "25", to: "100" },
    { from: "101", to: "600" },
    { from: "601", to: "20000" },
  ],
};

const DynamicPricingTab: React.FC<DynamicPricingTabProps> = ({ control }) => {
  const { watch, setValue } = useFormContext<ProductFormData>();
  const [rangeType, setRangeType] = React.useState("standard");

  // Watch selling price for first range
  const sellingPrice = watch("sellingPrice");

  // Handle range type change
  const handleRangeTypeChange = (value: string) => {
    setRangeType(value);
    const ranges =
      value === "standard" ? RANGE_OPTIONS.standard : RANGE_OPTIONS.extended;

    // Update only the last range's "to" value
    setValue(`dynamicPricing.3.to`, ranges[3].to);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Dynamic Pricing</h3>
      </div>

      <div className="mb-6 space-y-2">
        <Label>Select Range Option</Label>
        <RadioGroup
          defaultValue="standard"
          value={rangeType}
          onValueChange={handleRangeTypeChange}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="standard" id="standard" />
            <Label htmlFor="standard">601 - 2,000</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="extended" id="extended" />
            <Label htmlFor="extended">601 - 20,000</Label>
          </div>
        </RadioGroup>
      </div>

      {Array.from({ length: 4 }).map((_, index) => {
        const ranges =
          rangeType === "standard"
            ? RANGE_OPTIONS.standard
            : RANGE_OPTIONS.extended;

        return (
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
                      readOnly
                      value={ranges[index].from}
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
                      readOnly
                      value={ranges[index].to}
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
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      min="0"
                      // First range is locked to selling price
                      readOnly={index === 0}
                      value={index === 0 ? sellingPrice || "" : field.value}
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
        );
      })}
    </div>
  );
};

export default DynamicPricingTab;
