// app/(vendor)/SessionProvider.tsx
"use client";

import { createContext, useContext } from "react";

export type UserRole = "VENDOR" | "VENDORCUSTOMER";

export interface User {
  id: string;
  name?: string;
  email?: string;
  role: UserRole;
  vendor_website?: string;
  associated_vendors?: string[];
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
