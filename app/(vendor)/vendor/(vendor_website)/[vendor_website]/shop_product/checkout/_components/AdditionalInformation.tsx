import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { VendorFormValues } from "../_lib/types";

interface VendorAdditionalInformationProps {
  form: UseFormReturn<VendorFormValues>;
}

export const VendorAdditionalInformation: React.FC<VendorAdditionalInformationProps> =
  React.memo(({ form }) => {
    return (
      <div className="bg-background border rounded-lg p-4 md:p-6 transition-colors shadow-2xl shadow-black">
        <h3 className="text-xl font-semibold mb-6 text-foreground">
          Additional Information
        </h3>
        <FormField
          control={form.control}
          name="orderNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">
                Order Notes (optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Notes about your order, e.g. special notes for delivery"
                  className="min-h-[100px] bg-background text-foreground border-input"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  });

VendorAdditionalInformation.displayName = "VendorAdditionalInformation";
