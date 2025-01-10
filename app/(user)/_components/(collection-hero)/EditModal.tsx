import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface CategoryHeroData {
  id: string;
  imageUrl: string;
  categoryName: string;
  title: string;
  backgroundColor: string;
  opacity: number;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage: string;
  currentData: CategoryHeroData;
  onSave: (formData: FormData) => Promise<void>;
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  currentImage,
  currentData,
  onSave,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState(currentImage);
  const [formData, setFormData] = useState({
    title: currentData.title,
    categoryName: currentData.categoryName,
    opacity: currentData.opacity,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when modal opens with new data
  useEffect(() => {
    setFormData({
      title: currentData.title,
      categoryName: currentData.categoryName,
      opacity: currentData.opacity,
    });
    setPreviewImage(currentImage);
    setSelectedFile(null);
    setError(null);
  }, [currentData, currentImage]);

  const handleImageSelection = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
    setSelectedFile(file);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!formData.categoryName.trim()) {
      setError("Category name is required");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    try {
      setError(null);
      if (!validateForm()) return;

      setIsSubmitting(true);
      const submitData = new FormData();

      // Always include the file if selected
      if (selectedFile) {
        submitData.append("image", selectedFile);
      }

      submitData.append("title", formData.title);
      submitData.append("categoryName", formData.categoryName);
      submitData.append("opacity", formData.opacity.toString());
      submitData.append(
        "backgroundColor",
        currentData.backgroundColor || "#000000"
      );

      await onSave(submitData);
      onClose();
    } catch (error) {
      console.error("Error saving hero:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while saving"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Edit Hero Banner</h2>
            <div className="space-y-4">
              {/* Preview Image */}
              <div className="relative h-[200px] bg-muted rounded cursor-pointer group">
                <div
                  className="absolute inset-0 bg-black z-10"
                  style={{ opacity: formData.opacity }}
                />
                {previewImage && (
                  <Image
                    src={previewImage}
                    alt="Preview"
                    fill
                    className="object-cover rounded"
                    sizes="100vw"
                  />
                )}
                <div
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = e => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleImageSelection(file);
                    };
                    input.click();
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                >
                  <p className="text-white text-sm">Click to change image</p>
                </div>
              </div>

              <div>
                <Label>Title</Label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter title"
                />
              </div>

              <div>
                <Label>Category Name</Label>
                <Input
                  type="text"
                  value={formData.categoryName}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      categoryName: e.target.value,
                    }))
                  }
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <Label>Overlay Opacity: {formData.opacity.toFixed(1)}</Label>
                <Slider
                  value={[formData.opacity]}
                  min={0}
                  max={1}
                  step={0.1}
                  onValueChange={([value]) =>
                    setFormData(prev => ({ ...prev, opacity: value }))
                  }
                  className="mt-2"
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                  {error}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={
                isSubmitting || !formData.title || !formData.categoryName
              }
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
