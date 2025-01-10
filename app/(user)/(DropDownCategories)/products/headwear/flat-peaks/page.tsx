// app/(user)/(DropDownCategories)/products/headwear/flat-peaks/page.tsx
import React from "react";
import FlatPeaksProductList from "./_components/FlatPeaks";

const FlatPeaksPage = () => {
  return (
    <>
      {/* Banner Section - full width */}
      <div className="w-full mx-0">
        <FlatPeaksProductList />
      </div>
    </>
  );
};

export default FlatPeaksPage;
