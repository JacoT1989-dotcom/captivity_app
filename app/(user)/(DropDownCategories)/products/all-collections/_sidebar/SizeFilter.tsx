import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useCategoryStore } from "../_store/all-collections-store";

interface SizeFilterProps {
  options: Array<{ value: string; label: string }>;
  selectedValue: string[];
  onChange: (value: string) => void;
}

const normalizeString = (str: string): string => {
  return str.toLowerCase().replace(/[-_\s]/g, "");
};

export const SizeFilter: React.FC<SizeFilterProps> = ({
  options,
  selectedValue,
  onChange,
}) => {
  const pathname = usePathname() || "";
  const { products, filters } = useCategoryStore();

  // Get collection from pathname
  const getCollectionFromPath = useMemo(() => {
    const pathParts = pathname.split("/").filter(Boolean);
    const isCollectionPath = pathParts[1] === "all-collections";
    return isCollectionPath ? pathParts[2] : null;
  }, [pathname]);

  // Get products filtered by collection and current filters
  const filteredProducts = useMemo(() => {
    const collection = getCollectionFromPath;

    return products.filter(product => {
      // Skip if no category
      if (!product.category || product.category.length === 0) return false;

      // Check collection match
      const matchesCollection =
        !collection ||
        collection === "all-collections" ||
        collection === "all-in-collections" ||
        product.category.some(cat => {
          const normalizedCat = normalizeString(cat);
          const normalizedCollection = collection
            ? normalizeString(collection.replace("-collection", ""))
            : "";
          return (
            normalizedCollection === "" ||
            normalizedCat === normalizedCollection ||
            normalizedCat === normalizedCollection + "collection" ||
            normalizedCat.includes(normalizedCollection)
          );
        });

      if (!matchesCollection) return false;

      // Check if matches current color filters
      const matchesColors =
        filters.colors.length === 0 ||
        product.variations.some(v => filters.colors.includes(v.color));

      return matchesColors;
    });
  }, [products, getCollectionFromPath, filters.colors]);

  // Calculate available sizes and their counts
  const { availableSizes, sizeCounts } = useMemo(() => {
    const sizeMap = new Map<string, number>();
    const availableSizeSet = new Set<string>();

    filteredProducts.forEach(product => {
      product.variations.forEach(variation => {
        if (!variation.size) return;

        // Check if variation matches current color filters
        const matchesColor =
          filters.colors.length === 0 ||
          filters.colors.includes(variation.color);

        if (matchesColor) {
          const currentCount = sizeMap.get(variation.size) || 0;
          sizeMap.set(variation.size, currentCount + 1);
          availableSizeSet.add(variation.size);
        }
      });
    });

    return {
      availableSizes: Array.from(availableSizeSet),
      sizeCounts: sizeMap,
    };
  }, [filteredProducts, filters.colors]);

  // Filter options to only show available sizes
  const filteredOptions = options.filter(option =>
    availableSizes.includes(option.value)
  );

  if (filteredOptions.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2">
      {filteredOptions.map(option => (
        <label key={option.value} className="inline-flex items-center">
          <input
            type="checkbox"
            name="size"
            value={option.value}
            checked={selectedValue.includes(option.value)}
            onChange={() => onChange(option.value)}
            className="relative appearance-none h-4 w-4 rounded-full border border-gray-300 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 checked:bg-white before:content-[''] before:block before:w-2 before:h-2 before:rounded-full before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 checked:before:bg-blue-600"
          />
          <span className="ml-2 text-sm text-gray-600">
            {option.label}
            <span className="ml-1 text-xs text-gray-400">
              ({sizeCounts.get(option.value) || 0})
            </span>
          </span>
        </label>
      ))}
    </div>
  );
};

export default SizeFilter;
