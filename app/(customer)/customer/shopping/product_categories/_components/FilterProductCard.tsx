// FilterProductCard.jsx
import React, { memo, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProductImage, ProductPrice } from "./ProductCardComponents";
import { StarRating } from "./StarRating";
import { ProductWithRelations } from "../types";
interface FilterProductCardProps {
  product: ProductWithRelations;
  selectedColor: string | null;
  colors: string[];
  onColorChange: (color: string) => void;
}

const FilterProductCard: React.FC<FilterProductCardProps> = memo(
  ({ product, selectedColor, colors, onColorChange }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const defaultVariation = product.variations?.[0];
    const currentVariation =
      product.variations?.find(v => v.color === selectedColor) ||
      defaultVariation;

    const handleColorChange = (color: string) => {
      onColorChange(color);
    };

    return (
      <Card className="h-auto overflow-hidden shadow-2xl shadow-black transition-transform duration-300 hover:scale-95">
        <ProductImage
          imageSrc={
            currentVariation?.variationImageURL || product.featuredImage?.large
          }
          alt={product.productName}
        />
        <CardContent className="p-4">
          <h1 className="text-md font-md text-gray-800 font-semibold mb-2 line-clamp-1 hover:line-clamp-none">
            {product.productName}
          </h1>
          <ProductPrice
            dynamicPricing={product.dynamicPricing}
            sellingPrice={product.sellingPrice}
          />
          <div className="mb-4">
            <StarRating />
          </div>
          {/* Color Selection */}
          <div className="mb-4">
            <h4>Select Color:</h4>
            <div className="flex space-x-2 overflow-x-auto hide-scrollbar">
              {colors.map(color => (
                <Button
                  key={color}
                  title={color}
                  onClick={() => handleColorChange(color)}
                  className={`h-8 w-8 rounded-full border-gray-200 border-2 ${selectedColor === color ? "border-2 border-blue-500" : ""}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 ">
            <Button
              variant="default"
              size="sm"
              className="w-full bg-[#2c3e50] hover:bg-[#34495e] text-sm py-2"
            >
              View More
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="w-full text-sm py-2"
            >
              <Link href={`/customer/shopping/${product.id}`}>Shop</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
);

FilterProductCard.displayName = "FilterProductCard";
export default FilterProductCard;
