// app/(user)/(DropDownCategories)/products/headwear/beanies/page.tsx
import React from "react";
import BeaniesProductList from "./_components/Beanies";

const BeaniesPage = () => {
  return (
    <>
      {/* Banner Section - full width */}
      <div className="w-full mx-0">
        <BeaniesProductList />
      </div>
    </>
  );
};

export default BeaniesPage;
