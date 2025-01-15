import React from "react";
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

  // Get products that match the current pathname
  const getPathMatchedProducts = () => {
    const pathParts = pathname.split("/").filter(Boolean);
    const isCollectionPath = pathParts[1] === "all-collections";
    const specificCollection = pathParts[2];

    if (!isCollectionPath) return products;

    return products.filter(product => {
      if (!product.category || product.category.length === 0) {
        return false;
      }

      if (
        !specificCollection ||
        specificCollection === "all-collections" ||
        specificCollection === "all-in-collections"
      ) {
        return true;
      }

      return product.category.some(cat => {
        const normalizedCat = normalizeString(cat);
        const normalizedType = normalizeString(specificCollection);
        return (
          normalizedCat === normalizedType ||
          normalizedCat === normalizedType.replace("-collection", "") ||
          normalizedCat.includes(normalizedType.replace("-collection", ""))
        );
      });
    });
  };

  // Get available sizes with counts for the current path
  const getSizeCounts = () => {
    const sizeCounts = new Map<string, number>();
    const pathMatchedProducts = getPathMatchedProducts();

    pathMatchedProducts.forEach(product => {
      // Check if product matches current type filter
      const matchesType =
        !filters.types.length ||
        filters.types[0] === "all-in-collections" ||
        filters.types[0] === "all-collections" ||
        product.category.some(cat => {
          const normalizedCat = normalizeString(cat);
          return filters.types.some(type => {
            const normalizedType = normalizeString(type);
            return normalizedCat.includes(
              normalizedType.replace("-collection", "")
            );
          });
        });

      if (!matchesType) return;

      // Count sizes from variations that match current color filters
      product.variations.forEach(variation => {
        const matchesColor =
          filters.colors.length === 0 ||
          filters.colors.includes(variation.color);

        if (matchesColor && variation.size) {
          const currentCount = sizeCounts.get(variation.size) || 0;
          sizeCounts.set(variation.size, currentCount + 1);
        }
      });
    });

    return sizeCounts;
  };

  const sizeCounts = getSizeCounts();

  // Filter options to only show sizes that are available
  const availableOptions = options.filter(option =>
    sizeCounts.has(option.value)
  );

  return (
    <div className="grid grid-cols-2 gap-2">
      {availableOptions.map(option => (
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
              ({sizeCounts.get(option.value)})
            </span>
          </span>
        </label>
      ))}
    </div>
  );
};

export default SizeFilter;
