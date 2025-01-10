"use client";

import { useState } from "react";
import { User } from "@prisma/client";
import { useSession } from "@/app/(vendor)/SessionProvider";
import { VendorCustomersFilters } from "./filters";
import { VendorCustomersTable } from "./VendorCustomersTable";
import {
  ALL_VALUES,
  FilterOptions,
  VendorCustomersTableProps,
} from "./vendor-customers";
import { filterCustomers, sortCustomers } from "./utils";

export function VendorCustomersContainer({
  initialData,
}: VendorCustomersTableProps) {
  const session = useSession();
  const [customers] = useState<Partial<User>[]>(initialData.data || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof User>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState<FilterOptions>({
    country: ALL_VALUES.COUNTRIES,
    city: ALL_VALUES.CITIES,
    joinedAfter: "",
    joinedBefore: "",
  });

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      country: ALL_VALUES.COUNTRIES,
      city: ALL_VALUES.CITIES,
      joinedAfter: "",
      joinedBefore: "",
    });
    setSearchTerm("");
  };

  const hasActiveFilters = Boolean(
    searchTerm ||
      filters.country !== ALL_VALUES.COUNTRIES ||
      filters.city !== ALL_VALUES.CITIES ||
      filters.joinedAfter ||
      filters.joinedBefore
  );

  if (!session || session?.user?.role !== "VENDOR") {
    return null;
  }

  const filteredCustomers = filterCustomers(customers, filters, searchTerm);
  const sortedCustomers = sortCustomers(
    filteredCustomers,
    sortField,
    sortDirection
  );

  return (
    <div className="space-y-4 w-full">
      <VendorCustomersFilters
        filters={filters}
        searchTerm={searchTerm}
        customers={customers}
        onFilterChange={handleFilterChange}
        onSearchChange={setSearchTerm}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <VendorCustomersTable
        customers={sortedCustomers}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {sortedCustomers.length} of {customers.length} customers
      </div>
    </div>
  );
}

export default VendorCustomersContainer;
