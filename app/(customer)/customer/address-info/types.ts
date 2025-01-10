import { UserRole } from "@prisma/client";

export interface SessionUser {
  id: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  email?: string;
  countryRegion?: string; // Instead of country
  streetAddress?: string;
  addressLine2?: string;
  townCity?: string;
  suburb?: string;
  postcode?: string;
  phoneNumber?: string;
  companyName?: string;
  role: UserRole;
  isLoading?: boolean;
}
