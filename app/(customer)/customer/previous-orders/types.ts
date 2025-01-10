// types.ts
import { Order as PrismaOrder, OrderStatus } from "@prisma/client";

export { OrderStatus } from "@prisma/client";

export interface Order extends PrismaOrder {
  orderItems: OrderItem[];
}
export interface Variation {
  id: string;
  name: string;
  color: string;
  size: string;
  sku: string;
  sku2: string;
  variationImageURL: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  variationId: string;
  quantity: number;
  price: number;
  variation: Variation;
}

export interface Order {
  id: string;
  userId: string;
  captivityBranch: string;
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

  orderItems: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  agreeTerms: boolean;
  receiveEmailReviews: boolean | null;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface ActionResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
  };
}

export interface OrderSearchParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  query?: string;
  startDate?: Date;
  endDate?: Date;
}
