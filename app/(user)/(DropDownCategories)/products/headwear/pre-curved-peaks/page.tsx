// app/(user)/(DropDownCategories)/products/headwear/pre-curved-peaks/page.tsx
import React from "react";
import PreCurvedPeaksProductList from "./_components/PreCurvedPeaks";

const PreCurvedPeaksPage = () => {
  return (
    <>
      {/* Banner Section - full width */}
      <div className="w-full mx-0">
        <PreCurvedPeaksProductList />
      </div>
    </>
  );
};

export default PreCurvedPeaksPage;
