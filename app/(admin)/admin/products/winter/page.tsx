"use client";

import { Snowflake, Wind, Moon } from "lucide-react";
import ProductsPage from "./ProductTablePage";

const WinterTablePage = () => {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 space-y-6 rounded-lg p-6 bg-blue-500 dark:bg-card">
          {/* Title and Icons */}
          <div className="flex items-center justify-center space-x-4">
            <Snowflake className="h-8 w-8 text-blue-200" />
            <h1 className="text-4xl font-bold tracking-tight">
              Winter Collection 2024
            </h1>
            <Moon className="h-8 w-8 text-blue-200" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-card p-4 shadow-2xl shadow-black">
              <div className="text-center">
                <h3 className="text-sm font-medium text-muted-foreground">
                  New Arrivals
                </h3>
                <div className="mt-1 text-2xl font-semibold text-primary">
                  24 Products
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-card p-4 shadow-2xl shadow-black">
              <div className="text-center">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Featured Items
                </h3>
                <div className="mt-1 text-2xl font-semibold text-primary">
                  12 Products
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-card p-4 shadow-2xl shadow-black">
              <div className="text-center">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Limited Edition
                </h3>
                <div className="mt-1 text-2xl font-semibold text-primary">
                  6 Products
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-xl bg-card p-6 shadow-2xl shadow-black">
          <ProductsPage />
        </div>
      </div>
    </div>
  );
};

export default WinterTablePage;
