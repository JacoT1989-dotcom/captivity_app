import Link from "next/link";
import React from "react";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";

const SideMenu = () => {
  return (
    <div className="space-y-5 md:mr-10 lg:mr-10 min-h-[500px] xl:mr-10 xl:ml-20 lg:ml-20 md:ml-20">
      <aside className="w-[230px] mb-0 hidden lg:block top-0 border-2 -ml-10 border-gray-800 pl-4 pb-4 pt-4">
        <ul className="menu  text-gray-700">
          <span className="text-xl font-bold">HEADWEAR</span>
          <li className="hover:text-red-400">
            <Link href="/products/headwear/new-in-headwear">
              New in Headwear
            </Link>
          </li>
          <li className="hover:text-red-400">
            <Link href="/products/headwear/flat-peaks">Flat Peaks</Link>
          </li>
          <li className="hover:text-red-400">
            <Link href="/products/headwear/pre-curved-peaks">
              Pre-Curved Peaks
            </Link>
          </li>
          <li className="hover:text-red-400">
            <Link href="/products/headwear/hats">Hats</Link>
          </li>
          <li className="hover:text-red-400">
            <Link href="/products/headwear/multifunctional-headwear">
              Multifunctional Headwear
            </Link>
          </li>
          <li className="hover:text-red-400">
            <Link href="/products/headwear/beanies">Beanies</Link>
          </li>
          <li className="hover:text-red-400">
            <Link href="/products/headwear/trucker-caps">Trucker Caps</Link>
          </li>
          <li className="hover:text-red-400">
            <Link href="/products/headwear/bucket-hats">Bucket Hats</Link>
          </li>
        </ul>
      </aside>
      <aside className="w-[230px]  hidden lg:block top-0 border-2 -ml-10 border-gray-800 pl-4 pb-4 pt-4">
        <ul className="menu  text-gray-700 ">
          <span className="text-xl font-bold">APPAREL</span>
          <li className="hover:text-red-400">
            <Link href="/products/apparel/new-in-apparel">New in Apparel</Link>
          </li>
          <li className="hover:text-red-400">
            <Link href="/products/apparel/men">Men</Link>
          </li>
          <li className="hover:text-red-400">
            <Link href="/products/apparel/women">Women</Link>
          </li>
          <li className="hover:text-red-400">
            <Link href="/products/apparel/kids">Kids</Link>
          </li>
          <li className="hover:text-red-400">
            <Link href="/products/apparel/t-shirts">T - Shirts</Link>
          </li>
          <li className="hover:text-red-400">
            <Link href="/products/apparel/golfers">Golfers</Link>
          </li>
          <li className="hover:text-red-400">
            <Link href="/products/apparel/hoodies">Hoodies</Link>
          </li>
          <li className="hover:text-red-400">
            <Link href="/products/apparel/jackets">Jackets</Link>
          </li>
          <li className="hover:text-red-400">
            <Link href="/products/apparel/bottoms">Bottoms</Link>
          </li>
        </ul>
      </aside>
     
    </div>
  );
};

export default SideMenu;
