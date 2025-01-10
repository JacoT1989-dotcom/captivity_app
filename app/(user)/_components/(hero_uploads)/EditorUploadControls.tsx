"use client";

import { useState, useCallback, useEffect } from "react";
import EmptySlide from "./EmptySlide";
import { DEFAULT_SLIDE_STATE } from "@/app/(editor)/utils";
import { NewSlideState } from "@/app/(editor)/types";

const MAX_FILE_SIZE = 6 * 1024 * 1024; // 6MB in bytes to give some buffer

interface EditorUploadControlsProps {
  onUpload: (formData: FormData) => Promise<void>;
  startUserInteraction: () => void;
  endUserInteraction: () => void;
  error?: string | null;
}

export function EditorUploadControls({
  onUpload,
  startUserInteraction,
  endUserInteraction,
  error: externalError,
}: EditorUploadControlsProps) {
  const [newSlide, setNewSlide] = useState<NewSlideState>(DEFAULT_SLIDE_STATE);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (externalError) {
      setError(externalError);
      setIsUploading(false);
    }
  }, [externalError]);

  const handleFileSelect = useCallback(
    (file: File) => {
      startUserInteraction();
      setError(null);

      const fileSizeMB = file.size / (1024 * 1024);
      if (file.size > MAX_FILE_SIZE) {
        setError(
          `File size is too large (${fileSizeMB.toFixed(1)}MB). Please use an image under 6MB.`
        );
        return;
      }

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    },
    [startUserInteraction, previewUrl]
  );

  const handleSave = useCallback(async () => {
    if (!selectedFile) return;

    try {
      startUserInteraction();
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("backgroundColor", newSlide.backgroundColor);
      formData.append("title", newSlide.title);
      formData.append("subtitle", newSlide.subtitle);
      formData.append("cta", newSlide.cta || DEFAULT_SLIDE_STATE.cta);

      await onUpload(formData);

      setNewSlide(DEFAULT_SLIDE_STATE);
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError("Failed to upload slide. Please try again.");
    } finally {
      setIsUploading(false);
      endUserInteraction();
    }
  }, [
    selectedFile,
    newSlide,
    onUpload,
    startUserInteraction,
    endUserInteraction,
    previewUrl,
  ]);

  const handleCancel = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
    setNewSlide(DEFAULT_SLIDE_STATE);
    setError(null);
    setIsUploading(false);
    endUserInteraction();
  }, [previewUrl, endUserInteraction]);

  return (
    <EmptySlide
      onFileSelect={handleFileSelect}
      backgroundColor={newSlide.backgroundColor}
      onBackgroundColorChange={color => {
        startUserInteraction();
        setNewSlide(prev => ({ ...prev, backgroundColor: color }));
      }}
      title={newSlide.title}
      onTitleChange={title => {
        startUserInteraction();
        setNewSlide(prev => ({ ...prev, title }));
      }}
      subtitle={newSlide.subtitle}
      onSubtitleChange={subtitle => {
        startUserInteraction();
        setNewSlide(prev => ({ ...prev, subtitle }));
      }}
      cta={newSlide.cta}
      onCtaChange={cta => {
        startUserInteraction();
        setNewSlide(prev => ({ ...prev, cta }));
      }}
      isUploading={isUploading}
      onInputBlur={endUserInteraction}
      onSave={handleSave}
      onCancel={handleCancel}
      previewImage={previewUrl}
      error={error}
    />
  );
}
