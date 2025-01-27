"use client"
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { ProductFormData, productFormSchema } from "./types";
import BasicInfoTab from "./_components/BasicInfoTab";
import DynamicPricingTab from "./_components/DynamicPricingTab";
import VariationsTab from "./_components/VariationsTab";
import FeaturedImageTab from "./_components/FeaturedImageTab";
import { createProduct } from "./actions";
import { toast } from "sonner";

const PRESET_RANGES = [
  { from: "1", to: "24" },
  { from: "25", to: "100" },
  { from: "101", to: "600" },
  { from: "601", to: "2000" },
];

const ProductForm = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("basic-info");

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      productName: "",
      category: [],
      description: "",
      sellingPrice: 0,
      isPublished: true,
      dynamicPricing: PRESET_RANGES.map(range => ({
        from: range.from,
        to: range.to,
        type: "fixed_price",
        amount: "",
      })),
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

      // Add featured image
      if (data.featuredImage.file instanceof File) {
        formData.append("featuredImage", data.featuredImage.file);
      } else if (data.featuredImage.thumbnail) {
        formData.append(
          "featuredImage.thumbnail",
          data.featuredImage.thumbnail
        );
        formData.append("featuredImage.medium", data.featuredImage.medium);
        formData.append("featuredImage.large", data.featuredImage.large);
      }

      // Add dynamic pricing - ensure all required fields are present
      data.dynamicPricing.forEach((price, index) => {
        if (!price.from || !price.to || !price.amount) {
          throw new Error("Please fill in all pricing fields");
        }
        formData.append(`dynamicPricing.${index}.from`, price.from);
        formData.append(`dynamicPricing.${index}.to`, price.to);
        formData.append(`dynamicPricing.${index}.type`, price.type);
        formData.append(`dynamicPricing.${index}.amount`, price.amount);
      });

      // Validate variations
      if (!data.variations.length) {
        throw new Error("At least one variation is required");
      }

      // Add variations
      data.variations.forEach((variation, vIndex) => {
        // Validate variation fields
        if (!variation.name || !variation.sizes.length) {
          throw new Error("Please fill in all variation details");
        }

        formData.append(`variations.${vIndex}.name`, variation.name);
        formData.append(`variations.${vIndex}.color`, variation.color || "");

        // Handle variation image
        if (variation.variationImage instanceof File) {
          formData.append(
            `variations.${vIndex}.variationImage`,
            variation.variationImage
          );
        } else if (variation.variationImageURL) {
          formData.append(
            `variations.${vIndex}.variationImageURL`,
            variation.variationImageURL
          );
        }

        // Validate and add sizes for each variation
        variation.sizes.forEach((size, sIndex) => {
          if (!size.size || !size.sku) {
            throw new Error("Please fill in all size details");
          }

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
        toast.success("Product created successfully");
        form.reset();
        // Optional: Redirect to products list
        // window.location.href = "/products";
      } else {
        toast.error(result.error || "Failed to create product");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create product"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup images when component unmounts
  React.useEffect(() => {
    return () => {
      const formData = form.getValues();
      // Cleanup featured image
      if (formData.featuredImage.thumbnail?.startsWith("blob:")) {
        URL.revokeObjectURL(formData.featuredImage.thumbnail);
        URL.revokeObjectURL(formData.featuredImage.medium);
        URL.revokeObjectURL(formData.featuredImage.large);
      }
      // Cleanup variation images
      formData.variations.forEach(variation => {
        if (variation.variationImageURL?.startsWith("blob:")) {
          URL.revokeObjectURL(variation.variationImageURL);
        }
      });
    };
  }, [form]);

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-2xl shadow-black">
      <CardHeader>
        <CardTitle>Create New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs
              defaultValue="basic-info"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
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
                onClick={() => form.reset()}
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
