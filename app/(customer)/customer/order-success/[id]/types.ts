export interface OrderSuccessViewProps {
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
    orderItems: Array<{
      quantity: number;
      price: number;
      variation: {
        size: string;
        color: string;
        product: {
          productName: string;
        };
      };
    }>;
  };
}
