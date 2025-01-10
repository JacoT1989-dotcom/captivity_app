// app/(user)/(DropDownCategories)/products/headwear/multifunctional-headwear/page.tsx
import React from "react";
import MultifunctionalHeadwearProductList from "./_components/MultifunctionalHeadwear";

const MultifunctionalHeadwearPage = () => {
  return (
    <>
      {/* Banner Section - full width */}
      <div className="w-full mx-0">
        <MultifunctionalHeadwearProductList />
      </div>
    </>
  );
};

export default MultifunctionalHeadwearPage;