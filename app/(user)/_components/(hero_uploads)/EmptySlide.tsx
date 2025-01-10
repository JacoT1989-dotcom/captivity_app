import { memo } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";

const COLLECTION_LINKS = [
  { value: "/products/all-collections/signature", label: "Signature" },
  { value: "/products/all-collections/camo", label: "Camo" },
  { value: "/products/all-collections/winter", label: "Winter" },
  { value: "/products/all-collections/baseball", label: "Baseball" },
  { value: "/products/all-collections/fashion", label: "Fashion" },
  { value: "/products/all-collections/sport", label: "Sport" },
  { value: "/products/all-collections/industrial", label: "Industrial" },
  { value: "/products/all-collections/leisure", label: "Leisure" },
  { value: "/products/all-collections/kids", label: "Kids" },
  { value: "/products/all-collections/african", label: "African" },
];

interface EmptySlideProps {
  onFileSelect: (file: File) => void;
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
  title: string;
  onTitleChange: (title: string) => void;
  subtitle: string;
  onSubtitleChange: (subtitle: string) => void;
  cta: string;
  onCtaChange: (cta: string) => void;
  isUploading?: boolean;
  onInputBlur?: () => void;
  onSave: () => void;
  onCancel: () => void;
  previewImage?: string | null;
  error?: string | null;
}

interface ImageUploadSectionProps {
  previewImage?: string | null;
  onFileSelect: (file: File) => void;
}

const EmptySlide = memo(function EmptySlide({
  onFileSelect,
  backgroundColor,
  onBackgroundColorChange,
  title,
  onTitleChange,
  subtitle,
  onSubtitleChange,
  cta,
  onCtaChange,
  isUploading = false,
  onInputBlur,
  onSave,
  onCancel,
  previewImage,
  error,
}: EmptySlideProps) {
  return (
    <div className="w-full h-[600px] overflow-auto">
      <div className="w-full h-full md:grid md:grid-cols-2">
        <div
          className="w-full p-4 md:p-8 space-y-6"
          style={{ backgroundColor }}
        >
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Create Hero Slide
            </h2>
            <p className="mt-2 text-muted-foreground">
              Fill in the details below to create a new slide.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={e => onTitleChange(e.target.value)}
                onBlur={onInputBlur}
                className="w-full p-2 border border-input rounded-md shadow-sm bg-background text-foreground"
                placeholder="Enter slide title"
                disabled={isUploading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={e => onSubtitleChange(e.target.value)}
                onBlur={onInputBlur}
                className="w-full p-2 border border-input rounded-md shadow-sm bg-background text-foreground"
                placeholder="Enter slide subtitle"
                disabled={isUploading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Link to Collection
              </label>
              <select
                value={cta}
                onChange={e => onCtaChange(e.target.value)}
                onBlur={onInputBlur}
                className="w-full p-2 border border-input rounded-md shadow-sm bg-background text-foreground"
                disabled={isUploading}
              >
                <option value="">Select a collection link</option>
                {COLLECTION_LINKS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Background Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={e => onBackgroundColorChange(e.target.value)}
                  onBlur={onInputBlur}
                  className="h-8 w-16"
                  disabled={isUploading}
                />
                <span className="text-sm text-muted-foreground">
                  {backgroundColor}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={onCancel}
              disabled={isUploading}
              className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={isUploading || !previewImage}
              className={`px-4 py-2 rounded-md text-primary-foreground font-medium ${
                isUploading || !previewImage
                  ? "bg-muted cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {isUploading ? "Uploading..." : "Save Slide"}
            </button>
          </div>
        </div>

        <div className="h-[300px] md:h-[600px] bg-muted">
          <ImageUploadSection
            previewImage={previewImage}
            onFileSelect={onFileSelect}
          />
        </div>
      </div>
    </div>
  );
});

const ImageUploadSection = ({
  previewImage,
  onFileSelect,
}: ImageUploadSectionProps) => {
  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) onFileSelect(file);
    };
    input.click();
  };

  return (
    <div className="w-full h-full relative">
      {previewImage ? (
        <div className="w-full h-full relative group">
          <Image
            src={previewImage}
            alt="Preview"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 cursor-pointer">
            <label
              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-[opacity] duration-300 pointer-events-auto cursor-pointer"
              style={{ transitionDelay: "0.3s" }}
              onClick={handleClick}
            >
              <p className="text-white text-sm">Click to change image</p>
            </label>
          </div>
        </div>
      ) : (
        <div
          className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-accent"
          onClick={handleClick}
        >
          <div className="text-center p-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-foreground font-medium">
                Click to upload image
              </p>
              <p className="text-xs text-muted-foreground">
                Maximum size: 5MB
                <br />
                Recommended size: 1920x1080px
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

EmptySlide.displayName = "EmptySlide";

export default EmptySlide;
