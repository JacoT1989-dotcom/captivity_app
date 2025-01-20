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
import { ProductFormData } from "../types";

interface FeaturedImageTabProps {
  control: Control<ProductFormData>;
}

const FeaturedImageTab: React.FC<FeaturedImageTabProps> = ({ control }) => {
  const { watch, setValue } = useFormContext<ProductFormData>();

  const handleFeatureImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Create object URLs for preview
      const previewUrl = URL.createObjectURL(file);

      setValue(
        "featuredImage",
        {
          file: file, // Store the actual file
          thumbnail: previewUrl,
          medium: previewUrl,
          large: previewUrl,
        },
        {
          shouldValidate: true,
        }
      );

      console.log("Featured image file stored:", {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });
    } catch (error) {
      console.error("Error handling image upload:", error);
    }
  };

  React.useEffect(() => {
    // Cleanup object URLs when component unmounts
    return () => {
      const featuredImage = watch("featuredImage");
      if (featuredImage.thumbnail) {
        URL.revokeObjectURL(featuredImage.thumbnail);
        URL.revokeObjectURL(featuredImage.medium);
        URL.revokeObjectURL(featuredImage.large);
      }
    };
  }, [watch]);

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="featuredImage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Featured Image</FormLabel>
            <FormControl>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFeatureImageUpload}
                  className="cursor-pointer"
                />
                {field.value.thumbnail && (
                  <div className="relative w-16 h-16">
                    <Image
                      src={field.value.thumbnail}
                      alt="Featured image preview"
                      fill
                      className="object-cover rounded-md"
                      sizes="64px"
                    />
                  </div>
                )}
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
            </FormControl>
            <FormDescription>
              Upload the main product image. We&apos;ll automatically generate
              thumbnail, medium, and large versions.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Preview of all image sizes */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {watch("featuredImage.thumbnail") && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Thumbnail</p>
            <div className="relative aspect-square">
              <Image
                src={watch("featuredImage.thumbnail")}
                alt="Thumbnail preview"
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>
        )}
        {watch("featuredImage.medium") && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Medium</p>
            <div className="relative aspect-square">
              <Image
                src={watch("featuredImage.medium")}
                alt="Medium preview"
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>
        )}
        {watch("featuredImage.large") && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Large</p>
            <div className="relative aspect-square">
              <Image
                src={watch("featuredImage.large")}
                alt="Large preview"
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedImageTab;
