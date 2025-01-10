import React from "react";
import VendorKidsCollection from "./KidsCollection";

export default async function KidsPage(): Promise<JSX.Element> {
  return (
    <div>
      <div className="bg-muted border-b border-border mb-6">
        <div className="container mx-auto px-4 py-6 shadow-2xl shadow-black">
          <h1 className="text-3xl font-bold text-foreground">
            Kids Collection
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover our playful styles and childrens favorites
          </p>
        </div>
      </div>
      <VendorKidsCollection />
    </div>
  );
}
