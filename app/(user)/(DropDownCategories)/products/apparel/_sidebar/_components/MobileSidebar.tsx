import { X, Trash2 } from "lucide-react";
import { FilterSection } from "./FilterSection";
import { Filter, FilterState, FilterType } from "../../_store/types";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Array<{
    name: string;
    type: FilterType;
    options: Array<{ value: string; label: string }>;
  }>;
  openFilter: string | null;
  selectedFilters: FilterState;
  onFilterClick: (filterName: string) => void;
  onFilterChange: (filterType: FilterType, value: string) => void;
  onClearFilters: () => void; // Added new prop
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  openFilter,
  selectedFilters,
  onFilterClick,
  onFilterChange,
  onClearFilters, // Added new prop
}) => {
  if (!isOpen) return null;

  const typeSafeFilters: Filter[] = filters.map(filter => ({
    ...filter,
    type: filter.type,
  }));

  const hasActiveFilters =
    selectedFilters.sizes?.length > 0 ||
    selectedFilters.colors?.length > 0 ||
    selectedFilters.types?.length > 0 ||
    selectedFilters.stockLevel !== "all";

  return (
    <>
      <div
        className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="lg:hidden fixed right-0 top-0 h-full w-80 bg-white z-50 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button onClick={onClose} className="p-2">
              <X className="w-6 h-6" />
            </button>
          </div>

          {hasActiveFilters && (
            <div className="mb-6 pb-4 border-b border-gray-200">
              <button
                onClick={onClearFilters}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear all filters
              </button>
            </div>
          )}

          <div className="z-[60]">
            {typeSafeFilters.map(filter => (
              <FilterSection
                key={filter.name}
                filter={filter}
                isOpen={openFilter === filter.name}
                onToggle={() => onFilterClick(filter.name)}
                selectedValues={selectedFilters[filter.type]}
                onFilterChange={value => onFilterChange(filter.type, value)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
