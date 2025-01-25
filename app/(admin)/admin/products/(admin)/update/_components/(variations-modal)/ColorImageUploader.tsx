import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, ImageOff } from "lucide-react";
import Image from "next/image";
import { updateVariationImagesForColor } from "../../product-actions";
import { Product, Variation } from "../../types";

interface ColorImageUploaderProps {
  color: string;
  masterImage?: string;
  product: Product;
  onUpdateComplete: () => Promise<void>;
  addDebugLog: (message: string) => void;
}

const ColorImageUploader: React.FC<ColorImageUploaderProps> = ({
  color,
  masterImage,
  product,
  onUpdateComplete,
  addDebugLog,
}) => {
  const [processingImage, setProcessingImage] = useState<boolean>(false);

  const handleColorImageUpload = async (file: File) => {
    setProcessingImage(true);

    try {
      const colorVariations = product.variations.filter(v => v.color === color);
      addDebugLog(
        `Found ${colorVariations.length} variations to update for color ${color}`
      );

      const base64 = await new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const result = await updateVariationImagesForColor(
        product.id,
        colorVariations,
        base64,
        file.type
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      await onUpdateComplete();
      addDebugLog("Successfully updated all variations");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      addDebugLog(`Error updating images: ${errorMessage}`);
      console.error("Image upload error:", error);
    } finally {
      setProcessingImage(false);
    }
  };

  return (
    <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden border">
      {masterImage ? (
        <Image
          src={masterImage}
          alt={`${color} master image`}
          fill
          className="object-contain p-2"
          sizes="96px"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <ImageOff className="h-6 w-6 text-gray-400" />
          <span className="text-xs text-gray-500 mt-1">No image</span>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id={`color-image-${color}`}
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleColorImageUpload(file);
        }}
      />
      <Button
        variant="ghost"
        size="sm"
        className="absolute bottom-1 right-1 bg-white/80 hover:bg-white"
        onClick={() => document.getElementById(`color-image-${color}`)?.click()}
        disabled={processingImage}
      >
        <Edit2 className="h-3 w-3" />
        {processingImage && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/80">
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
          </span>
        )}
      </Button>
    </div>
  );
};

export default ColorImageUploader;
