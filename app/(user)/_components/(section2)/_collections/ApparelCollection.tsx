"use client";
import { useState, useCallback } from "react";
import { useSession } from "@/app/SessionProvider";
import { CollectionBase } from "./CollectionBase";
import { CollectionEditorControls } from "../CollectionEditorControls";
import { CollectionUploadControls } from "../CollectionUploadControls";
import { useCollectionData } from "@/app/(editor)/_editor-store/section2-store";
import {
  BaseCollection,
  COLLECTION_POSITIONS,
  CollectionType,
} from "@/app/(editor)/types";

export function ApparelCollection() {
  const sessionData = useSession();
  const isEditor = sessionData?.user?.role === "EDITOR";
  const [showUploadControls, setShowUploadControls] = useState(false);

  const { collections, isLoading, error, upload, remove, update } =
    useCollectionData();

  const apparelCollection = collections.find(
    (collection): collection is BaseCollection =>
      collection.type === "apparel" &&
      collection.position === COLLECTION_POSITIONS.APPAREL
  );

  const handleUploadComplete = useCallback(
    async (formData: FormData) => {
      try {
        await upload(formData);
        setShowUploadControls(false);
      } catch (error) {
        console.error("Upload error:", error);
      }
    },
    [upload]
  );

  if (isLoading) {
    return (
      <div className="h-[400px] w-full md:h-[400px] md:col-span-6 bg-gray-100 animate-pulse rounded-lg" />
    );
  }

  if (showUploadControls && isEditor) {
    return (
      <div className="h-[400px] w-full md:h-[400px] md:col-span-6">
        <CollectionUploadControls
          onUpload={handleUploadComplete}
          onCancel={() => setShowUploadControls(false)}
          type={"apparel" as CollectionType}
          position={COLLECTION_POSITIONS.APPAREL}
          error={error}
        />
      </div>
    );
  }

  if (!apparelCollection && isEditor) {
    return (
      <div className="h-[400px] w-full md:h-[400px] md:col-span-6">
        <div
          onClick={() => setShowUploadControls(true)}
          className="relative w-full h-full flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer group hover:bg-gray-100 hover:border-gray-300 transition-all duration-300"
        >
          <div className="flex flex-col items-center space-y-4 p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Add Apparel Collection
              </h3>
              <p className="text-sm text-gray-500 max-w-[280px]">
                Create a featured collection to showcase your apparel products
              </p>
            </div>
            <button className="mt-4 px-6 py-2 bg-white text-sm font-medium text-gray-700 border border-gray-200 rounded-full shadow-sm hover:bg-blue-500 hover:text-white hover:border-transparent transition-all duration-300">
              Get Started
            </button>
          </div>
          <div className="absolute inset-0 border-2 border-transparent rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!apparelCollection) return null;

  return (
    <div className="h-[300px] w-full md:h-[400px] md:col-span-6 relative group">
      <CollectionBase
        title={apparelCollection.title}
        image={apparelCollection.image}
        href={apparelCollection.href}
        backgroundColor={apparelCollection.backgroundColor}
      />
      {isEditor && (
        <CollectionEditorControls
          collection={apparelCollection}
          onRemove={remove}
          onUpdate={update}
          error={error}
        />
      )}
    </div>
  );
}
