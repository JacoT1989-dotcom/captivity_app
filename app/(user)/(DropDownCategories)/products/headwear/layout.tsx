// app/(user)/products/headwear/layout.tsx
"use client";

import React, { useEffect } from "react";
import FilterSidebar from "./_sidebar/_components/FilterSidebar";
import ProductGridWrapper from "./ProductGridWrapper";
import { useCategoryStore } from "./_store/headwear-store";
import { usePathname } from "next/navigation";
import { FilterState } from "./_store/types";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const { applyFilters, filterProductsByPath, fetchCategories, initialized } =
    useCategoryStore();

  useEffect(() => {
    const initializeProducts = async () => {
      if (!initialized) {
        await fetchCategories();
      }
      if (pathname) {
        filterProductsByPath(pathname);
      }
    };

    initializeProducts();
  }, [initialized, fetchCategories, filterProductsByPath, pathname]);

  const handleFilterChange = (filters: FilterState) => {
    applyFilters(filters);
  };

  return (
    <div className="min-h-screen w-full">
      <div className="w-full relative z-30">{children}</div>

      <div className="flex w-full px-2 sm:px-4 lg:px-8 mt-6">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-[76px]">
            <FilterSidebar
              className="border-r border-gray-200"
              onFilterChange={handleFilterChange}
            />
          </div>
        </aside>

        <main className="flex-1 lg:ml-6 w-full lg:max-w-[calc(100%-16rem)]">
          {" "}
          {/* Updated width calculation */}
          <div className="w-full">
            <ProductGridWrapper />
          </div>
        </main>
      </div>

      <FilterSidebar
        className="lg:hidden"
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}
