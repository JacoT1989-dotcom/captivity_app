import React, { useMemo } from "react";
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
import { FormValues } from "../_lib/types";

interface BillingDetailsProps {
  form: UseFormReturn<FormValues>;
}

// Pre-render select options components
const BRANCH_OPTIONS = [
  { value: "branch1", label: "Branch 1" },
  { value: "branch2", label: "Branch 2" },
] as const;

const COLLECTION_OPTIONS = [
  { value: "pickup", label: "Pick-up" },
  { value: "delivery", label: "Delivery" },
] as const;

const COUNTRY_OPTIONS = [
  { value: "southAfrica", label: "South Africa" },
] as const;

const PROVINCE_OPTIONS = [
  { value: "gauteng", label: "Gauteng" },
  { value: "westernCape", label: "Western Cape" },
  { value: "kwazuluNatal", label: "KwaZulu-Natal" },
  { value: "easternCape", label: "Eastern Cape" },
  { value: "freeState", label: "Free State" },
  { value: "limpopo", label: "Limpopo" },
  { value: "mpumalanga", label: "Mpumalanga" },
  { value: "northWest", label: "North West" },
  { value: "northernCape", label: "Northern Cape" },
] as const;

interface FormInputProps {
  label: string;
  name: keyof FormValues;
  control: UseFormReturn<FormValues>["control"];
  placeholder: string;
  type?: string;
  required?: boolean;
  className?: string;
}

interface FormSelectProps {
  label: string;
  name: keyof FormValues;
  placeholder: string;
  options: readonly { value: string; label: string }[];
  control: UseFormReturn<FormValues>["control"];
  required?: boolean;
  className?: string;
}

// Pre-render select options components
const BranchOptionsContent = React.memo(() => (
  <>
    {BRANCH_OPTIONS.map(option => (
      <SelectItem key={option.value} value={option.value}>
        {option.label}
      </SelectItem>
    ))}
  </>
));
BranchOptionsContent.displayName = "BranchOptionsContent";

const CollectionOptionsContent = React.memo(() => (
  <>
    {COLLECTION_OPTIONS.map(option => (
      <SelectItem key={option.value} value={option.value}>
        {option.label}
      </SelectItem>
    ))}
  </>
));
CollectionOptionsContent.displayName = "CollectionOptionsContent";

const CountryOptionsContent = React.memo(() => (
  <>
    {COUNTRY_OPTIONS.map(option => (
      <SelectItem key={option.value} value={option.value}>
        {option.label}
      </SelectItem>
    ))}
  </>
));
CountryOptionsContent.displayName = "CountryOptionsContent";

const ProvinceOptionsContent = React.memo(() => (
  <>
    {PROVINCE_OPTIONS.map(option => (
      <SelectItem key={option.value} value={option.value}>
        {option.label}
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
  }: FormInputProps) => (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {required && "*"}
          </FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type={type}
              {...field}
              value={field.value?.toString() ?? ""}
            />
          </FormControl>
          <FormMessage />
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
    options,
    control,
    required,
    className,
  }: FormSelectProps) => {
    // Determine which options content component to use
    const OptionsContent = useMemo(() => {
      if (options === BRANCH_OPTIONS) return BranchOptionsContent;
      if (options === COLLECTION_OPTIONS) return CollectionOptionsContent;
      if (options === COUNTRY_OPTIONS) return CountryOptionsContent;
      if (options === PROVINCE_OPTIONS) return ProvinceOptionsContent;
      return null;
    }, [options]);

    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={className}>
            <FormLabel>
              {label}
              {required && "*"}
            </FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value?.toString()}
              defaultValue={field.value?.toString()}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {OptionsContent && <OptionsContent />}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
);
FormSelect.displayName = "FormSelect";

export const BillingDetails: React.FC<BillingDetailsProps> = React.memo(
  ({ form }) => {
    const { control } = form;

    return (
      <div className="bg-white shadow-2xl shadow-black rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-6">Billing Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormSelect
            label="Captivity Branch"
            name="captivityBranch"
            placeholder="Select branch"
            options={BRANCH_OPTIONS}
            control={control}
            required
            className="col-span-2 md:col-span-1"
          />

          <FormSelect
            label="Collection Method"
            name="methodOfCollection"
            placeholder="Select method"
            options={COLLECTION_OPTIONS}
            control={control}
            required
            className="col-span-2 md:col-span-1"
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
            options={COUNTRY_OPTIONS}
            control={control}
            required
          />

          <FormInput
            label="Street Address"
            name="streetAddress"
            control={control}
            placeholder="House number and street name"
            required
            className="col-span-2"
          />

          <FormInput
            label="Apartment, Suite, etc."
            name="apartmentSuite"
            control={control}
            placeholder="Apartment, suite, unit, etc."
            className="col-span-2"
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
            options={PROVINCE_OPTIONS}
            control={control}
            required
          />

          <FormInput
            label="Postcode / ZIP"
            name="postcode"
            control={control}
            placeholder="Postcode / ZIP"
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
          />
        </div>
      </div>
    );
  }
);

BillingDetails.displayName = "BillingDetails";

export default BillingDetails;
