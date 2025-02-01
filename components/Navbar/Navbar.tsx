"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSession } from "@/app/SessionProvider";
import UserButton from "@/app/(user)/_components/UserButton";
import MobileDropdown from "./_components/MobileDropdown";
import {
  apparelItems,
  collectionsItems,
  headwearItems,
} from "./_components/nav-items";
import SearchButton from "./_components/SearchModal";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const session = useSession();
  const isEditor = session?.user?.role === "EDITOR";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAccountDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const NavItem = ({
    href,
    label,
    children,
  }: {
    href: string;
    label: string;
    children: React.ReactNode;
  }) => (
    <li className="group h-16 flex items-center relative">
      <div className="flex items-center">
        <Link
          href={href}
          className="px-3 py-2 rounded-lg hover:bg-white hover:text-black transition-colors"
        >
          {label}
        </Link>
      </div>
      <div className="absolute top-16 left-0 w-64 bg-white shadow-lg invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
        <div className="py-1">{children}</div>
      </div>
    </li>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-black text-white">
      <div className="container mx-auto px-4 h-16 flex items-center">
        <div className="flex items-center justify-between w-full">
          {/* Mobile menu button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-white hover:text-black transition-colors"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
              <div className="border-b border-gray-200 py-4 px-4">
                <div className="text-lg font-semibold">Menu</div>
              </div>
              <nav className="h-[calc(100%-60px)] overflow-y-auto">
                <div className="py-2 text-black">
                  <MobileDropdown
                    title="Headwear"
                    href="/products/headwear/all-in-headwear"
                    items={headwearItems}
                    onItemClick={() => setIsMenuOpen(false)}
                  />
                  <MobileDropdown
                    title="Apparel"
                    href="/products/apparel/all-in-apparel"
                    items={apparelItems}
                    onItemClick={() => setIsMenuOpen(false)}
                  />
                  <MobileDropdown
                    title="All Collections"
                    href="/products/all-collections/all-in-collections"
                    items={collectionsItems}
                    onItemClick={() => setIsMenuOpen(false)}
                  />
                  <Link
                    href="/catalogue"
                    className="block px-4 py-3 border-b border-gray-200 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Catalogue
                  </Link>
                  <Link
                    href="/clearance"
                    className="block px-4 py-3 border-b border-gray-200 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Clearance
                  </Link>
                  {!isEditor && (
                    <Link
                      href="/signup"
                      className="block px-4 py-3 border-b border-gray-200 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/captivity-logo-white.png"
              alt="CAPTIVITY"
              width={150}
              height={50}
              className="h-auto w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation with Dropdowns */}
          <nav className="hidden md:block flex-1 px-8">
            <ul className="flex justify-center space-x-8">
              <NavItem
                href="/products/headwear/all-in-headwear"
                label="Headwear"
              >
                {headwearItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </NavItem>

              <NavItem href="/products/apparel/all-in-apparel" label="Apparel">
                {apparelItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </NavItem>

              <NavItem
                href="/products/all-collections/all-in-collections"
                label="All Collections"
              >
                {collectionsItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </NavItem>

              <li className="h-16 flex items-center">
                <Link
                  href="/catalogue"
                  className="px-3 py-2 rounded-lg hover:bg-white hover:text-black transition-colors"
                >
                  Catalogue
                </Link>
              </li>
              <li className="h-16 flex items-center">
                <Link
                  href="/clearance"
                  className="px-3 py-2 rounded-lg hover:bg-white hover:text-black transition-colors"
                >
                  Clearance
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right section */}
          <div className="flex items-center space-x-4 h-16">
            <SearchButton />

            {isEditor ? (
              <UserButton />
            ) : (
              <div className="h-16 flex items-center relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-white hover:text-black transition-colors"
                  onClick={() =>
                    setIsAccountDropdownOpen(!isAccountDropdownOpen)
                  }
                >
                  <User className="h-5 w-5" />
                </Button>
                {isAccountDropdownOpen && (
                  <div
                    ref={accountDropdownRef}
                    className="absolute top-16 right-0 w-48 bg-white shadow-lg z-50"
                  >
                    <div className="py-1">
                      <Link
                        href="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Login
                      </Link>
                      <Link
                        href="/signup"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
