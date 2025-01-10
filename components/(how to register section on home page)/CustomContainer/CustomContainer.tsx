import React from "react";
import Image from "next/image";
import Link from "next/link";

const CustomContainer = () => {
  return (
    <section className="bg-white w-full hidden sm:block">
      <div className="flex w-full">
        <div className="relative group flex-1 overflow-hidden h-[500px]">
          <Image
            src="/ClassicTShirts.jpg"
            alt="Classic T-Shirts"
            fill
            sizes="max-width"
            style={{ objectFit: "cover" }}
            className="transform transition-transform duration-0 ease-in-out group-hover:scale-125"
          />
          <Link
            // href="/products/classic-t-shirts"
            href="/products/apparel/t-shirts"
            className="absolute bottom-14 right-20 transition-transform duration-300 ease-in-out group-hover:translate-x-10 group-hover:scale-125 bg-red-700 text-white px-7 py-3 rounded font-bold"
          >
            Classic T-Shirts
          </Link>
        </div>
        <div className="relative group flex-1 overflow-hidden h-[500px]">
          <Image
            src="/CamperCap.jpg"
            alt="Camper Cap"
            fill
            sizes="max-width"
            style={{ objectFit: "cover" }}
            className="transform transition-transform duration-0 ease-in-out group-hover:scale-125"
          />
          <Link
            // href="/products/camper-cap"
            href="/products/headwear/109979"
            className="absolute bottom-14 right-20 transition-transform duration-300 ease-in-out group-hover:translate-x-10 group-hover:scale-125 bg-red-700 text-white px-7 py-3 rounded font-bold"
          >
            Camper Cap
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CustomContainer;
