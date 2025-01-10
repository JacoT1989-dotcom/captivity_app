// ProductTypeFilter.tsx
import React, { useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FilterOption } from "../_store/types";

interface ProductTypeFilterProps {
  options: FilterOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  alwaysActive?: boolean;
}

export const ProductTypeFilter: React.FC<ProductTypeFilterProps> = ({
  options,
  selectedValue,
  onChange,
  alwaysActive = false
}) => {
  const router = useRouter();
  const pathname = usePathname() || "";

  // Memoize getCurrentType to avoid recreating it on every render
  const getCurrentType = useCallback((): string => {
    if (!pathname) return "all-in-apparel";

    const pathParts = pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];

    // Check if the last part matches any option value
    const isValidType = options.some(option => option.value === lastPart);
    return isValidType ? lastPart : "all-in-apparel";
  }, [pathname, options]);

  // Apply filters immediately when URL changes
  useEffect(() => {
    if (alwaysActive) {
      const currentType = getCurrentType();
      if (currentType !== selectedValue) {
        onChange(currentType);
      }
    }
  }, [pathname, getCurrentType, onChange, selectedValue, alwaysActive]);

  const handleTypeChange = (value: string) => {
    const basePath = "/products/apparel";
    const newPath = `${basePath}/${value}`;

    // First trigger the filter change
    onChange(value);

    // Then update the URL without page reload
    router.push(newPath, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-2">
      {options.map(option => (
        <label key={option.value} className="inline-flex items-center">
          <input
            type="radio"
            name="productType"
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => handleTypeChange(option.value)}
            className="relative appearance-none h-4 w-4 rounded-full border border-gray-300 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 checked:bg-white before:content-[''] before:block before:w-2 before:h-2 before:rounded-full before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 checked:before:bg-blue-600"
          />
          <span className="ml-2 text-sm text-gray-600">{option.label}</span>
        </label>
      ))}
    </div>
  );
};