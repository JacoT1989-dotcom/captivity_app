"use client";

import { useEffect, useState } from "react";
import { useFavoriteStore } from "./_favoritesStore";
import { getFavorites } from "./action";
import ProductCard from "../shopping/product_categories/_components/ProductCardColorPicker";
import DetailedProductCard from "../shopping/product_categories/_components/DetailProductPageCard";
import GalleryProductCard from "../shopping/product_categories/_components/GalleryProductCard";
import LayoutSwitcher from "../shopping/product_categories/_components/LayoutSwither";
import { ProductWithRelations } from "./types";
import { useRouter } from "next/navigation";
import { validateRequest } from "@/auth";
import { FaSpinner } from "react-icons/fa";
import BackToCustomerPage from "../_components/BackToCustomerButton";

const FavoritesPage = () => {
  const { favorites, setFavorites, isLoading, setLoading, clearFavorites } =
    useFavoriteStore();
  const [layout, setLayout] = useState<"grid" | "detail" | "gallery">("grid");
  const router = useRouter();

  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      try {
        const result = await getFavorites();
        if (result.success && result.data) {
          setFavorites(result.data);
        } else if (result.error === "Not authenticated") {
          clearFavorites();
          router.push("/login");
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
        clearFavorites();
      }
    };

    loadFavorites();

    // Cleanup on unmount
    return () => {
      clearFavorites();
    };
  }, [setFavorites, setLoading, clearFavorites, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <FaSpinner className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6 p-4">
      <div className="flex items-center justify-between mb-6">
        <BackToCustomerPage />
        <h1 className="text-2xl text-red-500 font-bold">My Favorites</h1>
        <LayoutSwitcher layout={layout} onLayoutChange={setLayout} />
      </div>

      {favorites.length === 0 ? (
        <div className="text-center text-gray-500">
          No favorite products yet.
        </div>
      ) : (
        <>
          {layout === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((product: ProductWithRelations) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  selectedColors={[]}
                  selectedSizes={[]}
                />
              ))}
            </div>
          ) : layout === "detail" ? (
            <div className="space-y-6">
              {favorites.map((product: ProductWithRelations) => (
                <DetailedProductCard
                  key={product.id}
                  product={product}
                  selectedColors={[]}
                  selectedSizes={[]}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {favorites.map((product: ProductWithRelations) => (
                <GalleryProductCard
                  key={product.id}
                  product={product}
                  selectedColors={[]}
                  selectedSizes={[]}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FavoritesPage;
