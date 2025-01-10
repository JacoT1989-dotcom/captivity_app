import { X } from "lucide-react";
import { FilterSection } from "./FilterSection";
import { Filter, FilterState, FilterType } from "../../_store/types";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Array<{
    name: string;
    type: FilterType; // Use the imported FilterType
    options: Array<{ value: string; label: string }>;
  }>;
  openFilter: string | null;
  selectedFilters: FilterState;
  onFilterClick: (filterName: string) => void;
  onFilterChange: (filterType: FilterType, value: string) => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  openFilter,
  selectedFilters,
  onFilterClick,
  onFilterChange,
}) => {
  if (!isOpen) return null;

  // Convert incoming filters to match the Filter type from types.ts
  const typeSafeFilters: Filter[] = filters.map(filter => ({
    ...filter,
    type: filter.type, // No need for type assertion since filter.type is already FilterType
  }));

  return (
    <>
      <div
        className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="lg:hidden fixed right-0 top-0 h-full w-80 bg-white z-50 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button onClick={onClose} className="p-2">
              <X className="w-6 h-6" />
            </button>
          </div>

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
