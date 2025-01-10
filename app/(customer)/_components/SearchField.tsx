"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import { useCategoryStore } from "../../(customer)/customer/shopping/product_categories/_categoryStore/useCategoryStore";
import { CategoryType } from "@/app/(customer)/types";

export default function SearchField() {
  const pathname = usePathname() || "";
  const [searchValue, setSearchValue] = useState("");
  const { setSearchQuery } = useCategoryStore();

  // Helper function to extract category from pathname
  const getCurrentCategory = useCallback(
    (pathname: string): CategoryType | null => {
      const categoryMap: { [key: string]: CategoryType } = {
        "/fashion": "fashion",
        "/summer": "summer",
        "/winter": "winter",
        "/camo": "camo",
        "/kids": "kids",
        "/african": "african",
        "/baseball": "baseball",
        "/industrial": "industrial",
        "/leisure": "leisure",
        "/signature": "signature",
        "/sport": "sport",
      };

      const category = Object.entries(categoryMap).find(([path]) =>
        pathname.includes(path)
      );

      return category ? category[1] : null;
    },
    []
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const query = e.target.value;
    setSearchValue(query);

    const currentCategory = getCurrentCategory(pathname);
    if (currentCategory) {
      setSearchQuery(query);
    }
  }

  // Reset search when changing collections
  useEffect(() => {
    setSearchValue("");
    const currentCategory = getCurrentCategory(pathname);
    if (currentCategory) {
      setSearchQuery("");
    }
  }, [pathname, setSearchQuery, getCurrentCategory]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <Input
          name="q"
          value={searchValue}
          placeholder="Search"
          className="pe-10 border-4 outline-none"
          onChange={handleChange}
        />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
}
