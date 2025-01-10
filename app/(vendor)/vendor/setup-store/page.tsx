"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { setupStore } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion as m } from "framer-motion";
import { Store, Building2, ArrowRight, Globe } from "lucide-react";

const storeFormSchema = z.object({
  storeName: z.string().min(3, "Store name must be at least 3 characters"),
  storeSlug: z
    .string()
    .min(3, "Store URL must be at least 3 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Only lowercase letters, numbers, and hyphens allowed"
    ),
  storeDescription: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  storePhoneNumber: z.string().min(10, "Please enter a valid phone number"),
  storeContactEmail: z.string().email("Please enter a valid email"),
  customDomain: z
    .string()
    .regex(
      /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/,
      "Invalid domain format. Only lowercase letters, numbers, hyphens, and dots allowed"
    )
    .optional()
    .nullable(),
});

type StoreFormValues = z.infer<typeof storeFormSchema>;

export default function SetupStorePage() {
  const router = useRouter();
  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      storeName: "",
      storeSlug: "",
      storeDescription: "",
      storePhoneNumber: "",
      storeContactEmail: "",
      customDomain: "",
    },
  });

  async function onSubmit(data: StoreFormValues) {
    try {
      const result = await setupStore(data);
      if (result.success) {
        toast.success("Store setup successful!");
        router.push("/vendor/" + data.storeSlug);
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to setup store");
    }
  }

  const handleLowercaseInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    const value = e.target.value.toLowerCase();
    field.onChange(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto min-h-screen flex items-center gap-8 px-4">
        <m.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 max-w-xl"
        >
          <div className="space-y-6">
            <Store className="w-16 h-16 text-primary" />
            <h1 className="text-5xl font-bold tracking-tight">
              Set Up Your
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 mt-2">
                Business Store
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Take your first step towards digital success. Create your store
              profile and start reaching customers today.
            </p>

            <div className="flex items-center gap-4 pt-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <span className="text-lg">
                Join our growing merchant community
              </span>
            </div>

            <div className="bg-secondary/10 p-6 rounded-lg backdrop-blur-sm mt-8">
              <h3 className="font-semibold mb-2">Ready to begin?</h3>
              <p className="text-muted-foreground">
                Fill out the form to create your customized store profile.
              </p>
            </div>
          </div>
        </m.div>

        <m.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex-1 max-w-xl"
        >
          <div className="bg-card border rounded-xl shadow-xl p-8 backdrop-blur-sm">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="storeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Awesome Store" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="storeSlug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Store URL - Combine the store name with hyphens if more
                        than one word
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="my-awesome-store"
                            onChange={e => handleLowercaseInput(e, field)}
                            value={field.value}
                            onBlur={field.onBlur}
                            name={field.name}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customDomain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Custom Domain
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="www.yourdomain.co.za"
                          onChange={e => handleLowercaseInput(e, field)}
                          value={field.value || ""}
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                      </FormControl>
                      <p className="text-sm text-muted-foreground">
                        Enter your domain - www.my-awesome-store.co.za
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="storeDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your store..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="storePhoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="storeContactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Setup Store
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </Form>
          </div>
        </m.div>
      </div>
    </div>
  );
}
