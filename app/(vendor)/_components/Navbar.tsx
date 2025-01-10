"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { RxDividerVertical } from "react-icons/rx";
import { Search, X, Menu, LayoutDashboard } from "lucide-react";
import { useSession } from "../SessionProvider";
import UserButton from "./UserButton";
import { useParams } from "next/navigation";
import VendorCartSidebar from "./CartSidebar";
import { Session } from "./_navbarComp/types";
import { LogoSection } from "./_navbarComp/LogoSection";
import { NavigationButtons } from "./_navbarComp/NavigationButtons";
import { CartButton } from "./_navbarComp/CartButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useVendorCartStore from "../vendor/(vendor_website)/[vendor_website]/shop_product/cart/useCartStore";
import { useLogoData } from "../vendor/(vendor_website)/[vendor_website]/welcome/_store/LogoStore";
import { VendorSearchBar } from "../vendor/(vendor_website)/[vendor_website]/navSearchActions/SearchBar";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const session = useSession() as Session;
  const params = useParams();
  const vendorWebsite =
    typeof params?.vendor_website === "string" ? params.vendor_website : "";

  // States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cart states
  const cart = useVendorCartStore(useCallback(state => state.cart, []));
  const isCartInitialized = useVendorCartStore(
    useCallback(state => state.isInitialized, [])
  );
  const initialize = useVendorCartStore(
    useCallback(state => state.initialize, [])
  );

  const cartItemCount =
    cart?.vendorCartItems?.reduce(
      (total, item) => total + (item?.quantity || 0),
      0
    ) || 0;

  const defaultLogoUrl = "/captivity-logo-white.png";
  const isVendor = session?.user?.role === "VENDOR";
  const isVendorCustomer = [
    "VENDORCUSTOMER",
    "APPROVEDVENDORCUSTOMER",
  ].includes(session?.user?.role || "");
  const hasAuthorizedAccess = isVendor || isVendorCustomer;

  useEffect(() => {
    if (session?.user && hasAuthorizedAccess && !isCartInitialized) {
      initialize();
    }
  }, [
    session?.user,
    isVendor,
    isVendorCustomer,
    initialize,
    isCartInitialized,
    hasAuthorizedAccess,
  ]);

  const {
    logoUrl,
    isLoading: isLogoLoading,
    upload,
    remove,
  } = useLogoData(vendorWebsite);

  const handleLogoUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!isVendor) return;
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const formData = new FormData();
        formData.append("logo", file);
        await upload(formData);
      } catch (error) {
        console.error("Error uploading logo:", error);
      }
    },
    [isVendor, upload]
  );

  const handleRemoveLogo = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      if (!isVendor) return;
      if (window.confirm("Are you sure you want to remove your logo?")) {
        try {
          await remove();
          setShowRemoveButton(false);
        } catch (error) {
          console.error("Error removing logo:", error);
        }
      }
    },
    [isVendor, remove]
  );

  const handleCartClick = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (isVendor && logoUrl) {
      setShowRemoveButton(true);
    }
  }, [isVendor, logoUrl]);

  const handleMouseLeave = useCallback(() => {
    setShowRemoveButton(false);
  }, []);

  // Render basic navbar for unauthorized users
  if (!hasAuthorizedAccess && !session?.user) {
    return (
      <nav className="sticky top-0 z-50 bg-black text-white shadow-lg">
        <div className="mx-auto w-full px-4 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-8">
              <LogoSection
                logoUrl={logoUrl}
                isLogoLoading={isLogoLoading}
                isVendor={false}
                isVendorCustomer={false}
                vendorWebsite={vendorWebsite}
                showRemoveButton={false}
                defaultLogoUrl={defaultLogoUrl}
                handleLogoUpload={handleLogoUpload}
                handleRemoveLogo={handleRemoveLogo}
                fileInputRef={fileInputRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:block w-[300px]">
              <VendorSearchBar isAuthenticated={false} />
            </div>

            {/* Auth Links and Mobile Search Toggle */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <Link
                  href={`/vendor/vendor_auth?vendor=${vendorWebsite}&mode=login`}
                  className="text-sm font-medium hover:text-gray-300"
                >
                  Login
                </Link>
                <RxDividerVertical />
                <Link
                  href={`/vendor/vendor_auth?vendor=${vendorWebsite}&mode=register`}
                  className="text-sm font-medium hover:text-gray-300"
                >
                  Register
                </Link>
              </div>

              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                {showMobileSearch ? <X size={24} /> : <Search size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        {showMobileSearch && (
          <div className="lg:hidden border-t border-gray-800">
            <div className="px-4 py-4">
              <VendorSearchBar isAuthenticated={false} />
            </div>
          </div>
        )}
      </nav>
    );
  }

  // Render full navbar for authorized users
  return (
    <div className="sticky top-0 z-50">
      <nav className="bg-black text-white shadow-lg">
        {/* Main Navigation Bar */}
        <div className="mx-auto w-full px-4 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Left Section - Logo & Main Nav */}
            <div className="flex items-center space-x-8">
              <LogoSection
                logoUrl={logoUrl}
                isLogoLoading={isLogoLoading}
                isVendor={isVendor}
                isVendorCustomer={isVendorCustomer}
                vendorWebsite={vendorWebsite}
                showRemoveButton={showRemoveButton}
                defaultLogoUrl={defaultLogoUrl}
                handleLogoUpload={handleLogoUpload}
                handleRemoveLogo={handleRemoveLogo}
                fileInputRef={fileInputRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
              <div className="hidden md:block">
                <NavigationButtons vendorWebsite={vendorWebsite} />
              </div>
            </div>

            {/* Center Section - Vendor Actions & Search (Desktop) */}
            <div className="hidden lg:flex items-center space-x-8">
              {isVendor && (
                <Button
                  size="sm"
                  className="flex-1 md:flex-none h-10 px-2.5 md:px-4 bg-blue-400"
                  asChild
                >
                  <Link href={`/vendor/${vendorWebsite}/dashboard`}>
                    <LayoutDashboard className="w-4 h-4 md:mr-4" />
                    <span className="text-xs ml-1.5 md:text-sm md:ml-0">
                      Dashboard
                    </span>
                  </Link>
                </Button>
              )}

              <div className="w-[300px]">
                <VendorSearchBar isAuthenticated={true} />
              </div>
            </div>

            {/* Right Section - User Actions */}
            <div className="flex items-center space-x-4">
              <UserButton className="text-base" />

              {/* Cart Button */}
              <CartButton
                onClick={handleCartClick}
                cartItemCount={cartItemCount}
                isCartInitialized={isCartInitialized}
              />

              {/* Mobile Menu Toggle */}
              <div className="flex items-center space-x-2 lg:hidden">
                <button
                  onClick={() => setShowMobileSearch(!showMobileSearch)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Toggle search"
                >
                  {showMobileSearch ? <X size={24} /> : <Search size={24} />}
                </button>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {(isMobileMenuOpen || showMobileSearch) && (
          <div className="lg:hidden border-t border-gray-800">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              {showMobileSearch && (
                <div className="pb-4">
                  <VendorSearchBar isAuthenticated={true} />
                </div>
              )}

              {/* Mobile Navigation */}
              {isMobileMenuOpen && (
                <div className="flex flex-col space-y-4">
                  <NavigationButtons vendorWebsite={vendorWebsite} />
                  {isVendor && (
                    <div className="pt-4 border-t border-gray-800">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full h-9 p-2.5 md:px-4"
                        asChild
                      >
                        <Link href={`/vendor/${vendorWebsite}/dashboard`}>
                          <LayoutDashboard className="w-4 h-8 mr-2" />
                          <span className="text-sm">Dashboard</span>
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Cart Sidebar */}
      <VendorCartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        vendorWebsite={vendorWebsite}
      />
    </div>
  );
};

export default Navbar;
