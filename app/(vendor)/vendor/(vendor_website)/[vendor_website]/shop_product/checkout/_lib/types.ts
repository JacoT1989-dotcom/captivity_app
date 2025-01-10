import { OrderStatus, UserRole } from "@prisma/client";

export interface VendorDynamicPricing {
  id: string;
  vendorProductId: string;
  from: string;
  to: string;
  type: string;
  amount: string;
}

export interface VendorFeaturedImage {
  id: string;
  thumbnail: string;
  medium: string;
  large: string;
  vendorProductId: string;
}

export interface VendorProduct {
  id: string;
  productName: string;
  description: string;
  sellingPrice: number;
  isPublished: boolean;
  category: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  featuredImage?: VendorFeaturedImage;
  dynamicPricing?: VendorDynamicPricing[];
}

export interface VendorVariation {
  id: string;
  name: string;
  color: string;
  size: string;
  sku: string;
  sku2: string;
  quantity: number;
  variationImageURL: string;
  vendorProduct: VendorProduct;
  vendorProductId: string;
}

export interface VendorCartItem {
  id: string;
  quantity: number;
  vendorVariation: VendorVariation;
}

export interface VendorCart {
  id: string;
  userId: string;
  vendorCartItems: VendorCartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface VendorOrderItem {
  id: string;
  quantity: number;
  price: number;
  vendorOrderId: string;
  vendorVariationId: string;
  vendorVariation: {
    id: string;
    name: string;
    color: string;
    size: string;
    sku: string;
    sku2: string;
    quantity: number;
    variationImageURL: string;
    vendorProductId: string;
    vendorProduct: {
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
  };
}

export interface VendorUser {
  id: string;
  role: UserRole;
  username: string;
  email: string;
  storeSlug: string | null;
  companyName: string;
  phoneNumber: string;
}

export interface OrderUser {
  id: string;
  role: UserRole;
  storeSlug: string | null;
  username: string;
  email: string;
}

export interface VendorOrder {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  vendorBranch: string;
  methodOfCollection: string;
  salesRep: string;
  referenceNumber: string;
  firstName: string;
  lastName: string;
  companyName: string;
  countryRegion: string;
  streetAddress: string;
  apartmentSuite: string;
  townCity: string;
  province: string;
  postcode: string;
  phone: string;
  email: string;
  orderNotes: string;
  agreeTerms: boolean;
  receiveEmailReviews: boolean;
  vendorOrderItems: VendorOrderItem[];
  user?: OrderUser;
}

export interface VendorFormValues {
  vendorBranch: string;
  methodOfCollection: string;
  salesRep: string;
  referenceNumber: string;
  firstName: string;
  lastName: string;
  companyName: string;
  countryRegion: string;
  streetAddress: string;
  apartmentSuite: string;
  townCity: string;
  province: string;
  postcode: string;
  phone: string;
  email: string;
  orderNotes: string;
  agreeTerms: boolean;
  receiveEmailReviews: boolean;
}

export type VendorOrderActionResult = {
  success: boolean;
  message: string;
  data?: VendorOrder | VendorOrder[] | null;
  error?: string;
};

export type VendorOrderSuccessResponse = {
  success: true;
  message: string;
  data: VendorOrder | VendorOrder[];
};

export type VendorOrderErrorResponse = {
  success: false;
  message: string;
  error: string;
};

export type VendorOrderResponse =
  | VendorOrderSuccessResponse
  | VendorOrderErrorResponse;

export interface VendorOrderSuccessViewProps {
  order: VendorOrder[] | null;
}
