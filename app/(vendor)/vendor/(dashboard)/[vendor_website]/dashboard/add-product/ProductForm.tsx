"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { VendorProductFormData, vendorProductFormSchema } from "./types";
import { createVendorProduct } from "./actions";
import { useSession } from "@/app/(vendor)/SessionProvider";
import { useParams, useRouter } from "next/navigation";
import BasicInfoTab from "./_components/BasicInfoTab";
import DynamicPricingTab from "./_components/DynamicPricingTab";
import VariationsTab from "./_components/VariationsTab";
import FeaturedImageTab from "./_components/FeaturedImageTab";

const VendorProductForm = () => {
  const params = useParams();
  const vendorWebsite = params?.vendor_website as string;
  const session = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Redirect if no session or not a vendor
  React.useEffect(() => {
    if (!session || session?.user?.role !== "VENDOR") {
      router.push(`/vendor/${vendorWebsite}`);
    }
  }, [session, router, vendorWebsite]);

  const form = useForm<VendorProductFormData>({
    resolver: zodResolver(vendorProductFormSchema),
    defaultValues: {
      productName: "",
      category: [],
      description: "",
      sellingPrice: 0,
      isPublished: true,
      dynamicPricing: [
        {
          from: "",
          to: "",
          type: "fixed_price",
          amount: "",
        },
      ],
      variations: [
        {
          name: "",
          color: "",
          variationImageURL: "",
          variationImage: undefined,
          sizes: [
            {
              size: "",
              quantity: 0,
              sku: "",
              sku2: "",
            },
          ],
        },
      ],
      featuredImage: {
        file: undefined,
        thumbnail: "",
        medium: "",
        large: "",
      },
    },
  });

  const onSubmit = async (data: VendorProductFormData) => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create products",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Add vendor ID from session
      formData.append("vendorId", session.user.id);

      // Add basic info
      formData.append("productName", data.productName);
      formData.append("description", data.description);
      formData.append("sellingPrice", data.sellingPrice.toString());
      formData.append("isPublished", data.isPublished.toString());
      data.category.forEach(cat => formData.append("category[]", cat));

      // Handle featured image
      if (data.featuredImage.file) {
        formData.append("featuredImage", data.featuredImage.file);
        // If WordPress URLs exist, append them
        if (data.featuredImage.thumbnail.includes("wp-content/uploads")) {
          formData.append(
            "featuredImage.thumbnail",
            data.featuredImage.thumbnail
          );
          formData.append("featuredImage.medium", data.featuredImage.medium);
          formData.append("featuredImage.large", data.featuredImage.large);
        }
      } else if (data.featuredImage.thumbnail) {
        // If no file but URLs exist (like WordPress URLs)
        formData.append(
          "featuredImage.thumbnail",
          data.featuredImage.thumbnail
        );
        formData.append("featuredImage.medium", data.featuredImage.medium);
        formData.append("featuredImage.large", data.featuredImage.large);
      }

      // Add dynamic pricing
      data.dynamicPricing.forEach((price, index) => {
        formData.append(`dynamicPricing.${index}.from`, price.from);
        formData.append(`dynamicPricing.${index}.to`, price.to);
        formData.append(`dynamicPricing.${index}.type`, price.type);
        formData.append(`dynamicPricing.${index}.amount`, price.amount);
      });

      // Add variations
      data.variations.forEach((variation, vIndex) => {
        formData.append(`variations.${vIndex}.name`, variation.name);
        formData.append(`variations.${vIndex}.color`, variation.color || "");

        // Handle variation images
        if (variation.variationImage) {
          formData.append(
            `variations.${vIndex}.image`,
            variation.variationImage
          );
        }
        if (variation.variationImageURL) {
          formData.append(
            `variations.${vIndex}.variationImageURL`,
            variation.variationImageURL
          );
        }

        // Add sizes for each variation
        variation.sizes.forEach((size, sIndex) => {
          formData.append(
            `variations.${vIndex}.sizes.${sIndex}.size`,
            size.size
          );
          formData.append(
            `variations.${vIndex}.sizes.${sIndex}.quantity`,
            size.quantity.toString()
          );
          formData.append(`variations.${vIndex}.sizes.${sIndex}.sku`, size.sku);
          if (size.sku2) {
            formData.append(
              `variations.${vIndex}.sizes.${sIndex}.sku2`,
              size.sku2
            );
          }
        });
      });

      const result = await createVendorProduct(formData);

      if (result.success) {
        toast({
          title: "Success",
          description: "Product created successfully",
        });
        // Clean up blob URLs before resetting form
        const formData = form.getValues();
        formData.variations.forEach(variation => {
          if (variation.variationImageURL?.startsWith("blob:")) {
            URL.revokeObjectURL(variation.variationImageURL);
          }
        });
        if (formData.featuredImage.thumbnail.startsWith("blob:")) {
          URL.revokeObjectURL(formData.featuredImage.thumbnail);
          URL.revokeObjectURL(formData.featuredImage.medium);
          URL.revokeObjectURL(formData.featuredImage.large);
        }
        form.reset();
        router.push(
          `/vendor/${vendorWebsite}/shopping/product_categories/summer`
        );
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create product",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Form Submission Error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup effect for blob URLs
  React.useEffect(() => {
    return () => {
      const formData = form.getValues();
      formData.variations.forEach(variation => {
        if (variation.variationImageURL?.startsWith("blob:")) {
          URL.revokeObjectURL(variation.variationImageURL);
        }
      });
      if (formData.featuredImage.thumbnail.startsWith("blob:")) {
        URL.revokeObjectURL(formData.featuredImage.thumbnail);
        URL.revokeObjectURL(formData.featuredImage.medium);
        URL.revokeObjectURL(formData.featuredImage.large);
      }
    };
  }, [form]);

  // If not authenticated or not a vendor, don't render the form
  if (!session || session?.user?.role !== "VENDOR") {
    return null;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl mt-8 mb-5">
      <CardHeader>
        <CardTitle>Create New Vendor Product</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            encType="multipart/form-data"
          >
            <Tabs defaultValue="basic-info" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                <TabsTrigger value="dynamic-pricing">Pricing</TabsTrigger>
                <TabsTrigger value="variations">Variations</TabsTrigger>
                <TabsTrigger value="featured-image">Images</TabsTrigger>
              </TabsList>

              <TabsContent value="basic-info">
                <BasicInfoTab control={form.control} setValue={form.setValue} />
              </TabsContent>

              <TabsContent value="dynamic-pricing">
                <DynamicPricingTab control={form.control} />
              </TabsContent>

              <TabsContent value="variations">
                <VariationsTab control={form.control} />
              </TabsContent>

              <TabsContent value="featured-image">
                <FeaturedImageTab control={form.control} />
              </TabsContent>
            </Tabs>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Product...
                  </div>
                ) : (
                  "Create Product"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => {
                  const formData = form.getValues();
                  // Clean up blob URLs before reset
                  formData.variations.forEach(variation => {
                    if (variation.variationImageURL?.startsWith("blob:")) {
                      URL.revokeObjectURL(variation.variationImageURL);
                    }
                  });
                  if (formData.featuredImage.thumbnail.startsWith("blob:")) {
                    URL.revokeObjectURL(formData.featuredImage.thumbnail);
                    URL.revokeObjectURL(formData.featuredImage.medium);
                    URL.revokeObjectURL(formData.featuredImage.large);
                  }
                  form.reset();
                }}
              >
                Reset Form
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default VendorProductForm;
