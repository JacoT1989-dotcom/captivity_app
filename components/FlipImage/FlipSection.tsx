"use client";

import React from "react";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import ReactCardFlip from "react-card-flip";

const FlipSection = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="p-5">
      <div className="max-w-6xl mx-auto bg-white flex flex-wrap">
        <div className="w-full lg:w-1/2 hidden md:block">
          <ReactCardFlip flipDirection="vertical" isFlipped={isFlipped}>
            <Link
              href="https://fwrd.co.za/"
              onMouseEnter={() => setIsFlipped(true)}
              onMouseLeave={() => setIsFlipped(false)}
            >
              <Image src="/fwrd.png" alt="fwrd" width={841} height={465} />
            </Link>
            <Link
              href="https://fwrd.co.za/"
              onMouseEnter={() => setIsFlipped(true)}
              onMouseLeave={() => setIsFlipped(false)}
            >
              <button className="bg-red-600 border-2 border-white text-white hover:bg-black rounded px-7 py-3 absolute mt-3 top-44 left-52">
                Take me there
              </button>
              <Image
                src="/fwrdFlipPicture.png"
                alt="fwrd2"
                width={841}
                height={465}
              />
            </Link>
          </ReactCardFlip>
        </div>
        <div className="w-full px-10 lg:w-1/2 md:text-left text-center">
          <h2 className="md:text-3xl text-lg font-bold text-red-600 pb-5">
            VISIT THE FWRD WEBSITE
          </h2>
          <p className="text-gray-500 md:text-lg text-xs mb-8 py-4">
            The FWRD Brand is distributed via promotional companies,
            advertising, event companies and resellers ONLY.
          </p>
          <Link href="https://fwrd.co.za/">
            <button className="bg-red-500 hover:bg-black text-white md:px-10 px-7 md:py-3 py-2 md:mb-0 mb-10 rounded">
              Visit Site
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FlipSection;
