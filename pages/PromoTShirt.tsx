"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { RiStarSFill } from "react-icons/ri";

const PromoTShirt = () => {
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
        <Link href="/products/promo-t-shirt">
          <Image
            src={
              isHovered
                ? "/Kids-Promo-T-Shirt-Lime2.jpg"
                : "/Promo-T-Shirt-Model-1.jpg"
            }
            alt="Red T-Shirt"
            width={1834}
            height={1834}
            style={{ cursor: 'pointer' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          </Link>
        </figure>
        <div className="card-body bg-gray-300 rounded-b hover:shadow-lg">
          <h2 className="card-title flex justify-center font-medium">Promo T-Shirt</h2>
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

export default PromoTShirt;
