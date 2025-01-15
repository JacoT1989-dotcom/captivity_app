import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FilterOption } from "../_store/types";
import { useCategoryStore } from "../_store/all-collections-store";

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
  const { filterProductsByPath, products, filteredProducts } =
    useCategoryStore();
  const [typeCounts, setTypeCounts] = useState<Record<string, number>>({});

  const normalizeString = (str: string): string => {
    return str.toLowerCase().replace(/[-_\s]/g, "");
  };

  useEffect(() => {
    if (!products || products.length === 0) return;

    const calculateCounts = () => {
      const counts: Record<string, number> = {};

      // For all-collections/all-in-collections, use the total number of products
      counts["all-in-collections"] = products.length;
      counts["all-collections"] = products.length;

      options.forEach(option => {
        if (
          option.value === "all-in-collections" ||
          option.value === "all-collections"
        )
          return;

        const count = products.filter(product => {
          if (!product.category || product.category.length === 0) return false;

          return product.category.some(cat => {
            const normalizedCat = normalizeString(cat);
            const normalizedOption = normalizeString(
              option.value.replace("-collection", "")
            );

            return (
              normalizedCat === normalizedOption ||
              normalizedCat === normalizedOption + "collection" ||
              normalizedCat.includes(normalizedOption)
            );
          });
        }).length;

        counts[option.value] = count;
      });

      setTypeCounts(counts);
    };

    calculateCounts();
  }, [products, options, pathname]);

  const handleTypeChange = (value: string) => {
    // Maintain the correct base path
    const basePath = "/products/all-collections";

    let newPath;
    if (value === "all-collections") {
      // If all-collections is selected, redirect to all-in-collections
      newPath = `${basePath}/all-in-collections`;
      onChange("all-in-collections");
    } else {
      newPath = `${basePath}/${value}`;
      onChange(value);
    }

    router.push(newPath, { scroll: false });
    filterProductsByPath(newPath);
  };

  const getCurrentType = (): string => {
    const pathParts = pathname.split("/").filter(Boolean);

    if (pathParts.length < 3) {
      return "all-in-collections";
    }

    const currentType = pathParts[2];
    const validType = options.some(option => option.value === currentType)
      ? currentType
      : "all-in-collections";

    return validType;
  };

  const effectiveSelectedValue =
    getCurrentType() || selectedValue || "all-in-collections";

  return (
    <div className="flex flex-col gap-2">
      {options.map(option => (
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
            <span className="ml-1 text-xs text-gray-400">
              ({typeCounts[option.value] || 0})
            </span>
          </span>
        </label>
      ))}
    </div>
  );
};

export default ProductTypeFilter;
