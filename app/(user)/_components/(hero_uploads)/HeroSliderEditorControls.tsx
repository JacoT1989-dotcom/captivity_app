"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Trash2, Pencil, Plus } from "lucide-react";
import { RegularSlide } from "@/app/(editor)/types";
import EditModal from "./EditModal";

interface HeroSliderEditorControlsProps {
  slide: RegularSlide;
  isCurrentSlide: boolean;
  onRemove: (id: string) => Promise<void>;
  onUpdate: (id: string, formData: FormData) => Promise<void>;
  onAddNew: () => void;
  startUserInteraction: () => void;
  endUserInteraction: () => void;
  canAddMore: boolean;
  error?: string | null;
}

export function HeroSliderEditorControls({
  slide,
  isCurrentSlide,
  onRemove,
  onUpdate,
  onAddNew,
  startUserInteraction,
  endUserInteraction,
  canAddMore,
  error,
}: HeroSliderEditorControlsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: slide.title,
    subtitle: slide.subtitle,
    backgroundColor: slide.backgroundColor,
    cta: slide.cta,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Reset state when slide changes
  useEffect(() => {
    setEditData({
      title: slide.title,
      subtitle: slide.subtitle,
      backgroundColor: slide.backgroundColor,
      cta: slide.cta,
    });
    setSelectedFile(null);
  }, [slide]);

  const handleEditDataChange = useCallback(
    (data: Partial<typeof editData>) => {
      startUserInteraction();
      setEditData(prev => ({ ...prev, ...data }));
    },
    [startUserInteraction]
  );

  const handleEditImage = useCallback(
    (file: File) => {
      startUserInteraction();
      setSelectedFile(file);
    },
    [startUserInteraction]
  );

  const handleEdit = useCallback(async () => {
    try {
      startUserInteraction();
      const formData = new FormData();

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      formData.append("title", editData.title);
      formData.append("subtitle", editData.subtitle);
      formData.append("backgroundColor", editData.backgroundColor);
      formData.append("cta", editData.cta);

      await onUpdate(slide.id, formData);
      setIsEditing(false);
      setSelectedFile(null);

      // Set a timeout to end the interaction after 3 seconds
      setTimeout(() => {
        endUserInteraction();
      }, 3000);
    } catch (error) {
      console.error("Error updating slide:", error);
      endUserInteraction();
    }
  }, [
    slide.id,
    editData,
    selectedFile,
    onUpdate,
    startUserInteraction,
    endUserInteraction,
  ]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setSelectedFile(null);
    setEditData({
      title: slide.title,
      subtitle: slide.subtitle,
      backgroundColor: slide.backgroundColor,
      cta: slide.cta,
    });
    endUserInteraction();
  }, [slide, endUserInteraction]);

  if (!isCurrentSlide) return null;

  return (
    <>
      <div className="absolute top-4 right-4 flex gap-2">
        {canAddMore && (
          <button
            onClick={onAddNew}
            className="p-2 bg-white/80 rounded-full hover:bg-white hover:text-blue-500 transition-colors"
            aria-label="Add new slide"
          >
            <Plus className="w-4 h-4 dark:text-black" />
          </button>
        )}
        <button
          onClick={() => {
            startUserInteraction();
            setIsEditing(true);
          }}
          className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
          aria-label="Edit slide"
        >
          <Pencil className="w-4 h-4 dark:text-black" />
        </button>
        <button
          onClick={() => onRemove(slide.id)}
          className="p-2 bg-white/80 rounded-full hover:bg-white hover:text-red-500 transition-colors"
          aria-label="Remove slide"
        >
          <Trash2 className="w-4 h-4 dark:text-black" />
        </button>
      </div>

      <EditModal
        isEditing={isEditing}
        editData={editData}
        currentImage={slide.image}
        onCancel={handleCancel}
        onSave={handleEdit}
        onImageUpload={handleEditImage}
        onEditDataChange={handleEditDataChange}
        onInputBlur={endUserInteraction}
      />

      {error && (
        <div className="absolute bottom-4 left-4 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded">
          {error}
        </div>
      )}
    </>
  );
}
