import React from "react";
import VendorSportCollection from "./SportCollection";

export default async function SportPage(): Promise<JSX.Element> {
  return (
    <div>
      <div className="bg-muted border-b border-border mb-6">
        <div className="container mx-auto px-4 py-6 shadow-2xl shadow-black">
          <h1 className="text-3xl font-bold text-foreground">
            Sport Collection
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover our latest sport styles and athletic favorites
          </p>
        </div>
      </div>
      <VendorSportCollection />
    </div>
  );
}
