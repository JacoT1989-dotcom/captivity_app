"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CarouselProduct {
  id: string;
  name: string;
  imageUrl: string;
  stock: number;
}

interface ProductCarouselProps {
  products: CarouselProduct[];
  className?: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setCurrentIndex(prevIndex => {
        let nextIndex = prevIndex + newDirection;
        if (nextIndex < 0) nextIndex = products.length - 1;
        if (nextIndex >= products.length) nextIndex = 0;
        return nextIndex;
      });
    },
    [products.length]
  );

  useEffect(() => {
    if (!isAutoPlaying || products.length <= 1) return;

    const interval = setInterval(() => {
      paginate(1);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, products.length, paginate]);

  if (!products.length) return null;

  return (
    <div className={cn("relative w-full group", className)}>
      <div className="relative w-full h-[300px] overflow-hidden rounded-xl">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute w-full h-full"
          >
            <Card className="w-full h-full overflow-hidden relative">
              <Image
                src={
                  products[currentIndex].imageUrl.split(",")[0] ||
                  "/placeholder.jpg"
                }
                alt={products[currentIndex].name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Content */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-0 left-0 right-0 p-6 text-white"
              >
                <h3 className="font-bold text-2xl mb-2">
                  {products[currentIndex].name}
                </h3>
                <p className="text-white/80">
                  Stock: {products[currentIndex].stock} available
                </p>
              </motion.div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={() => paginate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={() => paginate(1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Progress Indicators */}
        <div className="absolute bottom-6 left-0 right-0">
          <div className="flex justify-center gap-2">
            {products.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  idx === currentIndex
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/75"
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;
