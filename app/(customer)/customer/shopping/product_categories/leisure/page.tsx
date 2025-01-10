import React from "react";
import CollectionPage from "../_components/CollectionPage";

export default async function LeisurePage(): Promise<JSX.Element> {
  return (
    <div>
      <div className="bg-background border-b border-border mb-6">
        <div className="container mx-auto px-4 py-6 shadow-2xl shadow-black">
          <h1 className="text-3xl font-bold text-foreground dark:shadow-gray-500">
            Leisure Collection
          </h1>
          <p className="text-muted-foreground mt-1">
            Explore our latest leisure styles and seasonal essentials
          </p>
        </div>
      </div>
      <CollectionPage category="leisure" />
    </div>
  );
}
