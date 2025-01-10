"use client";

import { Shield, Target, Crosshair } from "lucide-react";
import ProductsPage from "./ProductTablePage";

const camoTheme = {
  primary: "[#4D5139]",
  hover: "[#2A3326]",
  text: "[#E6E8D4]",
  accent: "[#B5B89E]",
  gradientFrom: "[#4D5139]",
  gradientTo: "[#2B2B1B]",
  gradientVia: "[#3C4B37]",
};

const CamoTablePage = () => {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 space-y-6 rounded-lg p-6 bg-gradient-to-r from-[#4D5139] via-[#3C4B37] to-[#2B2B1B] dark:bg-card">
          {/* Title and Icons */}
          <div className="flex items-center justify-center space-x-4">
            <Shield className="h-8 w-8 text-[#B5B89E]" />
            <h1 className="text-4xl font-bold tracking-tight text-[#E6E8D4]">
              Camo Collection 2024
            </h1>
            <Target className="h-8 w-8 text-[#B5B89E]" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-gradient-to-br from-[#4D5139] to-[#2A3326] p-4 shadow-2xl shadow-black">
              <div className="text-center">
                <h3 className="text-sm font-medium text-[#B5B89E]">
                  New Arrivals
                </h3>
                <div className="mt-1 text-2xl font-semibold text-[#E6E8D4]">
                  24 Products
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-[#4D5139] to-[#2A3326] p-4 shadow-2xl shadow-black">
              <div className="text-center">
                <h3 className="text-sm font-medium text-[#B5B89E]">
                  Featured Items
                </h3>
                <div className="mt-1 text-2xl font-semibold text-[#E6E8D4]">
                  12 Products
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-[#4D5139] to-[#2A3326] p-4 shadow-2xl shadow-black">
              <div className="text-center">
                <h3 className="text-sm font-medium text-[#B5B89E]">
                  Limited Edition
                </h3>
                <div className="mt-1 text-2xl font-semibold text-[#E6E8D4]">
                  6 Products
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-xl bg-card p-6 shadow-2xl shadow-black">
          <ProductsPage themeColors={camoTheme} />
        </div>
      </div>
    </div>
  );
};

export default CamoTablePage;
