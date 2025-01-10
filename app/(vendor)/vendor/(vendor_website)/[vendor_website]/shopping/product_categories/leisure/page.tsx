import React from "react";
import VendorLeisureCollection from "./LeisureCollection";

export default async function LeisurePage(): Promise<JSX.Element> {
  return (
    <div>
      <div className="bg-muted border-b border-border mb-6">
        <div className="container mx-auto px-4 py-6 shadow-2xl shadow-black">
          <h1 className="text-3xl font-bold text-foreground">
            Leisure Collection
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover our casual comfort styles and relaxation favorites
          </p>
        </div>
      </div>
      <VendorLeisureCollection />
    </div>
  );
}
