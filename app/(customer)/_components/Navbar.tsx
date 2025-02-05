"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { GoHomeFill } from "react-icons/go";
import { TbCategoryFilled } from "react-icons/tb";
import { FaHeart } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { RxDividerVertical } from "react-icons/rx";
import { ShoppingCart } from "lucide-react";
import { useSession } from "../SessionProvider";
import UserButton from "./UserButton";
import useCartStore from "../customer/_store/useCartStore";
import SlideInCart from "../customer/shopping/cart/SlideInCart";
import { SearchBar } from "../customer/navSearchActions/SearchBar";

const Navbar = () => {
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cart = useCartStore(state => state.cart);

  const cartItemCount =
    cart?.cartItems.reduce((total, item) => total + item.quantity, 0) || 0;

  useEffect(() => {
    // Fetch cart data when component mounts
    useCartStore.getState().fetchCart();
  }, []);

  return (
    <>
      {/* Fixed top navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <nav className="bg-black text-white shadow-lg">
          <div className="flex items-center justify-between text-xs mx-auto w-full py-6 px-8">
            <Link href="/customer" className="w-[170px] h-[10px] mb-5">
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
                <SearchBar />
              </div>
              {session?.user ? (
                <div className="flex items-center space-x-4">
                  <UserButton className="text-lg" />
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative"
                  >
                    <ShoppingCart size={24} />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {cartItemCount}
                      </span>
                    )}
                  </button>
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
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative"
                  >
                    <ShoppingCart size={24} />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                </>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative mr-4"
              >
                <ShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartItemCount}
                  </span>
                )}
              </button>
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

        {/* Mobile search bar - now part of fixed header */}
        <div className="md:hidden bg-background">
          <div className="flex items-center text-foreground justify-center border-b-2 p-2">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-[120px] md:h-[88px]"></div>

      {/* Mobile bottom Nav */}
      <div className="md:hidden fixed inset-x-0 bottom-0 bg-background shadow-xl shadow-gray-400 border-t-2 border-t-gray-400 border-2 ml-5 mr-5 mb-2 z-50 rounded-xl">
        <div className="flex justify-around text-gray-500 m-auto">
          <Link
            href="/customer"
            className="flex flex-col items-center py-2 hover:text-red-500"
          >
            <GoHomeFill />
            <div className="text-xs mt-2">Home</div>
          </Link>
          <Link
            href="/customer/shopping/product_categories/summer"
            className="flex flex-col items-center py-2 hover:text-red-500"
          >
            <TbCategoryFilled />
            <div className="text-xs mt-2">Categories</div>
          </Link>
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center py-2 hover:text-red-500 relative"
          >
            <ShoppingCart size={20} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {cartItemCount}
              </span>
            )}
            <div className="text-xs mt-2">Cart</div>
          </button>
          {/* <Link
            href="/customer/favourites"
            className="flex text-gray-600 flex-col items-center py-2 hover:text-red-500"
          >
            <FaHeart />
            <div className="text-xs mt-2">Favorites</div>
          </Link> */}
          <Link
            href="/customer/account-info"
            className="flex flex-col items-center py-2 hover:text-red-500"
          >
            <MdAccountCircle />
            <div className="text-xs mt-2">Account</div>
          </Link>
        </div>
      </div>

      {/* Slide-in Cart */}
      <SlideInCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
