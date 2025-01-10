"use client";

import Image from "next/image";

export default function NotFoundPage() {
  return (
    <div>
      <h1 className="flex justify-center mx-5 lg:text-4xl md:text-3xl sm:text-3xl p-4 text-red-500 font-semibold">
        PAGE NOT FOUND
      </h1>
      <div className="flex justify-center my-9 px-6 p-12">
        <Image
          src="/404.png"
          alt="404 not found image"
          width={769}
          height={346}
        />
      </div>
    </div>
  );
}
