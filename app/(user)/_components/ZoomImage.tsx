import { useState } from "react";
import Image from "next/image";

interface ZoomImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ZoomImage({
  src,
  alt,
  className = "",
}: ZoomImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      className={`relative overflow-hidden bg-white rounded-lg ${className}`}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      <div
        className={`
          relative w-full h-full transition-transform duration-300 ease-out
          ${isZoomed ? "scale-150" : "scale-100"}
        `}
        style={{
          transformOrigin: `${position.x}% ${position.y}%`,
        }}
      >
        <Image
          src={src}
          alt={alt}
          className="object-contain"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 75vw, (max-width: 1024px) 50vw, 33vw"
          priority
        />
      </div>
    </div>
  );
}
