// SearchField.tsx
"use client";
import { Input } from "@/components/ui/input";
import { SearchIcon, XIcon } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";

interface SearchFieldProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

export default function SearchField({
  onSearch,
  initialValue = "",
}: SearchFieldProps) {
  const [value, setValue] = useState(initialValue);

  const debouncedSearch = useDebouncedCallback((term: string) => {
    onSearch(term);
  }, 200);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <div className="relative w-full">
      <Input
        value={value}
        onChange={handleChange}
        placeholder="Search"
        className="pe-10"
      />
      {value ? (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700"
        >
          <XIcon className="size-4" />
        </button>
      ) : (
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      )}
    </div>
  );
}
