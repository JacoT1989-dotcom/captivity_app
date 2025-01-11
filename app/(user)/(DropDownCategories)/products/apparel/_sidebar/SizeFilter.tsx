import React from "react";
import { usePathname } from "next/navigation";
import { useCategoryStore } from "../_store/apparel-store";
import { normalizeString } from "../_store/utils";

interface SizeFilterProps {
  options: Array<{ value: string; label: string }>;
  selectedValue: string[];
  onChange: (value: string) => void;
}

export const SizeFilter: React.FC<SizeFilterProps> = ({
  options,
  selectedValue,
  onChange,
}) => {
  const pathname = usePathname() || "";
  const { products, filters } = useCategoryStore();

  // Get available sizes based on current product type and filters
  const getAvailableSizes = () => {
    const pathParts = pathname.split("/").filter(Boolean);
    const productType = pathParts[2] || "all-in-apparel";
    const availableSizes = new Set<string>();

    products.forEach(product => {
      // Skip if product has no categories
      if (!product.category || product.category.length === 0) return;

      // Check if product matches the current type
      const matchesType = product.category.some(cat => {
        const normalizedCat = normalizeString(cat);
        if (productType === "all-in-apparel") {
          return (
            normalizedCat.includes("shirt") ||
            normalizedCat.includes("hoodie") ||
            normalizedCat.includes("jacket") ||
            normalizedCat.includes("vest") ||
            normalizedCat.includes("apparel")
          );
        }
        return normalizedCat.includes(normalizeString(productType));
      });

      if (matchesType) {
        // Check variations that match current color filter
        product.variations.forEach(variation => {
          if (
            (filters.colors.length === 0 ||
              filters.colors.includes(variation.color)) &&
            (filters.stockLevel === "all" ||
              (filters.stockLevel === "in" && variation.quantity > 0) ||
              (filters.stockLevel === "out" && variation.quantity === 0))
          ) {
            availableSizes.add(variation.size);
          }
        });
      }
    });

    return availableSizes;
  };

  const availableSizes = getAvailableSizes();

  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map(option => {
        const isAvailable = availableSizes.has(option.value);
        if (!isAvailable) return null;

        return (
          <label key={option.value} className="inline-flex items-center">
            <input
              type="checkbox"
              name="size"
              value={option.value}
              checked={selectedValue.includes(option.value)}
              onChange={() => onChange(option.value)}
              className="relative appearance-none h-4 w-4 rounded-full border border-gray-300 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 checked:bg-white before:content-[''] before:block before:w-2 before:h-2 before:rounded-full before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 checked:before:bg-blue-600"
            />
            <span className="ml-2 text-sm text-gray-600">{option.label}</span>
          </label>
        );
      })}
    </div>
  );
};

export default SizeFilter;
