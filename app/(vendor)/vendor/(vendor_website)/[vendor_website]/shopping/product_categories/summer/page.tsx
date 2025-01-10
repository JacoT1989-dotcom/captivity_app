// shopping/(product_categories)/summer/page.tsx
import React from "react";
import VendorSummerCollection from "./SummerCollection";

export default async function SummerPage(): Promise<JSX.Element> {
  return (
    <div>
      <div className="bg-muted border-b border-border mb-6">
        <div className="container mx-auto px-4 py-6 shadow-2xl shadow-black">
          <h1 className="text-3xl font-bold text-foreground">
            Summer Collection
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover our latest summer styles and seasonal favorites
          </p>
        </div>
      </div>
      <VendorSummerCollection />
    </div>
  );
}
