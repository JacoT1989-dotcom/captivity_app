import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { FilterOption } from "../_store/types";
import { useCategoryStore } from "../_store/headwear-store";

interface ProductTypeFilterProps {
  options: FilterOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

export const ProductTypeFilter: React.FC<ProductTypeFilterProps> = ({
  options,
  selectedValue,
  onChange,
}) => {
  const router = useRouter();
  const pathname = usePathname() || "";
  const { filterProductsByPath } = useCategoryStore();

  const handleTypeChange = async (value: string) => {
    const basePath = "/products/headwear";
    const newPath = `${basePath}/${value}`;

    // First trigger the filter change
    onChange(value);

    // Then update the URL and filter products
    router.push(newPath, { scroll: false });
    // Update the filtered products based on the new path
    filterProductsByPath(newPath);
  };

  // Extract the current type from pathname
  const getCurrentType = (): string => {
    // Handle empty pathname
    if (!pathname) return "all-in-headwear";

    // Split the pathname and remove empty strings
    const pathParts = pathname.split("/").filter(Boolean);

    // Check if we have enough parts in the path
    if (pathParts.length < 3) return "all-in-headwear";

    // The type should be the last part of the path
    const currentType = pathParts[pathParts.length - 1];

    // Verify if the current type exists in options
    return options.some(option => option.value === currentType)
      ? currentType
      : "all-in-headwear";
  };

  // Use pathname to determine selected value, fallback to provided selectedValue
  const effectiveSelectedValue =
    getCurrentType() || selectedValue || "all-in-headwear";

  // Calculate the count of products for each type
  const { products } = useCategoryStore();
  const getTypeCount = (type: string): number => {
    return products.filter(product => {
      if (type === "all-in-headwear") {
        return product.category.some(cat => {
          const normalizedCat = cat.toLowerCase().replace(/[-_\s]/g, "");
          return (
            normalizedCat.includes("hat") ||
            normalizedCat.includes("cap") ||
            normalizedCat.includes("beanie") ||
            normalizedCat.includes("headwear")
          );
        });
      }

      return product.category.some(cat => {
        const normalizedCat = cat.toLowerCase().replace(/[-_\s]/g, "");
        const normalizedType = type.toLowerCase().replace(/[-_\s]/g, "");
        return normalizedCat.includes(normalizedType);
      });
    }).length;
  };

  return (
    <div className="flex flex-col gap-2">
      {options.map(option => {
        const count =
          option.value !== "all-in-headwear"
            ? getTypeCount(option.value)
            : null;

        return (
          <label key={option.value} className="inline-flex items-center">
            <input
              type="radio"
              name="productType"
              value={option.value}
              checked={effectiveSelectedValue === option.value}
              onChange={() => handleTypeChange(option.value)}
              className="relative appearance-none h-4 w-4 rounded-full border border-gray-300 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 checked:bg-white before:content-[''] before:block before:w-2 before:h-2 before:rounded-full before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 checked:before:bg-blue-600"
            />
            <span className="ml-2 text-sm text-gray-600">
              {option.label}
              {count !== null && (
                <span className="ml-1 text-xs text-gray-400">({count})</span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
};

export default ProductTypeFilter;
