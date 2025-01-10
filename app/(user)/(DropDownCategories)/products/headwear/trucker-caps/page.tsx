// app/(user)/(DropDownCategories)/products/headwear/trucker-caps/page.tsx
import React from "react";
import TruckerCapsProductList from "./_components/TruckerCaps";

const TruckerCapsPage = () => {
  return (
    <>
      {/* Banner Section - full width */}
      <div className="w-full">
        <TruckerCapsProductList />
      </div>

      {/* Products Grid Section */}
      <div className="mt-6">{/* Your products grid component here */}</div>
    </>
  );
};

export default TruckerCapsPage;
