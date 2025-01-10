"use client";

import { Session, User } from "lucia";
import React, { createContext, useContext, useEffect } from "react";
import { useFavoriteStore } from "./customer/favourites/_favoritesStore";

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
    isLoading?: boolean;
  };
  session: Session;
}

const SessionContext = createContext<SessionContext | null>(null);

export default function SessionProvider({
  children,
  value,
}: React.PropsWithChildren<{ value: SessionContext }>) {
  const clearFavorites = useFavoriteStore(state => state.clearFavorites);
  useEffect(() => {
    if (!value.user) {
      clearFavorites();
    }
    return () => {
      clearFavorites();
    };
  }, [value.user, clearFavorites]); // Only run when user ID changes
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
