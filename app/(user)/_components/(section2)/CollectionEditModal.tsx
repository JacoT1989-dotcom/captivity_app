"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { BaseCollection } from "@/app/(editor)/types";

const MAX_FILE_SIZE = 6 * 1024 * 1024;

const COLLECTION_LINKS = [
  {
    value: "/products/all-collections/signature-collection",
    label: "Signature Collection",
  },
  {
    value: "/products/all-collections/camo-collection",
    label: "Camo Collection",
  },
  {
    value: "/products/all-collections/winter-collection",
    label: "Winter Collection",
  },
  {
    value: "/products/all-collections/baseball-collection",
    label: "Baseball Collection",
  },
  {
    value: "/products/all-collections/fashion-collection",
    label: "Fashion Collection",
  },
  {
    value: "/products/all-collections/sport-collection",
    label: "Sport Collection",
  },
  {
    value: "/products/all-collections/industrial-collection",
    label: "Industrial Collection",
  },
  {
    value: "/products/all-collections/leisure-collection",
    label: "Leisure Collection",
  },
  {
    value: "/products/all-collections/kids-collection",
    label: "Kids Collection",
  },
  {
    value: "/products/all-collections/african-collection",
    label: "African Collection",
  },
];

interface CollectionEditModalProps {
  isOpen: boolean;
  collection: BaseCollection;
  onClose: () => void;
  onUpdate: (id: string, formData: FormData) => Promise<void>;
}

export function CollectionEditModal({
  isOpen,
  collection,
  onClose,
  onUpdate,
}: CollectionEditModalProps) {
  const [title, setTitle] = useState(collection.title);
  const [href, setHref] = useState(collection.href);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState<number>(4 / 5);

  useEffect(() => {
    setTitle(collection.title);
    setHref(collection.href);
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setIsDirty(false);

    if (collection.image) {
      const img = document.createElement("img");
      img.src = collection.image;
      img.onload = () => {
        setImageAspectRatio(img.width / img.height);
      };
    }
  }, [collection]);

  const handleFileSelect = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file (JPEG, PNG, or WebP)");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("File size must be less than 5MB");
        return;
      }

      if (previewUrl && previewUrl !== collection.image) {
        URL.revokeObjectURL(previewUrl);
      }

      const imageUrl = URL.createObjectURL(file);
      const img = document.createElement("img");
      img.src = imageUrl;
      img.onload = () => {
        setImageAspectRatio(img.width / img.height);
      };

      setSelectedFile(file);
      setPreviewUrl(imageUrl);
      setError(null);
      setIsDirty(true);
    },
    [previewUrl, collection.image]
  );

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl !== collection.image) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, collection.image]);

  const handleInputChange = (field: string, value: string) => {
    setError(null);
    setIsDirty(true);

    switch (field) {
      case "title":
        setTitle(value);
        break;
      case "href":
        setHref(value);
        break;
    }
  };

  const validateInputs = () => {
    if (!title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!href) {
      setError("Please select a collection link");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    try {
      setIsUpdating(true);
      setError(null);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("href", href);

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      await onUpdate(collection.id, formData);
      onClose();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update collection"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        "Are you sure you want to discard your changes?"
      );
      if (!confirmed) return;
    }

    if (previewUrl && previewUrl !== collection.image) {
      URL.revokeObjectURL(previewUrl);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background dark:bg-card w-full max-w-4xl mx-4 rounded-lg">
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Preview */}
          <div className="w-full lg:w-1/2 p-6 border-b lg:border-b-0 lg:border-r border-border">
            <h2 className="text-xl text-gray-700 dark:text-card-foreground">
              Preview
            </h2>
            <div
              className="w-full mt-4"
              style={{
                paddingBottom: `${(1 / imageAspectRatio) * 100}%`,
                position: "relative",
              }}
            >
              <div className="absolute inset-0 bg-muted dark:bg-muted rounded cursor-pointer">
                {previewUrl || collection.image ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={previewUrl || collection.image}
                      alt="Collection preview"
                      fill
                      style={{
                        objectFit: "contain",
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                      }}
                      priority
                      sizes="50vw"
                      unoptimized={previewUrl?.startsWith("blob:")}
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-muted-foreground">No image selected</p>
                  </div>
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                    accept="image/jpeg,image/png,image/webp"
                    disabled={isUpdating}
                  />
                  <span className="text-white text-lg">Change image</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full lg:w-1/2 p-6 bg-muted dark:bg-secondary">
            <h2 className="text-xl text-gray-700 dark:text-card-foreground">
              Edit Details
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-muted-foreground">
              Update your collection details and appearance
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-muted-foreground mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => handleInputChange("title", e.target.value)}
                  className="w-full p-2 border border-input dark:border-input bg-background dark:bg-card rounded"
                  placeholder="Enter collection title"
                  disabled={isUpdating}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 dark:text-muted-foreground mb-1">
                  Collection Link
                </label>
                <select
                  value={href}
                  onChange={e => handleInputChange("href", e.target.value)}
                  className="w-full p-2 border border-input dark:border-input bg-background dark:bg-card rounded"
                  disabled={isUpdating}
                >
                  <option value="">Select a collection link</option>
                  {COLLECTION_LINKS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive rounded">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-border bg-muted dark:bg-secondary">
          <button
            onClick={handleCancel}
            disabled={isUpdating}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {isDirty ? "You have unsaved changes" : "No changes made"}
            </span>
            <button
              onClick={handleSubmit}
              disabled={isUpdating || !isDirty}
              className="px-4 py-2 text-sm text-primary-foreground bg-primary rounded disabled:opacity-50"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
