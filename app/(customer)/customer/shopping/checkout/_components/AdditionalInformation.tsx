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
import { FormValues } from "../_lib/types";

interface AdditionalInformationProps {
  form: UseFormReturn<FormValues>;
}

export const AdditionalInformation: React.FC<AdditionalInformationProps> = ({
  form,
}) => {
  return (
    <div className="bg-white shadow-2xl shadow-black rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-6">Additional Information</h3>
      <FormField
        control={form.control}
        name="orderNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Order Notes (optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Notes about your order, e.g. special notes for delivery"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
