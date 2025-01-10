"use client"

import { RiStarSFill } from "react-icons/ri";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const AmericanoCap = () => {
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseEnter() {
    setIsHovered(true);
  }

  function handleMouseLeave() {
    setIsHovered(false);
  }

  return (
    <main className="py-3">
      <div className="card card-compact rounded-md object-cover w-90">
        <figure>
        <Link href="/products/americano-cap">
          <Image
            src={
              isHovered
                ? "/Americano-Royal-Foc1-scaled.jpg"
                : "/Americano-model-scaled.jpg"
            }
            alt="Blue T-Shirt"
            width={2560}
            height={2560}
            style={{ cursor: 'pointer' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          </Link>
        </figure>
        <div className="card-body bg-gray-300 rounded-b  hover:shadow-lg">
          <h2 className="card-title flex justify-center font-medium">Americano Cap</h2>
          <div className="rating flex justify-center">
          <RiStarSFill className="my-3 text-yellow-400 text-2xl"/>
          <RiStarSFill className="my-3 text-yellow-400 text-2xl"/>
          <RiStarSFill className="my-3 text-yellow-400 text-2xl"/>
          <RiStarSFill className="my-3 text-yellow-400 text-2xl"/>
          <RiStarSFill className="my-3 text-yellow-400 text-2xl"/>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AmericanoCap;
