import React from "react";
import { usePathname } from "next/navigation";
import { useCategoryStore } from "../_store/apparel-store";
import { normalizeString } from "../_store/utils";

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
    const categoryType = pathParts[1] || ""; // e.g., "apparel"
    const specificCategory = pathParts[2] || ""; // e.g., "t-shirts"

    return products.filter(product => {
      if (!product.category || product.category.length === 0) {
        return false;
      }

      // For all-in-apparel or no specific category, show all apparel products
      if (
        categoryType === "apparel" &&
        (!specificCategory || specificCategory === "all-in-apparel")
      ) {
        return product.category.some(cat => {
          const normalizedCat = normalizeString(cat);
          return (
            normalizedCat.includes("shirt") ||
            normalizedCat.includes("hoodie") ||
            normalizedCat.includes("jacket") ||
            normalizedCat.includes("vest") ||
            normalizedCat.includes("apparel")
          );
        });
      }

      // For specific categories (e.g., t-shirts)
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
    let total = 0;

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
            total++;
            if (variation.quantity > 0) {
              inStock++;
            } else {
              outOfStock++;
            }
          }
        }
      });
    });

    return { inStock, outOfStock, total };
  };

  const { inStock, outOfStock, total } = getStockCounts();

  return (
    <div className="flex flex-col gap-2">
      {options.map(option => {
        let displayCount = total;
        if (option.value === "in") displayCount = inStock;
        if (option.value === "out") displayCount = outOfStock;

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
              {option.label} ({displayCount})
            </span>
          </label>
        );
      })}
    </div>
  );
};

export default StockLevelFilter;
