import React, { useState } from "react";
import { Plus } from "lucide-react";

interface UniversalEmptyUploadProps {
  onUpload: (formData: FormData) => Promise<void>;
  collectionType: "collection" | "category";
  customTitle?: string;
  customIdentifier?: string;
}

export const UniversalEmptyUpload: React.FC<UniversalEmptyUploadProps> = ({
  onUpload,
  collectionType,
  customTitle = "",
  customIdentifier = "",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setIsUploading(true);
      setError(null);
      await onUpload(formData);
    } catch (error) {
      console.error("Error uploading:", error);
      setError(
        error instanceof Error ? error.message : "Error uploading image"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full h-[300px] bg-muted/20 rounded-lg mb-8 flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Plus className="w-6 h-6 text-muted-foreground" />
        </div>
        <button
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = e => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) handleFileSelect(file);
            };
            input.click();
          }}
          disabled={isUploading}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isUploading
            ? "Uploading..."
            : `Add ${customTitle || collectionType} Banner`}
        </button>
        <p className="text-xs text-muted-foreground mt-2">
          Recommended size: 1920x300px
        </p>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default UniversalEmptyUpload;
