import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { subWeeks } from "date-fns";
import { OrderStatus } from "@prisma/client";
import { VendorOrder } from "@/app/(vendor)/vendor/(vendor_website)/[vendor_website]/shop_product/checkout/_lib/types";
import { getVendorOrder } from "@/app/(vendor)/vendor/(vendor_website)/[vendor_website]/shop_product/checkout/vendor-orders";

// Type definitions for filters and sorting
export type PriceRange =
  | "all"
  | "less_than_twoK"
  | "two_to_fiveK"
  | "greater_than_fiveK";
export type TimeFilter = "all" | "recent" | "old";
export type StatusFilter = OrderStatus | "all";
export type CustomerTypeFilter = "all" | "vendor" | "customer";
export type SortDirection = "asc" | "desc";
export type SortField = "date" | "amount" | "status";

// Extended VendorOrder type with user information
type ExtendedVendorOrder = VendorOrder & {
  user?: {
    role: string;
    storeSlug: string | null;
  };
};

// Main store state interface
interface OrderState {
  currentOrders: ExtendedVendorOrder[];
  filteredOrders: ExtendedVendorOrder[];
  loading: boolean;
  error: string | null;
  selectedPriceRange: PriceRange;
  selectedTimeFilter: TimeFilter;
  selectedStatus: StatusFilter;
  selectedCustomerType: CustomerTypeFilter;
  sortDirection: SortDirection;
  sortField: SortField;
  searchQuery: string;
  totalOrders: number;
  totalAmount: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;

  fetchOrders: () => Promise<void>;
  filterOrders: (
    priceRange?: PriceRange,
    timeFilter?: TimeFilter,
    status?: StatusFilter,
    customerType?: CustomerTypeFilter
  ) => void;
  sortOrders: (field: SortField, direction: SortDirection) => void;
  searchOrders: (query: string) => void;
  setPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  getOrdersByAge: () => {
    recentOrders: ExtendedVendorOrder[];
    oldOrders: ExtendedVendorOrder[];
  };
  getOrderStats: () => {
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
    refunded: number;
    totalAmount: number;
  };
}

