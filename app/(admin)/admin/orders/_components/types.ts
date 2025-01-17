import { OrderStatus } from "@prisma/client";

export interface OrderVariation {
  id: string;
  name: string;
  color: string;
  size: string;
  sku: string;
  sku2: string;
  variationImageURL: string;
  quantity: number;
  productId: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  variationId: string;
  quantity: number;
  price: number;
  variation: OrderVariation;
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
  status: OrderStatus;
  totalAmount: number;
  agreeTerms: boolean;
  receiveEmailReviews: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  orderItems: OrderItem[];
}

export interface OrdersData {
  orders: Order[];
  totalPages: number;
  totalOrders: number;
}

export interface OrderTableProps {
  initialData: OrdersData;
  status?: OrderStatus;
  title: string;
}
