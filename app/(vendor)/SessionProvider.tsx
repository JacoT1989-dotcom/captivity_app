// app/(vendor)/SessionProvider.tsx
"use client";

import { createContext, useContext } from "react";

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
  | "VENDORCUSTOMER";

// Updated User interface with all needed properties
export interface User {
  id: string;
  name?: string;
  email?: string;
  username?: string;
  avatarUrl: string | null | undefined; // Allow null as well
  role: UserRole;
  vendor_website?: string;
  associated_vendors?: string[];
  // Add any other user properties you need
}

export interface SessionContext {
  user: User | null;
}

const SessionContext = createContext<SessionContext | null>(null);

interface SessionProviderProps {
  children: React.ReactNode;
  value: SessionContext;
}

export default function SessionProvider({
  children,
  value,
}: SessionProviderProps) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionContext {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
