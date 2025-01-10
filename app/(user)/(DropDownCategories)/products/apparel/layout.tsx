"use client";

import React, { useEffect, useRef } from "react";
import FilterSidebar from "./_sidebar/_components/FilterSidebar";
import ProductGridWrapper from "./ProductGridWrapper";
import { useCategoryStore } from "./_store/apparel-store";
import { usePathname } from "next/navigation";
import { FilterState } from "./_store/types";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const {
    applyFilters,
    filterProductsByPath,
    fetchCategories,
    initialized,
    products,
  } = useCategoryStore();
  const initializationAttempted = useRef(false);

  // Handle initial data loading and path-based filtering
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

  // Handle path-based filtering separately
  useEffect(() => {
    if (pathname && products.length > 0) {
      filterProductsByPath(pathname);
    }
  }, [pathname, products, filterProductsByPath]);

  const handleFilterChange = (filters: FilterState) => {
    applyFilters(filters);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full relative z-30">{children}</div>

      <div className="flex w-full px-4 lg:px-8 mt-6">
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-[76px] shadow-lg">
            <FilterSidebar
              className="border-r border-gray-200"
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>

        <div className="flex-1 lg:ml-6">
          <ProductGridWrapper />
        </div>
      </div>

      <FilterSidebar
        className="lg:hidden"
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}
