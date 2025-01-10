import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { VendorFormValues } from "../_lib/types";
import {
  VENDOR_BRANCHES,
  VENDOR_COLLECTION_METHODS,
  VENDOR_PROVINCES,
} from "../_lib/validation";

interface VendorBillingDetailsProps {
  form: UseFormReturn<VendorFormValues>;
}

const VendorBranchOptionsContent = React.memo(() => (
  <>
    {VENDOR_BRANCHES.map(option => (
      <SelectItem key={option.id} value={option.id}>
        {option.label}
      </SelectItem>
    ))}
  </>
));
VendorBranchOptionsContent.displayName = "VendorBranchOptionsContent";

const CollectionOptionsContent = React.memo(() => (
  <>
    {VENDOR_COLLECTION_METHODS.map(option => (
      <SelectItem key={option.id} value={option.id}>
        {option.label}
      </SelectItem>
    ))}
  </>
));
CollectionOptionsContent.displayName = "CollectionOptionsContent";

const CountryOptionsContent = React.memo(() => (
  <SelectItem value="southAfrica">South Africa</SelectItem>
));
CountryOptionsContent.displayName = "CountryOptionsContent";

const ProvinceOptionsContent = React.memo(() => (
  <>
    {VENDOR_PROVINCES.map(province => (
      <SelectItem key={province} value={province}>
        {province}
      </SelectItem>
    ))}
  </>
));
ProvinceOptionsContent.displayName = "ProvinceOptionsContent";

const FormInput = React.memo(
  ({
    label,
    name,
    control,
    placeholder,
    type = "text",
    required,
    className,
  }: {
    label: string;
    name: keyof VendorFormValues;
    control: UseFormReturn<VendorFormValues>["control"];
    placeholder: string;
    type?: string;
    required?: boolean;
    className?: string;
  }) => (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="text-foreground">
            {label}
            {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type={type}
              {...field}
              value={field.value?.toString() ?? ""}
              className="bg-background border-input hover:border-ring focus:border-ring transition-colors"
            />
          </FormControl>
          <FormMessage className="text-destructive" />
        </FormItem>
      )}
    />
  )
);
FormInput.displayName = "FormInput";

const FormSelect = React.memo(
  ({
    label,
    name,
    placeholder,
    optionsContent,
    control,
    required,
    className,
  }: {
    label: string;
    name: keyof VendorFormValues;
    placeholder: string;
    optionsContent: React.ReactNode;
    control: UseFormReturn<VendorFormValues>["control"];
    required?: boolean;
    className?: string;
  }) => (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Ensure we only pass string values to Select
        const value = typeof field.value === "string" ? field.value : undefined;

        return (
          <FormItem className={className}>
            <FormLabel className="text-foreground">
              {label}
              {required && <span className="text-destructive">*</span>}
            </FormLabel>
            <Select onValueChange={field.onChange} value={value}>
              <FormControl>
                <SelectTrigger className="w-full bg-background border-input hover:border-ring focus:border-ring transition-colors">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-background border-input">
                {optionsContent}
              </SelectContent>
            </Select>
            <FormMessage className="text-destructive" />
          </FormItem>
        );
      }}
    />
  )
);
FormSelect.displayName = "FormSelect";

export const VendorBillingDetails: React.FC<VendorBillingDetailsProps> =
  React.memo(({ form }) => {
    const { control } = form;

    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card shadow-2xl shadow-black dark:shadow-none rounded-lg p-4 sm:p-6 lg:p-8 border border-border transition-colors">
          <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-card-foreground">
            Vendor Billing/Shipping Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <FormSelect
              label="Branch"
              name="vendorBranch"
              placeholder="Select branch"
              optionsContent={<VendorBranchOptionsContent />}
              control={control}
              required
              className="col-span-1 sm:col-span-2 md:col-span-1"
            />

            <FormSelect
              label="Collection Method"
              name="methodOfCollection"
              placeholder="Select method"
              optionsContent={<CollectionOptionsContent />}
              control={control}
              required
              className="col-span-1 sm:col-span-2 md:col-span-1"
            />

            <FormInput
              label="Sales Rep"
              name="salesRep"
              control={control}
              placeholder="Sales rep name"
            />

            <FormInput
              label="Reference Number"
              name="referenceNumber"
              control={control}
              placeholder="Your reference"
            />

            <FormInput
              label="First Name"
              name="firstName"
              control={control}
              placeholder="First name"
              required
            />

            <FormInput
              label="Last Name"
              name="lastName"
              control={control}
              placeholder="Last name"
              required
            />

            <FormInput
              label="Company Name"
              name="companyName"
              control={control}
              placeholder="Company name"
              required
            />

            <FormSelect
              label="Country / Region"
              name="countryRegion"
              placeholder="Select country/region"
              optionsContent={<CountryOptionsContent />}
              control={control}
              required
            />

            <FormInput
              label="Street Address"
              name="streetAddress"
              control={control}
              placeholder="eg... 123 Main str, Claremont"
              required
              className="col-span-1 sm:col-span-2"
            />

            <FormInput
              label="Apartment, Suite, etc."
              name="apartmentSuite"
              control={control}
              placeholder="Apartment, suite, unit, etc."
              className="col-span-1 sm:col-span-2"
            />

            <FormInput
              label="Town / City"
              name="townCity"
              control={control}
              placeholder="Town / City"
              required
            />

            <FormSelect
              label="Province"
              name="province"
              placeholder="Select province"
              optionsContent={<ProvinceOptionsContent />}
              control={control}
              required
            />

            <FormInput
              label="Postcode"
              name="postcode"
              control={control}
              placeholder="Postcode"
              required
            />

            <FormInput
              label="Phone"
              name="phone"
              control={control}
              placeholder="Phone number"
              type="tel"
              required
            />

            <FormInput
              label="Email Address"
              name="email"
              control={control}
              placeholder="Email address"
              type="email"
              required
              className="col-span-1 sm:col-span-2"
            />
          </div>
        </div>
      </div>
    );
  });

VendorBillingDetails.displayName = "VendorBillingDetails";

export default VendorBillingDetails;
