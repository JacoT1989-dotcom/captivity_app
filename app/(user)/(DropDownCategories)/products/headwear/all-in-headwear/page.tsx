// app/(user)/(DropDownCategories)/products/headwear/beanies/page.tsx
import React from "react";
import AllInHeadwearProductList from "./_components/All_Headwear";

const BeaniesPage = () => {
  return (
    <>
      {/* Banner Section - full width */}
      <div className="w-full mx-0">
        <AllInHeadwearProductList />
      </div>
    </>
  );
};

export default BeaniesPage;
