import { useState, ChangeEvent } from "react";

// Define the possible sort values
type SortOption =
  | "popularity"
  | "rating"
  | "latest"
  | "priceLowToHigh"
  | "priceHighToLow";

// Define props interface
interface SortDropdownProps {
  onSortChange: (value: SortOption) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ onSortChange }) => {
  const [selectedOption, setSelectedOption] =
    useState<SortOption>("popularity");

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const sortValue = e.target.value as SortOption;
    setSelectedOption(sortValue);
    onSortChange(sortValue); // Notify the parent component about the change
  };

  return (
    <div className="flex items-center justify-end mb-2 space-x-2">
      <label htmlFor="sort" className="text-gray-600 text-sm">
        Showing all 10 results
      </label>
      <select
        id="sort"
        className="bg-gray-200 rounded-md p-2"
        value={selectedOption}
        onChange={handleSortChange}
      >
        <option value="popularity">Sort By Popularity</option>
        <option value="rating">Sort By Average Rating</option>
        <option value="latest">Sort By Latest</option>
        <option value="priceLowToHigh">Sort By Price: Low To High</option>
        <option value="priceHighToLow">Sort By Price: High To Low</option>
      </select>
    </div>
  );
};

export default SortDropdown;
