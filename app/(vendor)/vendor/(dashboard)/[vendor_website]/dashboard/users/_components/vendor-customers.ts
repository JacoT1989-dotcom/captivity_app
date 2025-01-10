import { User } from "@prisma/client";

export type VendorCustomerResponse = {
  success: boolean;
  message: string;
  data?: Partial<User>[];
  error?: string;
};

export interface VendorCustomersTableProps {
  initialData: VendorCustomerResponse;
}

export type FilterOptions = {
  country: string;
  city: string;
  joinedAfter: string;
  joinedBefore: string;
};

export const ALL_VALUES = {
  COUNTRIES: "all-countries",
  CITIES: "all-cities",
} as const;
