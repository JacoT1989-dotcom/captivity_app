import React from "react";
import VendorFashionCollection from "./FashionCollection";

export default async function FashionPage(): Promise<JSX.Element> {
  return (
    <div>
      <div className="bg-muted border-b border-border mb-6">
        <div className="container mx-auto px-4 py-6 shadow-2xl shadow-black">
          <h1 className="text-3xl font-bold text-foreground">
            Fashion Collection
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover our trendy styles and fashion-forward designs
          </p>
        </div>
      </div>
      <VendorFashionCollection />
    </div>
  );
}
