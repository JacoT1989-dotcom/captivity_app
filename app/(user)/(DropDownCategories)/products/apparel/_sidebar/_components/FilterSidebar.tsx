import React, { useState, useRef } from "react";
import { Filter, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { filters } from "../filterData";
import { FilterSection } from "./FilterSection";
import { usePathname } from "next/navigation";
import { FilterState, FilterType, StockLevelType } from "../../_store/types";

interface FilterSidebarProps {
  className?: string;
  onFilterChange?: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

const defaultFilters: FilterState = {
  stockLevel: "all",
  sizes: [],
  colors: [],
  types: [],
};

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  className,
  onFilterChange,
  initialFilters,
}) => {
  const pathname = usePathname() || "";
  const [isOpen, setIsOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<FilterState>(
    initialFilters || defaultFilters
  );
  const sidebarRef = useRef<HTMLDivElement>(null);

  function isTypeFromURL(type: string): boolean {
    if (!pathname) return false;
    const pathParts = pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];
    return lastPart === type;
  }

  const handleFilterClick = (filterName: string) => {
    setOpenFilter(openFilter === filterName ? null : filterName);
  };

  const handleFilterChange = (filterType: FilterType, value: string) => {
    setSelectedFilters(prev => {
      let newFilters = { ...prev };

      if (filterType === "stockLevel") {
        newFilters.stockLevel = value as StockLevelType;
      } else if (filterType === "types") {
        newFilters.types = [value];
      } else {
        const arrayKey = filterType as "sizes" | "colors";
        if (prev[arrayKey].includes(value)) {
          newFilters[arrayKey] = prev[arrayKey].filter(v => v !== value);
        } else {
          newFilters[arrayKey] = [...prev[arrayKey], value];
        }
      }

      onFilterChange?.(newFilters);
      return newFilters;
    });
  };

  const handleClearAllFilters = () => {
    const currentUrlType = pathname.split("/").pop();
    const newFilters = {
      ...defaultFilters,
      types:
        currentUrlType && isTypeFromURL(currentUrlType) ? [currentUrlType] : [],
    };

    setSelectedFilters(newFilters);
    onFilterChange?.(newFilters);
    setOpenFilter(null);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  };

  const renderFilterContent = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Filters</h2>
        <button
          onClick={handleClearAllFilters}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 rounded-md transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-1.5" />
          Clear
        </button>
      </div>

      <div className="border-t border-border" />

      {filters.map(filter => (
        <FilterSection
          key={filter.name}
          filter={filter}
          isOpen={openFilter === filter.name}
          onToggle={() => handleFilterClick(filter.name)}
          selectedValues={selectedFilters[filter.type as keyof FilterState]}
          onFilterChange={(value: string) =>
            handleFilterChange(filter.type as FilterType, value)
          }
          isProductTypeFilter={filter.type === "types"}
        />
      ))}
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:block w-64 bg-background p-4 space-y-4 border border-border rounded-lg",
          className
        )}
      >
        {renderFilterContent()}
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleSidebar}
          className="flex items-center bg-background border border-border rounded-full px-6 py-3 shadow-lg"
        >
          <Filter className="w-5 h-5 mr-2 text-foreground" />
          <span className="font-medium text-sm text-foreground">Filters</span>
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={toggleSidebar}
          />
          <div
            ref={sidebarRef}
            className="lg:hidden fixed right-0 top-0 h-full w-80 bg-background border-l border-border z-50 overflow-y-auto p-4"
          >
            <div className="relative mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Filters
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearAllFilters}
                    className="flex items-center px-3 py-1.5 text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    Clear
                  </button>
                  <button onClick={toggleSidebar} className="p-2">
                    <X className="w-6 h-6 text-foreground" />
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-border mb-6" />

            <div className="z-[60]">
              {filters.map(filter => (
                <FilterSection
                  key={filter.name}
                  filter={filter}
                  isOpen={openFilter === filter.name}
                  onToggle={() => handleFilterClick(filter.name)}
                  selectedValues={
                    selectedFilters[filter.type as keyof FilterState]
                  }
                  onFilterChange={(value: string) =>
                    handleFilterChange(filter.type as FilterType, value)
                  }
                  isProductTypeFilter={filter.type === "types"}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default FilterSidebar;
