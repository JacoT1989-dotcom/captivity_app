import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductWithFeaturedImage } from "../(DropDownCategories)/products/all-collections/types";

interface RelatedProductsProps {
  products: ProductWithFeaturedImage[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(product => (
          <Link href={`/product/${product.id}`} key={product.id}>
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="relative h-48 mb-2">
                <Image
                  src={
                    product.featuredImage?.medium || "/placeholder-image.jpg"
                  }
                  alt={product.productName}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-md"
                />
              </div>
              <h3 className="text-lg font-semibold">{product.productName}</h3>
              <p className="text-gray-600">
                R{product.sellingPrice.toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
