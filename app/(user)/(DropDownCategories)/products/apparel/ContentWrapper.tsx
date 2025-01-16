// ContentWrapper.tsx
"use client";

import React, { useEffect, useRef } from "react";
import ProductGridWrapper from "./ProductGridWrapper";
import { useCategoryStore } from "./_store/apparel-store";
import { usePathname } from "next/navigation";
import { FilterState } from "./_store/types";
import { FilterSidebar } from "./_sidebar/_components/FilterSidebar";

export default function ContentWrapper() {
  const pathname = usePathname();
  const {
    applyFilters,
    filterProductsByPath,
    fetchCategories,
    initialized,
    products,
  } = useCategoryStore();
  const initializationAttempted = useRef(false);

  useEffect(() => {
    const initializeProducts = async () => {
      try {
        if (!initialized && !initializationAttempted.current) {
          initializationAttempted.current = true;
          await fetchCategories();
        }
      } catch (error) {
        console.error("Error initializing products:", error);
      }
    };

    initializeProducts();
  }, [initialized, fetchCategories]);

  useEffect(() => {
    if (pathname && products.length > 0) {
      filterProductsByPath(pathname);
    }
  }, [pathname, products, filterProductsByPath]);

  const handleFilterChange = (filters: FilterState) => {
    applyFilters(filters);
  };

  return (
    <div className="flex w-full min-h-screen relative">
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-[76px] max-h-[calc(100vh-76px)] overflow-y-auto">
          <FilterSidebar
            className="border-r border-gray-200"
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      <div className="w-full lg:ml-6">
        <ProductGridWrapper />
      </div>

      <FilterSidebar
        className="lg:hidden fixed right-0 top-0 h-full z-50"
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}
