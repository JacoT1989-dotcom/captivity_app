import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface EditModalProps {
  isEditing: boolean;
  editData: {
    title: string;
    subtitle: string;
    backgroundColor: string;
    cta: string;
  };
  currentImage: string;
  onCancel: () => void;
  onSave: () => void;
  onImageUpload: (file: File) => void;
  onEditDataChange: (data: Partial<EditModalProps["editData"]>) => void;
  onInputBlur?: () => void;
}

const COLLECTION_LINKS = [
  {
    href: "/products/all-collections/signature",
    name: "Signature",
    display: "Signature",
  },
  { href: "/products/all-collections/camo", name: "Camo", display: "Camo" },
  {
    href: "/products/all-collections/winter",
    name: "Winter",
    display: "Winter",
  },
  {
    href: "/products/all-collections/baseball",
    name: "Baseball",
    display: "Baseball",
  },
  {
    href: "/products/all-collections/fashion",
    name: "Fashion",
    display: "Fashion",
  },
  { href: "/products/all-collections/sport", name: "Sport", display: "Sport" },
  {
    href: "/products/all-collections/industrial",
    name: "Industrial",
    display: "Industrial",
  },
  {
    href: "/products/all-collections/leisure",
    name: "Leisure",
    display: "Leisure",
  },
  { href: "/products/all-collections/kids", name: "Kids", display: "Kids" },
  {
    href: "/products/all-collections/african",
    name: "African",
    display: "African",
  },
];

// Helper function to get display name from href
const getDisplayNameFromHref = (href: string): string => {
  const collection = COLLECTION_LINKS.find(link => link.href === href);
  return collection ? collection.display : "";
};

const EditModal = ({
  isEditing,
  editData,
  currentImage,
  onCancel,
  onSave,
  onImageUpload,
  onEditDataChange,
  onInputBlur,
}: EditModalProps) => {
  const [previewImage, setPreviewImage] = useState<string>(currentImage);
  const [imageAspectRatio, setImageAspectRatio] = useState<number>(16 / 9);

  useEffect(() => {
    if (currentImage) {
      setPreviewImage(currentImage);
      const img = document.createElement("img");
      img.src = currentImage;
      img.onload = () => {
        setImageAspectRatio(img.width / img.height);
      };
    }
  }, [currentImage]);

  const handleImageSelection = useCallback(
    (file: File) => {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);

      const img = document.createElement("img");
      img.src = imageUrl;
      img.onload = () => {
        setImageAspectRatio(img.width / img.height);
      };

      onImageUpload(file);
    },
    [onImageUpload]
  );

  const handleHexColorChange = (value: string) => {
    const hexValue = value.startsWith("#") ? value : `#${value}`;
    if (hexValue === "#" || /^#[0-9A-Fa-f]{0,6}$/.test(hexValue)) {
      onEditDataChange({ backgroundColor: hexValue });
    }
  };

  const handleHexColorBlur = (value: string) => {
    let hexValue = value;
    if (!hexValue.startsWith("#")) hexValue = `#${hexValue}`;
    while (hexValue.length < 7) hexValue += "0";
    onEditDataChange({ backgroundColor: hexValue });
    onInputBlur?.();
  };

  useEffect(() => {
    return () => {
      if (previewImage && previewImage !== currentImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage, currentImage]);

  if (!isEditing) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8 mb-10">
      <div className="bg-white dark:bg-card rounded-lg w-full max-w-5xl max-h-[80vh] overflow-y-auto">
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Image Preview */}
          <div className="lg:w-1/2 p-6 border-b lg:border-b-0 lg:border-r dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 dark:text-card-foreground">
              Preview
            </h2>
            <div
              className="w-full"
              style={{
                paddingBottom: `${(1 / imageAspectRatio) * 100}%`,
                position: "relative",
              }}
            >
              <div className="absolute inset-0 bg-gray-100 dark:bg-muted rounded cursor-pointer group">
                {previewImage ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={previewImage}
                      alt="Slide preview"
                      fill={true}
                      style={{
                        objectFit: "contain",
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                      }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={true}
                      unoptimized={previewImage.startsWith("blob:")}
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500 dark:text-muted-foreground">
                      No image selected
                    </p>
                  </div>
                )}
                <div
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = e => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        handleImageSelection(file);
                      }
                    };
                    input.click();
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-in-out"
                >
                  <p className="text-white text-lg font-medium">
                    Click to change image
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form Fields */}
          <div className="lg:w-1/2 p-6">
            <h2 className="text-xl font-bold mb-4 dark:text-card-foreground">
              Edit Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={e => onEditDataChange({ title: e.target.value })}
                  onBlur={onInputBlur}
                  className="w-full p-2 border rounded dark:bg-background dark:text-foreground dark:border-input"
                  placeholder="Enter title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={editData.subtitle}
                  onChange={e => onEditDataChange({ subtitle: e.target.value })}
                  onBlur={onInputBlur}
                  className="w-full p-2 border rounded dark:bg-background dark:text-foreground dark:border-input"
                  placeholder="Enter subtitle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-1">
                  Link to Collection
                </label>
                <select
                  value={editData.cta}
                  onChange={e => onEditDataChange({ cta: e.target.value })}
                  onBlur={onInputBlur}
                  className="w-full p-2 border rounded bg-white dark:bg-background dark:text-foreground dark:border-input"
                >
                  <option value="">Select a collection</option>
                  {COLLECTION_LINKS.map(option => (
                    <option key={option.href} value={option.href}>
                      {option.display}
                    </option>
                  ))}
                </select>
                {editData.cta && (
                  <p className="text-sm text-gray-600 mt-1">
                    Button will display: {getDisplayNameFromHref(editData.cta)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-1">
                  Background Color (Hex)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={editData.backgroundColor}
                    onChange={e => handleHexColorChange(e.target.value)}
                    onBlur={e => handleHexColorBlur(e.target.value)}
                    className="w-full p-2 border rounded font-mono dark:bg-background dark:text-foreground dark:border-input uppercase"
                    placeholder="#000000"
                    maxLength={7}
                  />
                  <div
                    className="w-10 h-10 border rounded flex-shrink-0"
                    style={{ backgroundColor: editData.backgroundColor }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter a hex color code (e.g., #FF0000 for red)
                </p>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-foreground dark:hover:bg-muted rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={onSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
