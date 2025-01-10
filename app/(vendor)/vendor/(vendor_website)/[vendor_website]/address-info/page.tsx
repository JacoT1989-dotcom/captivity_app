import React from "react";
import { SquareArrowLeft } from "lucide-react";
import Link from "next/link";
import AddressTabs from "./AddressTabs";

const AddressInfoPage = () => {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20">
      <div className="flex items-center justify-between mb-6">
        <span>
          <h2 className="text-2xl font-bold text-red-500">
            Address Information
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your billing and shipping addresses
          </p>
        </span>
      </div>

      <AddressTabs />
    </section>
  );
};

export default AddressInfoPage;
