import React from "react";
import Image from "next/image";
import { Control, useFormContext } from "react-hook-form";
import { Upload } from "lucide-react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VendorProductFormData } from "../types";

interface FeaturedImageTabProps {
  control: Control<VendorProductFormData>;
}

const FeaturedImageTab: React.FC<FeaturedImageTabProps> = ({ control }) => {
  const { watch, setValue } = useFormContext<VendorProductFormData>();

  const handleFeatureImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const currentImage = watch("featuredImage");

      // If there are existing WordPress URLs, preserve them
      if (currentImage.thumbnail?.includes("wp-content/uploads")) {
        return;
      }

      // Revoke any existing blob URLs
      if (currentImage.thumbnail?.startsWith("blob:")) {
        URL.revokeObjectURL(currentImage.thumbnail);
        URL.revokeObjectURL(currentImage.medium);
        URL.revokeObjectURL(currentImage.large);
      }

      // Create preview URLs
      const previewUrl = URL.createObjectURL(file);

      setValue(
        "featuredImage",
        {
          file,
          thumbnail: previewUrl,
          medium: previewUrl,
          large: previewUrl,
        },
        {
          shouldValidate: true,
        }
      );
    } catch (error) {
      console.error("Error handling image upload:", error);
    }
  };

  // Function to check if URLs are WordPress URLs
  const isWordPressUrl = (url: string) => url?.includes("wp-content/uploads");

  React.useEffect(() => {
    return () => {
      const featuredImage = watch("featuredImage");
      if (featuredImage.thumbnail?.startsWith("blob:")) {
        URL.revokeObjectURL(featuredImage.thumbnail);
        URL.revokeObjectURL(featuredImage.medium);
        URL.revokeObjectURL(featuredImage.large);
      }
    };
  }, [watch]);

  const imageUrls = watch("featuredImage");
  const isWordPress = isWordPressUrl(imageUrls.thumbnail);

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="featuredImage"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">Featured Image</FormLabel>
            <FormControl>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {!isWordPress && (
                  <div className="w-full sm:w-auto">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFeatureImageUpload}
                      className="cursor-pointer w-full"
                    />
                  </div>
                )}
                {field.value.thumbnail && (
                  <div className="relative w-16 h-16 shrink-0">
                    <Image
                      src={field.value.thumbnail}
                      alt="Featured image preview"
                      fill
                      className="object-cover rounded-md"
                      sizes="64px"
                    />
                  </div>
                )}
                <Upload className="w-6 h-6 text-gray-400 hidden sm:block" />
              </div>
            </FormControl>
            {isWordPress && (
              <FormDescription className="text-sm mt-2 text-green-600">
                Using existing WordPress image
              </FormDescription>
            )}
            <FormDescription className="text-sm mt-2">
              {!isWordPress &&
                "Upload the main product image. We'll automatically generate thumbnail, medium, and large versions."}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {imageUrls.thumbnail && (
        <div className="space-y-4">
          <h3 className="text-base font-medium">Image Previews</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Thumbnail</p>
              <div className="relative aspect-square max-w-[200px] w-full">
                <Image
                  src={imageUrls.thumbnail}
                  alt="Thumbnail preview"
                  fill
                  className="object-cover rounded-md"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Medium</p>
              <div className="relative aspect-square max-w-[300px] w-full">
                <Image
                  src={imageUrls.medium}
                  alt="Medium preview"
                  fill
                  className="object-cover rounded-md"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Large</p>
              <div className="relative aspect-square max-w-[400px] w-full">
                <Image
                  src={imageUrls.large}
                  alt="Large preview"
                  fill
                  className="object-cover rounded-md"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {!imageUrls.thumbnail && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Upload a featured image for your product.
            This will be displayed prominently in your store and product
            listings.
          </p>
        </div>
      )}
    </div>
  );
};

export default FeaturedImageTab;
