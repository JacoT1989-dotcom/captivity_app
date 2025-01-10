// ProductGridWrapper.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useCategoryError,
  useCategoryLoading,
  useCategoryStore,
  useFilteredProducts,
} from "./_store/headwear-store";
import { SortAsc } from "lucide-react";
import VariationsGrid from "./VariationsGrid";
import { Product } from "./_store/types";
import ProductGrid from "./ProducGrid";

interface ProductLookup {
  [key: string]: {
    id: string;
    productName: string;
    sellingPrice: number;
  };
}

const transformProducts = (
  products: Product[]
): Array<Product & { featuredImage: Product["featuredImage"] | null }> => {
  return products.map(p => ({
    ...p,
    featuredImage: p.featuredImage || null,
    variations: p.variations || [],
    reviews: p.reviews || [],
    category: p.category || [],
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

  const shouldShowVariations =
    filters.colors.length > 0 || filters.sizes.length > 0;

  // Only handle path changes after initial load
  useEffect(() => {
    if (initialized && pathname) {
      filterProductsByPath(pathname);
      setCurrentPage(1);
    }
  }, [pathname, filterProductsByPath, initialized]);

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-lg">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1} -{" "}
          {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}{" "}
          {isVariationView ? "variations" : "products"}
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <SortAsc className="w-4 h-4 text-gray-500" />
            <select
              className="text-sm border-0 bg-transparent focus:ring-0 text-gray-600 cursor-pointer"
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

          <div className="flex items-center gap-2 border-l border-gray-200 pl-6">
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
    );
  };

  const renderPagination = (
    currentPage: number,
    totalPages: number,
    setCurrentPage: (page: number) => void
  ) => {
    if (totalPages <= 1) return null;

    // Calculate the range of pages to show
    const getPageNumbers = () => {
      const delta = 2; // Number of pages to show on each side of current page
      const range: (number | string)[] = [];

      // Always show first page
      range.push(1);

      // Calculate start and end of range
      let start = Math.max(2, currentPage - delta);
      let end = Math.min(totalPages - 1, currentPage + delta);

      // Add ellipsis after first page if needed
      if (start > 2) {
        range.push("...");
      }

      // Add pages in range
      for (let i = start; i <= end; i++) {
        range.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        range.push("...");
      }

      // Always show last page if there is more than one page
      if (totalPages > 1) {
        range.push(totalPages);
      }

      return range;
    };

    return (
      <div className="flex justify-center items-center gap-2 my-16 pb-8">
        <div className="inline-flex items-center gap-2 rounded-lg bg-white p-1 shadow-sm border border-gray-200">
          <button
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex items-center gap-1 px-2">
            {getPageNumbers().map((page, index) =>
              typeof page === "number" ? (
                <button
                  key={index}
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-[2.5rem] px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentPage === page
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span key={index} className="px-2 text-gray-400">
                  {page}
                </span>
              )
            )}
          </div>

          <button
            onClick={() =>
              setCurrentPage(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 animate-pulse rounded-lg aspect-square"
          />
        ))}
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

  if (shouldShowVariations) {
    const variations = filteredProducts.flatMap(product => {
      return product.variations.filter(variation => {
        const matchesColor =
          filters.colors.length === 0 ||
          filters.colors.includes(variation.color);
        const matchesSize =
          filters.sizes.length === 0 || filters.sizes.includes(variation.size);
        return matchesColor && matchesSize;
      });
    });

    const productsLookup = filteredProducts.reduce<ProductLookup>(
      (acc, product) => {
        acc[product.id] = {
          id: product.id,
          productName: product.productName,
          sellingPrice: product.sellingPrice,
        };
        return acc;
      },
      {}
    );

    const totalItems = variations.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedVariations = variations.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    return (
      <div className="space-y-6">
        {renderControls(startIndex, totalItems, itemsPerPage, true)}
        <VariationsGrid
          variations={paginatedVariations}
          products={productsLookup}
        />
        {renderPagination(currentPage, totalPages, setCurrentPage)}
      </div>
    );
  } else {
    const transformedProducts = transformProducts(filteredProducts);
    const totalItems = transformedProducts.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedProducts = transformedProducts.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    return (
      <div className="space-y-6">
        {renderControls(startIndex, totalItems, itemsPerPage, false)}
        <ProductGrid products={paginatedProducts} />
        {renderPagination(currentPage, totalPages, setCurrentPage)}
      </div>
    );
  }
}
