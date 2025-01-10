import React, { ReactNode } from "react";
import prisma from "@/lib/prisma";
import FilterSidebar from "./_components/FilterSidebar";
import ProductCarousel from "./_components/ProductCarousel";
import SearchField from "@/app/(customer)/_components/SearchField";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { ProductWithRelations } from "./types";

interface LayoutProps {
  children: ReactNode;
}

async function fetchAllProducts(): Promise<ProductWithRelations[]> {
  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
    },
    include: {
      dynamicPricing: true,
      featuredImage: true,
      variations: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return products as ProductWithRelations[];
}

async function fetchNewProducts() {
  const newProducts = await prisma.product.findMany({
    where: {
      AND: [
        {
          isPublished: true,
          category: {
            hasSome: ["new-products"],
          },
        },
      ],
    },
    select: {
      id: true,
      productName: true,
      featuredImage: {
        select: {
          medium: true,
          large: true,
        },
      },
      variations: {
        select: {
          quantity: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return newProducts.map(product => ({
    id: product.id,
    name: product.productName,
    imageUrl: `${product.featuredImage?.medium || ""},${product.featuredImage?.large || ""}`,
    stock: product.variations.reduce(
      (total, variation) => total + variation.quantity,
      0
    ),
  }));
}

export default async function Layout({
  children,
}: LayoutProps): Promise<JSX.Element> {
  const [newProducts, allProducts] = await Promise.all([
    fetchNewProducts(),
    fetchAllProducts(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="lg"
              className="rounded-full hover:bg-red-500 absolute bottom-16 right-2 shadow-lg flex items-center gap-2"
            >
              <Filter className="h-5 w-5" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
            <SheetHeader className="p-4">
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Filter products by category, color, and size
              </SheetDescription>
            </SheetHeader>
            <div className="p-4 space-y-6 h-full overflow-y-auto">
              <FilterSidebar products={allProducts} />
              {newProducts.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    New Products
                  </h2>
                  <ProductCarousel
                    products={newProducts}
                    className="bg-card rounded-lg shadow-md mb-20"
                  />
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-4 sm:py-6 md:py-8 px-2 sm:px-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Sidebar Column - Desktop */}
          <div className="hidden lg:block w-[300px] flex-shrink-0">
            {/* Search - Desktop Only */}
            <div className="mb-6">
              <SearchField />
            </div>

            {/* Filters */}
            <div className="sticky top-4">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                Filter
              </h1>
              <FilterSidebar products={allProducts} />

              {/* New Products Carousel */}
              {newProducts.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    New Products
                  </h2>
                  <ProductCarousel
                    products={newProducts}
                    className="bg-card rounded-lg shadow-2xl shadow-black mb-20"
                  />
                </div>
              )}

              {/* Shop Name Banner */}
              <div className="mt-8 bg-black shadow-2xl shadow-black text-white p-4 sm:p-6 rounded-lg">
                <h2 className="text-xl sm:text-2xl font-medium text-center">
                  Welcome to Captivity Express Shop.
                </h2>
              </div>
            </div>
          </div>

          {/* Main Content Column */}
          <div className="flex-1 min-w-0">
            {/* Search - Mobile Only */}
            <div className="lg:hidden sticky top-0 bg-background z-40 pb-4 pt-2">
              <SearchField />
            </div>
            {children}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-muted mt-8 sm:mt-12 py-8 sm:py-12 mb-16 sm:mb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
              Stay Updated
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-4">
              Subscribe to our newsletter for exclusive collection updates and
              special offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto px-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md border border-border bg-background min-w-0"
                required
              />
              <Button
                type="submit"
                className="w-full sm:w-auto whitespace-nowrap"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