const useVendorOrderStore = create<OrderState>()(
  devtools((set, get) => ({
    // Initial state
    currentOrders: [],
    filteredOrders: [],
    loading: false,
    error: null,
    selectedPriceRange: "all",
    selectedTimeFilter: "all",
    selectedStatus: "all",
    selectedCustomerType: "all",
    sortDirection: "desc",
    sortField: "date",
    searchQuery: "",
    totalOrders: 0,
    totalAmount: 0,
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1,

    // Fetch orders from the API
    fetchOrders: async () => {
      try {
        set({ loading: true, error: null });
        const response = await getVendorOrder();

        if (!response.success || !response.data) {
          throw new Error(response.error || "Failed to fetch orders");
        }

        const orders = Array.isArray(response.data)
          ? response.data
          : [response.data];

        set(state => ({
          currentOrders: orders,
          loading: false,
        }));

        const {
          filterOrders,
          selectedPriceRange,
          selectedTimeFilter,
          selectedStatus,
          selectedCustomerType,
        } = get();

        filterOrders(
          selectedPriceRange,
          selectedTimeFilter,
          selectedStatus,
          selectedCustomerType
        );
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "An error occurred",
          loading: false,
          currentOrders: [],
          filteredOrders: [],
        });
      }
    },

    // Filter orders based on multiple criteria
    filterOrders: (
      priceRange?: PriceRange,
      timeFilter?: TimeFilter,
      status?: StatusFilter,
      customerType?: CustomerTypeFilter
    ) => {
      const state = get();
      const newPriceRange = priceRange || state.selectedPriceRange;
      const newTimeFilter = timeFilter || state.selectedTimeFilter;
      const newStatus = status || state.selectedStatus;
      const newCustomerType = customerType || state.selectedCustomerType;

      let filtered = [...state.currentOrders];
      const oneWeekAgo = subWeeks(new Date(), 1);

      // Apply customer type filter
      if (newCustomerType !== "all") {
        filtered = filtered.filter(order => {
          const isCustomerOrder = order.user?.storeSlug?.includes("-customer-");
          return newCustomerType === "customer"
            ? isCustomerOrder
            : !isCustomerOrder;
        });
      }

      // Apply time filter
      if (newTimeFilter !== "all") {
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.createdAt);
          return newTimeFilter === "recent"
            ? orderDate > oneWeekAgo
            : orderDate <= oneWeekAgo;
        });
      }

      // Apply price range filter only if not "all"
      if (newPriceRange !== "all") {
        filtered = filtered.filter(order => {
          const amount = order.totalAmount;
          switch (newPriceRange) {
            case "less_than_twoK":
              return amount < 2000;
            case "two_to_fiveK":
              return amount >= 2000 && amount <= 5000;
            case "greater_than_fiveK":
              return amount > 5000;
            default:
              return true;
          }
        });
      }

      // Apply status filter
      if (newStatus !== "all") {
        filtered = filtered.filter(order => order.status === newStatus);
      }

      // Apply search filter
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase().trim();
        filtered = filtered.filter(order =>
          [order.id, order.firstName, order.lastName, order.companyName].some(
            field => field?.toLowerCase().includes(query)
          )
        );
      }

      // Apply sorting
      const sortedFiltered = [...filtered].sort((a, b) => {
        const direction = state.sortDirection === "asc" ? 1 : -1;

        switch (state.sortField) {
          case "date":
            return (
              direction *
              (new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime())
            );
          case "amount":
            return direction * (b.totalAmount - a.totalAmount);
          case "status":
            return direction * a.status.localeCompare(b.status);
          default:
            return 0;
        }
      });

      // Calculate pagination
      const totalPages = Math.ceil(sortedFiltered.length / state.itemsPerPage);
      const startIndex = (state.currentPage - 1) * state.itemsPerPage;
      const paginatedOrders = sortedFiltered.slice(
        startIndex,
        startIndex + state.itemsPerPage
      );

      // Update state with all filtered orders (not just paginated ones)
      set({
        filteredOrders: sortedFiltered, // Store all filtered orders, not just paginated ones
        selectedPriceRange: newPriceRange,
        selectedTimeFilter: newTimeFilter,
        selectedStatus: newStatus,
        selectedCustomerType: newCustomerType,
        totalOrders: sortedFiltered.length,
        totalAmount: sortedFiltered.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        ),
        totalPages,
      });
    },

    // Sort orders
    sortOrders: (field: SortField, direction: SortDirection) => {
      set({ sortField: field, sortDirection: direction });
      get().filterOrders();
    },

    // Search orders
    searchOrders: (query: string) => {
      set({ searchQuery: query, currentPage: 1 });
      get().filterOrders();
    },

    // Update current page
    setPage: (page: number) => {
      set({ currentPage: page });
      get().filterOrders();
    },

    // Update items per page
    setItemsPerPage: (items: number) => {
      set({ itemsPerPage: items, currentPage: 1 });
      get().filterOrders();
    },

    // Get orders grouped by age
    getOrdersByAge: () => {
      const { filteredOrders } = get();
      const oneWeekAgo = subWeeks(new Date(), 1);

      return {
        recentOrders: filteredOrders.filter(
          order => new Date(order.createdAt) > oneWeekAgo
        ),
        oldOrders: filteredOrders.filter(
          order =>
            new Date(order.createdAt) <= oneWeekAgo &&
            order.status === OrderStatus.PENDING
        ),
      };
    },

    // Get order statistics based on filtered orders
    getOrderStats: () => {
      const { filteredOrders } = get();
      const activeOrders = filteredOrders.filter(
        order => order.status !== "CANCELLED" && order.status !== "REFUNDED"
      );

      return {
        pending: filteredOrders.filter(o => o.status === "PENDING").length,
        processing: filteredOrders.filter(o => o.status === "PROCESSING")
          .length,
        completed: filteredOrders.filter(o => o.status === "DELIVERED").length,
        cancelled: filteredOrders.filter(o => o.status === "CANCELLED").length,
        refunded: filteredOrders.filter(o => o.status === "REFUNDED").length,
        totalAmount: activeOrders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        ),
      };
    },
  }))
);

export default useVendorOrderStore;
