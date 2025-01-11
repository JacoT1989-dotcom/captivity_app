// HeroSlider.tsx
"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useSession } from "@/app/SessionProvider";
import { useHeroSlideData } from "@/app/(editor)/_editor-store/hero-store";
import { EditorUploadControls } from "./EditorUploadControls";
import { HeroSliderEditorControls } from "./HeroSliderEditorControls";
import { SLIDE_INTERVAL } from "@/app/(editor)/utils";
import { RegularSlide } from "@/app/(editor)/types";
import { COLLECTION_LINKS, getDisplayNameFromPath } from "./collectionConfig";

const MAX_SLIDES = 5;

export function HeroSlider() {
  const isMountedRef = useRef(false);
  const slideIntervalRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInteractingRef = useRef(false);

  const sessionData = useSession();
  const isEditor = useMemo(
    () => sessionData?.user?.role === "EDITOR",
    [sessionData?.user?.role]
  );

  const {
    slides: apiSlides,
    isLoading,
    error,
    upload,
    remove,
    update,
  } = useHeroSlideData();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [showEmptySlide, setShowEmptySlide] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pausedOnSlideId, setPausedOnSlideId] = useState<string | null>(null);

  const regularSlides = useMemo<RegularSlide[]>(
    () =>
      apiSlides.map(slide => ({
        ...slide,
        type: "regular" as const,
      })),
    [apiSlides]
  );

  const canAddMoreSlides = useMemo(
    () => regularSlides.length < MAX_SLIDES,
    [regularSlides.length]
  );

  const startTransitionTimer = useCallback(() => {
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current);
    }

    // Don't start timer if uploading, empty, or user is interacting
    if (isUploading || regularSlides.length === 0 || isInteractingRef.current)
      return;

    const handleSlideTransition = () => {
      if (showEmptySlide) {
        setShowEmptySlide(false);
        setCurrentSlide(0);
      } else if (
        currentSlide === regularSlides.length - 1 &&
        canAddMoreSlides &&
        isEditor
      ) {
        setShowEmptySlide(true);
      } else {
        setCurrentSlide(prev => (prev + 1) % regularSlides.length);
      }
    };

    slideIntervalRef.current = setInterval(
      handleSlideTransition,
      SLIDE_INTERVAL
    );
  }, [
    showEmptySlide,
    currentSlide,
    regularSlides.length,
    canAddMoreSlides,
    isEditor,
    isUploading,
  ]);

  const stopTransitionTimer = useCallback(() => {
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current);
      slideIntervalRef.current = undefined;
    }
  }, []);

  // Navigation handlers
  const handlePrevSlide = useCallback(() => {
    stopTransitionTimer();
    setCurrentSlide(prev => (prev === 0 ? regularSlides.length - 1 : prev - 1));
    setShowEmptySlide(false);
    setTimeout(startTransitionTimer, 100);
  }, [regularSlides.length, stopTransitionTimer, startTransitionTimer]);

  const handleNextSlide = useCallback(() => {
    stopTransitionTimer();
    setCurrentSlide(prev => (prev + 1) % regularSlides.length);
    setShowEmptySlide(false);
    setTimeout(startTransitionTimer, 100);
  }, [regularSlides.length, stopTransitionTimer, startTransitionTimer]);

  const handleMouseEnter = useCallback(() => {
    isInteractingRef.current = true;
    stopTransitionTimer();
  }, [stopTransitionTimer]);

  const handleMouseLeave = useCallback(() => {
    isInteractingRef.current = false;
    if (!pausedOnSlideId) {
      startTransitionTimer();
    }
  }, [startTransitionTimer, pausedOnSlideId]);

  const handleUpdate = async (id: string, formData: FormData) => {
    stopTransitionTimer();
    await update(id, formData);
    setPausedOnSlideId(id);
  };

  useEffect(() => {
    if (pausedOnSlideId) {
      stopTransitionTimer();
      const pausedSlideIndex = regularSlides.findIndex(
        slide => slide.id === pausedOnSlideId
      );
      if (pausedSlideIndex !== -1) {
        setCurrentSlide(pausedSlideIndex);
      }

      const timeoutId = setTimeout(() => {
        setPausedOnSlideId(null);
        if (!isInteractingRef.current) {
          startTransitionTimer();
        }
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
        if (!pausedOnSlideId) {
          startTransitionTimer();
        }
      };
    }
  }, [
    pausedOnSlideId,
    regularSlides,
    stopTransitionTimer,
    startTransitionTimer,
  ]);

  useEffect(() => {
    startTransitionTimer();
    return () => stopTransitionTimer();
  }, [startTransitionTimer, stopTransitionTimer]);

  useEffect(() => {
    if (regularSlides.length === 0) {
      setCurrentSlide(0);
      return;
    }

    if (currentSlide >= regularSlides.length) {
      setCurrentSlide(Math.max(0, regularSlides.length - 1));
    }
  }, [regularSlides.length, currentSlide]);

  useEffect(() => {
    if (isUploading) {
      stopTransitionTimer();
    } else if (!isInteractingRef.current && !pausedOnSlideId) {
      startTransitionTimer();
    }
  }, [isUploading, stopTransitionTimer, startTransitionTimer, pausedOnSlideId]);

  if (isLoading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (
    (regularSlides.length === 0 || (showEmptySlide && canAddMoreSlides)) &&
    isEditor
  ) {
    return (
      <div className="relative pb-12">
        <div
          ref={containerRef}
          className="relative w-full h-[600px] overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <EditorUploadControls
            onUpload={async formData => {
              setIsUploading(true);
              try {
                await upload(formData);
                setShowEmptySlide(false);
                setCurrentSlide(regularSlides.length);
              } finally {
                setIsUploading(false);
              }
            }}
            startUserInteraction={() => {
              isInteractingRef.current = true;
              stopTransitionTimer();
            }}
            endUserInteraction={() => {
              isInteractingRef.current = false;
              if (!isUploading && !pausedOnSlideId) {
                startTransitionTimer();
              }
            }}
            error={error}
          />

          {regularSlides.length > 0 && (
            <>
              {/* Navigation Arrows */}
              <button
                onClick={handlePrevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors z-10"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors z-10"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Bullets */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-0">
                {regularSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      stopTransitionTimer();
                      setCurrentSlide(index);
                      setShowEmptySlide(false);
                      setTimeout(startTransitionTimer, 100);
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSlide && !showEmptySlide
                        ? "bg-gray-800"
                        : "bg-gray-400"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
                <button
                  onClick={() => {
                    stopTransitionTimer();
                    setShowEmptySlide(true);
                    setTimeout(startTransitionTimer, 100);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    showEmptySlide ? "bg-gray-800" : "bg-gray-400"
                  }`}
                  aria-label="Add new slide"
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (regularSlides.length === 0) {
    return null;
  }

  const currentSlideData = regularSlides[currentSlide];
  if (!currentSlideData) {
    return null;
  }

  return (
    <div className="relative pb-12">
      {" "}
      {/* Added padding-bottom for bullet navigation */}
      <div
        ref={containerRef}
        className="relative w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="grid h-[600px] w-full grid-cols-1 md:grid-cols-2">
          <div
            className="order-2 md:order-1 flex flex-col justify-center px-4 md:px-16 lg:px-24 transition-colors duration-500 py-8 md:py-0"
            style={{ backgroundColor: currentSlideData.backgroundColor }}
          >
            <div className="space-y-4 md:space-y-6 max-w-xl mx-auto text-left">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
                {currentSlideData.title}
              </h1>
              <p className="text-base md:text-xl text-gray-700">
                {currentSlideData.subtitle}
              </p>
              <div className="text-left">
                <Link
                  href={
                    COLLECTION_LINKS.find(link =>
                      link.href.includes(
                        currentSlideData.cta.split("/").pop() || ""
                      )
                    )?.href || currentSlideData.cta
                  }
                  className="inline-block rounded-md bg-gray-900 px-6 md:px-8 py-2 md:py-3 text-sm font-medium text-white transition hover:bg-gray-700"
                >
                  {getDisplayNameFromPath(currentSlideData.cta)}
                </Link>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2 relative h-[400px] md:h-full w-full">
            {regularSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute h-full w-full transition-opacity duration-500 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  zIndex: index === currentSlide ? 1 : 0,
                  pointerEvents: index === currentSlide ? "auto" : "none",
                }}
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {isEditor && (
                  <HeroSliderEditorControls
                    slide={slide}
                    isCurrentSlide={index === currentSlide}
                    onRemove={remove}
                    onUpdate={handleUpdate}
                    onAddNew={() => {
                      stopTransitionTimer();
                      setShowEmptySlide(true);
                    }}
                    startUserInteraction={() => {
                      isInteractingRef.current = true;
                      stopTransitionTimer();
                    }}
                    endUserInteraction={() => {
                      isInteractingRef.current = false;
                      if (!isUploading && !pausedOnSlideId) {
                        startTransitionTimer();
                      }
                    }}
                    canAddMore={canAddMoreSlides}
                    error={error}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows (only visible for editor role) */}
        {isEditor && (
          <>
            <button
              onClick={handlePrevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Bullets below the slide */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {regularSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                stopTransitionTimer();
                setCurrentSlide(index);
                setShowEmptySlide(false);
                setTimeout(startTransitionTimer, 100);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide && !showEmptySlide
                  ? "bg-gray-800"
                  : "bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
          {isEditor && canAddMoreSlides && (
            <button
              onClick={() => {
                stopTransitionTimer();
                setShowEmptySlide(true);
                setTimeout(startTransitionTimer, 100);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                showEmptySlide ? "bg-gray-800" : "bg-gray-400"
              }`}
              aria-label="Add new slide"
            />
          )}
        </div>
      </div>
    </div>
  );
}
