import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ProductLookup {
  [key: string]: {
    id: string;
    productName: string;
    sellingPrice: number;
  };
}

interface VariationsGridProps {
  variations: Array<{
    id: string;
    name: string;
    color: string;
    size: string;
    sku: string;
    sku2: string;
    variationImageURL: string;
    quantity: number;
    productId: string;
  }>;
  products: ProductLookup;
}

const VariationsGrid = ({ variations, products }: VariationsGridProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(price);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {variations.map(variation => {
        const product = products[variation.productId];

        return (
          <Link
            key={variation.id}
            href={`/products/${variation.productId}`}
            className="group relative bg-white rounded-lg hover:shadow-lg transition-shadow shadow-lg"
          >
            <div className="aspect-square relative overflow-hidden rounded-t-lg">
              {variation.variationImageURL ? (
                <Image
                  src={variation.variationImageURL}
                  alt={variation.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="text-center">
                    <span className="block text-lg font-medium text-gray-600">
                      {product?.productName || variation.name}
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">
                      {variation.color} - {variation.size}
                    </span>
                  </div>
                </div>
              )}

              {/* Size and Color Badge */}
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 text-xs font-medium bg-gray-900 text-white rounded-full">
                  {variation.size}
                </span>
              </div>

              {/* Stock Badge */}
              <div className="absolute top-2 right-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    variation.quantity > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {variation.quantity > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                {product?.productName || variation.name}
              </h3>

              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                    {variation.color}
                  </span>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                    Size: {variation.size}
                  </span>
                </div>
              </div>

              {product && (
                <p className="mt-3 text-lg font-bold text-gray-900">
                  {formatPrice(product.sellingPrice)}
                </p>
              )}
            </div>
          </Link>
        );
      })}

      {variations.length === 0 && (
        <div className="col-span-full text-center py-8 text-gray-500">
          No variations found with selected filters
        </div>
      )}
    </div>
  );
};

export default VariationsGrid;
