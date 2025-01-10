import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export interface ProductCardProps {
  id: number;
  productName: string;
  sellingPrice: number;
  featuredImage?: {
    medium?: string;
  } | null;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  productName,
  sellingPrice,
  featuredImage,
}) => {
  return (
    <Card className="overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl cursor-pointer">
      <CardContent className="p-4">
        {featuredImage && featuredImage.medium && (
          <div className="relative h-48 w-full mb-4 overflow-hidden rounded-lg">
            <Image
              src={featuredImage.medium}
              alt={productName}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              style={{ objectFit: "cover" }}
              className="transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}
        <h3 className="text-lg font-semibold mb-2 truncate">{productName}</h3>
        <p className="text-xl font-bold text-primary">
          R{sellingPrice.toFixed(2)}
        </p>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
