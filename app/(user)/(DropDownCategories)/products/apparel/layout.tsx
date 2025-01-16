"use client";
import React, { useEffect } from "react";
import FilterSidebar from "./_sidebar/_components/FilterSidebar";
import ProductGridWrapper from "./ProductGridWrapper";
import { usePathname } from "next/navigation";
import { FilterState } from "./_store/types";
import { useCategoryStore } from "./_store/apparel-store";

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
    <div className="min-h-screen w-full relative">
      <div className="relative z-30">{children}</div>

      <div className="flex w-full mt-6">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-[76px]">
            <FilterSidebar
              className="mr-6"
              onFilterChange={handleFilterChange}
            />
          </div>
        </aside>

        <main className="flex-1">
          <div className="w-full max-w-[calc(100vw-32px)] lg:max-w-full mx-auto">
            <ProductGridWrapper />
          </div>
        </main>
      </div>

      <div className="fixed bottom-0 right-0 p-6 z-50 lg:hidden">
        <FilterSidebar onFilterChange={handleFilterChange} />
      </div>
    </div>
  );
}
