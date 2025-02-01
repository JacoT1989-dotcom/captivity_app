"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SortAsc } from "lucide-react";
import VariationsGrid from "./VariationsGrid";
import { Product, SortOrderType, Variation } from "./_store/types";
import {
  useCategoryError,
  useCategoryLoading,
  useCategoryStore,
  useFilteredProducts,
} from "./_store/apparel-store";
import ProductGrid from "./ProductGrid";

interface ProductLookup {
  [key: string]: {
    id: string;
    productName: string;
    sellingPrice: number;
    dynamicPricing: {
      id: string;
      from: string;
      to: string;
      type: string;
      amount: string;
      productId: string;
    }[];
  };
}

interface GroupedVariation {
  productId: string;
  variations: {
    [color: string]: Variation[];
  };
}

const transformProducts = (products: Product[]): Product[] => {
  return products.map(p => ({
    ...p,
    featuredImage: p.featuredImage || null,
    variations: p.variations || [],
    reviews: p.reviews || [],
    category: p.category || [],
    userId: p.userId,
    productName: p.productName,
    description: p.description,
    sellingPrice: p.sellingPrice,
    isPublished: p.isPublished,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    dynamicPricing: p.dynamicPricing || [],
  }));
};

export default function ProductGridWrapper() {
  const pathname = usePathname() || "";
  const {
    fetchCategories,
    filterProductsByPath,
    sortProducts,
    filters,
    initialized,
  } = useCategoryStore();
  const filteredProducts = useFilteredProducts();
  const isLoading = useCategoryLoading();
  const error = useCategoryError();

  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  const hasColorSelected = filters.colors.length > 0;

  useEffect(() => {
    if (initialized && pathname) {
      filterProductsByPath(pathname);
      setCurrentPage(1);
    }
  }, [pathname, filterProductsByPath, initialized]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSortChange = (value: string) => {
    sortProducts(value as SortOrderType);
    setCurrentPage(1);
  };

  // Group variations by product and color
  const groupVariations = (products: Product[]) => {
    const groupedByProduct: { [productId: string]: GroupedVariation } = {};

    products.forEach(product => {
      const filteredVariations = product.variations.filter(variation => {
        const matchesColor =
          filters.colors.length === 0 ||
          filters.colors.includes(variation.color);
        const matchesSize =
          filters.sizes.length === 0 || filters.sizes.includes(variation.size);
        return matchesColor && matchesSize;
      });

      if (filteredVariations.length > 0) {
        const variationsByColor: { [color: string]: Variation[] } = {};
        filteredVariations.forEach(variation => {
          if (!variationsByColor[variation.color]) {
            variationsByColor[variation.color] = [];
          }
          variationsByColor[variation.color].push(variation);
        });

        groupedByProduct[product.id] = {
          productId: product.id,
          variations: variationsByColor,
        };
      }
    });

    return groupedByProduct;
  };

  const renderControls = (
    startIndex: number,
    totalItems: number,
    itemsPerPage: number,
    isVariationView: boolean
  ) => {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} -{" "}
            {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}{" "}
            {isVariationView ? "variations" : "products"}
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4 text-gray-500" />
              <select
                className="text-sm border-0 bg-transparent focus:ring-0 text-gray-600 cursor-pointer max-w-[200px]"
                onChange={e => handleSortChange(e.target.value)}
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>

            <div className="flex items-center gap-2 sm:border-l sm:border-gray-200 sm:pl-6">
              <span className="text-sm text-gray-500">Show</span>
              <select
                className="text-sm border-0 bg-transparent focus:ring-0 text-gray-600 cursor-pointer"
                value={itemsPerPage}
                onChange={e => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="36">36</option>
                <option value="48">48</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPagination = (
    currentPage: number,
    totalPages: number,
    setCurrentPage: (page: number) => void
  ) => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center gap-2 py-8">
        <div className="inline-flex items-center rounded-lg bg-white p-1 shadow-sm border border-gray-200">
          <button
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="w-20 px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="w-12 flex justify-center">
            <span className="px-3 py-2 text-sm font-medium rounded-md bg-gray-900 text-white">
              {currentPage}
            </span>
          </div>

          <button
            onClick={() =>
              setCurrentPage(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="w-20 px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 animate-pulse rounded-lg aspect-square w-full"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Error loading products: {error}
      </div>
    );
  }

  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <div className="text-center py-8">
        No products found with current filters
      </div>
    );
  }

  const startIndex = (currentPage - 1) * itemsPerPage;

  if (hasColorSelected) {
    const productsLookup = filteredProducts.reduce<ProductLookup>(
      (acc, product) => {
        acc[product.id] = {
          id: product.id,
          productName: product.productName,
          sellingPrice: product.sellingPrice,
          dynamicPricing: product.dynamicPricing || [],
        };
        return acc;
      },
      {}
    );

    const groupedProducts = groupVariations(filteredProducts);
    const totalProducts = Object.keys(groupedProducts).length;
    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    // Get paginated products
    const paginatedProductIds = Object.keys(groupedProducts).slice(
      startIndex,
      startIndex + itemsPerPage
    );

    // Create variations array for paginated products
    const paginatedVariations = paginatedProductIds.flatMap(productId => {
      const groupedVariation = groupedProducts[productId];
      return Object.values(groupedVariation.variations).flat();
    });

    return (
      <div className="w-full space-y-6">
        {renderControls(startIndex, totalProducts, itemsPerPage, true)}
        <div className="w-full">
          <VariationsGrid
            variations={paginatedVariations}
            products={productsLookup}
          />
        </div>
        {renderPagination(currentPage, totalPages, setCurrentPage)}
      </div>
    );
  }

  const transformedProducts = transformProducts(filteredProducts);
  const totalItems = transformedProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedProducts = transformedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="w-full space-y-6">
      {renderControls(startIndex, totalItems, itemsPerPage, false)}
      <div className="w-full relative">
        <ProductGrid products={paginatedProducts} key={currentPage} />
      </div>
      {renderPagination(currentPage, totalPages, setCurrentPage)}
    </div>
  );
}
