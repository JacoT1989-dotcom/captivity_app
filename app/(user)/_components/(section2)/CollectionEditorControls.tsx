"use client";

import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { CollectionEditModal } from "./CollectionEditModal";
import { BaseCollection } from "@/app/(editor)/types";

interface CollectionEditorControlsProps {
  collection: BaseCollection;
  onRemove: (id: string) => Promise<void>;
  onUpdate: (id: string, formData: FormData) => Promise<void>;
  error?: string | null;
}

export function CollectionEditorControls({
  collection,
  onRemove,
  onUpdate,
  error,
}: CollectionEditorControlsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this collection?"
    );
    if (!confirmed) return;

    try {
      setIsRemoving(true);
      await onRemove(collection.id);
    } catch (error) {
      console.error("Error removing collection:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <>
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 dark:bg-gray-800 bg-white/80 rounded-full hover:bg-white dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200"
          aria-label="Edit collection"
        >
          <Pencil className="w-4 h-4 dark:text-gray-200" />
        </button>
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className="p-2 dark:bg-gray-800 bg-white/80 rounded-full hover:bg-white dark:hover:bg-gray-700 hover:text-red-500 dark:hover:text-red-400 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Remove collection"
        >
          <Trash2 className="w-4 h-4 dark:text-gray-200" />
        </button>
      </div>

      <CollectionEditModal
        isOpen={isEditing}
        collection={{
          ...collection,
          backgroundColor: collection.backgroundColor || "#FFFFFF",
        }}
        onClose={() => setIsEditing(false)}
        onUpdate={onUpdate}
      />

      {error && (
        <div className="absolute bottom-4 left-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 px-4 py-2 rounded-md shadow-sm">
          {error}
        </div>
      )}
    </>
  );
}
