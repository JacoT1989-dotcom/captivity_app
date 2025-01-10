"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback, memo } from "react";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { useCategoryData } from "../_store/CategoryStore";
import { useParams } from "next/navigation";
import { useSession } from "@/app/(vendor)/SessionProvider";

const MAX_CATEGORIES = 4;

interface CategoryItem {
  url: string;
  categoryName: string;
}

interface EmptyBlockProps {
  index: number;
  categoryName: string;
  onCategoryNameChange: (index: number, name: string) => void;
  onFileSelect: (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  onUploadClick: (index: number) => void;
  setInputRef: (el: HTMLInputElement | null, index: number) => void;
}

interface FilledBlockProps {
  category: CategoryItem;
  isVendor: boolean;
  onRemove: (url: string) => void;
}

const EmptyBlock = memo(
  ({
    index,
    categoryName,
    onCategoryNameChange,
    onFileSelect,
    onUploadClick,
    setInputRef,
  }: EmptyBlockProps) => (
    <div
      className="aspect-[786/1239] relative flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => onUploadClick(index)}
    >
      <input
        type="file"
        ref={el => setInputRef(el, index)}
        onChange={e => onFileSelect(e, index)}
        accept="image/*"
        className="hidden"
      />
      <div className="flex flex-col items-center gap-3 px-4">
        <div className="p-2 rounded-full bg-gray-100">
          <Plus
            size={20}
            className={`${categoryName.trim() ? "text-gray-500" : "text-gray-300"}`}
          />
        </div>
        <div className="flex flex-col items-center text-center">
          <p className="text-xs text-gray-500 font-medium mb-1">
            Category slot ({index + 1}/4)
          </p>
          <p className="text-[11px] text-gray-400">
            {categoryName.trim()
              ? "Click to upload image"
              : "⚠️ Enter category name below first"}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Image Dimensions: width=786 x height=1239
          </p>
        </div>
      </div>
      <input
        type="text"
        placeholder="Enter category name*"
        value={categoryName}
        onChange={e => onCategoryNameChange(index, e.target.value)}
        className="absolute bottom-4 left-4 right-4 p-2 rounded border border-gray-400 text-center text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white/90"
        onClick={e => e.stopPropagation()}
      />
    </div>
  )
);

EmptyBlock.displayName = "EmptyBlock";

const FilledBlock = memo(
  ({ category, isVendor, onRemove }: FilledBlockProps) => (
    <div className="relative group rounded-lg overflow-hidden">
      <Image
        src={category.url}
        alt={category.categoryName}
        width={786}
        height={1239}
        className="w-full h-auto group-hover:brightness-50 transition duration-1000"
      />
      {isVendor && (
        <button
          onClick={() => onRemove(category.url)}
          className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full 
                 opacity-0 group-hover:opacity-100 transition-opacity
                 hover:bg-white hover:text-red-500 z-10"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
      <div className="absolute bottom-8 left-0 w-full font-bold text-white text-center py-2 transition duration-700 group-hover:bg-opacity-75">
        <span className="text-lg group-hover:text-xl transition duration-700">
          {category.categoryName.toUpperCase()}
        </span>
      </div>
    </div>
  )
);

FilledBlock.displayName = "FilledBlock";

const CategoryBlock = memo(
  ({
    index,
    category,
    isVendor,
    categoryName,
    onCategoryNameChange,
    onFileSelect,
    onUploadClick,
    onRemove,
    setInputRef,
  }: {
    index: number;
    category?: CategoryItem;
    isVendor: boolean;
    categoryName: string;
    onCategoryNameChange: (index: number, name: string) => void;
    onFileSelect: (
      event: React.ChangeEvent<HTMLInputElement>,
      index: number
    ) => void;
    onUploadClick: (index: number) => void;
    onRemove: (url: string) => void;
    setInputRef: (el: HTMLInputElement | null, index: number) => void;
  }) => (
    <div className="w-full sm:w-1/2 md:w-1/4 p-2">
      <div className="relative group rounded-lg overflow-hidden shadow-black shadow-2xl">
        {!category && isVendor ? (
          <EmptyBlock
            index={index}
            categoryName={categoryName}
            onCategoryNameChange={onCategoryNameChange}
            onFileSelect={onFileSelect}
            onUploadClick={onUploadClick}
            setInputRef={setInputRef}
          />
        ) : category ? (
          <FilledBlock
            category={category}
            isVendor={isVendor}
            onRemove={onRemove}
          />
        ) : null}
      </div>
    </div>
  )
);

CategoryBlock.displayName = "CategoryBlock";

export default function CategoryImages() {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [categoryNames, setCategoryNames] = useState<string[]>(
    Array(MAX_CATEGORIES).fill("")
  );

  const { user } = useSession();
  const params = useParams();
  const vendorSlug =
    typeof params?.vendor_website === "string"
      ? params.vendor_website
      : undefined;

  const {
    categories,
    isLoading,
    error,
    upload: uploadCategory,
    remove: removeCategory,
  } = useCategoryData(vendorSlug);

  const isVendor = user?.role === "VENDOR";

  // Reset category names when vendor changes
  useEffect(() => {
    setCategoryNames(Array(MAX_CATEGORIES).fill(""));
  }, [vendorSlug]);

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      if (!isVendor) return;

      const file = event.target.files?.[0];
      if (!file) return;

      if (categories.length >= MAX_CATEGORIES) {
        alert(`Maximum ${MAX_CATEGORIES} categories allowed`);
        return;
      }

      const categoryName = categoryNames[index].trim();
      if (!categoryName) {
        alert("Please enter a category name first");
        return;
      }

      const formData = new FormData();
      formData.append("category", file);
      formData.append("categoryName", categoryName);

      try {
        await uploadCategory(formData);

        if (fileInputRefs.current[index]) {
          fileInputRefs.current[index]!.value = "";
        }

        setCategoryNames(prev => {
          const newNames = [...prev];
          newNames[index] = "";
          return newNames;
        });
      } catch (error) {
        console.error("Error uploading category:", error);
      }
    },
    [isVendor, categories.length, categoryNames, uploadCategory]
  );

  const handleCategoryNameChange = useCallback(
    (index: number, name: string) => {
      setCategoryNames(prev => {
        const newNames = [...prev];
        newNames[index] = name;
        return newNames;
      });
    },
    []
  );

  const handleRemoveCategory = useCallback(
    async (url: string) => {
      if (
        !isVendor ||
        !window.confirm("Are you sure you want to remove this category?")
      )
        return;

      try {
        await removeCategory(url);
      } catch (error) {
        console.error("Error removing category:", error);
      }
    },
    [isVendor, removeCategory]
  );

  const handleUploadClick = useCallback(
    (index: number) => {
      if (fileInputRefs.current[index] && categoryNames[index].trim()) {
        fileInputRefs.current[index]?.click();
      }
    },
    [categoryNames]
  );

  const setInputRef = useCallback(
    (el: HTMLInputElement | null, index: number) => {
      fileInputRefs.current[index] = el;
    },
    []
  );

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <section className="max-container max-sm:mt-12">
        <div className="flex flex-col justify-center gap-2 mb-6">
          <h2 className="text-3xl sm:text-2xl md:text-2xl lg:text-3xl flex items-center justify-center text-red-600 font-semibold">
            PRODUCT CATEGORIES
          </h2>
        </div>

        <div className="flex flex-wrap items-start justify-center">
          {Array.from({ length: MAX_CATEGORIES }).map((_, index) => (
            <CategoryBlock
              key={index}
              index={index}
              category={categories[index]}
              isVendor={isVendor}
              categoryName={categoryNames[index]}
              onCategoryNameChange={handleCategoryNameChange}
              onFileSelect={handleFileSelect}
              onUploadClick={handleUploadClick}
              onRemove={handleRemoveCategory}
              setInputRef={setInputRef}
            />
          ))}
        </div>

        {isVendor && error && (
          <div className="fixed top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-md text-sm">
            {error}
          </div>
        )}
      </section>
    </div>
  );
}
