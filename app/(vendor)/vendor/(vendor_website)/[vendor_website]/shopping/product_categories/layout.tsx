/* eslint-disable react/no-unescaped-entities */
// shopping/layout.tsx
import React, { ReactNode } from "react";
import FilterSidebar from "./_components/FilterSidebar";
import SearchField from "./_components/SearchField";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({
  children,
}: LayoutProps): Promise<JSX.Element> {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Filter Button - Fixed Position */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="default"
              size="lg"
              className="rounded-full shadow-lg"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px] px-0">
            <div className="px-4">
              <FilterSidebar />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-4 sm:py-6 md:py-8 px-2 sm:px-4">
        {/* Mobile Search - Sticky Top */}
        <div className="lg:hidden sticky top-0 bg-background z-40 pb-4 pt-2">
          <SearchField />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Sidebar Column - Desktop */}
          <div className="hidden lg:block w-[300px] flex-shrink-0 sticky top-4 h-fit">
            <div className="mb-6">
              <SearchField />
            </div>
            <FilterSidebar />
          </div>

          {/* Main Content Column */}
          <div className="flex-1 min-w-0">
            {" "}
            {/* min-w-0 prevents flex item overflow */}
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
              <Button type="submit" className="w-full sm:w-auto">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
