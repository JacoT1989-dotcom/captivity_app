import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterSectionProps } from "../../_store/types";
import { StockLevelFilter } from "../StockLevelFilter";
import { ProductTypeFilter } from "../ProductTypeFilter";
import ColorFilter from "../ColorFilter";
import SizeFilter from "../SizeFilter";

export const FilterSection: React.FC<FilterSectionProps> = ({
  filter,
  isOpen,
  onToggle,
  selectedValues,
  onFilterChange,
}) => {
  // Handle different types of selected values
  const actualSelectedValue =
    filter.type === "stockLevel"
      ? (selectedValues as string)
      : filter.type === "types"
        ? Array.isArray(selectedValues)
          ? selectedValues[0] || "all-collections"
          : selectedValues || "all-collections"
        : Array.isArray(selectedValues)
          ? selectedValues
          : [];

  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center py-2 text-left text-gray-700 hover:text-gray-900"
      >
        <span className="font-medium">{filter.name}</span>
        <ChevronDown
          className={cn(
            "w-5 h-5 transition-transform duration-200",
            isOpen ? "transform rotate-180" : ""
          )}
        />
      </button>

      {isOpen && (
        <div className="mt-2">
          {filter.type === "stockLevel" ? (
            <StockLevelFilter
              options={filter.options}
              selectedValue={actualSelectedValue as string}
              onChange={onFilterChange}
            />
          ) : filter.type === "types" ? (
            <ProductTypeFilter
              options={filter.options}
              selectedValue={actualSelectedValue as string}
              onChange={onFilterChange}
            />
          ) : filter.type === "colors" ? (
            <ColorFilter
              options={filter.options}
              selectedValue={actualSelectedValue as string[]}
              onChange={onFilterChange}
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
