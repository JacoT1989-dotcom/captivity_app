"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { registrationSchema, RegistrationFormData } from "@/lib/validation";
import { signUp } from "./actions";
import { isRedirectError } from "next/dist/client/components/redirect";
import AccountDetailsSection from "./AccountDetailsSection";
import CompanyDetailsSection from "./CompanyDetailsSection";

type SignUpResult = {
  error?: string;
};

const RegistrationForm = () => {
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      companyName: "",
      vatNumber: "",
      ckNumber: "",
      username: "",
      password: "",
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      natureOfBusiness: "distributors",
      currentSupplier: "none",
      otherSupplier: "",
      website: "",
      resellingLocation: "",
      position: "",
      streetAddress: "",
      addressLine2: "",
      suburb: "",
      townCity: "",
      postcode: "",
      country: "southAfrica",
      salesRep: "noOne",
      agreeTerms: false,
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      const result = await signUp(data);
      if (result && result.error) {
        console.error(result.error);
      }
    } catch (error) {
      if (isRedirectError(error)) {
        // Redirect handled automatically
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <div className=" mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <AccountDetailsSection form={form} />
          <CompanyDetailsSection form={form} />

          <FormField
            control={form.control}
            name="salesRep"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">
                  The sales rep. that helped you?
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sales rep" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="noOne">No one yet</SelectItem>
                    <SelectItem value="rep1">Sales Rep 1</SelectItem>
                    <SelectItem value="rep2">Sales Rep 2</SelectItem>
                    <SelectItem value="rep3">Sales Rep 3</SelectItem>
                    <SelectItem value="rep4">Sales Rep 4</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agreeTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>I agree to the Terms & Conditions</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Registering..." : "Register"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;
