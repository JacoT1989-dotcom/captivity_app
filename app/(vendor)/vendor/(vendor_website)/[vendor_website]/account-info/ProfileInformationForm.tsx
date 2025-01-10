// components/vendor/account/ProfileInformationForm.tsx
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
  ProfileActionResult,
  ProfileUpdateData,
  profileUpdateSchema,
} from "./profile";
import { updateUserProfile } from "./actions";

interface ProfileInformationFormProps {
  profile: ProfileActionResult;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onProfileUpdate: (profile: ProfileActionResult) => void;
}

export function ProfileInformationForm({
  profile,
  isLoading,
  setIsLoading,
  onProfileUpdate,
}: ProfileInformationFormProps) {
  const defaultValues: ProfileUpdateData = {
    firstName: profile.userData?.firstName ?? "",
    lastName: profile.userData?.lastName ?? "",
    displayName: profile.userData?.displayName ?? "",
    phoneNumber: profile.userData?.phoneNumber ?? "",
    companyName: profile.userData?.companyName ?? "",
    website: profile.userData?.website ?? "",
    streetAddress: profile.userData?.streetAddress ?? "",
    addressLine2: profile.userData?.addressLine2 ?? null,
    suburb: profile.userData?.suburb ?? null,
    townCity: profile.userData?.townCity ?? "",
    postcode: profile.userData?.postcode ?? "",
    country: profile.userData?.country ?? "",
    position: profile.userData?.position ?? null,
    natureOfBusiness: profile.userData?.natureOfBusiness ?? "",
    currentSupplier: profile.userData?.currentSupplier ?? "",
    otherSupplier: profile.userData?.otherSupplier ?? null,
    resellingTo: profile.userData?.resellingTo ?? null,
    salesRep: profile.userData?.salesRep ?? "",
    bio: profile.userData?.bio ?? null,
    ckNumber: profile.userData?.ckNumber ?? null,
  };

  const form = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues,
  });

  const onSubmit = async (data: ProfileUpdateData) => {
    try {
      setIsLoading(true);
      const result = await updateUserProfile(data);

      if (!result.success) {
        throw new Error(result.error || "Failed to update profile");
      }

      onProfileUpdate(result);
      toast.success("Profile updated successfully");
      form.reset(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (
    name: keyof ProfileUpdateData,
    label: string,
    options: {
      type?: string;
      isTextarea?: boolean;
      colSpan?: boolean;
    } = {}
  ) => {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className={options.colSpan ? "md:col-span-2" : ""}>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              {options.isTextarea ? (
                <Textarea
                  {...field}
                  disabled={isLoading}
                  rows={4}
                  value={field.value ?? ""}
                />
              ) : (
                <Input
                  {...field}
                  type={options.type}
                  disabled={isLoading}
                  value={field.value ?? ""}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Card className="border-none shadow-black shadow-2xl">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal and business details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-medium">Personal Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("firstName", "First Name")}
                {renderField("lastName", "Last Name")}
                {renderField("displayName", "Display Name")}
                {renderField("phoneNumber", "Phone Number", { type: "tel" })}
              </div>
            </div>

            {/* Business Information */}
            <div className="space-y-4">
              <h3 className="font-medium">Business Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("companyName", "Company Name")}
                {renderField("website", "Website", { type: "url" })}
                {renderField("position", "Position")}
                {renderField("natureOfBusiness", "Nature of Business")}
                {renderField("ckNumber", "CK Number")}
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="font-medium">Address Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("streetAddress", "Street Address", {
                  colSpan: true,
                })}
                {renderField("addressLine2", "Address Line 2")}
                {renderField("suburb", "Suburb")}
                {renderField("townCity", "Town/City")}
                {renderField("postcode", "Postcode")}
                {renderField("country", "Country")}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="font-medium">Additional Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {renderField("currentSupplier", "Current Supplier")}
                {renderField("otherSupplier", "Other Supplier")}
                {renderField("resellingTo", "Reselling To")}
                {renderField("salesRep", "Sales Representative")}
                {renderField("bio", "Bio", { isTextarea: true, colSpan: true })}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading || !form.formState.isDirty}
              >
                {isLoading ? "Saving changes..." : "Save changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
