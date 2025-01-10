import { OrderStatus, UserRole } from "@prisma/client";

interface OrderDataCommon {
  success: boolean;
  message: string;
}

interface SuccessResponse extends OrderDataCommon {
  success: true;
  data:
    | {
        id: string;
        userId: string;
        status: OrderStatus;
        totalAmount: number;
        createdAt: Date;
        updatedAt: Date;
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
        agreeTerms: boolean;
        receiveEmailReviews: boolean | null;
        user?: {
          id: string;
          role: UserRole;
          storeSlug: string | null;
          username: string;
          email: string;
        };
        vendorOrderItems: Array<{
          id: string;
          quantity: number;
          price: number;
          vendorVariation: {
            id: string;
            sku: string;
            color: string;
            size: string;
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
        }>;
      }
    | {
        id: string;
        status: OrderStatus;
        updatedAt: Date;
      };
}

interface ErrorResponse extends OrderDataCommon {
  success: false;
  error: string;
}

export type VendorOrderResponse = SuccessResponse | ErrorResponse;
