import React from "react";
import CollectionPage from "../_components/CollectionPage";

export default async function WinterPage(): Promise<JSX.Element> {
  return (
    <div>
      <div className="bg-background border-b border-border mb-6">
        <div className="container mx-auto px-4 py-6 shadow-2xl shadow-black dark:shadow-gray-500">
          <h1 className="text-3xl font-bold text-foreground text-cyan-400">
            Winter Collection
          </h1>
          <p className="text-muted-foreground mt-1">
            Explore our latest winter styles and seasonal essentials
          </p>
        </div>
      </div>
      <CollectionPage category="winter" />
    </div>
  );
}
