"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { RiStarSFill } from "react-icons/ri";

const AspenBeanie = () => {
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
        <Link href="/products/aspen-beanie">
          <Image
            src={
              isHovered
                ? "/Aspen-Beanie-Lime.jpg"
                : "/Aspen-Beanie-model.jpg"
            }
            alt="Orange Beanie"
            width={1834}
            height={1834}
            style={{ cursor: 'pointer' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          </Link>
        </figure>
        <div className="card-body bg-gray-300 rounded-b hover:shadow-lg">
          <h2 className="card-title flex justify-center font-medium">Aspen Beanie</h2>
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

export default AspenBeanie;
