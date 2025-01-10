"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Loader2, SquareArrowLeft } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "../../../SessionProvider";
import { getUserDetails, updateBillingAddress } from "./actions";
import * as z from "zod";
import { SessionUser } from "../types";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "../../_components/Header";
import billingAddressSchema, { FormValues } from "../validation";

export default function BillingAddressForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useSession() as { user: SessionUser | null };
  const [isLoadingPreviousOrder, setIsLoadingPreviousOrder] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(billingAddressSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      companyName: "",
      countryRegion: "",
      streetAddress: "",
      apartmentSuite: "",
      townCity: "",
      province: "",
      postcode: "",
      phone: "",
      email: "",
    },
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const result = await getUserDetails();

        if (result.success && result.data) {
          form.reset({
            ...form.getValues(),
            firstName: result.data.firstName || "",
            lastName: result.data.lastName || "",
            email: result.data.email || "",

            phone: result.data.phoneNumber?.toString() || "",
            companyName: result.data.companyName || "",
            countryRegion: result.data.country || "",
            streetAddress: result.data.streetAddress || "",
            apartmentSuite: result.data.addressLine2 || "",
            townCity: result.data.townCity || "",
            province: result.data.suburb || "",
            postcode: result.data.postcode || "",
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoadingPreviousOrder(false);
      }
    };

    loadUserData();
  }, [form]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await updateBillingAddress(data);

      if (result.success) {
        toast({
          title: "Success",
          description: "Billing address has been updated successfully.",
          variant: "default",
          duration: 5000,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update billing address.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20">
      <Header />
      <div className="flex items-center justify-between mb-6 ">
        <span>
          {" "}
          <h2 className="text-2xl font-bold text-red-500 ">Billing Address</h2>
          <span>
            {isLoadingPreviousOrder && <span>Loading previous data...</span>}
          </span>
        </span>
        <span className="hover:bg-neutral-100 p-2">
          <Link href="/customer/address-info">
            {" "}
            <SquareArrowLeft />
          </Link>
        </span>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 border p-5 mb-20 border-gray-700 rounded-lg"
        >
          {/* Rest of the form JSX remains the same */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First name <span className="text-red-500">*</span>
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
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Last name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Company name <span className="text-red-500">*</span>
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
            name="countryRegion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country / Region*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country/region" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="southAfrica">South Africa</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="streetAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Street address <span className="text-red-500">*</span>
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
            name="apartmentSuite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apartment, suite, unit, etc. (optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="townCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Town / City <span className="text-red-500">*</span>
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
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="gauteng">Gauteng</SelectItem>
                      <SelectItem value="westernCape">Western Cape</SelectItem>
                      <SelectItem value="kwazuluNatal">
                        KwaZulu-Natal
                      </SelectItem>
                      <SelectItem value="easternCape">Eastern Cape</SelectItem>
                      <SelectItem value="freeState">Free State</SelectItem>
                      <SelectItem value="limpopo">Limpopo</SelectItem>
                      <SelectItem value="mpumalanga">Mpumalanga</SelectItem>
                      <SelectItem value="northWest">North West</SelectItem>
                      <SelectItem value="northernCape">
                        Northern Cape
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Postal code <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Phone <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} type="tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email address <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            variant="destructive"
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving changes...
              </>
            ) : (
              "Save address"
            )}
          </Button>
        </form>
      </Form>
    </section>
  );
}
