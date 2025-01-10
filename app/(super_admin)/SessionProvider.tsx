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
}: React.PropsWithChildren<{ value: SessionContext }>) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
