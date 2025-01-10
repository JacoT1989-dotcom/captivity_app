import React from "react";
import CheckoutForm from "./_components/CheckoutForm";
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

// Add noStore to prevent caching
import { unstable_noStore as noStore } from "next/cache";

async function CheckoutContent() {
  noStore();
  const { user } = await validateRequest();

  if (!user) {
    redirect("/auth/signin");
  }

  return <CheckoutForm />;
}

export default async function VendorCheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between m-6">
        <h1 className="text-3xl font-extrabold text-center">
          VENDOR CHECKOUT PAGE
        </h1>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
