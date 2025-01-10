export interface VendorOrderSuccessViewProps {
  order: {
    id: string;
    createdAt: string;
    totalAmount: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyName: string;
    streetAddress: string;
    apartmentSuite?: string;
    townCity: string;
    province: string;
    postcode: string;
    countryRegion: string;
    vendorOrderItems: Array<{
      quantity: number;
      price: number;
      vendorVariation: {
        size: string;
        color: string;
        vendorProduct: {
          productName: string;
        };
      };
    }>;
  };
}
