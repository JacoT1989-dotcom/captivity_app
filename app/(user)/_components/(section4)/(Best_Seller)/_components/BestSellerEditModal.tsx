import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { HighlightedProduct } from "@/app/(editor)/_editor-store/highlighted-products-store";

const MAX_FILE_SIZE = 6 * 1024 * 1024; // 6MB

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: HighlightedProduct;
  onUpdate: (id: string, formData: FormData) => Promise<void>;
}

interface FormState {
  title: string;
  price: number;
  rating: number;
  newImage: File | null;
  imagePreview: string;
}

export function BestSellerEditModal({
  isOpen,
  onClose,
  product,
  onUpdate,
}: EditModalProps) {
  const [formData, setFormData] = useState<FormState>({
    title: product.title,
    price: product.price,
    rating: product.rating,
    newImage: null,
    imagePreview: product.image,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData({
      title: product.title,
      price: product.price,
      rating: product.rating,
      newImage: null,
      imagePreview: product.image,
    });
    setError(null);
  }, [product, isOpen]);

  const handleFileSelect = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 6MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setFormData(prev => ({
      ...prev,
      newImage: file,
      imagePreview: URL.createObjectURL(file),
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("price", String(formData.price));
      submitData.append("rating", String(formData.rating));
      if (formData.newImage) {
        submitData.append("image", formData.newImage);
      }

      await onUpdate(product.id, submitData);
      onClose();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update product"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-2xl mx-4 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">Edit Best Seller</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={formData.imagePreview}
                    alt={formData.title}
                    fill
                    className="object-cover"
                  />
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-white text-sm">Change Image</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                      accept="image/*"
                      disabled={isSubmitting}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        price: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                    step="0.01"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <input
                    type="number"
                    value={formData.rating}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        rating: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                    max="5"
                    step="0.5"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}
