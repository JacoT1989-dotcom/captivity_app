import React from "react";
import { usePathname } from "next/navigation";
import {
  normalizeString,
  useCategoryStore,
} from "../_store/all-collections-store";

interface StockLevelFilterProps {
  options: Array<{ value: string; label: string }>;
  selectedValue: string;
  onChange: (value: string) => void;
}

export const StockLevelFilter: React.FC<StockLevelFilterProps> = ({
  options,
  selectedValue,
  onChange,
}) => {
  const pathname = usePathname() || "";
  const { filters, products } = useCategoryStore();

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

  const getStockCounts = () => {
    let inStock = 0;
    let outOfStock = 0;

    const pathMatchedProducts = getPathMatchedProducts();

    pathMatchedProducts.forEach(product => {
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

      // Check if any variation matches current size and color filters
      const hasMatchingVariations = product.variations.some(variation => {
        const matchesColor =
          filters.colors.length === 0 ||
          filters.colors.includes(variation.color);
        const matchesSize =
          filters.sizes.length === 0 || filters.sizes.includes(variation.size);
        return matchesColor && matchesSize;
      });

      if (!hasMatchingVariations) return;

      // Count stock status
      const totalStock = product.variations.reduce(
        (sum, variation) => sum + variation.quantity,
        0
      );

      if (totalStock > 0) {
        inStock++;
      } else {
        outOfStock++;
      }
    });

    return { inStock, outOfStock };
  };

  const { inStock, outOfStock } = getStockCounts();

  return (
    <div className="flex flex-col gap-2">
      {options.map(option => {
        let count = 0;
        if (option.value === "in") count = inStock;
        if (option.value === "out") count = outOfStock;
        if (option.value === "all") count = inStock + outOfStock;

        return (
          <label key={option.value} className="inline-flex items-center">
            <input
              type="radio"
              name="stockLevel"
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => onChange(option.value)}
              className="relative appearance-none h-4 w-4 rounded-full border border-gray-300 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 checked:bg-white before:content-[''] before:block before:w-2 before:h-2 before:rounded-full before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 checked:before:bg-blue-600"
            />
            <span className="ml-2 text-sm text-gray-600">
              {option.label}
              <span className="ml-1 text-xs text-gray-400">({count})</span>
            </span>
          </label>
        );
      })}
    </div>
  );
};

export default StockLevelFilter;
