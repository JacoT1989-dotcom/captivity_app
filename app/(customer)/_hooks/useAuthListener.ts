"use client";

import { useEffect } from "react";
import { useFavoriteStore } from "../customer/favourites/_favoritesStore";
import { validateRequest } from "@/auth";

export const useAuthListener = () => {
  const clearFavorites = useFavoriteStore(state => state.clearFavorites);

  useEffect(() => {
    const checkAuth = async () => {
      const { user } = await validateRequest();
      if (!user) {
        clearFavorites();
      }
    };

    checkAuth();
  }, [clearFavorites]);
};
