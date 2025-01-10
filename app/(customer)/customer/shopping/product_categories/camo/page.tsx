// shopping/(product_categories)/fashion/page.tsx
import React from "react";
import CollectionPage from "../_components/CollectionPage";

export default async function CamoPage(): Promise<JSX.Element> {
  return (
    <div>
      <div className="bg-background border-b border-border mb-6">
        <div className="container mx-auto px-4 py-6 shadow-2xl shadow-black dark:shadow-gray-500">
          <h1 className="text-3xl font-bold text-foreground">
            Camo Collection
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover our latest Camo styles and seasonal favorites
          </p>
        </div>
      </div>
      <CollectionPage category="camo" />
    </div>
  );
}
