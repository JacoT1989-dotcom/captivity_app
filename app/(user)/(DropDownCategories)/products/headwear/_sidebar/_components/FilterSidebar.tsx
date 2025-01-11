// _sidebar/_components/FilterSidebar.tsx
import React, { useState, useEffect } from "react";
import { Filter, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { filters as baseFilters } from "../filterData";
import { FilterSection } from "./FilterSection";
import { usePathname } from "next/navigation";
import { FilterState, FilterType } from "../../_store/types";
import { useDynamicFilterStore } from "../../_store/dynamic-filter-store";
import { useCategoryStore } from "../../_store/headwear-store";

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
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<FilterState>(
    initialFilters || defaultFilters
  );

  const { products } = useCategoryStore();
  const {
    availableSizes,
    availableColors,
    setAvailableSizes,
    setAvailableColors,
  } = useDynamicFilterStore();

  // Update available sizes and colors when products or pathname changes
  useEffect(() => {
    if (products.length > 0) {
      setAvailableSizes(products, pathname || undefined);
      setAvailableColors(products, pathname || undefined);
    }
  }, [products, pathname, setAvailableSizes, setAvailableColors]);

  // Modify filters to use dynamic options
  const filters = baseFilters.map(filter => {
    if (filter.type === "sizes") {
      return {
        ...filter,
        options: availableSizes,
      };
    }
    if (filter.type === "colors") {
      return {
        ...filter,
        options: availableColors,
      };
    }
    return filter;
  });

  const hasActiveFilters =
    selectedFilters.stockLevel !== "all" ||
    selectedFilters.sizes.length > 0 ||
    selectedFilters.colors.length > 0 ||
    selectedFilters.types.length > 0;

  const handleFilterClick = (filterName: string) => {
    setOpenFilter(openFilter === filterName ? null : filterName);
  };

  const handleFilterChange = (filterType: FilterType, value: string) => {
    setSelectedFilters(prev => {
      let newFilters = { ...prev };

      if (filterType === "stockLevel") {
        newFilters.stockLevel = value;
      } else if (filterType === "types") {
        newFilters.types = [value];
      } else {
        const arrayKey = filterType as "sizes" | "colors";
        // Toggle value in array
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
    setSelectedFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
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

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:block w-64 bg-background p-4 space-y-4 border border-border rounded-lg",
          className
        )}
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Filters</h2>
          {hasActiveFilters && (
            <button
              onClick={handleClearAllFilters}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 rounded-md transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Clear
            </button>
          )}
        </div>

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
          />
        ))}
      </div>

      {/* Mobile Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed bottom-6 right-6 z-50 flex items-center bg-background border border-border rounded-full px-6 py-3 shadow-lg"
      >
        <Filter className="w-5 h-5 mr-2 text-foreground" />
        <span className="font-medium text-sm text-foreground">Filters</span>
      </button>

      {/* Mobile Sidebar */}
      {isOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={toggleSidebar}
          />
          <div className="lg:hidden fixed right-0 top-0 h-full w-80 bg-background border-l border-border z-50 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground">
                  Filters
                </h2>
                <div className="flex items-center gap-4">
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearAllFilters}
                      className="flex items-center px-3 py-1.5 text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-1.5" />
                      Clear
                    </button>
                  )}
                  <button onClick={toggleSidebar} className="text-foreground">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

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
