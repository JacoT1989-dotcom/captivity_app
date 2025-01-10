export type UserRole =
  | "USER"
  | "CUSTOMER"
  | "SUBSCRIBER"
  | "PROMO"
  | "DISTRIBUTOR"
  | "SHOPMANAGER"
  | "EDITOR"
  | "ADMIN"
  | "SUPERADMIN"
  | "VENDOR"
  | "VENDORCUSTOMER"
  | "APPROVEDVENDORCUSTOMER";

export interface User {
  id: string;
  role: UserRole;
}

export interface Session {
  user: User | null;
}
