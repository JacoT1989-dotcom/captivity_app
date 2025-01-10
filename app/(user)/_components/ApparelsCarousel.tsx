"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { fetchNewInApparel } from "../(DropDownCategories)/products/_global/actions";

interface CarouselProduct {
  id: string;
  name: string;
  imageUrl: string;
  stock: number;
}

interface ProductCarouselProps {
  className?: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ className }) => {
  const [products, setProducts] = useState<CarouselProduct[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchNewInApparel();
        
        // Check if the request was successful and data is available
        if (response.success && response.data) {
          setProducts(response.data); // Set products to the data array
        } else {
          console.error("Failed to load products:", response.error);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    loadProducts();
  }, []);

  useEffect(() => {
    if (products.length <= 1) return;

    const interval = setInterval(() => {
      setDirection("right");
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [products.length]);

  if (!products.length) {
    return null;
  };
  
  const currentProduct = products[currentIndex];

  return (
    <div className={cn("w-full space-y-4", className)}>
      <h1>NEW PRODUCTS</h1>
      <div className="relative w-full overflow-hidden rounded-lg">
        <div
          className="relative w-full transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(${direction === "right" ? "-100" : "100"}%)`,
            animation: `slide-${direction} 500ms forwards`,
          }}
        >
          <Link href={`/products/apparel/${currentProduct.id}`}>
            <Card className="bg-white overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300">
              <div className="relative aspect-square w-full">
                <Image
                  src={
                    currentProduct.imageUrl.split(",")[0] || "/placeholder.jpg"
                  }
                  alt={currentProduct.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg text-card-foreground truncate">
                  {currentProduct.name}
                </h3>
              </div>
            </Card>
          </Link>
        </div>

        {/* Progress indicators */}
        <div className="absolute bottom-4 left-0 right-0">
          <div className="flex justify-center gap-1.5">
            {products.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  idx === currentIndex
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/75"
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes slide-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes slide-left {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProductCarousel;