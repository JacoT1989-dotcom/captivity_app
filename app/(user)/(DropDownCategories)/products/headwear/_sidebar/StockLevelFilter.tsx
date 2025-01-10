import React from "react";
import { usePathname } from "next/navigation";
import { normalizeString, useCategoryStore } from "../_store/headwear-store";

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

  // Get products that match the current pathname category
  const getPathMatchedProducts = () => {
    const pathParts = pathname.split("/").filter(Boolean);
    const categoryType = pathParts[1] || ""; // e.g., "headwear"
    const specificCategory = pathParts[2] || ""; // e.g., "beanies"

    return products.filter(product => {
      if (!product.category || product.category.length === 0) {
        return false;
      }

      // For all-in-headwear or no specific category, show all headwear products
      if (
        categoryType === "headwear" &&
        (!specificCategory || specificCategory === "all-in-headwear")
      ) {
        return product.category.some(cat => {
          const normalizedCat = normalizeString(cat);
          return (
            normalizedCat.includes("hat") ||
            normalizedCat.includes("cap") ||
            normalizedCat.includes("beanie") ||
            normalizedCat.includes("headwear")
          );
        });
      }

      // For specific categories (e.g., beanies)
      return product.category.some(cat => {
        const normalizedCat = normalizeString(cat);
        const normalizedSpecific = normalizeString(specificCategory);
        return normalizedCat.includes(normalizedSpecific);
      });
    });
  };

  // Calculate stock counts for pathname-matched and filtered variations
  const getStockCounts = () => {
    let inStock = 0;
    let outOfStock = 0;

    const pathMatchedProducts = getPathMatchedProducts();

    pathMatchedProducts.forEach(product => {
      product.variations.forEach(variation => {
        // Only count variations that match current color filter
        if (
          filters.colors.length === 0 ||
          filters.colors.includes(variation.color)
        ) {
          // Only count variations that match current size filter
          if (
            filters.sizes.length === 0 ||
            filters.sizes.includes(variation.size)
          ) {
            if (variation.quantity > 0) {
              inStock++;
            } else {
              outOfStock++;
            }
          }
        }
      });
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
              {option.value !== "all" && (
                <span className="ml-1 text-xs text-gray-400">({count})</span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
};

export default StockLevelFilter;
