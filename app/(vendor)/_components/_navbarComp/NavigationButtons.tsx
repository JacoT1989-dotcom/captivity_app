import React from "react";
import Link from "next/link";
import { Home, Store, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  vendorWebsite: string;
}

export const NavigationButtons = React.memo(
  ({ vendorWebsite }: NavigationButtonsProps) => (
    <div className="flex gap-1.5 md:gap-3">
      <Button
        variant="default"
        size="sm"
        className="flex-1 md:flex-none h-9 px-2.5 md:px-4"
        asChild
      >
        <Link href={`/vendor/${vendorWebsite}/welcome`}>
          <Home className="w-4 h-4 md:mr-2" />
          <span className="text-xs ml-1.5 md:text-sm md:ml-0">Home</span>
        </Link>
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className="flex-1 md:flex-none h-9 px-2.5 md:px-4"
        asChild
      >
        <Link href={`/vendor/${vendorWebsite}`}>
          <Store className="w-4 h-4 md:mr-2" />
          <span className="text-xs ml-1.5 md:text-sm md:ml-0">History</span>
        </Link>
      </Button>
      <Button
        variant="destructive"
        size="sm"
        className="flex-1 md:flex-none h-9 px-2.5 md:px-4"
        asChild
      >
        <Link
          href={`/vendor/${vendorWebsite}/shopping/product_categories/summer`}
        >
          <ShoppingBag className="w-4 h-4 md:mr-2" />
          <span className="text-xs ml-1.5 md:text-sm md:ml-0">Shop</span>
        </Link>
      </Button>
    </div>
  )
);

NavigationButtons.displayName = "NavigationButtons";
