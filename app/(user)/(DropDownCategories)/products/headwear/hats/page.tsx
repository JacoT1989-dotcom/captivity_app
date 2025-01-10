// app/(user)/(DropDownCategories)/products/headwear/hats/page.tsx
import React from "react";
import HatsProductList from "./_components/Hats";

const HatsPage = () => {
  return (
    <>
      {/* Banner Section - full width */}
      <div className="w-full mx-0">
        <HatsProductList />
      </div>
    </>
  );
};

export default HatsPage;
