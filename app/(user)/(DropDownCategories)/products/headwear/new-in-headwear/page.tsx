// page.tsx (HeadwearLanding)
import React from "react";
import NewInHeadwearProductList from "./_components/NewInHeadwear";

const HeadwearLanding = () => {
  return (
    <>
      {/* Banner Section - removed any container classes to allow full width */}
      <div className="w-full mx-0">
        <NewInHeadwearProductList />
      </div>
    </>
  );
};

export default HeadwearLanding;
