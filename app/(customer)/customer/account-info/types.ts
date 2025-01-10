// Enums
export enum UserRole {
  USER = "USER",
  CUSTOMER = "CUSTOMER",
  SUBSCRIBER = "SUBSCRIBER",
  PROMO = "PROMO",
  DISTRIBUTOR = "DISTRIBUTOR",
  SHOPMANAGER = "SHOPMANAGER",
  EDITOR = "EDITOR",
  ADMIN = "ADMIN",
}

// Custom Types
export type Country =
  | "southAfrica"
  | "namibia"
  | "botswana"
  | "zimbabwe"
  | "mozambique";

export type BusinessNature =
  | "distributors"
  | "retailer"
  | "manufacturer"
  | "service"
  | "other";

export type Supplier =
  | "none"
  | "supplier1"
  | "supplier2"
  | "supplier3"
  | "other";

export type SalesRep = "noOne" | "rep1" | "rep2" | "rep3" | "rep4";

// Base User Interface
export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  vatNumber?: string;
  phoneNumber: string;
  streetAddress: string;
  addressLine2?: string;
  suburb?: string;
  townCity: string;
  postcode: string;
  country: string;
  position?: string;
  natureOfBusiness: string;
  currentSupplier: string;
  otherSupplier?: string;
  resellingTo?: string;
  salesRep: string;
  website?: string;
  companyName: string;
  ckNumber?: string;
  avatarUrl?: string;
  bio?: string;
  agreeTerms: boolean;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// User Data for Form
export interface UserData {
  id: string; // Added id field
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  website?: string;
  bio?: string;
  streetAddress: string;
  addressLine2?: string;
  suburb?: string;
  townCity: string;
  postcode: string;
  country: Country;
  companyName: string;
  vatNumber?: string;
  ckNumber?: string;
  position?: string;
  natureOfBusiness: BusinessNature;
  currentSupplier: Supplier;
  otherSupplier?: string;
  resellingTo?: string;
  salesRep: SalesRep;
}

// Update DTOs
export interface UpdateUserProfileDto {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  email?: string;
  vatNumber?: string;
  phoneNumber?: number;
  streetAddress?: string;
  addressLine2?: string;
  suburb?: string;
  townCity?: string;
  postcode?: string;
  country?: string;
  position?: string;
  website?: string;
  companyName?: string;
  ckNumber?: string;
  avatarUrl?: string;
  bio?: string;
}

export interface UpdateBusinessInfoDto {
  natureOfBusiness?: string;
  currentSupplier?: string;
  otherSupplier?: string;
  resellingTo?: string;
  salesRep?: string;
}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Display Profile
export interface UserProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  role: UserRole;
  companyName: string;
  website?: string;
}

// Form Props
export interface UpdateUserFormProps {
  user: UserData; // Now includes id, no need for separate userId
}

// Response and Status Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface UpdateStatus {
  success?: string;
  error?: string;
}
