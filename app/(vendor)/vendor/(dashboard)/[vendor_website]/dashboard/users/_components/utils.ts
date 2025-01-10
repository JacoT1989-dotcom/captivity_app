import { User } from "@prisma/client";
import { ALL_VALUES, FilterOptions } from "./vendor-customers";

export function filterCustomers(
  customers: Partial<User>[],
  filters: FilterOptions,
  searchTerm: string
): Partial<User>[] {
  return customers.filter(customer => {
    // Text search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        customer.companyName?.toLowerCase().includes(searchLower) ||
        customer.email?.toLowerCase().includes(searchLower) ||
        `${customer.firstName} ${customer.lastName}`
          .toLowerCase()
          .includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Country filter
    if (
      filters.country !== ALL_VALUES.COUNTRIES &&
      customer.country !== filters.country
    ) {
      return false;
    }

    // City filter
    if (
      filters.city !== ALL_VALUES.CITIES &&
      customer.townCity !== filters.city
    ) {
      return false;
    }

    // Date range filter
    if (customer.createdAt) {
      const createdDate = new Date(customer.createdAt);
      if (filters.joinedAfter && createdDate < new Date(filters.joinedAfter)) {
        return false;
      }
      if (
        filters.joinedBefore &&
        createdDate > new Date(filters.joinedBefore)
      ) {
        return false;
      }
    }

    return true;
  });
}

export function sortCustomers(
  customers: Partial<User>[],
  sortField: keyof User,
  sortDirection: "asc" | "desc"
): Partial<User>[] {
  return [...customers].sort((a, b) => {
    if (!a[sortField] || !b[sortField]) return 0;
    const aValue = a[sortField];
    const bValue = b[sortField];
    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    return sortDirection === "asc" ? comparison : -comparison;
  });
}
