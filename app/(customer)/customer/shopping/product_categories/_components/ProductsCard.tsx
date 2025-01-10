import React, { memo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProductImage, ProductPrice } from "./ProductCardComponents";
import { StarRating } from "./StarRating";
import {
  Product,
  DynamicPricing,
  FeaturedImage,
  Variation,
} from "@prisma/client";
import { VariationWithRelations } from "../../[id]/[variationId]/_types/types";
import { fetchVariationById } from "../../[id]/[variationId]/actions";
import VariationDetails from "../../[id]/[variationId]/VariationDetails";

type ProductWithRelations = Product & {
  dynamicPricing: DynamicPricing[];
  featuredImage: FeaturedImage | null;
  variations?: Variation[];
};

interface ProductCardProps {
  product: ProductWithRelations;
  selectedVariation?: Variation;
}

const ProductCard: React.FC<ProductCardProps> = memo(
  ({ product, selectedVariation }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [variationData, setVariationData] =
      useState<VariationWithRelations | null>(null);
    const defaultVariation = product.variations?.[0];
    const currentVariation = selectedVariation || defaultVariation;

    const handleViewMore = async () => {
      if (currentVariation?.id) {
        const result = await fetchVariationById(currentVariation.id);
        if (result.success) {
          setVariationData(result.data);
          setIsModalOpen(true);
        }
      }
    };

    return (
      <>
        <Card className="h-auto overflow-hidden shadow-2xl shadow-black transition-transform duration-300 hover:scale-95 ">
          <ProductImage
            imageSrc={product.featuredImage?.large}
            alt={product.productName}
          />
          <CardContent className="p-4">
            <h3 className="text-sm font-sm text-gray-800 mb-2 line-clamp-1 hover:line-clamp-none">
              {product.productName}
            </h3>
            <ProductPrice
              dynamicPricing={product.dynamicPricing}
              sellingPrice={product.sellingPrice}
            />
            <div className="mb-4">
              <StarRating />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleViewMore}
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

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
            <DialogTitle className="text-xl font-semibold">
              {product.productName}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              View detailed information about this product variation.
            </DialogDescription>
            {variationData && <VariationDetails data={variationData} />}
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
