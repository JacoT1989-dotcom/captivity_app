import React from "react";
import NewInApparelProductList from "./_components/NewInApparelProductList";

const NewInApparelLanding = () => {
  return (
    <>
      {/* Banner Section - removed any container classes to allow full width */}
      <div className="w-full mx-0">
        <NewInApparelProductList />
      </div>
    </>
  );
};

export default NewInApparelLanding;
