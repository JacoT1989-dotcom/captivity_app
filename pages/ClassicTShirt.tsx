"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { RiStarSFill } from "react-icons/ri";

const ClassicTShirt = () => {
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseEnter() {
    setIsHovered(true);
  }

  function handleMouseLeave() {
    setIsHovered(false);
  }

  return (
    <main className="py-3">
      <div className="card card-compact  rounded-md object-cover w-90">
        <figure>
        <Link href="/products/classic-t-shirt">
          <Image
            src={
              isHovered
                ? "/Classic-T-Shirt-Airforce-Blue2.jpg"
                : "/Classic-T-Shirt-Model-2.jpg"
            }
            alt="Blue T-Shirt"
            width={1834}
            height={1834}
            style={{ cursor: 'pointer' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          </Link>
        </figure>

        <div className="card-body bg-gray-300 rounded-b hover:shadow-lg">
          <h2 className="card-title flex justify-center font-medium">Classic T-Shirt</h2>
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

export default ClassicTShirt;
