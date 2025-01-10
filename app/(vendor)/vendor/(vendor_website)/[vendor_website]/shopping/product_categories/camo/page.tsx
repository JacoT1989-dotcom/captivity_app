import React from "react";
import VendorCamoCollection from "./CamoCollection";

export default async function CamoPage(): Promise<JSX.Element> {
  return (
    <div>
      <div className="bg-muted border-b border-border mb-6">
        <div className="container mx-auto px-4 py-6 shadow-2xl shadow-black">
          <h1 className="text-3xl font-bold text-foreground">
            Camo Collection
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover our military-inspired styles and camouflage designs
          </p>
        </div>
      </div>
      <VendorCamoCollection />
    </div>
  );
}
