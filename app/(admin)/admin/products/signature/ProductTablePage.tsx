"use client";

import { useEffect, useRef } from "react";
import { ProductTable } from "../_components/UniversalTable";
import { useCollectionsStore } from "../_store/useCollectionsStore";

interface ThemeColors {
  primary: string;
  hover: string;
  text?: string;
  accent?: string;
}

interface ProductsPageProps {
  themeColors?: ThemeColors;
}

export default function ProductsPage({ themeColors }: ProductsPageProps) {
  const { collections, isLoading, fetchCollections } = useCollectionsStore();
  const initRef = useRef(false);

  useEffect(() => {
    // Skip repeated effect calls in development/strict mode
    if (initRef.current) return;
    initRef.current = true;

    const loadData = async () => {
      await fetchCollections();
    };

    loadData();

    // Cleanup function to handle component unmount
    return () => {
      initRef.current = false;
    };
  }, [fetchCollections]);

  return (
    <div className="container py-6">
      <ProductTable
        products={collections.signature || []}
        isLoading={isLoading}
        themeColors={themeColors}
      />
    </div>
  );
}
