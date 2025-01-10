import React from "react";

interface SizeFilterProps {
  options: Array<{ value: string; label: string }>;
  selectedValue: string[];
  onChange: (value: string) => void;
}

export const SizeFilter: React.FC<SizeFilterProps> = ({
  options,
  selectedValue,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map(option => (
        <label key={option.value} className="inline-flex items-center">
          <input
            type="checkbox"
            name="size"
            value={option.value}
            checked={selectedValue.includes(option.value)}
            onChange={() => onChange(option.value)}
            className="relative appearance-none h-4 w-4 rounded-full border border-gray-300 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 checked:bg-white before:content-[''] before:block before:w-2 before:h-2 before:rounded-full before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 checked:before:bg-blue-600"
          />
          <span className="ml-2 text-sm text-gray-600">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default SizeFilter;
