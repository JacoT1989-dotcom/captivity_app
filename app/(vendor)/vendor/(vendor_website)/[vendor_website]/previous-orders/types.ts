import { UserRole, OrderStatus } from "@prisma/client";

// Base product variation interface
export interface VendorVariation {
  id: string;
  name: string;
  color: string;
  size: string;
  sku: string;
  sku2: string;
  variationImageURL: string;
  quantity: number; // Changed from 'int' to 'number'
  vendorProductId: string;
  vendorProduct?: {
    id: string;
    productName: string;
    description: string;
    sellingPrice: number;
    isPublished: boolean;
    category: string[];
    createdAt: Date;
    updatedAt: Date;
    userId: string;
  };
}

export interface VendorOrderItem {
  id: string;
  vendorOrderId: string;
  vendorVariationId: string;
  quantity: number;
  price: number;
  vendorVariation: VendorVariation;
}

export interface VendorUser {
  id: string;
  role: UserRole;
  storeSlug: string | null;
  username: string;
  email: string;
  companyName: string;
  displayName: string;
}

export interface VendorOrder {
  id: string;
  userId: string;
  vendorBranch: string;
  methodOfCollection: string;
  salesRep: string | null;
  referenceNumber: string | null;
  firstName: string;
  lastName: string;
  companyName: string;
  countryRegion: string;
  streetAddress: string;
  apartmentSuite: string | null;
  townCity: string;
  province: string;
  postcode: string;
  phone: string;
  email: string;
  orderNotes: string | null;
  status: OrderStatus;
  totalAmount: number;
  agreeTerms: boolean;
  receiveEmailReviews: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  vendorOrderItems: VendorOrderItem[];
  user?: VendorUser;
}

export interface OrderSearchParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  query?: string;
  startDate?: Date;
  endDate?: Date;
  vendorBranch?: string;
  customerType?: "all" | "vendor" | "customer";
  minAmount?: number;
  maxAmount?: number;
}

export interface OrderMeta {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  totalAmount: number;
}

export interface ActionResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: OrderMeta;
}

// Type guard for checking if a user can access vendor features
export function canAccessVendorFeatures(role: UserRole): boolean {
  return (
    role === "VENDOR" ||
    role === "VENDORCUSTOMER" ||
    role === "APPROVEDVENDORCUSTOMER"
  );
}

// Type guard for checking if an order has full details
export function hasFullOrderDetails(
  order: Partial<VendorOrder>
): order is VendorOrder {
  return !!(
    order.id &&
    order.userId &&
    order.vendorOrderItems &&
    order.status &&
    order.totalAmount
  );
}
