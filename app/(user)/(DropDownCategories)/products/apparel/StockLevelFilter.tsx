// StockLevelFilter.tsx
import React from "react";

interface StockLevelFilterProps {
  options: Array<{ value: string; label: string }>;
  selectedValue: string;
  onChange: (value: string) => void;
}

export const StockLevelFilter: React.FC<StockLevelFilterProps> = ({
  options,
  selectedValue,
  onChange,
}) => (
  <div className="flex flex-col gap-2">
    {options.map(option => (
      <label key={option.value} className="inline-flex items-center">
        <input
          type="radio"
          name="stockLevel"
          value={option.value}
          checked={selectedValue === option.value}
          onChange={() => onChange(option.value)}
          className="relative appearance-none h-4 w-4 rounded-full border border-gray-300 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 checked:bg-white before:content-[''] before:block before:w-2 before:h-2 before:rounded-full before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 checked:before:bg-blue-600"
        />
        <span className="ml-2 text-sm text-gray-600">{option.label}</span>
      </label>
    ))}
  </div>
);
