// BusinessSection.tsx
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
import { UpdateBusinessInfoValues } from "../validation";

interface BusinessSectionProps {
  form: UseFormReturn<UpdateBusinessInfoValues>;
  onSubmit: (data: UpdateBusinessInfoValues) => Promise<void>;
}

export const BusinessSection = ({ form, onSubmit }: BusinessSectionProps) => {
  return (
    <div className="bg-background text-foreground">
      <h2 className="text-xl font-semibold mb-6 text-foreground">
        Business Information
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Company Name</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-background border-input" />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="natureOfBusiness"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">
                  Nature of Business
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background border-input">
                      <SelectValue
                        placeholder="Select nature of business"
                        className="text-muted-foreground"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background border-input">
                    <SelectItem value="distributors">Distributors</SelectItem>
                    <SelectItem value="retailer">Retailer</SelectItem>
                    <SelectItem value="manufacturer">Manufacturer</SelectItem>
                    <SelectItem value="service">Service Provider</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentSupplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">
                  Current Supplier
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background border-input">
                      <SelectValue
                        placeholder="Select current supplier"
                        className="text-muted-foreground"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background border-input">
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="supplier1">Supplier 1</SelectItem>
                    <SelectItem value="supplier2">Supplier 2</SelectItem>
                    <SelectItem value="supplier3">Supplier 3</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          {form.watch("currentSupplier") === "other" && (
            <FormField
              control={form.control}
              name="otherSupplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Other Supplier
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-background border-input" />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
          )}

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {form.formState.isSubmitting
              ? "Updating..."
              : "Update Business Information"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
