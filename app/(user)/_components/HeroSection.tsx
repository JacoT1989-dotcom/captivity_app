import React from "react";
import Image from "next/image";

interface HeroSectionProps {
  featuredImage: {
    large: string;
  };
  categoryName: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  featuredImage,
  categoryName,
}) => {
  return (
    <div className="relative w-full rounded-lg h-[300px] mb-8">
      <Image
        src={featuredImage.large}
        alt={`${categoryName} category`}
        fill
        style={{ objectFit: "cover", objectPosition: "center-25" }}
        sizes="100vw"
        priority
      />
      <div className="absolute rounded-lg inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
          {categoryName}
        </h1>
      </div>
    </div>
  );
};

export default HeroSection;
