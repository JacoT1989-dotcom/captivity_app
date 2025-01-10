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
  alwaysActive = false,
}) => {
  const router = useRouter();
  const pathname = usePathname() || "";

  const getCurrentType = useCallback((): string => {
    if (!pathname) return "all-in-apparel";

    const pathParts = pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];

    const isValidType = options.some(option => option.value === lastPart);
    return isValidType ? lastPart : "all-in-apparel";
  }, [pathname, options]);

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

    onChange(value);
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
            className="relative appearance-none h-4 w-4 rounded-full border border-gray-300 checked:border-blue-600 checked:bg-white"
            style={{
              backgroundImage:
                selectedValue === option.value
                  ? "radial-gradient(circle at center, #2563eb 45%, transparent 50%)"
                  : "none",
            }}
          />
          <span className="ml-2 text-sm text-gray-600">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default ProductTypeFilter;
