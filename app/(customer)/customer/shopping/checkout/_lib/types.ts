export interface CartItem {
    id: string;
    quantity: number;
    variation: {
      quantity: number;
      size: string;
      color: string;
      variationImageURL?: string;
      product: {
        productName: string;
        sellingPrice: number;
        featuredImage?: {
          medium: string;
        };
      };
    };
  }
  
  export interface Cart {
    cartItems: CartItem[];
  }
  
  export interface FormValues {
    captivityBranch: string;
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

  export type OrderActionResult = {
    success: boolean;
    message: string;
    data?: any;
    error?: string;
  };