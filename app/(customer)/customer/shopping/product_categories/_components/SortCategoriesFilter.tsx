"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SortOption = {
  value: "relevance" | "stock-asc" | "stock-desc" | "price-asc" | "price-desc";
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

  return (
    <div className="relative z-30">
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        className={cn(
          "w-full justify-between bg-background/80 backdrop-blur-sm px-4 py-3",
          "border border-border/50 shadow-2xl shadow-black min-w-[200px]",
          "transition-all duration-300 hover:scale-95",
          "group relative overflow-hidden ",
          isOpen && "ring-2 ring-primary"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 relative z-10">
          <span className="text-sm font-medium">{getCurrentLabel()}</span>
        </div>
        <div
          className={cn(
            "transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        >
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 group-hover:opacity-100" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity min-w-[200px]" />
      </Button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-background/80 backdrop-blur-sm border rounded-lg shadow-lg overflow-hidden">
          <div className="max-h-[300px] overflow-y-auto min-w-[200px]">
            {sortOptions.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  onSortChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between px-4 py-3",
                  "text-sm transition-colors hover:bg-muted/50",
                  currentSort === option.value
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <span className="font-medium">{option.label}</span>
                {currentSort === option.value && (
                  <Check className="h-4 w-4 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSortFilter;
