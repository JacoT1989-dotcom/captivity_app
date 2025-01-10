// shopping/(product_categories)/summer/page.tsx
import React from "react";
import CollectionPage from "../_components/CollectionPage";

export default async function BaseballPage(): Promise<JSX.Element> {
  return (
    <div>
      <div className="bg-background border-b border-border mb-6">
        <div className="container mx-auto px-4 py-6 shadow-2xl shadow-black dark:shadow-gray-500">
          <h1 className="text-3xl font-bold text-foreground">
            Baseball Collection
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover our latest baseball styles and seasonal favorites
          </p>
        </div>
      </div>
      <CollectionPage category="baseball" />
    </div>
  );
}
