"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { RxDividerVertical } from "react-icons/rx";
import { useSession } from "../SessionProvider";
import UserButton from "./UserButton";

const Navbar = () => {
  const session = useSession();

  return (
    <div className="sticky top-0 z-50">
      <nav className="bg-black text-white">
        <div className="flex items-center justify-between text-xs mx-auto w-full py-6 px-8">
          <Link href="/admin" className="w-[170px] h-[10px] mb-5">
            <Image
              src="/captivity-logo-white.png"
              alt="captivityLogo"
              width={331}
              height={54}
              className="h-auto border border-white hover:opacity-80 hover:border-2"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/help" className="hover:text-gray-300">
              <span>Help</span>
            </Link>
            <div className="flex">
              <input
                type="text"
                placeholder="Search for product"
                className="px-2 w-[150px] py-2 rounded-l-sm bg-white text-black"
              />
              <button className="bg-red-600 text-sm rounded-r-sm text-white px-2 py-2 hover:bg-red-500">
                SEARCH
              </button>
            </div>
            {session?.user ? (
              <div className="flex items-center space-x-4">
                <UserButton className="text-lg" />
              </div>
            ) : (
              <>
                <Link href="/login" className="hover:text-gray-300">
                  Login
                </Link>
                <RxDividerVertical />
                <Link href="/signup" className="hover:text-gray-300">
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            {session?.user ? (
              <UserButton className="text-lg" />
            ) : (
              <Link
                href="/login"
                className="font-bold text-lg hover:text-gray-300"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile search bar */}
      <div className="md:hidden bg-white">
        <div className="flex items-center justify-center border-b-2 p-2">
          <input
            type="text"
            placeholder="Search for product"
            className="px-2 w-[150px] py-2 bg-white rounded-l-sm text-black border-2"
          />
          <button className="bg-red-600 hover:bg-red-500 rounded-r-sm text-white px-2 py-2">
            SEARCH
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
