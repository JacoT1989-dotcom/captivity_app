import { OrderStatus } from "@prisma/client";

// Base vendor type with essential information
export type BaseVendor = {
  id: string;
  storeName: string | null;
  storeSlug: string;
  companyName: string;
  storeLogoUrl: string | null;
  vendorRating: number | null;
};

// Extended vendor type with analytics metrics
export type VendorWithMetrics = BaseVendor & {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue?: number;
};

// Detailed vendor analytics
export type VendorAnalytics = {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<OrderStatus, number>;
};

// Response types for different API endpoints
export type VendorAnalyticsResponse =
  | {
      success: true;
      vendors: VendorWithMetrics[];
      totalVendors: number;
    }
  | {
      success: false;
      error: string;
    };

export type TopVendorsResponse =
  | {
      success: true;
      vendors: VendorWithMetrics[];
      totalVendors: number;
    }
  | {
      success: false;
      error: string;
    };

export type SingleVendorAnalyticsResponse =
  | {
      success: true;
      analytics: VendorAnalytics;
    }
  | {
      success: false;
      error: string;
    };

// Request types for API endpoints
export type FetchTopVendorsParams = {
  limit?: number;
  page?: number;
  sortBy?: "totalOrders" | "totalRevenue" | "vendorRating";
  order?: "asc" | "desc";
};

// Vendor tier related types
export type VendorTier = {
  name: string;
  minOrders: number;
  maxOrders: number | null;
  benefits: string[];
};

// Tier calculation helper types
export type VendorTierDetails = VendorWithMetrics & {
  currentTier: string;
  nextTier: string | null;
  ordersToNextTier: number | null;
};

// Filter and sort types for vendor queries
export type VendorFilters = {
  minOrders?: number;
  maxOrders?: number;
  minRevenue?: number;
  maxRevenue?: number;
  minRating?: number;
  tierLevel?: string;
  searchTerm?: string;
};
