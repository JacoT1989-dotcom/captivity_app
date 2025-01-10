"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";

const COLLECTIONS = [
  "Winter",
  "Summer",
  "African",
  "Baseball",
  "Camo",
  "Fashion",
  "Industrial",
  "Kids",
  "Leisure",
  "Signature",
  "Sport",
] as const;

type Collection = (typeof COLLECTIONS)[number];

const FilterSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const vendorWebsite = params?.vendor_website as string;

  // Function to extract collection name from pathname
  const getCurrentCollection = useCallback((): Collection | null => {
    if (!pathname) return null;

    // Split the pathname and get the last segment
    const segments = pathname.split("/");
    const lastSegment = segments[segments.length - 1];

    // Find matching collection (case-insensitive)
    return (
      COLLECTIONS.find(
        collection => collection.toLowerCase() === lastSegment.toLowerCase()
      ) ?? null
    );
  }, [pathname]);

  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(() => getCurrentCollection());

  const handleCollectionChange = (value: Collection) => {
    setSelectedCollection(value);

    const basePath = `/vendor/${vendorWebsite}/shopping/product_categories`;
    const collectionPath = value.toLowerCase();
    const newPath = `${basePath}/${collectionPath}`;

    router.push(newPath, { scroll: false });
  };

  // Update selected collection when path changes
  useEffect(() => {
    const currentCollection = getCurrentCollection();
    if (currentCollection !== selectedCollection) {
      setSelectedCollection(currentCollection);
    }
  }, [getCurrentCollection, selectedCollection]);

  return (
    <div className="bg-card p-4 rounded-lg shadow-2xl shadow-black dark:shadow-none">
      <div className="text-2xl font-semibold mb-4 text-foreground">
        Collections
      </div>

      {/* Collections */}
      <div className="flex flex-col space-y-4" role="radiogroup">
        {COLLECTIONS.map(collection => (
          <label
            key={collection}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <input
              type="radio"
              name="collection"
              value={collection}
              checked={selectedCollection === collection}
              onChange={() => handleCollectionChange(collection)}
              className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
            />
            <span className="text-base group-hover:text-primary transition-colors">
              {collection}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;
