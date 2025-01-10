"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useVendorCollectionsStore } from "../_store/useVendorCollectionsStore";
import { useParams } from "next/navigation";
import { StarRating } from "../_components/StarRating";
import { useSession } from "@/app/(vendor)/SessionProvider";

const ITEMS_PER_PAGE = 4;

const VendorKidsCollection: React.FC = () => {
  const params = useParams();
  const vendorWebsite = params?.vendor_website as string;
  const { user } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const {
    collections,
    filteredCollections,
    isLoading,
    error,
    fetchCollections,
    isFetched,
  } = useVendorCollectionsStore();

  useEffect(() => {
    let isSubscribed = true;

    const initializeData = async () => {
      if (!user || !vendorWebsite || isFetched || isLoading) {
        return;
      }

      try {
        if (user.role === "VENDOR" || user.role === "VENDORCUSTOMER") {
          await fetchCollections(
            user.role === "VENDORCUSTOMER" ? vendorWebsite : undefined
          );
        }
      } catch (error) {
        if (isSubscribed) {
          console.error("Error fetching collections:", error);
        }
      }
    };

    initializeData();

    return () => {
      isSubscribed = false;
    };
  }, [user, vendorWebsite, fetchCollections, isFetched, isLoading]);

  if (!user || !vendorWebsite) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        Loading...
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        Loading kids collection...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center min-h-[400px] flex items-center justify-center">
        Error: {error}
      </div>
    );
  }

  const displayCollections = filteredCollections || collections;

  if (!displayCollections?.kids || displayCollections.kids.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-foreground">
          No products found in kids collection.
        </h2>
        {user?.role === "VENDOR" && (
          <p className="text-muted-foreground mt-2">
            Add some kids products to see them here.
          </p>
        )}
      </div>
    );
  }

  const totalPages = Math.max(
    1,
    Math.ceil(displayCollections.kids.length / ITEMS_PER_PAGE)
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = displayCollections.kids.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {currentProducts.map(product => (
          <Card
            key={product.id}
            className="overflow-hidden shadow-2xl shadow-black hover:scale-105"
          >
            <div className="relative aspect-square">
              <Image
                src={product.featuredImage?.medium || "/placeholder.jpg"}
                alt={product.productName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-lg mb-1 line-clamp-1">
                {product.productName}
              </h3>
              <p className="text-muted-foreground mb-1 text-sm line-clamp-1">
                {product.description}
              </p>
              <p className="font-bold text-lg mb-2">
                <StarRating />
              </p>
              <p className="font-bold text-lg mb-2">
                R {product.sellingPrice.toFixed(2)}
              </p>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  asChild
                  variant="default"
                  className="w-full bg-[#2c3e50] hover:bg-[#34495e]"
                >
                  <Link
                    href={`/vendor/${vendorWebsite}/shop_product/${product.id}`}
                  >
                    Shop
                  </Link>
                </Button>
                <Button asChild variant="destructive" className="w-full">
                  <Link
                    href={`/vendor/${vendorWebsite}/product_details/${product.id}`}
                  >
                    Details
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={safeCurrentPage === 1}
            variant="outline"
            size="icon"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                variant={safeCurrentPage === page ? "default" : "outline"}
                size="sm"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            onClick={() =>
              setCurrentPage(prev => Math.min(totalPages, prev + 1))
            }
            disabled={safeCurrentPage === totalPages}
            variant="outline"
            size="icon"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="text-sm text-muted-foreground text-center mt-4">
        Showing {startIndex + 1}-
        {Math.min(startIndex + ITEMS_PER_PAGE, displayCollections.kids.length)}{" "}
        of {displayCollections.kids.length} products
      </div>
    </div>
  );
};

export default VendorKidsCollection;
