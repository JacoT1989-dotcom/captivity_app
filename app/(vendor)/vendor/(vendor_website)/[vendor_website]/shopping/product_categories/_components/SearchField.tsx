"use client";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useVendorCollectionsStore } from "../_store/useVendorCollectionsStore";
import { useDebounce } from "./useDebounce";

export default function SearchField() {
  const pathname = usePathname() || "";
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 300);
  const setSearchQuery = useVendorCollectionsStore(
    state => state.setSearchQuery
  );

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const query = e.target.value;
    setSearchValue(query);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <Input
          name="q"
          value={searchValue}
          placeholder="Search products..."
          className="pe-10 border-4 outline-none"
          onChange={handleChange}
        />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
}
