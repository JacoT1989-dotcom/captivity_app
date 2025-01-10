"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, Search, X } from "lucide-react";
import { User } from "@prisma/client";
import { ALL_VALUES, FilterOptions } from "./vendor-customers";

interface FiltersProps {
  filters: FilterOptions;
  searchTerm: string;
  customers: Partial<User>[];
  onFilterChange: (key: keyof FilterOptions, value: string) => void;
  onSearchChange: (value: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export function VendorCustomersFilters({
  filters,
  searchTerm,
  customers,
  onFilterChange,
  onSearchChange,
  onReset,
  hasActiveFilters,
}: FiltersProps) {
  const countries = Array.from(
    new Set(customers.map(c => c.country).filter(Boolean))
  );
  const cities = Array.from(
    new Set(customers.map(c => c.townCity).filter(Boolean))
  );

  return (
    <>
      {/* Search and Filter Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Country</label>
                <Select
                  value={filters.country}
                  onValueChange={(value: string) =>
                    onFilterChange("country", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_VALUES.COUNTRIES}>
                      All Countries
                    </SelectItem>
                    {countries.map(
                      country =>
                        country && (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">City</label>
                <Select
                  value={filters.city}
                  onValueChange={(value: string) =>
                    onFilterChange("city", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_VALUES.CITIES}>
                      All Cities
                    </SelectItem>
                    {cities.map(
                      city =>
                        city && (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Joined After</label>
                <Input
                  type="date"
                  value={filters.joinedAfter}
                  onChange={e => onFilterChange("joinedAfter", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Joined Before</label>
                <Input
                  type="date"
                  value={filters.joinedBefore}
                  onChange={e => onFilterChange("joinedBefore", e.target.value)}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset} className="gap-2">
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4">
          {Object.entries(filters).map(([key, value]) => {
            if (
              !value ||
              (key === "country" && value === ALL_VALUES.COUNTRIES) ||
              (key === "city" && value === ALL_VALUES.CITIES)
            ) {
              return null;
            }
            return (
              <div
                key={key}
                className="bg-muted text-sm px-3 py-1 rounded-full flex items-center gap-2"
              >
                <span className="text-foreground">
                  {key}: {value}
                </span>
                <button
                  onClick={() =>
                    onFilterChange(
                      key as keyof FilterOptions,
                      key === "country"
                        ? ALL_VALUES.COUNTRIES
                        : key === "city"
                          ? ALL_VALUES.CITIES
                          : ""
                    )
                  }
                  className="hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}