// AddressSection.tsx
import { UseFormReturn } from "react-hook-form";
import {
  Form,
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
import { Button } from "@/components/ui/button";
import { UpdateAddressValues } from "../validation";

interface AddressSectionProps {
  form: UseFormReturn<UpdateAddressValues>;
  onSubmit: (data: UpdateAddressValues) => Promise<void>;
}

export const AddressSection = ({ form, onSubmit }: AddressSectionProps) => {
  return (
    <div className="bg-background text-foreground ">
      <h2 className="text-xl font-semibold mb-6 text-foreground">
        Address Information
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="streetAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">
                  Street Address
                </FormLabel>
                <FormControl>
                  <Input {...field} className="bg-background border-input" />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="addressLine2"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">
                  Address Line 2
                </FormLabel>
                <FormControl>
                  <Input {...field} className="bg-background border-input" />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="suburb"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Suburb</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-background border-input" />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="townCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Town/City</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-background border-input" />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Postcode</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-background border-input" />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Country</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background border-input">
                      <SelectValue
                        placeholder="Select country"
                        className="text-muted-foreground"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background border-input">
                    <SelectItem value="southAfrica">South Africa</SelectItem>
                    <SelectItem value="namibia">Namibia</SelectItem>
                    <SelectItem value="botswana">Botswana</SelectItem>
                    <SelectItem value="zimbabwe">Zimbabwe</SelectItem>
                    <SelectItem value="mozambique">Mozambique</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {form.formState.isSubmitting ? "Updating..." : "Update Address"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
