import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";
import Image from "next/image";

const MAX_FILE_SIZE = 6 * 1024 * 1024; // 6MB

interface OnSaleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  error?: string | null;
}

const initialFormState = {
  title: "",
  price: "",
  salePrice: "",
  rating: "0",
  selectedFile: null as File | null,
  previewUrl: null as string | null,
};

export function OnSaleFormModal({
  isOpen,
  onClose,
  onSubmit,
  error: externalError,
}: OnSaleFormModalProps) {
  const [title, setTitle] = useState(initialFormState.title);
  const [price, setPrice] = useState(initialFormState.price);
  const [salePrice, setSalePrice] = useState(initialFormState.salePrice);
  const [rating, setRating] = useState(initialFormState.rating);
  const [selectedFile, setSelectedFile] = useState(
    initialFormState.selectedFile
  );
  const [previewUrl, setPreviewUrl] = useState(initialFormState.previewUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal is opened/closed
  useEffect(() => {
    if (!isOpen) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setTitle(initialFormState.title);
      setPrice(initialFormState.price);
      setSalePrice(initialFormState.salePrice);
      setRating(initialFormState.rating);
      setSelectedFile(initialFormState.selectedFile);
      setPreviewUrl(initialFormState.previewUrl);
      setError(null);
      setIsUploading(false);
    }
  }, [isOpen, previewUrl]);

  useEffect(() => {
    if (externalError) {
      setError(externalError);
      setIsUploading(false);
    }
  }, [externalError]);

  const handleFileSelect = useCallback(
    (file: File) => {
      setError(null);

      if (file.size > MAX_FILE_SIZE) {
        setError("File size must be less than 6MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("File must be an image");
        return;
      }

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    },
    [previewUrl]
  );

  const handleSubmit = async () => {
    if (!selectedFile || !title || !price || !salePrice) {
      setError("All fields are required");
      return;
    }

    if (parseFloat(salePrice) >= parseFloat(price)) {
      setError("Sale price must be less than regular price");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("title", title);
      formData.append("price", price);
      formData.append("salePrice", salePrice);
      formData.append("rating", rating);

      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to upload product"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <div className="w-full bg-gray-50 rounded-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Add Sale Item
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Add a new product to your on-sale collection
            </p>
          </div>

          <div className="p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="h-64 relative bg-gray-100 rounded-lg">
                {previewUrl ? (
                  <div className="relative w-full h-full group">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
                      <input
                        type="file"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect(file);
                        }}
                        accept="image/*"
                        disabled={isUploading}
                      />
                      <span className="text-white text-sm font-medium">
                        Change image
                      </span>
                    </label>
                  </div>
                ) : (
                  <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                      accept="image/*"
                      disabled={isUploading}
                    />
                    <Plus className="h-8 w-8 text-gray-400" />
                    <div className="mt-4 text-center">
                      <span className="text-sm font-medium text-gray-900">
                        Upload image
                      </span>
                      <p className="mt-1 text-xs text-gray-500">
                        Maximum size: 6MB
                      </p>
                    </div>
                  </label>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter product title"
                    disabled={isUploading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Regular Price
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter regular price"
                    min="0"
                    step="0.01"
                    disabled={isUploading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Sale Price
                  </label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={e => setSalePrice(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter sale price"
                    min="0"
                    step="0.01"
                    disabled={isUploading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rating
                  </label>
                  <input
                    type="number"
                    value={rating}
                    onChange={e => setRating(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="5"
                    step="0.5"
                    disabled={isUploading}
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 border-t bg-white">
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                disabled={isUploading}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  isUploading || !selectedFile || !title || !price || !salePrice
                }
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {isUploading ? "Uploading..." : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
