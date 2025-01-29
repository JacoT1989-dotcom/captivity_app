import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RegistrationFormData } from "@/lib/validation";

interface CompanyDetailsSectionProps {
  form: UseFormReturn<RegistrationFormData>;
}

const CompanyDetailsSection = ({ form }: CompanyDetailsSectionProps) => {
  return (
    <div className="border p-4">
      <h2 className="text-lg font-semibold mb-4">Company Details</h2>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Company Name *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">First Name *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vatNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">VAT Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Last Name *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ckNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">CK Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Phone Number *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currentSupplier"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">
                Who are you currently buying from? *
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select current supplier" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="supplier1">Supplier 1</SelectItem>
                  <SelectItem value="supplier2">Supplier 2</SelectItem>
                  <SelectItem value="supplier3">Supplier 3</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("currentSupplier") === "other" && (
          <FormField
            control={form.control}
            name="otherSupplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Other Supplier</FormLabel>
                <FormControl>
                  <Input placeholder="Specify other supplier" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">
                Position held in company
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">
                Website or Social Media Page *
              </FormLabel>
              <FormControl>
                <Input placeholder="www.yourcompany.co.za" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="natureOfBusiness"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">
                Nature of Business *
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select nature of business" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="distributors">Distributors</SelectItem>
                  <SelectItem value="retailer">Retailer</SelectItem>
                  <SelectItem value="manufacturer">Manufacturer</SelectItem>
                  <SelectItem value="service">Service Provider</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resellingLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">
                Where would you be reselling our products? *
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Address Fields */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="streetAddress"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="text-gray-700">Street Address *</FormLabel>
              <FormControl>
                <Input placeholder="House number and street name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addressLine2"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="text-gray-700">
                Address line 2 (Optional)
              </FormLabel>
              <FormControl>
                <Input placeholder="Apartment, suite, unit, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="suburb"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Suburb *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="townCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Town / City *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="postcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Postcode / ZIP *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Country *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="southAfrica">South Africa</SelectItem>
                  <SelectItem value="namibia">Namibia</SelectItem>
                  <SelectItem value="botswana">Botswana</SelectItem>
                  <SelectItem value="zimbabwe">Zimbabwe</SelectItem>
                  <SelectItem value="mozambique">Mozambique</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default CompanyDetailsSection;
