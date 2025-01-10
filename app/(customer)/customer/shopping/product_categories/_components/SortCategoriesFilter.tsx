import React, { useState } from "react";
import { Button } from "@/components/ui/button";

type SortOption = {
  value:
    | "relevance"
    | "code-asc"
    | "code-desc"
    | "name-asc"
    | "name-desc"
    | "stock-asc"
    | "stock-desc"
    | "price-asc"
    | "price-desc";
  label: string;
};

interface ProductSortFilterProps {
  currentSort: SortOption["value"];
  onSortChange: (value: SortOption["value"]) => void;
}

const ProductSortFilter: React.FC<ProductSortFilterProps> = ({
  currentSort,
  onSortChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions: SortOption[] = [
    { value: "relevance", label: "Sort By" },
    { value: "code-asc", label: "Code A-Z" },
    { value: "code-desc", label: "Code Z-A" },
    { value: "name-asc", label: "Name A-Z" },
    { value: "name-desc", label: "Name Z-A" },
    { value: "stock-asc", label: "Stock - Low to High" },
    { value: "stock-desc", label: "Stock - High to Low" },
    { value: "price-asc", label: "Price - Low to High" },
    { value: "price-desc", label: "Price - High to Low" },
  ];

  const getCurrentLabel = () => {
    return (
      sortOptions.find(option => option.value === currentSort)?.label ||
      "Sort By"
    );
  };

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="relative z-30">
      <Button
        variant="outline"
        className="mb-4 flex w-full items-center justify-between py-2 shadow-2xl shadow-black dark:shadow-gray-500 transition-transform duration-300 hover:scale-95"
        onClick={toggleDropdown}
      >
        <span className="text-sm font-medium">{getCurrentLabel()}</span>
        <span
          className={`text-xl transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </Button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full min-w-[200px] rounded-lg bg-background p-2 shadow-2xl  max-h-[300px] overflow-y-scroll">
          <div className="flex flex-col gap-2">
            {sortOptions.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  onSortChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-background
                  ${currentSort === option.value ? "bg-muted font-medium" : ""}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSortFilter;
