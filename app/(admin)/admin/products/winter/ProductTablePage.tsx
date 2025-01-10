"use client";

import { useEffect, useRef } from "react";
import { ProductTable } from "../_components/UniversalTable";
import { useCollectionsStore } from "../_store/useCollectionsStore";

export default function ProductsPage() {
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
      <ProductTable products={collections.winter || []} isLoading={isLoading} />
    </div>
  );
}
