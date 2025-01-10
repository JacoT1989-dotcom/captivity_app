"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const images = [
  {
    src: "/Savannah-Hat-model.jpg",
    title: "Savannah Hat",
    rating: 5,
    link: "/products/headwear/160433",
  },
  {
    src: "/Alaska-Puffer-Jacket-Black.jpg",
    title: "Alaska Puffer Jacket Black",
    rating: 4,
    link: "/products/apparel/161054",
  },
  {
    src: "/model1.jpg",
    title: "FWRD short 240gm",
    rating: 4.5,
    link: "/products/apparel/175503",
  },
  {
    src: "/Supafit-new-model.jpg",
    title: "Supafit NEW",
    rating: 4.5,
    link: "/products/headwear/153329",
  },
  {
    src: "/Harlem-Bucket-model.jpg",
    title: "Harlem Bucket",
    rating: 4.5,
    link: "/products/headwear/153169",
  },
  {
    src: "/Venture-Hat-model-scaled.webp",
    title: "Venture Hat",
    rating: 4.5,
    link: "/products/headwear/161394",
  },
  {
    src: "/Frost-Beanie-model.jpg",
    title: "Frost Beanie",
    rating: 4.5,
    link: "/products/headwear/159723",
  },
  {
    src: "/Arctic-Body-Warmer-model-scaled.webp",
    title: "Arctic Body Warmer model scaled",
    rating: 4.5,
    link: "/products/apparel/161071",
  },
  {
    src: "/Drawstrings-Orange.jpg",
    title: "Drawstrings Orange",
    rating: 4.5,
    link: "/products/apparel/159706",
  },
  {
    src: "/Glacier-Ribbed-model2.jpg",
    title: "Glacier Ribbed",
    rating: 4.5,
    link: "/products/headwear/159788",
  },
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 4000); // Rotate every 4 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="flex flex-col items-center md:hidden lg:hidden xl:hidden ">
      <span className="text-8xl font-bold text-gray-200 ">NEW</span>
      <div className="relative w-full max-w-xs overflow-hidden rounded-lg shadow-lg bg-gray-200">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <Link href={image.link}>
                <Image
                  src={image.src}
                  alt={image.title}
                  width={1300}
                  height={1300}
                  className="object-cover w-full h-70 cursor-pointer"
                />
              </Link>
              <div className="p-4 bg-gray-200">
                <h3 className="text-lg font-semibold">{image.title}</h3>
                <div className="flex items-center">
                  {Array.from({ length: Math.floor(image.rating) }, (_, i) => (
                    <span key={i} className="text-yellow-500">
                      ★
                    </span>
                  ))}
                  {image.rating % 1 !== 0 && (
                    <span className="text-yellow-500">★</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex space-x-2 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-1 rounded-full ${
              index === currentIndex ? "bg-red-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
