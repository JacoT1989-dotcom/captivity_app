"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabNavigationProps } from "./types";

export function TabNavigation({ activeTab }: TabNavigationProps) {
  return (
    <div className="overflow-x-auto -mx-4 px-4 mb-6 md:mb-8">
      <TabsList className="inline-flex w-auto min-w-full md:w-full">
        <TabsTrigger
          value="new-arrivals"
          className="text-base md:text-xl font-medium md:font-bold flex-1 min-w-[120px] md:min-w-0"
        >
          New Arrivals
        </TabsTrigger>
        <TabsTrigger
          value="best-sellers"
          className="text-base md:text-xl font-medium md:font-bold flex-1 min-w-[120px] md:min-w-0"
        >
          Best Sellers
        </TabsTrigger>
        <TabsTrigger
          value="on-sale"
          className="text-base md:text-xl font-medium md:font-bold flex-1 min-w-[120px] md:min-w-0"
        >
          On Sale
        </TabsTrigger>
      </TabsList>
    </div>
  );
}
