"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleFavorite } from "../action";
import { useState } from "react";
import { toast } from "sonner";
import { ProductWithRelations } from "../types";
import { useFavoriteStore } from "../_favoritesStore";

interface FavoriteButtonProps {
  product: ProductWithRelations;
  className?: string;
}

export const FavoriteButton = ({
  product,
  className = "",
}: FavoriteButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isLoading) return;

    const currentFavoriteStatus = isFavorite(product.id);
    const isAddingToFavorites = !currentFavoriteStatus;

    // Optimistically update UI
    if (isAddingToFavorites) {
      addFavorite(product);
    } else {
      removeFavorite(product.id);
    }

    try {
      setIsLoading(true);
      const result = await toggleFavorite(product.id);

      if (result.success) {
        toast.success(
          isAddingToFavorites ? "Added to favorites" : "Removed from favorites"
        );
      } else {
        // Revert optimistic update on error
        if (isAddingToFavorites) {
          removeFavorite(product.id);
        } else {
          addFavorite(product);
        }
        toast.error(result.error || "Failed to update favorites");
      }
    } catch (error) {
      // Revert optimistic update on error
      if (isAddingToFavorites) {
        removeFavorite(product.id);
      } else {
        addFavorite(product);
      }
      console.error("Error toggling favorite:", error);
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`absolute top-2 left-2 z-10 ${
        isLoading ? "opacity-50" : ""
      } ${className}`}
      onClick={handleToggleFavorite}
      disabled={isLoading}
    >
      <Heart
        className={`h-5 w-5 transition-colors duration-200 ${
          isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"
        }`}
      />
    </Button>
  );
};
