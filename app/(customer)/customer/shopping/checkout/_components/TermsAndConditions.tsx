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
import { FormValues } from "../_lib/types";

interface TermsAndConditionsProps {
  form: UseFormReturn<FormValues>;
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  form,
}) => {
  return (
    <div className="bg-white shadow-2xl shadow-black rounded-lg p-6">
      <p className="mb-4 text-sm">Pay upon Proforma Invoice receipt</p>
      <p className="mb-6 text-sm">
        Your personal data will be used to process your order, support your
        experience throughout this website, and for other purposes described in
        our privacy policy.
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
              <FormLabel>
                Check here to receive an email to review our products.
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
                <FormLabel>
                  I have read and agree to the website terms and conditions*
                </FormLabel>
              </div>
            </div>
            <FormMessage className="text-red-500 text-sm" />
          </FormItem>
        )}
      />
    </div>
  );
};
