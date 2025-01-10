"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { ProductFormData, productFormSchema } from "./types";
import BasicInfoTab from "./_components/BasicInfoTab";
import DynamicPricingTab from "./_components/DynamicPricingTab";
import VariationsTab from "./_components/VariationsTab";
import FeaturedImageTab from "./_components/FeaturedImageTab";
import { createProduct } from "./actions";

const ProductForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
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

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Add basic info
      formData.append("productName", data.productName);
      formData.append("description", data.description);
      formData.append("sellingPrice", data.sellingPrice.toString());
      formData.append("isPublished", data.isPublished.toString());
      data.category.forEach(cat => formData.append("category[]", cat));

      // Add featured image if exists
      if (data.featuredImage.file) {
        formData.append("featuredImage", data.featuredImage.file);
      }

      // Add dynamic pricing
      data.dynamicPricing.forEach((price, index) => {
        formData.append(`dynamicPricing.${index}.from`, price.from);
        formData.append(`dynamicPricing.${index}.to`, price.to);
        formData.append(`dynamicPricing.${index}.type`, price.type);
        formData.append(`dynamicPricing.${index}.amount`, price.amount);
      });

      // Add variations with all sizes
      data.variations.forEach((variation, vIndex) => {
        formData.append(`variations.${vIndex}.name`, variation.name);
        formData.append(`variations.${vIndex}.color`, variation.color || "");
        if (variation.variationImage) {
          formData.append(
            `variations.${vIndex}.image`,
            variation.variationImage
          );
        }

        // Add all sizes for this variation
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

      const result = await createProduct(formData);

      if (result.success) {
        toast({
          title: "Success",
          description: "Product created successfully",
        });
        form.reset();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create product",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
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

  // Cleanup object URLs when component unmounts
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

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-2xl shadow-black">
      <CardHeader>
        <CardTitle>Create New Product</CardTitle>
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
                <BasicInfoTab control={form.control} />
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
                  // Clean up any existing object URLs before reset
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

export default ProductForm;
