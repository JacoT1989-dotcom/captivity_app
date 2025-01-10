import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { VendorFormValues } from "../_lib/types";

interface VendorTermsAndConditionsProps {
  form: UseFormReturn<VendorFormValues>;
}

export const VendorTermsAndConditions: React.FC<VendorTermsAndConditionsProps> =
  React.memo(({ form }) => {
    return (
      <div className="bg-background border rounded-lg p-4 md:p-6 transition-colors shadow-2xl shadow-black">
        <p className="mb-4 text-sm text-foreground">
          Pay upon Proforma Invoice receipt
        </p>
        <p className="mb-6 text-sm text-muted-foreground">
          Your personal data will be used to process your order, support your
          experience throughout this website, and for other purposes described
          in our privacy policy.
        </p>

        <FormField
          control={form.control}
          name="receiveEmailReviews"
          render={({ field }) => (
            <FormItem className="flex items-start space-x-3 space-y-0 mb-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-foreground">
                  Check here to receive an email to review our vendor products.
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agreeTerms"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2">
              <div className="flex items-start space-x-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-foreground">
                    I have read and agree to the vendor website terms and
                    conditions*
                  </FormLabel>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  });

VendorTermsAndConditions.displayName = "VendorTermsAndConditions";
