// app/SessionProvider.tsx
"use client";

import { Session, User } from "lucia";
import React, { createContext, useContext } from "react";

interface SessionContext {
  user: User & {
    role:
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
  };
  session: Session;
}

const SessionContext = createContext<SessionContext | null>(null);

export default function SessionProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: SessionContext | null;
}) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  // Return null if no context instead of throwing
  return context;
}
