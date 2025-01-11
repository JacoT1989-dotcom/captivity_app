import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

import { FilterSectionProps } from "../../_store/types";
import { StockLevelFilter } from "../StockLevelFilter";
import { ProductTypeFilter } from "../ProductTypeFilter";
import SizeFilter from "../SizeFilter";
import { useCategoryStore } from "../../_store/apparel-store";
import DynamicColorFilter from "../ColorFilter";

export const FilterSection: React.FC<
  FilterSectionProps & { isProductTypeFilter?: boolean }
> = ({
  filter,
  isOpen,
  onToggle,
  selectedValues,
  onFilterChange,
  isProductTypeFilter,
}) => {
  // Get products from the store
  const products = useCategoryStore(state => state.products);

  const actualSelectedValue =
    filter.type === "stockLevel"
      ? (selectedValues as string)
      : filter.type === "types"
        ? Array.isArray(selectedValues)
          ? selectedValues[0] || "all-in-apparel"
          : selectedValues || "all-in-apparel"
        : Array.isArray(selectedValues)
          ? selectedValues
          : [];

  return (
    <div className="border-b border-border pb-4">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center py-2 text-left text-foreground hover:text-foreground/90"
      >
        <span className="font-medium">{filter.name}</span>
        <ChevronDown
          className={cn(
            "w-5 h-5 transition-transform duration-200",
            isOpen ? "transform rotate-180" : ""
          )}
        />
      </button>

      {filter.type === "types" && (
        <div className={!isOpen ? "hidden" : "mt-2 space-y-2"}>
          <ProductTypeFilter
            options={filter.options}
            selectedValue={actualSelectedValue as string}
            onChange={onFilterChange}
            alwaysActive={true}
          />
        </div>
      )}

      {isOpen && filter.type !== "types" && (
        <div className="mt-2 space-y-2">
          {filter.type === "stockLevel" ? (
            <StockLevelFilter
              options={filter.options}
              selectedValue={actualSelectedValue as string}
              onChange={onFilterChange}
            />
          ) : filter.type === "colors" ? (
            <DynamicColorFilter
              options={filter.options}
              selectedValue={actualSelectedValue as string[]}
              onChange={onFilterChange}
              products={products}
            />
          ) : filter.type === "sizes" ? (
            <SizeFilter
              options={filter.options}
              selectedValue={actualSelectedValue as string[]}
              onChange={onFilterChange}
            />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default FilterSection;
