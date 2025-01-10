import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductSection = () => {
  return (
    <div className="md:m-10 m-5">
      <div className="md:flex md:items-center md:justify-center">
        {/* Horizontal line */}
        <div className="md:hidden lg:hidden xl:hidden  w-auto h-px bg-gray-400 ml-2 mr-2"></div>
        <div className="md:hidden flex flex-nowrap items-center justify-between m-1 p-2">
          <p className="text-sm text-gray-600 font-bold">Categories</p>{" "}
          <p className="text-red-500 text-sm font-bold">VIEW ALL</p>
        </div>

        <div className="flex flex-nowrap items-center justify-center max-w-[950px] ">
          <div className="w-full sm:w-1/2 md:w-1/4 p-2 ">
            <div className="relative group rounded-lg overflow-hidden ">
              <Link href="/products/headwear/new-in-headwear">
                <Image
                  src="https://captivity.co.za/wp-content/uploads/2023/05/Headwear-cat-btn.svg"
                  alt="Headwear"
                  className="block sm:hidden w-full h-auto"
                  width={100}
                  height={200}
                />
                <Image
                  src="/1-Headwear-CTA-spring.jpg"
                  alt="Headwear"
                  className="hidden sm:block w-full h-auto hover:cursor-pointer group-hover:brightness-50 transition duration-1000"
                  width={786}
                  height={1239}
                />
                <div className="absolute bottom-8 left-0 w-full hover:cursor-pointer font-bold text-white text-center py-2 transition duration-700 group-hover:bg-opacity-75 hidden sm:block">
                  <span className="text-lg group-hover:text-xl hover:cursor-pointer transition duration-700">
                    HEADWEAR
                  </span>
                </div>
              </Link>
            </div>
          </div>
          <div className="w-full sm:w-1/2 md:w-1/4 p-2">
            <div className="relative group rounded-lg overflow-hidden">
              <Link href="/products/apparel/new-in-apparel">
                <Image
                  src="https://captivity.co.za/wp-content/uploads/2023/09/Apparel-cat-btn-2.svg"
                  alt="Apparel"
                  className="block sm:hidden w-full h-auto "
                  width={100}
                  height={200}
                />
                <Image
                  src="/2-Apparel-CTA-spring.jpg"
                  alt="Apparel"
                  className="hidden sm:block w-full h-auto hover:cursor-pointer group-hover:brightness-50 transition duration-1000"
                  width={786}
                  height={1239}
                />
              </Link>
              <div className="absolute bottom-8 left-0 w-full hover:cursor-pointer font-bold bg-opacity-50 text-white text-center py-2 transition duration-700 group-hover:bg-opacity-75 hidden sm:block">
                <span className="text-lg group-hover:text-xl hover:cursor-pointer transition duration-300">
                  APPAREL
                </span>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-1/2 md:w-1/4 p-2">
            <div className="relative group rounded-lg overflow-hidden">
              <Link href="/products/apparel/t-shirts">
                <Image
                  src="https://captivity.co.za/wp-content/uploads/2023/09/T-Shirts-cat-btn.svg"
                  alt="T-Shirts"
                  className="block sm:hidden w-full h-auto"
                  width={100}
                  height={200}
                />
                <Image
                  src="/3-T-shirts-CTA-spring.jpg"
                  alt="T-Shirts"
                  className="hidden sm:block hover:cursor-pointer w-full h-auto group-hover:brightness-50 transition duration-1000"
                  width={786}
                  height={1239}
                />
              </Link>
              <div className="absolute font-bold bottom-8 hover:cursor-pointer left-0 w-full bg-opacity-50 text-white text-center py-2 transition duration-700 group-hover:bg-opacity-75 hidden sm:block">
                <span className="text-lg group-hover:text-xl hover:cursor-pointer transition duration-300">
                  T-SHIRTS
                </span>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-1/2 md:w-1/4 p-2">
            <div className="relative group rounded-lg overflow-hidden">
              <Link href="/products/apparel/kids">
                <Image
                  src="https://captivity.co.za/wp-content/uploads/2023/05/Kids-cat-btn.svg"
                  alt="Kids"
                  className="block sm:hidden w-full h-auto "
                  width={100}
                  height={200}
                />
                <Image
                  src="/4-Kids-CTA-spring.jpg"
                  alt="Kids"
                  className="hidden sm:block w-full h-auto hover:cursor-pointer group-hover:brightness-50 transition duration-1000"
                  width={786}
                  height={1239}
                />
              </Link>
              <div className="absolute bottom-8 left-0 w-full hover:cursor-pointer font-bold bg-opacity-50 text-white text-center py-2 transition duration-1000 group-hover:bg-opacity-75 hidden sm:block">
                <span className="text-lg group-hover:text-xl hover:cursor-pointer transition duration-1000">
                  KIDS
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Horizontal line */}
        <div className="md:hidden lg:hidden xl:hidden w-auto h-px mb-5 bg-gray-400 ml-2 mr-2"></div>
      </div>
    </div>
  );
};

export default ProductSection;
