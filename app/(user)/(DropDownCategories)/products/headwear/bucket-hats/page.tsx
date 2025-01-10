// app/(user)/(DropDownCategories)/products/headwear/bucket-hats/page.tsx
import React from "react";
import BucketHatsProductList from "./_components/BucketHats";

const BucketHatsPage = () => {
  return (
    <>
      {/* Banner Section - full width */}
      <div className="w-full mx-0">
        <BucketHatsProductList />
      </div>
    </>
  );
};

export default BucketHatsPage;
