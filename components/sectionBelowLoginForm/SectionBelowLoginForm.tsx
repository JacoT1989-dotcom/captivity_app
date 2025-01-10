import React from "react";
import Image from "next/image";

const sectionBelowLoginForm = () => {
  return (
    <div className="flex h-screen">
      <h2 className="mb-4 text-2xl font-semibold pb-5 text-left text-gray-700">
        Trading as a reseller?
      </h2>
      <button
        className="px-4 py-2 font-bold text-white bg-red-500 rounded-sm hover:bg-red-700 focus:outline-none focus:shadow-outline"
        type="button"
      >
        Log In
      </button>
      <Image
      src='/hours-section.png'
      alt="Hours Section"
      width={1803}
      height={558}
      />
    </div>
  );
};

export default sectionBelowLoginForm;
