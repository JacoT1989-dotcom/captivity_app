import React from "react";
import AmericanoCap from "@/pages/AmericanoCap";
import AspenBeanie from "@/pages/AspenBeanie";
import ClassicTShirt from "@/pages/ClassicTShirt";
import PromoTShirt from "@/pages/PromoTShirt";

const BestSeller = () => {
  return (
    <div className="mx-auto max-w-6xl">
      <section className="max-container max-sm:mt-12">
        <div className="flex flex-col justify-center gap-2">
          <h2 className="text-3xl sm:text-2xl md:text-2xl lg:text-3xl flex items-center justify-center text-red-600 font-semibold">
            BEST SELLERS
          </h2>
        </div>
        <div className="lg:ml-11 lg:mr-12 p-12 mb-10 lg:mt-0 grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-1 grid-cols-2 sm:gap-4 gap-2 justify-center items-center">
          <>
            <AmericanoCap />
            <AspenBeanie />
            <ClassicTShirt />
            <PromoTShirt />
          </>
        </div>
      </section>
    </div>
  );
};

export default BestSeller;
