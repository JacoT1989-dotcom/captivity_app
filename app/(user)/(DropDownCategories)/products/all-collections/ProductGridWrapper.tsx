"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SortAsc } from "lucide-react";
import VariationsGrid from "./VariationsGrid";
import { Product } from "./_store/types";
import {
  useCategoryError,
  useCategoryLoading,
  useCategoryStore,
  useFilteredProducts,
} from "./_store/all-collections-store";
import ProductGrid from "./ProducGrid";

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
    products,
  } = useCategoryStore();
  const filteredProducts = useFilteredProducts();
  const isLoading = useCategoryLoading();
  const error = useCategoryError();

  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  const hasColorSelected = filters.colors.length > 0;

  // First effect to fetch categories
  useEffect(() => {
    if (!initialized) {
      fetchCategories();
    }
  }, [initialized, fetchCategories]);

  // Second effect to handle URL-based filtering
  useEffect(() => {
    if (initialized && products.length > 0 && pathname) {
      filterProductsByPath(pathname);
      setCurrentPage(1);
    }
  }, [pathname, filterProductsByPath, initialized, products]);

  const handleSortChange = (value: string) => {
    sortProducts(value);
    setCurrentPage(1);
  };

  const renderControls = (
    startIndex: number,
    totalItems: number,
    itemsPerPage: number,
    isVariationView: boolean
  ) => {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
          <div className="text-sm text-gray-600 whitespace-nowrap">
            Showing {startIndex + 1} -{" "}
            {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}{" "}
            {isVariationView ? "products" : "products"}
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <div className="flex items-center gap-2 min-w-[120px]">
              <SortAsc className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <select
                className="text-sm border-0 bg-transparent focus:ring-0 text-gray-600 cursor-pointer w-full"
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

  if (!products || products.length === 0) {
    return <div className="text-center py-8">Loading products...</div>;
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
    // Group variations by product
    const productGroups = filteredProducts.reduce<Record<string, Product>>(
      (acc, product) => {
        const matchingVariations = product.variations.filter(variation => {
          const matchesColor =
            filters.colors.length === 0 ||
            filters.colors.includes(variation.color);
          const matchesSize =
            filters.sizes.length === 0 ||
            filters.sizes.includes(variation.size);
          const matchesStock =
            filters.stockLevel === "all" ||
            (filters.stockLevel === "in" && variation.quantity > 0) ||
            (filters.stockLevel === "out" && variation.quantity <= 0);

          return matchesColor && matchesSize && matchesStock;
        });

        if (matchingVariations.length > 0) {
          acc[product.id] = {
            ...product,
            variations: matchingVariations,
          };
        }
        return acc;
      },
      {}
    );

    // Convert to array and paginate
    const productsArray = Object.values(productGroups);
    const totalItems = productsArray.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedProducts = productsArray.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    // Create product lookup for VariationsGrid
    const productsLookup = paginatedProducts.reduce<ProductLookup>(
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

    // Get all variations for paginated products
    const allVariations = paginatedProducts.flatMap(
      product => product.variations
    );

    return (
      <div className="w-full max-w-full space-y-6">
        {renderControls(startIndex, totalItems, itemsPerPage, true)}
        <div className="w-full max-w-full">
          <VariationsGrid
            variations={allVariations}
            products={productsLookup}
          />
        </div>
        {renderPagination(currentPage, totalPages, setCurrentPage)}
      </div>
    );
  }

  const transformedProducts = transformProducts(filteredProducts).filter(
    product => {
      const hasMatchingVariations = product.variations.some(variation => {
        const matchesSize =
          filters.sizes.length === 0 || filters.sizes.includes(variation.size);
        const matchesColor =
          filters.colors.length === 0 ||
          filters.colors.includes(variation.color);
        const stockStatus = variation.quantity > 0;
        const matchesStock =
          filters.stockLevel === "all" ||
          (filters.stockLevel === "in" && stockStatus) ||
          (filters.stockLevel === "out" && !stockStatus);

        return matchesSize && matchesColor && matchesStock;
      });

      return hasMatchingVariations;
    }
  );

  const totalItems = transformedProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedProducts = transformedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="w-full max-w-full space-y-6">
      {renderControls(startIndex, totalItems, itemsPerPage, false)}
      <div className="w-full max-w-full">
        <ProductGrid products={paginatedProducts} key={currentPage} />
      </div>
      {renderPagination(currentPage, totalPages, setCurrentPage)}
    </div>
  );
}
