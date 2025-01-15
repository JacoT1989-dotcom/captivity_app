"use client";

import React, { useEffect } from "react";
import FilterSidebar from "./_sidebar/_components/FilterSidebar";
import ProductGridWrapper from "./ProductGridWrapper";
import { usePathname } from "next/navigation";
import { FilterState } from "./_store/types";
import { useCategoryStore } from "./_store/all-collections-store";

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

  // Initialize products when component mounts
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Separate effect for filtering after products are loaded
  useEffect(() => {
    if (initialized && pathname && products.length > 0) {
      filterProductsByPath(pathname);
    }
  }, [initialized, pathname, products, filterProductsByPath]);

  const handleFilterChange = (filters: FilterState) => {
    applyFilters(filters);
  };

  return (
    <div className="min-h-screen w-full">
      {/* Banner area - full width with lower z-index */}
      <div className="w-full relative z-30">{children}</div>

      {/* Content area with sidebar - positioned below banner */}
      <div className="flex w-full px-2 sm:px-4 lg:px-8 mt-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-[76px]">
            <FilterSidebar
              className="border-r border-gray-200"
              onFilterChange={handleFilterChange}
            />
          </div>
        </aside>

        {/* Main content area with max-width constraint */}
        <main className="flex-1 lg:ml-6 w-full lg:max-w-[calc(100%-16rem)]">
          <div className="w-full">
            <ProductGridWrapper />
          </div>
        </main>
      </div>

      {/* Mobile FilterSidebar */}
      <FilterSidebar
        className="lg:hidden"
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}
